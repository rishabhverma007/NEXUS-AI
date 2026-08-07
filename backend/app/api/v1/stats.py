"""
Workspace statistics — the single source of truth for the dashboard.

Aggregates live counts (documents, chunks, graph topology, memories, chat
activity) plus a merged, time-ordered "recent activity" feed so the UI renders
real telemetry instead of static placeholders.
"""
from typing import Any, Dict, List

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.security import get_current_user_payload, TokenPayload
from app.models.domain import (
    ChatMessage,
    ChatThread,
    Document,
    DocumentChunk,
    KnowledgeGraphEntity,
    KnowledgeGraphRelation,
    MemoryEntry,
    Workspace,
)

router = APIRouter(prefix="/stats", tags=["System Stats"])


async def _count(db: AsyncSession, model, workspace_id: str) -> int:
    stmt = select(func.count()).select_from(model).where(model.workspace_id == workspace_id)
    return (await db.execute(stmt)).scalar_one()


@router.get("")
async def get_workspace_stats(
    db: AsyncSession = Depends(get_db),
    user_payload: TokenPayload = Depends(get_current_user_payload),
):
    workspace_id = user_payload.workspace_id or "ws_default_01"

    documents = await _count(db, Document, workspace_id)
    chunks = await _count(db, DocumentChunk, workspace_id)
    entities = await _count(db, KnowledgeGraphEntity, workspace_id)
    relations = await _count(db, KnowledgeGraphRelation, workspace_id)
    memories = await _count(db, MemoryEntry, workspace_id)
    threads = await _count(db, ChatThread, workspace_id)

    workspace_count = (
        await db.execute(select(func.count()).select_from(Workspace))
    ).scalar_one()

    # Messages live under threads; count + reflection score join through them.
    message_count_stmt = (
        select(func.count(ChatMessage.id))
        .join(ChatThread, ChatMessage.thread_id == ChatThread.id)
        .where(ChatThread.workspace_id == workspace_id)
    )
    messages = (await db.execute(message_count_stmt)).scalar_one()

    # Average reflection score across stored assistant turns (real telemetry).
    avg_reflection_stmt = (
        select(func.avg(ChatMessage.reflection_score))
        .join(ChatThread, ChatMessage.thread_id == ChatThread.id)
        .where(
            ChatThread.workspace_id == workspace_id,
            ChatMessage.role == "assistant",
            ChatMessage.reflection_score.isnot(None),
        )
    )
    avg_reflection = (await db.execute(avg_reflection_stmt)).scalar_one_or_none()

    # --- Recent activity (merged, time-ordered) ------------------------------
    recent: List[Dict[str, Any]] = []

    recent_docs = (
        await db.execute(
            select(Document)
            .where(Document.workspace_id == workspace_id)
            .order_by(Document.created_at.desc())
            .limit(3)
        )
    ).scalars().all()
    recent.extend(
        {
            "type": "document",
            "title": d.title,
            "detail": f"{d.chunk_count} chunks",
            "status": d.status.title(),
            "timestamp": d.created_at,
        }
        for d in recent_docs
    )

    recent_threads = (
        await db.execute(
            select(ChatThread)
            .where(ChatThread.workspace_id == workspace_id)
            .order_by(ChatThread.updated_at.desc())
            .limit(3)
        )
    ).scalars().all()
    recent.extend(
        {
            "type": "thread",
            "title": t.title,
            "detail": f"{t.agent_mode.replace('_', ' ').title()}",
            "status": t.model,
            "timestamp": t.updated_at,
        }
        for t in recent_threads
    )

    recent_memories = (
        await db.execute(
            select(MemoryEntry)
            .where(MemoryEntry.workspace_id == workspace_id)
            .order_by(MemoryEntry.created_at.desc())
            .limit(2)
        )
    ).scalars().all()
    recent.extend(
        {
            "type": "memory",
            "title": m.key.replace("_", " ").title(),
            "detail": m.memory_type.title(),
            "status": "Stored",
            "timestamp": m.created_at,
        }
        for m in recent_memories
    )

    recent.sort(key=lambda item: item["timestamp"], reverse=True)
    recent_activity = recent[:8]

    return {
        "workspace_id": workspace_id,
        "counts": {
            "documents": documents,
            "chunks": chunks,
            "graph_entities": entities,
            "graph_relations": relations,
            "memories": memories,
            "threads": threads,
            "messages": messages,
            "workspaces": workspace_count,
        },
        "avg_reflection_score": round(avg_reflection, 4) if avg_reflection is not None else None,
        "recent_activity": recent_activity,
    }
