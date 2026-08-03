-- ====================================================================
-- NEXUS AI — Enterprise Embedding & Indexing Platform Database Schema & RLS
-- ====================================================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. EMBEDDING MODELS REGISTRY
CREATE TABLE IF NOT EXISTS public.embedding_models (
  id VARCHAR(100) PRIMARY KEY,
  provider VARCHAR(50) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  dimension INTEGER NOT NULL,
  max_tokens INTEGER DEFAULT 8192,
  cost_per_1k_token NUMERIC(10, 6) DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. VECTOR INDEXES
CREATE TABLE IF NOT EXISTS public.vector_indexes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  model_id VARCHAR(100) NOT NULL REFERENCES public.embedding_models(id),
  name VARCHAR(255) NOT NULL,
  index_type VARCHAR(50) NOT NULL DEFAULT 'hnsw', -- hnsw, ivfflat
  distance_metric VARCHAR(50) NOT NULL DEFAULT 'cosine', -- cosine, l2, inner_product
  status VARCHAR(50) DEFAULT 'ready', -- building, ready, optimizing, failed
  total_vectors BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 3. EMBEDDINGS TABLE (PGVECTOR INTEGRATION)
CREATE TABLE IF NOT EXISTS public.embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  index_id UUID NOT NULL REFERENCES public.vector_indexes(id) ON DELETE CASCADE,
  chunk_id UUID NOT NULL REFERENCES public.document_chunks(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  dimension INTEGER NOT NULL,
  provider VARCHAR(50) NOT NULL,
  model_id VARCHAR(100) NOT NULL,
  embedding_vector vector(1536), -- Default 1536-dim vector column
  checksum_sha256 VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EMBEDDING JOBS QUEUE
CREATE TABLE IF NOT EXISTS public.embedding_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'queued', -- queued, processing, embedding, indexing, completed, failed
  total_chunks INTEGER DEFAULT 0,
  processed_chunks INTEGER DEFAULT 0,
  provider VARCHAR(50) NOT NULL,
  model_id VARCHAR(100) NOT NULL,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 5. INDEX STATISTICS TABLE
CREATE TABLE IF NOT EXISTS public.index_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE UNIQUE,
  total_documents BIGINT DEFAULT 0,
  total_chunks BIGINT DEFAULT 0,
  indexed_chunks BIGINT DEFAULT 0,
  missing_embeddings BIGINT DEFAULT 0,
  orphaned_chunks BIGINT DEFAULT 0,
  health_score INTEGER DEFAULT 100, -- 0 to 100 percentage
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE public.vector_indexes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Select workspace indexes" ON public.vector_indexes
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Select workspace embeddings" ON public.embeddings
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_embeddings_workspace ON public.embeddings(workspace_id, index_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_chunk ON public.embeddings(chunk_id);
