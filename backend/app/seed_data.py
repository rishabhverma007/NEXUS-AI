"""
Enterprise seed corpus for NEXUS AI.

A realistic knowledge base that makes the product demo itself: architecture
blueprints, compliance specs, retrieval-tuning guides, and design docs, plus a
connected knowledge graph and long-term memory entries.

Seeded on first boot (when the default workspace has no documents) or on demand
via:  python seed.py
"""
from typing import Any, Dict, List

# ---------------------------------------------------------------------------
# Documents (markdown, realistic enterprise corpus)
# ---------------------------------------------------------------------------
SEED_DOCUMENTS: List[Dict[str, Any]] = [
    {
        "title": "NEXUS AI Master Architecture Blueprint",
        "source_type": "markdown",
        "metadata": {"category": "architecture", "author": "Principal Architect", "version": "v2.0"},
        "content": """# NEXUS AI Enterprise Specification

NEXUS AI is built upon a hybrid Multi-Agent RAG architecture that unites:
1. Dense cosine vector embeddings stored in pgvector (HNSW index).
2. Sparse BM25 keyword search with Reciprocal Rank Fusion (RRF).
3. NetworkX Knowledge Graph (GraphRAG) with sub-graph traversal up to 2 hops.
4. A Reflection Engine evaluating factual correctness before emitting SSE frames.

## Multi-Agent Pipeline
The Router Agent classifies intent, then delegates to Vector RAG, Graph RAG,
and Long-Term Memory agents in parallel. A Synthesis Agent streams a grounded
markdown answer while the Reflection Agent scores hallucination risk.

## Security & Isolation
Multi-tenant workspaces isolate document chunks, vector indices, and graph
nodes per workspace ID. All secrets live in environment variables; the
SECRET_KEY has no default in production.
""",
    },
    {
        "title": "Enterprise Security & SOC-2 Compliance Framework",
        "source_type": "markdown",
        "metadata": {"category": "compliance", "author": "Security Team", "version": "v1.4"},
        "content": """# SOC-2 Compliance Framework

## Control Areas
- **Access Control**: JWT-based bearer auth with role hierarchy (viewer, member, admin, owner).
- **Encryption**: TLS in transit; SECRET_KEY injected via environment, never committed.
- **Audit Logging**: All workspace mutations and chat sessions are traceable.

## Data Isolation
Each tenant workspace owns its document chunks, embeddings, and knowledge
graph entities. Cross-workspace access is rejected at the query layer.

## Incident Response
Reflection scores below 0.8 trigger manual review queues rather than
auto-approval, ensuring hallucination risk never reaches end users silently.
""",
    },
    {
        "title": "GraphRAG Subgraph Traversal Specification",
        "source_type": "markdown",
        "metadata": {"category": "specification", "author": "Graph Team", "version": "v1.1"},
        "content": """# GraphRAG Subgraph Traversal Specification

## Entity & Relationship Model
Entities carry a name, entity_type (concept, tool, database, system), and a
description. Relations are typed edges: USES, DEPENDS_ON, STORED_IN, ENFORCES,
RELATED_TO.

## Traversal Semantics
Given a user query, seed nodes are matched by keyword overlap on name,
description, or entity type. Ego-graph expansion walks up to `max_depth` hops
and caps at `max_nodes`. The resulting sub-graph is rendered as an interactive
3D force-directed visualization and summarized as context for the Synthesis
Agent.

## Multi-hop Reasoning
Two-hop paths such as (Multi-Agent Architecture) --USES--> (GraphRAG Engine)
--STORED_IN--> (pgvector Database) give the pipeline its reasoning depth.
""",
    },
    {
        "title": "Hybrid Search Ranking & RRF Tuning Guide",
        "source_type": "markdown",
        "metadata": {"category": "retrieval", "author": "Retrieval Team", "version": "v1.0"},
        "content": """# Hybrid Search Ranking & RRF Tuning Guide

## Dense + Sparse Fusion
Dense vectors capture semantic similarity; BM25 captures lexical overlap.
Reciprocal Rank Fusion combines both rank lists with score = sum(1/(k + rank)).

## Tuning knobs
- `rrf_k = 60` balances dense vs sparse influence.
- `top_k = 5` for agent grounding, `top_k = 10` for exploration dashboards.
- BM25 parameters k1 = 1.5, b = 0.75 with corpus-averaged document length.

## Embedding Models
Real embeddings (OpenAI text-embedding-3-small, 1536-dim) are used when a key
is configured; deterministic mock vectors keep local demos stable. Re-ingest
documents after switching embedding providers.
""",
    },
    {
        "title": "Long-Term Memory Distillation Design",
        "source_type": "markdown",
        "metadata": {"category": "design", "author": "Memory Team", "version": "v0.9"},
        "content": """# Long-Term Memory Distillation Design

## Memory Types
- **Episodic**: distilled summaries of past user interactions.
- **Semantic**: workspace facts and distilled knowledge.
- **Preference**: user choices (language, tooling, output style).

## Retrieval
Memories are embedded and cosine-ranked against the incoming query, top-k
injected into the Synthesis prompt as User Memory context.

## Distillation Loop
Periodically compress chat turns into semantic vector entries so persistent
context grows without unbounded token cost.
""",
    },
    {
        "title": "Multi-Agent Orchestration Patterns",
        "source_type": "markdown",
        "metadata": {"category": "architecture", "author": "Platform Team", "version": "v1.2"},
        "content": """# Multi-Agent Orchestration Patterns

## Router-Fanout-Consolidate
The Router Agent classifies intent, fans out to specialized agents
(VectorRAG, GraphRAG, Memory), and a Synthesis Agent consolidates grounded
output.

## Reflection Loop
Every draft answer is scored by the Reflection Agent against retrieved
context before streaming completes. Scores below threshold are flagged for
review rather than silently approved.

## Streaming Protocol
SSE frames: agent_step (telemetry), token (incremental markdown), done
(citations + graph + reflection_score). The frontend renders agent steps in
a live telemetry drawer while tokens stream into the message bubble.
""",
    },
]

# ---------------------------------------------------------------------------
# Knowledge graph entities + relations
# ---------------------------------------------------------------------------
SEED_ENTITIES: List[Dict[str, Any]] = [
    {
        "id": "ent_01",
        "name": "Multi-Agent Architecture",
        "entity_type": "Concept",
        "description": "Distributed agentic collaboration model with Router, RAG, Reflection, and Synthesis agents.",
    },
    {
        "id": "ent_02",
        "name": "GraphRAG Engine",
        "entity_type": "Tool",
        "description": "Sub-graph traversal engine combining NetworkX topology with pgvector semantic similarity.",
    },
    {
        "id": "ent_03",
        "name": "pgvector Database",
        "entity_type": "Database",
        "description": "PostgreSQL vector extension for HNSW cosine distance semantic search.",
    },
    {
        "id": "ent_04",
        "name": "Reflection Engine",
        "entity_type": "Concept",
        "description": "Factual consistency verification loop with hallucination score evaluation.",
    },
    {
        "id": "ent_05",
        "name": "Hybrid Search Engine",
        "entity_type": "Tool",
        "description": "Reciprocal Rank Fusion of dense vector similarity and sparse BM25 keyword scores.",
    },
    {
        "id": "ent_06",
        "name": "Long-Term Memory Service",
        "entity_type": "Service",
        "description": "Episodic, semantic, and preference memory with cosine retrieval.",
    },
    {
        "id": "ent_07",
        "name": "SSE Streaming Protocol",
        "entity_type": "Protocol",
        "description": "Server-sent events carrying agent steps, tokens, and final citations.",
    },
    {
        "id": "ent_08",
        "name": "SOC-2 Compliance",
        "entity_type": "Framework",
        "description": "Access control, encryption, audit logging, and tenant data isolation controls.",
    },
]

SEED_RELATIONS: List[Dict[str, Any]] = [
    {
        "id": "rel_01",
        "source_entity_id": "ent_01",
        "target_entity_id": "ent_02",
        "relation_type": "USES",
        "description": "Multi-Agent Architecture leverages GraphRAG for entity relation reasoning.",
    },
    {
        "id": "rel_02",
        "source_entity_id": "ent_02",
        "target_entity_id": "ent_03",
        "relation_type": "STORED_IN",
        "description": "GraphRAG entity vector representations are indexed in pgvector.",
    },
    {
        "id": "rel_03",
        "source_entity_id": "ent_01",
        "target_entity_id": "ent_04",
        "relation_type": "ENFORCES",
        "description": "Multi-Agent Architecture enforces output quality via Reflection Engine.",
    },
    {
        "id": "rel_04",
        "source_entity_id": "ent_01",
        "target_entity_id": "ent_05",
        "relation_type": "USES",
        "description": "The Router fans out retrieval to the Hybrid Search Engine.",
    },
    {
        "id": "rel_05",
        "source_entity_id": "ent_01",
        "target_entity_id": "ent_06",
        "relation_type": "USES",
        "description": "Memory Agent recalls long-term context from the Memory Service.",
    },
    {
        "id": "rel_06",
        "source_entity_id": "ent_05",
        "target_entity_id": "ent_03",
        "relation_type": "DEPENDS_ON",
        "description": "Hybrid Search depends on pgvector for dense vector queries.",
    },
    {
        "id": "rel_07",
        "source_entity_id": "ent_01",
        "target_entity_id": "ent_07",
        "relation_type": "EMITS",
        "description": "Multi-Agent pipeline streams results over the SSE protocol.",
    },
    {
        "id": "rel_08",
        "source_entity_id": "ent_01",
        "target_entity_id": "ent_08",
        "relation_type": "COMPLIES_WITH",
        "description": "Architecture adheres to SOC-2 compliance controls.",
    },
    {
        "id": "rel_09",
        "source_entity_id": "ent_04",
        "target_entity_id": "ent_07",
        "relation_type": "GATES",
        "description": "Reflection gates final SSE emission by hallucination score.",
    },
]

# ---------------------------------------------------------------------------
# Long-term memory entries
# ---------------------------------------------------------------------------
SEED_MEMORIES: List[Dict[str, Any]] = [
    {
        "memory_type": "preference",
        "key": "preferred_language",
        "value": "TypeScript / Python with strict typing and clean architecture",
    },
    {
        "memory_type": "preference",
        "key": "output_style",
        "value": "Concise markdown with architecture diagrams, code fences, and actionable next steps",
    },
    {
        "memory_type": "semantic",
        "key": "default_workspace",
        "value": "Nexus Enterprise AI Core — primary workspace for multi-agent RAG and GraphRAG systems",
    },
    {
        "memory_type": "episodic",
        "key": "recent_research",
        "value": "Deep-dived hybrid search RRF tuning and pgvector HNSW parameters in the last session",
    },
]
