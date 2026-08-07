import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import secrets
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.db import engine, Base, AsyncSessionLocal
from app.core.rate_limit import RateLimitMiddleware
from app.core.security import get_password_hash
from app.api.v1 import chat, knowledge, graph, workspace, memory, auth, stats
from app.models.domain import User, Workspace
from app.services.seeder import seed_corpus_for_workspace
from app.services.llm import (
    is_embedding_configured,
    is_model_available,
    MODEL_REGISTRY,
)

# The dev-fallback identity used by permissive endpoints when no token is sent
# (see get_current_user_payload). We materialize it as a real row on first
# boot so the default workspace's owner_id satisfies foreign-key constraints
# on Postgres as well as SQLite.
DEV_USER_ID = "user_dev_nexus_01"
DEV_USER_EMAIL = "dev@nexus.local"
DEFAULT_WORKSPACE_ID = "ws_default_01"


async def seed_initial_workspace_data():
    """
    First-boot bootstrap: ensure the dev user exists, create the default
    workspace if missing, then load the enterprise corpus into it.

    The dev-user check runs even when the workspace already exists (e.g. a DB
    created before users were materialized) so the demo-fallback identity is
    always a real row — required for foreign keys on Postgres.
    """
    async with AsyncSessionLocal() as session:
        dev_user = await session.get(User, DEV_USER_ID)
        if not dev_user:
            # Unusable random hash — this identity is for the demo fallback,
            # not for real logins.
            session.add(
                User(
                    id=DEV_USER_ID,
                    email=DEV_USER_EMAIL,
                    full_name="Development Sandbox",
                    hashed_password=get_password_hash(secrets.token_urlsafe(32)),
                )
            )

        workspace = await session.get(Workspace, DEFAULT_WORKSPACE_ID)
        if workspace:
            await session.commit()
            return

        session.add(
            Workspace(
                id=DEFAULT_WORKSPACE_ID,
                name="Nexus Enterprise AI Core",
                slug="nexus-enterprise-core",
                description="Default Enterprise Knowledge Workspace for Multi-Agent RAG & Graph Systems",
                owner_id=DEV_USER_ID,
            )
        )
        await session.flush()

        # Keep the original deterministic seed ids (ent_01...) for the default
        # workspace; only per-user workspaces get remapped UUIDs.
        await seed_corpus_for_workspace(
            session=session,
            workspace_id=DEFAULT_WORKSPACE_ID,
            owner_id=DEV_USER_ID,
            keep_seed_ids=True,
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

# Per-IP sliding-window rate limiting (login/register brute-force protection
# + a general API ceiling). Disable via RATE_LIMIT_ENABLED=false if a reverse
# proxy already enforces limits.
app.add_middleware(RateLimitMiddleware)


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
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(knowledge.router, prefix=settings.API_V1_STR)
app.include_router(graph.router, prefix=settings.API_V1_STR)
app.include_router(workspace.router, prefix=settings.API_V1_STR)
app.include_router(memory.router, prefix=settings.API_V1_STR)
app.include_router(stats.router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
