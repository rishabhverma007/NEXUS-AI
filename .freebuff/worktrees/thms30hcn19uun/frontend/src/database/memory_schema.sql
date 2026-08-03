-- ====================================================================
-- NEXUS AI — Enterprise Long-Term Memory Platform Database Schema & RLS
-- ====================================================================

-- 1. MEMORY OBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.memory_objects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  memory_type VARCHAR(50) NOT NULL DEFAULT 'episodic', -- working, episodic, semantic, workspace, organization
  key VARCHAR(255) NOT NULL,
  value TEXT NOT NULL,
  importance_score FLOAT DEFAULT 0.5, -- 0.0 to 1.0
  confidence_score FLOAT DEFAULT 0.95,
  access_count INTEGER DEFAULT 1,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 2. MEMORY FACTS TABLE
CREATE TABLE IF NOT EXISTS public.memory_facts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memory_object_id UUID NOT NULL REFERENCES public.memory_objects(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  fact_category VARCHAR(50) NOT NULL DEFAULT 'preference', -- preference, entity, task, goal, decision
  subject VARCHAR(255) NOT NULL,
  predicate VARCHAR(255) NOT NULL,
  object VARCHAR(512) NOT NULL,
  confidence FLOAT DEFAULT 0.95,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MEMORY SUMMARIES TABLE
CREATE TABLE IF NOT EXISTS public.memory_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  summary_type VARCHAR(50) DEFAULT 'hierarchical',
  summary_text TEXT NOT NULL,
  compression_ratio FLOAT DEFAULT 0.78,
  memories_count INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES FOR MEMORY DATA
ALTER TABLE public.memory_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_facts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Select workspace memory objects" ON public.memory_objects
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Select workspace memory facts" ON public.memory_facts
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_memory_workspace ON public.memory_objects(workspace_id, memory_type);
CREATE INDEX IF NOT EXISTS idx_memory_importance ON public.memory_objects(importance_score DESC);
