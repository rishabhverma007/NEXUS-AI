import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.db import engine, Base, AsyncSessionLocal
from app.api.v1 import chat, knowledge, graph, workspace, memory
from app.models.domain import Workspace, KnowledgeGraphEntity, KnowledgeGraphRelation
from app.services.doc_processor import doc_processor
from app.services.memory_service import memory_service
from app.seed_data import SEED_DOCUMENTS, SEED_ENTITIES, SEED_RELATIONS, SEED_MEMORIES
from app.services.llm import (
    is_embedding_configured,
    is_model_available,
    MODEL_REGISTRY,
)


async def seed_initial_workspace_data():
    """
    Seed the default workspace with the enterprise corpus on first boot:
    documents, knowledge graph entities/relations, and long-term memories.
    """
    async with AsyncSessionLocal() as session:
        # Check if default workspace exists (fresh installs only)
        res = await session.get(Workspace, "ws_default_01")
        if not res:
            ws = Workspace(
                id="ws_default_01",
                name="Nexus Enterprise AI Core",
                slug="nexus-enterprise-core",
                description="Default Enterprise Knowledge Workspace for Multi-Agent RAG & Graph Systems",
                owner_id="user_dev_nexus_01"
            )
            session.add(ws)
            await session.flush()

            # Knowledge graph
            session.add_all(
                KnowledgeGraphEntity(workspace_id="ws_default_01", **ent)
                for ent in SEED_ENTITIES
            )
            session.add_all(
                KnowledgeGraphRelation(workspace_id="ws_default_01", **rel)
                for rel in SEED_RELATIONS
            )

            # Documents (real embedding when configured, mock otherwise)
            for doc_in in SEED_DOCUMENTS:
                await doc_processor.process_and_ingest_document(
                    session=session,
                    workspace_id="ws_default_01",
                    title=doc_in["title"],
                    content=doc_in["content"],
                    source_type=doc_in.get("source_type", "markdown"),
                    metadata=doc_in.get("metadata", {}),
                )

            # Long-term memory
            for mem in SEED_MEMORIES:
                await memory_service.store_memory(
                    session=session,
                    workspace_id="ws_default_01",
                    user_id="user_dev_nexus_01",
                    memory_type=mem["memory_type"],
                    key=mem["key"],
                    value=mem["value"],
                )

            await session.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Database Tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    await seed_initial_workspace_data()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root_health_check():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "engine": "FastAPI + LangGraph + GraphRAG + pgvector"
    }


@app.get(f"{settings.API_V1_STR}/health")
async def readiness_health_check():
    """
    Readiness probe: reports live vs simulation AI mode, per-model availability,
    embedding mode, and database connectivity. Used by the frontend to show a
    LIVE AI / Simulation badge and by deployments for readiness checks.
    """
    db_status = "ok"
    try:
        from sqlalchemy import text
        async with engine.connect() as conn:
            await conn.scalar(text("SELECT 1"))
    except Exception:
        db_status = "error"

    model_status: dict = {}
    for model_id in MODEL_REGISTRY:
        model_status[model_id] = await is_model_available(model_id)

    live_any = any(model_status.values())
    # Only list providers whose models are actually reachable right now
    # (a configured Ollama base URL alone does not mean the daemon is up).
    providers = sorted(
        {
            entry["provider"]
            for model_id, entry in MODEL_REGISTRY.items()
            if model_status.get(model_id)
        }
    )

    return {
        "status": "ok" if db_status == "ok" else "degraded",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": db_status,
        "ai_mode": "live" if live_any else "simulation",
        "providers_configured": providers,
        "default_model": settings.DEFAULT_LLM_MODEL,
        "models": model_status,
        "embeddings": {
            "mode": "live" if is_embedding_configured() else "mock",
            "provider": settings.EMBEDDING_PROVIDER,
            "model": settings.DEFAULT_EMBEDDING_MODEL,
        },
    }


# Include V1 API Routers
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(knowledge.router, prefix=settings.API_V1_STR)
app.include_router(graph.router, prefix=settings.API_V1_STR)
app.include_router(workspace.router, prefix=settings.API_V1_STR)
app.include_router(memory.router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
