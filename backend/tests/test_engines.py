"""Tests for the hybrid search (RRF) and GraphRAG engines (no network)."""
import pytest

from app.services.hybrid_search import hybrid_search_engine
from app.services.graph_rag import graph_rag_engine


@pytest.mark.asyncio
async def test_hybrid_search_ranks_relevant_chunk_first(db_session):
    # Query lexically + semantically aligned with chunk_1 (pgvector content).
    results = await hybrid_search_engine.search(
        session=db_session,
        workspace_id="ws_test",
        query="pgvector dense vector semantic search",
        top_k=5,
    )
    assert len(results) >= 1
    assert results[0]["chunk_id"] == "chunk_1"
    assert results[0]["rrf_score"] > 0
    assert "dense_rank" in results[0] and "sparse_rank" in results[0]


@pytest.mark.asyncio
async def test_hybrid_search_ranks_other_chunk_first_for_other_query(db_session):
    results = await hybrid_search_engine.search(
        session=db_session,
        workspace_id="ws_test",
        query="python sdk streaming chat",
        top_k=5,
    )
    assert results[0]["chunk_id"] == "chunk_2"


@pytest.mark.asyncio
async def test_hybrid_search_isolated_per_workspace(db_session):
    results = await hybrid_search_engine.search(
        session=db_session,
        workspace_id="ws_other",
        query="anything",
        top_k=5,
    )
    assert results == []


@pytest.mark.asyncio
async def test_graph_rag_expands_ego_subgraph(db_session):
    result = await graph_rag_engine.query_subgraph(
        session=db_session,
        workspace_id="ws_test",
        query="graph engine",
        max_depth=2,
        max_nodes=10,
    )
    # Seeding on "graph engine" should pull B (Graph Engine) and its neighbors.
    names = {n["name"] for n in result["nodes"]}
    assert "Graph Engine" in names
    assert len(result["edges"]) >= 1
    assert "context_summary" in result


@pytest.mark.asyncio
async def test_graph_rag_empty_workspace(db_session):
    result = await graph_rag_engine.query_subgraph(
        session=db_session,
        workspace_id="ws_empty",
        query="anything",
    )
    assert result["nodes"] == []
    assert result["edges"] == []
    assert "empty" in result["context_summary"].lower()
