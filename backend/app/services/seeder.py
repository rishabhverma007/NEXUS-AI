"""
Shared, idempotent corpus seeder.

Seeds the enterprise corpus (documents, knowledge-graph entities/relations,
long-term memories) into a workspace. Used by:

- the first-boot lifespan (default workspace),
- the `auth/register` flow (each new user gets a preloaded sandbox),
- the `seed.py` CLI.

Idempotency rules:
- Documents are skipped when a title already exists in the workspace.
- The knowledge graph is seeded only when the workspace has NO entities yet;
  entity/relation ids are remapped to fresh UUIDs so multiple workspaces never
  collide on the fixed seed ids (kg entity ids are global primary keys).
- Memories are skipped when the (workspace, user, key) tuple already exists.
"""
from typing import Any, Dict, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.domain import (
    Document,
    KnowledgeGraphEntity,
    KnowledgeGraphRelation,
    MemoryEntry,
)
from app.services.doc_processor import doc_processor
from app.services.memory_service import memory_service
from app.seed_data import (
    SEED_DOCUMENTS,
    SEED_ENTITIES,
    SEED_RELATIONS,
    SEED_MEMORIES,
)

DEFAULT_USER_ID = "user_dev_nexus_01"


def _fresh_id() -> str:
    import uuid

    return str(uuid.uuid4())


async def seed_corpus_for_workspace(
    session: AsyncSession,
    workspace_id: str,
    owner_id: str = DEFAULT_USER_ID,
    keep_seed_ids: bool = False,
) -> Dict[str, int]:
    """
    Seed the corpus into `workspace_id`. Safe to call repeatedly.

    Returns a dict of counts: docs_added, entities_added, relations_added,
    memories_added. When `keep_seed_ids` is False (the default) entity/relation
    ids are remapped to fresh UUIDs so per-user workspaces never collide on the
    global primary keys; set it True for the canonical default workspace to
    preserve its deterministic seed ids.
    """
    counts = {"docs_added": 0, "entities_added": 0, "relations_added": 0, "memories_added": 0}

    # --- Documents (skip titles already present in this workspace) -----------
    existing_titles = set(
        (
            await session.execute(
                select(Document.title).where(Document.workspace_id == workspace_id)
            )
        ).scalars().all()
    )
    for doc_in in SEED_DOCUMENTS:
        if doc_in["title"] in existing_titles:
            continue
        await doc_processor.process_and_ingest_document(
            session=session,
            workspace_id=workspace_id,
            title=doc_in["title"],
            content=doc_in["content"],
            source_type=doc_in.get("source_type", "markdown"),
            metadata=doc_in.get("metadata", {}),
        )
        counts["docs_added"] += 1
    await session.flush()

    # --- Knowledge graph (only when the workspace has no entities yet) -------
    existing_entity_ids = set(
        (
            await session.execute(
                select(KnowledgeGraphEntity.id).where(
                    KnowledgeGraphEntity.workspace_id == workspace_id
                )
            )
        ).scalars().all()
    )
    if not existing_entity_ids:
        # Remap fixed seed ids -> fresh UUIDs unless the caller opted to keep
        # them (default workspace), so per-user workspaces never collide on
        # the global primary keys.
        id_map: Dict[str, str] = {}
        for ent in SEED_ENTITIES:
            new_id = ent["id"] if keep_seed_ids else _fresh_id()
            id_map[ent["id"]] = new_id
            session.add(
                KnowledgeGraphEntity(
                    id=new_id,
                    workspace_id=workspace_id,
                    name=ent["name"],
                    entity_type=ent["entity_type"],
                    description=ent.get("description", ""),
                    properties=ent.get("properties", {}),
                )
            )
            counts["entities_added"] += 1

        for rel in SEED_RELATIONS:
            session.add(
                KnowledgeGraphRelation(
                    id=rel["id"] if keep_seed_ids else _fresh_id(),
                    workspace_id=workspace_id,
                    source_entity_id=id_map[rel["source_entity_id"]],
                    target_entity_id=id_map[rel["target_entity_id"]],
                    relation_type=rel["relation_type"],
                    weight=rel.get("weight", 1.0),
                    description=rel.get("description", ""),
                    properties=rel.get("properties", {}),
                )
            )
            counts["relations_added"] += 1
        await session.flush()

    # --- Long-term memory (skip keys already stored for this workspace+user) --
    existing_keys = set(
        (
            await session.execute(
                select(MemoryEntry.key).where(
                    MemoryEntry.workspace_id == workspace_id,
                    MemoryEntry.user_id == owner_id,
                )
            )
        ).scalars().all()
    )
    for mem in SEED_MEMORIES:
        if mem["key"] in existing_keys:
            continue
        await memory_service.store_memory(
            session=session,
            workspace_id=workspace_id,
            user_id=owner_id,
            memory_type=mem["memory_type"],
            key=mem["key"],
            value=mem["value"],
        )
        counts["memories_added"] += 1
    await session.flush()

    return counts
