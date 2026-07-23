import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.db import engine, Base, AsyncSessionLocal
from app.api.v1 import chat, knowledge, graph, workspace, memory
from app.models.domain import Workspace, KnowledgeGraphEntity, KnowledgeGraphRelation, Document
from app.services.doc_processor import doc_processor
from app.services.memory_service import memory_service


async def seed_initial_workspace_data():
    """Seed initial enterprise workspace data, GraphRAG nodes, and document chunks."""
    async with AsyncSessionLocal() as session:
        # Check if default workspace exists
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

            # Seed Knowledge Graph Entities
            e1 = KnowledgeGraphEntity(
                id="ent_01",
                workspace_id="ws_default_01",
                name="Multi-Agent Architecture",
                entity_type="Concept",
                description="Distributed agentic collaboration model with Router, RAG, Reflection, and Synthesis agents."
            )
            e2 = KnowledgeGraphEntity(
                id="ent_02",
                workspace_id="ws_default_01",
                name="GraphRAG Engine",
                entity_type="Tool",
                description="Sub-graph traversal engine combining NetworkX topology with pgvector semantic similarity."
            )
            e3 = KnowledgeGraphEntity(
                id="ent_03",
                workspace_id="ws_default_01",
                name="pgvector Database",
                entity_type="Database",
                description="PostgreSQL vector extension for high-performance HNSW cosine distance semantic search."
            )
            e4 = KnowledgeGraphEntity(
                id="ent_04",
                workspace_id="ws_default_01",
                name="Reflection Engine",
                entity_type="Concept",
                description="Factual consistency verification loop with hallucination score evaluation."
            )
            session.add_all([e1, e2, e3, e4])

            # Seed Relations
            r1 = KnowledgeGraphRelation(
                id="rel_01",
                workspace_id="ws_default_01",
                source_entity_id="ent_01",
                target_entity_id="ent_02",
                relation_type="USES",
                description="Multi-Agent Architecture leverages GraphRAG for entity relation reasoning."
            )
            r2 = KnowledgeGraphRelation(
                id="rel_02",
                workspace_id="ws_default_01",
                source_entity_id="ent_02",
                target_entity_id="ent_03",
                relation_type="STORED_IN",
                description="GraphRAG entity vector representations are indexed in pgvector."
            )
            r3 = KnowledgeGraphRelation(
                id="rel_03",
                workspace_id="ws_default_01",
                source_entity_id="ent_01",
                target_entity_id="ent_04",
                relation_type="ENFORCES",
                description="Multi-Agent Architecture enforces output quality via Reflection Engine."
            )
            session.add_all([r1, r2, r3])

            await session.commit()

            # Seed Document Content
            await doc_processor.process_and_ingest_document(
                session=session,
                workspace_id="ws_default_01",
                title="NEXUS AI Master Architecture Blueprint",
                content="""
# NEXUS AI Enterprise Specification

NEXUS AI is built upon a hybrid Multi-Agent RAG architecture that unites:
1. Dense Cosine Vector Embeddings stored in pgvector.
2. Sparse BM25 Keyword Search with Reciprocal Rank Fusion (RRF).
3. NetworkX Knowledge Graph (GraphRAG) with sub-graph traversal up to 2 hops.
4. Reflection Engine evaluating factual correctness before emitting final SSE frames.

## Security & Isolation
Multi-tenant workspaces isolate document chunks, vector indices, and graph nodes per tenant workspace ID.
                """,
                source_type="markdown",
                metadata={"category": "architecture", "author": "Principal Architect"}
            )

            # Seed Long-Term Memory
            await memory_service.store_memory(
                session=session,
                workspace_id="ws_default_01",
                user_id="user_dev_nexus_01",
                memory_type="preference",
                key="preferred_language",
                value="TypeScript / Python with Strict Typing and Clean Architecture"
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


# Include V1 API Routers
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(knowledge.router, prefix=settings.API_V1_STR)
app.include_router(graph.router, prefix=settings.API_V1_STR)
app.include_router(workspace.router, prefix=settings.API_V1_STR)
app.include_router(memory.router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
