import json
from typing import AsyncGenerator, Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.security import get_current_user_payload, TokenPayload
from app.models.schemas import ChatMessageCreate, ChatMessageResponse
from app.models.domain import ChatThread, ChatMessage
from app.services.agentic_rag import multi_agent_orchestrator

router = APIRouter(prefix="/chat", tags=["Chat & Multi-Agent"])


@router.post("/threads")
async def create_chat_thread(
    title: str = "New Architectural Session",
    model: str = "gpt-4o",
    agent_mode: str = "agentic_rag",
    db: AsyncSession = Depends(get_db),
    user_payload: TokenPayload = Depends(get_current_user_payload),
):
    workspace_id = user_payload.workspace_id or "ws_default_01"
    thread = ChatThread(
        workspace_id=workspace_id,
        user_id=user_payload.sub or "user_dev_nexus_01",
        title=title,
        model=model,
        agent_mode=agent_mode,
    )
    db.add(thread)
    await db.flush()
    return {
        "id": thread.id,
        "workspace_id": thread.workspace_id,
        "title": thread.title,
        "model": thread.model,
        "agent_mode": thread.agent_mode,
        "created_at": thread.created_at,
        "message_count": 0,
    }


@router.get("/threads")
async def list_chat_threads(
    db: AsyncSession = Depends(get_db),
    user_payload: TokenPayload = Depends(get_current_user_payload),
):
    workspace_id = user_payload.workspace_id or "ws_default_01"

    threads_res = await db.execute(
        select(ChatThread)
        .where(ChatThread.workspace_id == workspace_id)
        .order_by(ChatThread.updated_at.desc())
    )
    threads = threads_res.scalars().all()

    # Message counts for the whole workspace in one aggregate query.
    counts_res = await db.execute(
        select(ChatThread.id, func.count(ChatMessage.id))
        .outerjoin(ChatMessage, ChatMessage.thread_id == ChatThread.id)
        .where(ChatThread.workspace_id == workspace_id)
        .group_by(ChatThread.id)
    )
    counts = dict(counts_res.all())

    return [
        {
            "id": t.id,
            "title": t.title,
            "model": t.model,
            "agent_mode": t.agent_mode,
            "updated_at": t.updated_at,
            "message_count": counts.get(t.id, 0),
        }
        for t in threads
    ]


@router.get("/threads/{thread_id}/messages", response_model=list[ChatMessageResponse])
async def get_thread_messages(
    thread_id: str,
    db: AsyncSession = Depends(get_db),
    user_payload: TokenPayload = Depends(get_current_user_payload),
):
    workspace_id = user_payload.workspace_id or "ws_default_01"
    thread = (
        await db.execute(
            select(ChatThread).where(
                ChatThread.id == thread_id,
                ChatThread.workspace_id == workspace_id,
            )
        )
    ).scalar_one_or_none()
    if not thread:
        raise HTTPException(status_code=404, detail="Chat thread not found")

    msgs_res = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.thread_id == thread_id)
        .order_by(ChatMessage.created_at.asc())
    )
    messages = msgs_res.scalars().all()
    return [
        {
            "id": m.id,
            "thread_id": m.thread_id,
            "role": m.role,
            "content": m.content,
            "agent_steps": m.agent_steps_json,
            "citations": m.citations_json,
            "reflection_score": m.reflection_score,
            "created_at": m.created_at,
        }
        for m in messages
    ]


def _thread_title_from(content: str, limit: int = 60) -> str:
    cleaned = " ".join(content.split())
    return cleaned[:limit] + ("..." if len(cleaned) > limit else "")


@router.post("/stream")
async def stream_chat_response(
    req: ChatMessageCreate,
    db: AsyncSession = Depends(get_db),
    user_payload: TokenPayload = Depends(get_current_user_payload),
):
    workspace_id = req.workspace_id or user_payload.workspace_id or "ws_default_01"
    user_id = user_payload.sub or "user_dev_nexus_01"

    # Resolve or create the conversation thread BEFORE streaming so the
    # frontend learns its id from the first SSE frame.
    if req.thread_id:
        thread = (
            await db.execute(
                select(ChatThread).where(
                    ChatThread.id == req.thread_id,
                    ChatThread.workspace_id == workspace_id,
                )
            )
        ).scalar_one_or_none()
        if not thread:
            raise HTTPException(status_code=404, detail="Chat thread not found")
    else:
        thread = ChatThread(
            workspace_id=workspace_id,
            user_id=user_id,
            title=_thread_title_from(req.content),
            model=req.model or "gpt-4o",
            agent_mode=req.agent_mode,
        )
        db.add(thread)
        await db.flush()

    async def event_generator() -> AsyncGenerator[str, None]:
        # The DB session stays open for the life of the stream, so we can
        # persist the exchange here; get_db commits on teardown.
        user_msg = ChatMessage(
            thread_id=thread.id, role="user", content=req.content
        )
        db.add(user_msg)
        # Commit the thread + user question up-front so a client disconnect
        # mid-stream never loses the user's prompt (the assistant turn is
        # committed only when the stream completes normally).
        await db.commit()

        steps: list = []
        tokens: list = []
        done_data: Optional[dict] = None

        yield f"data: {json.dumps({'type': 'thread', 'thread_id': thread.id})}\n\n"

        try:
            async for event in multi_agent_orchestrator.execute_agentic_flow(
                session=db,
                workspace_id=workspace_id,
                user_id=user_id,
                user_query=req.content,
                agent_mode=req.agent_mode,
                model=req.model or "gpt-4o",
            ):
                event_type = event.get("type")
                if event_type == "agent_step" and event.get("step"):
                    steps.append(event["step"])
                elif event_type == "token" and event.get("content"):
                    tokens.append(event["content"])
                elif event_type == "done":
                    done_data = event
                event_data = json.dumps(event)
                yield f"data: {event_data}\n\n"
        except Exception as e:
            error_data = json.dumps({"type": "error", "message": str(e)})
            yield f"data: {error_data}\n\n"
            return

        # Persist the assistant turn once the stream completes.
        if done_data is not None:
            from datetime import datetime, timezone

            assistant_msg = ChatMessage(
                thread_id=thread.id,
                role="assistant",
                content="".join(tokens),
                agent_steps_json=steps,
                citations_json=done_data.get("citations", []),
                reflection_score=done_data.get("reflection_score"),
            )
            db.add(assistant_msg)
            thread.updated_at = datetime.now(timezone.utc)
            await db.commit()

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
