-- ====================================================================
-- NEXUS AI — Enterprise Knowledge Management Platform Database Schema & RLS
-- ====================================================================

-- 1. KNOWLEDGE COLLECTIONS
CREATE TABLE IF NOT EXISTS public.knowledge_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(50) DEFAULT 'blue',
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 2. KNOWLEDGE FOLDERS
CREATE TABLE IF NOT EXISTS public.knowledge_folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES public.knowledge_collections(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  parent_folder_id UUID REFERENCES public.knowledge_folders(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 3. DOCUMENTS TABLE (OVERVIEW)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES public.knowledge_collections(id) ON DELETE SET NULL,
  folder_id UUID REFERENCES public.knowledge_folders(id) ON DELETE SET NULL,
  title VARCHAR(512) NOT NULL,
  source_type VARCHAR(50) NOT NULL DEFAULT 'file', -- file, web, repo, note
  mime_type VARCHAR(100) NOT NULL DEFAULT 'text/markdown',
  current_version INTEGER DEFAULT 1,
  status VARCHAR(50) DEFAULT 'queued', -- queued, parsing, ocr, completed, failed
  file_size_bytes BIGINT DEFAULT 0,
  checksum_sha256 VARCHAR(64),
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  updated_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 4. DOCUMENT VERSIONS TABLE
CREATE TABLE IF NOT EXISTS public.document_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  file_path TEXT,
  raw_content TEXT NOT NULL,
  diff_summary TEXT,
  file_size_bytes BIGINT DEFAULT 0,
  checksum_sha256 VARCHAR(64) NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(document_id, version_number)
);

-- 5. DOCUMENT METADATA TABLE
CREATE TABLE IF NOT EXISTS public.document_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE UNIQUE,
  author VARCHAR(255),
  language VARCHAR(10) DEFAULT 'en',
  language_confidence FLOAT DEFAULT 0.99,
  page_count INTEGER DEFAULT 1,
  word_count INTEGER DEFAULT 0,
  character_count INTEGER DEFAULT 0,
  reading_time_minutes INTEGER DEFAULT 1,
  parser_used VARCHAR(100) DEFAULT 'MarkdownParser',
  ocr_used BOOLEAN DEFAULT FALSE,
  custom_attributes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROCESSING JOBS TABLE
CREATE TABLE IF NOT EXISTS public.processing_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'queued', -- queued, uploading, parsing, ocr, metadata, chunking, completed, failed
  progress_percentage INTEGER DEFAULT 0,
  current_stage VARCHAR(100) DEFAULT 'Upload',
  error_message TEXT,
  duration_ms INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 7. DOCUMENT CHUNKS TABLE (PREPARED ONLY)
CREATE TABLE IF NOT EXISTS public.document_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  version_id UUID REFERENCES public.document_versions(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  chunk_order INTEGER NOT NULL,
  content TEXT NOT NULL,
  estimated_token_count INTEGER DEFAULT 0,
  heading VARCHAR(255),
  page_number INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. LABELS, TAGS & RELATIONSHIPS
CREATE TABLE IF NOT EXISTS public.document_labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(50) DEFAULT 'blue',
  UNIQUE(workspace_id, name)
);

CREATE TABLE IF NOT EXISTS public.document_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  source_document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  target_document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  relationship_type VARCHAR(50) NOT NULL, -- references, parent_of, derived_from, duplicate_of
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES FOR KNOWLEDGE DATA
ALTER TABLE public.knowledge_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Select workspace collections" ON public.knowledge_collections
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Select workspace documents" ON public.documents
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_docs_workspace ON public.documents(workspace_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chunks_document ON public.document_chunks(document_id, chunk_order);
