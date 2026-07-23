from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.db import get_db
from app.core.security import get_current_user_payload, TokenPayload
from app.models.schemas import DocumentCreate, DocumentResponse
from app.models.domain import Document, DocumentChunk
from app.services.doc_processor import doc_processor
from app.services.hybrid_search import hybrid_search_engine

router = APIRouter(prefix="/knowledge", tags=["Knowledge Base & Ingestion"])


@router.post("/documents", response_model=DocumentResponse)
async def ingest_document(
    doc_in: DocumentCreate,
    db: AsyncSession = Depends(get_db),
    user_payload: TokenPayload = Depends(get_current_user_payload)
):
    workspace_id = user_payload.workspace_id or "ws_default_01"
    doc = await doc_processor.process_and_ingest_document(
        session=db,
        workspace_id=workspace_id,
        title=doc_in.title,
        content=doc_in.content,
        source_type=doc_in.source_type,
        metadata=doc_in.metadata
    )
    return doc


@router.get("/documents")
async def list_documents(
    db: AsyncSession = Depends(get_db),
    user_payload: TokenPayload = Depends(get_current_user_payload)
):
    workspace_id = user_payload.workspace_id or "ws_default_01"
    stmt = select(Document).where(Document.workspace_id == workspace_id).order_by(Document.created_at.desc())
    res = await db.execute(stmt)
    documents = res.scalars().all()
    return [{
        "id": d.id,
        "workspace_id": d.workspace_id,
        "title": d.title,
        "source_type": d.source_type,
        "status": d.status,
        "chunk_count": d.chunk_count,
        "file_size_bytes": d.file_size_bytes,
        "created_at": d.created_at
    } for d in documents]


@router.get("/documents/{doc_id}/chunks")
async def get_document_chunks(
    doc_id: str,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(DocumentChunk).where(DocumentChunk.document_id == doc_id).order_by(DocumentChunk.chunk_index)
    res = await db.execute(stmt)
    chunks = res.scalars().all()
    return [{
        "id": c.id,
        "document_id": c.document_id,
        "chunk_index": c.chunk_index,
        "content": c.content,
        "token_count": c.token_count,
        "metadata": c.metadata_json
    } for c in chunks]


@router.post("/search")
async def test_hybrid_search(
    query: str,
    top_k: int = 5,
    db: AsyncSession = Depends(get_db),
    user_payload: TokenPayload = Depends(get_current_user_payload)
):
    workspace_id = user_payload.workspace_id or "ws_default_01"
    results = await hybrid_search_engine.search(
        session=db,
        workspace_id=workspace_id,
        query=query,
        top_k=top_k
    )
    return {"query": query, "results_count": len(results), "results": results}
