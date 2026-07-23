from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.core.security import get_current_user_payload, TokenPayload
from app.models.schemas import MemoryCreate, MemoryResponse
from app.services.memory_service import memory_service

router = APIRouter(prefix="/memory", tags=["Long-Term Memory"])


@router.post("", response_model=MemoryResponse)
async def store_memory_item(
    mem_in: MemoryCreate,
    db: AsyncSession = Depends(get_db),
    user_payload: TokenPayload = Depends(get_current_user_payload)
):
    workspace_id = user_payload.workspace_id or "ws_default_01"
    user_id = user_payload.sub or "user_dev_nexus_01"
    memory = await memory_service.store_memory(
        session=db,
        workspace_id=workspace_id,
        user_id=user_id,
        memory_type=mem_in.memory_type,
        key=mem_in.key,
        value=mem_in.value
    )
    return memory


@router.get("/search")
async def query_user_memories(
    query: str,
    top_k: int = 5,
    db: AsyncSession = Depends(get_db),
    user_payload: TokenPayload = Depends(get_current_user_payload)
):
    workspace_id = user_payload.workspace_id or "ws_default_01"
    user_id = user_payload.sub or "user_dev_nexus_01"
    results = await memory_service.query_memories(
        session=db,
        workspace_id=workspace_id,
        user_id=user_id,
        query=query,
        top_k=top_k
    )
    return {"query": query, "memories": results}
