from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.db import get_db
from app.core.security import get_current_user_payload, TokenPayload
from app.models.domain import KnowledgeGraphEntity, KnowledgeGraphRelation
from app.services.graph_rag import graph_rag_engine

router = APIRouter(prefix="/graph", tags=["GraphRAG Engine"])


@router.get("/visualization")
async def get_graph_visualization(
    db: AsyncSession = Depends(get_db),
    user_payload: TokenPayload = Depends(get_current_user_payload)
):
    workspace_id = user_payload.workspace_id or "ws_default_01"
    
    # Fetch Entities
    stmt_e = select(KnowledgeGraphEntity).where(KnowledgeGraphEntity.workspace_id == workspace_id)
    res_e = await db.execute(stmt_e)
    entities = res_e.scalars().all()

    # Fetch Relations
    stmt_r = select(KnowledgeGraphRelation).where(KnowledgeGraphRelation.workspace_id == workspace_id)
    res_r = await db.execute(stmt_r)
    relations = res_r.scalars().all()

    nodes_data = [{
        "id": e.id,
        "name": e.name,
        "entity_type": e.entity_type,
        "description": e.description,
        "properties": e.properties
    } for e in entities]

    edges_data = [{
        "id": r.id,
        "source": r.source_entity_id,
        "target": r.target_entity_id,
        "relation_type": r.relation_type,
        "weight": r.weight,
        "description": r.description
    } for r in relations]

    return {
        "nodes": nodes_data,
        "edges": edges_data,
        "stats": {
            "total_nodes": len(nodes_data),
            "total_edges": len(edges_data)
        }
    }


@router.post("/query")
async def query_graph_subgraph(
    query: str,
    max_depth: int = 2,
    db: AsyncSession = Depends(get_db),
    user_payload: TokenPayload = Depends(get_current_user_payload)
):
    workspace_id = user_payload.workspace_id or "ws_default_01"
    result = await graph_rag_engine.query_subgraph(
        session=db,
        workspace_id=workspace_id,
        query=query,
        max_depth=max_depth
    )
    return result
