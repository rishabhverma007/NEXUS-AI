import json
import asyncio
from typing import AsyncGenerator
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
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
    user_payload: TokenPayload = Depends(get_current_user_payload)
):
    thread = ChatThread(
        workspace_id=user_payload.workspace_id or "ws_default_01",
        user_id=user_payload.sub or "user_dev_nexus_01",
        title=title,
        model=model,
        agent_mode=agent_mode
    )
    db.add(thread)
    await db.flush()
    return {
        "id": thread.id,
        "workspace_id": thread.workspace_id,
        "title": thread.title,
        "model": thread.model,
        "agent_mode": thread.agent_mode,
        "created_at": thread.created_at
    }


@router.get("/threads")
async def list_chat_threads(
    db: AsyncSession = Depends(get_db),
    user_payload: TokenPayload = Depends(get_current_user_payload)
):
    stmt = select(ChatThread).where(
        ChatThread.workspace_id == (user_payload.workspace_id or "ws_default_01")
    ).order_by(ChatThread.updated_at.desc())
    res = await db.execute(stmt)
    threads = res.scalars().all()
    return [{
        "id": t.id,
        "title": t.title,
        "model": t.model,
        "agent_mode": t.agent_mode,
        "updated_at": t.updated_at
    } for t in threads]


@router.post("/stream")
async def stream_chat_response(
    req: ChatMessageCreate,
    db: AsyncSession = Depends(get_db),
    user_payload: TokenPayload = Depends(get_current_user_payload)
):
    workspace_id = req.workspace_id or user_payload.workspace_id or "ws_default_01"
    user_id = user_payload.sub or "user_dev_nexus_01"

    async def event_generator() -> AsyncGenerator[str, None]:
        try:
            async for event in multi_agent_orchestrator.execute_agentic_flow(
                session=db,
                workspace_id=workspace_id,
                user_id=user_id,
                user_query=req.content,
                agent_mode=req.agent_mode
            ):
                event_data = json.dumps(event)
                yield f"data: {event_data}\n\n"
        except Exception as e:
            error_data = json.dumps({"type": "error", "message": str(e)})
            yield f"data: {error_data}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
