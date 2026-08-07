"""
NEXUS AI — Enterprise seed CLI.

Ingests the enterprise corpus (documents, knowledge graph, memories) into the
default workspace. Safe to run repeatedly: existing documents are skipped.

Usage:
    cd backend
    python seed.py            # seed the default workspace
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import select

from app.core.db import AsyncSessionLocal
from app.models.domain import (
    Document,
    KnowledgeGraphEntity,
    KnowledgeGraphRelation,
    MemoryEntry,
    Workspace,
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


async def seed_workspace(workspace_id: str = "ws_default_01") -> None:
    async with AsyncSessionLocal() as session:
        # --- Workspace (bootstrap a fresh DB like workspace.py does) ---------
        ws = await session.get(Workspace, workspace_id)
        if not ws:
            session.add(
                Workspace(
                    id=workspace_id,
                    name="Nexus Enterprise AI Core",
                    slug="nexus-enterprise-core",
                    description="Default Enterprise Knowledge Workspace for Multi-Agent RAG & Graph Systems",
                    owner_id=DEFAULT_USER_ID,
                )
            )
            await session.flush()
            print(f"  + created workspace: {workspace_id}")

        # --- Documents (skip any title that already exists in THIS workspace) --
        existing = set(
            (
                await session.execute(
                    select(Document.title).where(Document.workspace_id == workspace_id)
                )
            ).scalars().all()
        )
        added_docs = 0
        for doc_in in SEED_DOCUMENTS:
            if doc_in["title"] in existing:
                print(f"  ~ skip (exists): {doc_in['title']}")
                continue
            await doc_processor.process_and_ingest_document(
                session=session,
                workspace_id=workspace_id,
                title=doc_in["title"],
                content=doc_in["content"],
                source_type=doc_in.get("source_type", "markdown"),
                metadata=doc_in.get("metadata", {}),
            )
            added_docs += 1
            print(f"  + ingested: {doc_in['title']}")
        await session.commit()

        # --- Knowledge graph ------------------------------------------------
        existing_ents = set(
            (await session.execute(select(KnowledgeGraphEntity.id))).scalars().all()
        )
        added_ents = 0
        for ent in SEED_ENTITIES:
            if ent["id"] in existing_ents:
                continue
            session.add(KnowledgeGraphEntity(workspace_id=workspace_id, **ent))
            added_ents += 1

        existing_rels = set(
            (await session.execute(select(KnowledgeGraphRelation.id))).scalars().all()
        )
        added_rels = 0
        for rel in SEED_RELATIONS:
            if rel["id"] in existing_rels:
                continue
            session.add(KnowledgeGraphRelation(workspace_id=workspace_id, **rel))
            added_rels += 1
        await session.commit()
        if added_ents or added_rels:
            print(f"  + graph: {added_ents} entities, {added_rels} relations")

        # --- Memories (idempotent: skip keys that already exist) -------------
        existing_mem_keys = set(
            (
                await session.execute(
                    select(MemoryEntry.key).where(
                        MemoryEntry.workspace_id == workspace_id,
                        MemoryEntry.user_id == DEFAULT_USER_ID,
                    )
                )
            ).scalars().all()
        )
        added_memories = 0
        for mem in SEED_MEMORIES:
            if mem["key"] in existing_mem_keys:
                print(f"  ~ skip (exists): memory '{mem['key']}'")
                continue
            await memory_service.store_memory(
                session=session,
                workspace_id=workspace_id,
                user_id=DEFAULT_USER_ID,
                memory_type=mem["memory_type"],
                key=mem["key"],
                value=mem["value"],
            )
            added_memories += 1
        await session.commit()
        print(f"  + memories: {added_memories} entries")

        print(
            f"\nDone. {added_docs} documents ingested, {added_ents} entities, "
            f"{added_rels} relations, {added_memories} memories in '{workspace_id}'."
        )


if __name__ == "__main__":
    asyncio.run(seed_workspace())
