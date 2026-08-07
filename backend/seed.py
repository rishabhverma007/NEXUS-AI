"""
NEXUS AI — Enterprise seed CLI.

Ingests the enterprise corpus (documents, knowledge graph, memories) into the
default workspace. Safe to run repeatedly: existing documents, graph entities,
and memory keys are skipped.

Usage:
    cd backend
    python seed.py            # seed the default workspace
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.db import AsyncSessionLocal
from app.models.domain import Workspace
from app.services.seeder import seed_corpus_for_workspace

DEFAULT_USER_ID = "user_dev_nexus_01"


async def seed_workspace(workspace_id: str = "ws_default_01", owner_id: str = DEFAULT_USER_ID) -> None:
    async with AsyncSessionLocal() as session:
        # --- Workspace (bootstrap a fresh DB) --------------------------------
        ws = await session.get(Workspace, workspace_id)
        if not ws:
            session.add(
                Workspace(
                    id=workspace_id,
                    name="Nexus Enterprise AI Core",
                    slug="nexus-enterprise-core",
                    description="Default Enterprise Knowledge Workspace for Multi-Agent RAG & Graph Systems",
                    owner_id=owner_id,
                )
            )
            await session.flush()
            print(f"  + created workspace: {workspace_id}")

        counts = await seed_corpus_for_workspace(
            session=session,
            workspace_id=workspace_id,
            owner_id=owner_id,
        )
        await session.commit()

        print(
            f"\nDone. {counts['docs_added']} documents ingested, "
            f"{counts['entities_added']} entities, {counts['relations_added']} relations, "
            f"{counts['memories_added']} memories in '{workspace_id}'."
        )


if __name__ == "__main__":
    asyncio.run(seed_workspace())
