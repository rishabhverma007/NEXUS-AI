from typing import List, Dict, Any, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.domain import MemoryEntry
from app.services.hybrid_search import hybrid_search_engine


class MemoryService:
    """
    Enterprise Long-Term Memory Service managing:
    1. Episodic Memory (past interaction distillation)
    2. Semantic Memory (workspace facts & preferences)
    3. Memory Retrieval & Context Augmentation
    """

    async def store_memory(
        self,
        session: AsyncSession,
        workspace_id: str,
        user_id: str,
        memory_type: str,
        key: str,
        value: str,
        confidence_score: float = 1.0
    ) -> MemoryEntry:
        embedding = hybrid_search_engine.generate_mock_embedding(f"{key}: {value}")
        memory = MemoryEntry(
            workspace_id=workspace_id,
            user_id=user_id,
            memory_type=memory_type,
            key=key,
            value=value,
            embedding_json=embedding,
            confidence_score=confidence_score
        )
        session.add(memory)
        await session.flush()
        return memory

    async def query_memories(
        self,
        session: AsyncSession,
        workspace_id: str,
        user_id: str,
        query: str,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        stmt = select(MemoryEntry).where(
            MemoryEntry.workspace_id == workspace_id,
            MemoryEntry.user_id == user_id
        )
        res = await session.execute(stmt)
        memories: List[MemoryEntry] = list(res.scalars().all())

        if not memories:
            return []

        query_emb = hybrid_search_engine.generate_mock_embedding(query)
        scored = []
        for m in memories:
            sim = hybrid_search_engine._cosine_similarity(query_emb, m.embedding_json or [])
            scored.append((m, sim))

        scored.sort(key=lambda x: x[1], reverse=True)

        results = []
        for mem, score in scored[:top_k]:
            results.append({
                "id": mem.id,
                "type": mem.memory_type,
                "key": mem.key,
                "value": mem.value,
                "confidence": mem.confidence_score,
                "similarity": round(score, 4)
            })

        return results


memory_service = MemoryService()
