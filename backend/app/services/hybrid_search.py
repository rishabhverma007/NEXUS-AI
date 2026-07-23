import math
import numpy as np
from typing import List, Dict, Any, Tuple, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.domain import DocumentChunk
from app.core.config import settings


class HybridSearchEngine:
    """
    Enterprise Hybrid Search Engine combining:
    1. Dense Vector Cosine Similarity Search
    2. Sparse BM25 Term Frequency-Inverse Document Frequency Search
    3. Reciprocal Rank Fusion (RRF) Re-ranking
    """

    def __init__(self, rrf_k: int = 60):
        self.rrf_k = rrf_k

    def generate_mock_embedding(self, text: str, dim: int = 1536) -> List[float]:
        """
        Generates a deterministic normalized embedding vector for demonstration & local operation
        when external API key is not present.
        """
        rng = np.random.RandomState(seed=abs(hash(text)) % (2**32))
        vec = rng.randn(dim).astype(np.float32)
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec.tolist()

    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        a = np.array(vec1, dtype=np.float32)
        b = np.array(vec2, dtype=np.float32)
        dot = np.dot(a, b)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(dot / (norm_a * norm_b))

    def _compute_bm25_score(self, query_terms: List[str], doc_text: str, avg_doc_len: float = 100.0, k1: float = 1.5, b: float = 0.75) -> float:
        words = doc_text.lower().split()
        doc_len = len(words)
        score = 0.0
        for term in query_terms:
            tf = words.count(term.lower())
            if tf > 0:
                # BM25 term frequency calculation
                tf_norm = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (doc_len / max(1.0, avg_doc_len))))
                score += tf_norm
        return score

    async def search(
        self,
        session: AsyncSession,
        workspace_id: str,
        query: str,
        top_k: int = 10,
        query_embedding: Optional[List[float]] = None
    ) -> List[Dict[str, Any]]:
        if not query_embedding:
            query_embedding = self.generate_mock_embedding(query)

        # 1. Fetch chunks from database for the workspace
        stmt = select(DocumentChunk).where(DocumentChunk.workspace_id == workspace_id)
        result = await session.execute(stmt)
        chunks: List[DocumentChunk] = list(result.scalars().all())

        if not chunks:
            return []

        # 2. Compute Dense Vector Scores
        dense_results: List[Tuple[DocumentChunk, float]] = []
        for chunk in chunks:
            sim = self._cosine_similarity(query_embedding, chunk.embedding_json)
            dense_results.append((chunk, sim))
        dense_results.sort(key=lambda x: x[1], reverse=True)

        # 3. Compute Sparse BM25 Scores
        query_terms = [t for t in query.lower().split() if len(t) > 2]
        sparse_results: List[Tuple[DocumentChunk, float]] = []
        avg_len = sum(len(c.content.split()) for c in chunks) / max(1, len(chunks))
        for chunk in chunks:
            bm25 = self._compute_bm25_score(query_terms, chunk.content, avg_doc_len=avg_len)
            sparse_results.append((chunk, bm25))
        sparse_results.sort(key=lambda x: x[1], reverse=True)

        # 4. Reciprocal Rank Fusion (RRF)
        rrf_scores: Dict[str, float] = {}
        chunk_map: Dict[str, DocumentChunk] = {}
        dense_rank_map: Dict[str, int] = {}
        sparse_rank_map: Dict[str, int] = {}

        for rank, (chunk, score) in enumerate(dense_results):
            chunk_map[chunk.id] = chunk
            dense_rank_map[chunk.id] = rank + 1
            rrf_scores[chunk.id] = rrf_scores.get(chunk.id, 0.0) + (1.0 / (self.rrf_k + rank + 1))

        for rank, (chunk, score) in enumerate(sparse_results):
            chunk_map[chunk.id] = chunk
            sparse_rank_map[chunk.id] = rank + 1
            rrf_scores[chunk.id] = rrf_scores.get(chunk.id, 0.0) + (1.0 / (self.rrf_k + rank + 1))

        # 5. Sort final results by RRF score
        fused_sorted_ids = sorted(rrf_scores.keys(), key=lambda cid: rrf_scores[cid], reverse=True)

        output: List[Dict[str, Any]] = []
        for cid in fused_sorted_ids[:top_k]:
            chunk = chunk_map[cid]
            output.append({
                "chunk_id": chunk.id,
                "document_id": chunk.document_id,
                "content": chunk.content,
                "token_count": chunk.token_count,
                "rrf_score": round(rrf_scores[cid], 5),
                "dense_rank": dense_rank_map.get(cid, 999),
                "sparse_rank": sparse_rank_map.get(cid, 999),
                "metadata": chunk.metadata_json
            })

        return output


hybrid_search_engine = HybridSearchEngine()
