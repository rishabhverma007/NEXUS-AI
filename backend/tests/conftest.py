"""Shared pytest fixtures: in-memory async SQLite database with tables."""
import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.db import Base
from app.models.domain import (
    Document,
    DocumentChunk,
    KnowledgeGraphEntity,
    KnowledgeGraphRelation,
)
from app.services.hybrid_search import hybrid_search_engine


@pytest_asyncio.fixture
async def db_session():
    """Fresh in-memory SQLite DB with all tables created, plus seeded data."""
    # StaticPool keeps a single shared in-memory connection so `create_all` and
    # session queries always hit the SAME database (in-memory SQLite otherwise
    # creates a fresh DB per connection, silently breaking the fixtures).
    engine = create_async_engine(
        "sqlite+aiosqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    Session = async_sessionmaker(bind=engine, expire_on_commit=False)
    async with Session() as session:
        # Two documents with clearly different vocabulary for RRF tests.
        doc_vector = Document(
            id="doc_1",
            workspace_id="ws_test",
            title="Vector Search Doc",
            source_type="markdown",
            status="indexed",
        )
        doc_python = Document(
            id="doc_2",
            workspace_id="ws_test",
            title="Python SDK Doc",
            source_type="markdown",
            status="indexed",
        )
        session.add_all([doc_vector, doc_python])
        await session.flush()

        chunk_vector = DocumentChunk(
            id="chunk_1",
            document_id="doc_1",
            workspace_id="ws_test",
            chunk_index=0,
            content="pgvector stores dense vector embeddings for semantic cosine search.",
            token_count=12,
            embedding_json=hybrid_search_engine.generate_mock_embedding(
                "pgvector dense vector semantic search"
            ),
        )
        chunk_python = DocumentChunk(
            id="chunk_2",
            document_id="doc_2",
            workspace_id="ws_test",
            chunk_index=0,
            content="The Python SDK exposes async streaming chat and SSE event parsing.",
            token_count=12,
            embedding_json=hybrid_search_engine.generate_mock_embedding(
                "python sdk async streaming chat sse"
            ),
        )
        session.add_all([chunk_vector, chunk_python])

        # A small knowledge graph: A --USES--> B --STORED_IN--> C.
        session.add_all(
            [
                KnowledgeGraphEntity(
                    id="ent_a", workspace_id="ws_test", name="Agent A",
                    entity_type="Concept", description="orchestrator agent",
                ),
                KnowledgeGraphEntity(
                    id="ent_b", workspace_id="ws_test", name="Graph Engine",
                    entity_type="Tool", description="knowledge graph traversal",
                ),
                KnowledgeGraphEntity(
                    id="ent_c", workspace_id="ws_test", name="Vector DB",
                    entity_type="Database", description="pgvector storage",
                ),
            ]
        )
        session.add_all(
            [
                KnowledgeGraphRelation(
                    id="rel_a", workspace_id="ws_test",
                    source_entity_id="ent_a", target_entity_id="ent_b",
                    relation_type="USES", description="A uses the graph engine",
                ),
                KnowledgeGraphRelation(
                    id="rel_b", workspace_id="ws_test",
                    source_entity_id="ent_b", target_entity_id="ent_c",
                    relation_type="STORED_IN", description="graph stored in vector db",
                ),
            ]
        )
        await session.flush()
        yield session

    await engine.dispose()
