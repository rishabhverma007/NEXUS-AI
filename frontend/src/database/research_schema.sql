-- ============================================================================
-- NEXUS AI — Enterprise Deep Research Engine Database Schema
-- Module 12 Extension
-- ============================================================================

-- 1. Research Sessions Table
CREATE TABLE IF NOT EXISTS public.research_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    objective TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'planning', 'executing', 'synthesizing', 'completed', 'failed')),
    depth_level VARCHAR(30) NOT NULL DEFAULT 'standard' CHECK (depth_level IN ('fast', 'standard', 'deep', 'exhaustive')),
    max_iterations INT NOT NULL DEFAULT 3,
    current_iteration INT NOT NULL DEFAULT 0,
    confidence_score NUMERIC(5,4) DEFAULT 0.0000,
    summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Research Plans Table
CREATE TABLE IF NOT EXISTS public.research_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.research_sessions(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    strategy_summary TEXT NOT NULL,
    primary_hypotheses JSONB NOT NULL DEFAULT '[]'::jsonb,
    planned_tasks_count INT NOT NULL DEFAULT 0,
    estimated_duration_seconds INT NOT NULL DEFAULT 120,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Research Tasks Table (DAG Execution Tasks)
CREATE TABLE IF NOT EXISTS public.research_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.research_sessions(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.research_plans(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    sub_query TEXT NOT NULL,
    assigned_agent_role VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    iteration INT NOT NULL DEFAULT 1,
    dependencies JSONB NOT NULL DEFAULT '[]'::jsonb,
    result_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Research Hypotheses Table
CREATE TABLE IF NOT EXISTS public.research_hypotheses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.research_sessions(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    statement TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'supported', 'refuted', 'inconclusive')),
    confidence NUMERIC(5,4) NOT NULL DEFAULT 0.5000,
    supporting_evidence_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    refuting_evidence_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Research Evidence Table
CREATE TABLE IF NOT EXISTS public.research_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.research_sessions(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.research_tasks(id) ON DELETE SET NULL,
    workspace_id UUID NOT NULL,
    source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('retrieval', 'graphrag', 'memory', 'tool', 'web')),
    source_title VARCHAR(255) NOT NULL,
    source_uri TEXT,
    content TEXT NOT NULL,
    relevance_score NUMERIC(5,4) NOT NULL DEFAULT 0.8000,
    credibility_score NUMERIC(5,4) NOT NULL DEFAULT 0.8500,
    verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Research Reports Table
CREATE TABLE IF NOT EXISTS public.research_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID UNIQUE NOT NULL REFERENCES public.research_sessions(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    executive_summary TEXT NOT NULL,
    methodology TEXT NOT NULL,
    full_content TEXT NOT NULL,
    key_takeaways JSONB NOT NULL DEFAULT '[]'::jsonb,
    citations_count INT NOT NULL DEFAULT 0,
    confidence_rating NUMERIC(5,4) NOT NULL DEFAULT 0.9000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Research Iterations Log Table
CREATE TABLE IF NOT EXISTS public.research_iterations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.research_sessions(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    iteration_number INT NOT NULL,
    focus_area TEXT NOT NULL,
    findings_summary TEXT NOT NULL,
    evidence_gathered_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Research Citations Table
CREATE TABLE IF NOT EXISTS public.research_citations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES public.research_reports(id) ON DELETE CASCADE,
    evidence_id UUID NOT NULL REFERENCES public.research_evidence(id) ON DELETE CASCADE,
    citation_index INT NOT NULL,
    citation_text TEXT NOT NULL,
    source_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Research Metrics Table
CREATE TABLE IF NOT EXISTS public.research_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    total_researches_executed INT NOT NULL DEFAULT 0,
    total_evidence_nodes_collected INT NOT NULL DEFAULT 0,
    total_hypotheses_validated INT NOT NULL DEFAULT 0,
    average_research_duration_seconds NUMERIC(8,2) NOT NULL DEFAULT 0.00,
    average_confidence_score NUMERIC(5,4) NOT NULL DEFAULT 0.0000,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Research Logs Audit Table
CREATE TABLE IF NOT EXISTS public.research_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.research_sessions(id) ON DELETE CASCADE,
    log_level VARCHAR(20) NOT NULL DEFAULT 'info',
    stage VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for Fast Querying
CREATE INDEX IF NOT EXISTS idx_research_sessions_workspace ON public.research_sessions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_research_tasks_session ON public.research_tasks(session_id);
CREATE INDEX IF NOT EXISTS idx_research_evidence_session ON public.research_evidence(session_id);
CREATE INDEX IF NOT EXISTS idx_research_hypotheses_session ON public.research_hypotheses(session_id);

-- Enable Row Level Security
ALTER TABLE public.research_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_hypotheses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_iterations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Multi-Tenant Workspace Isolation
CREATE POLICY research_sessions_workspace_policy ON public.research_sessions
    FOR ALL USING (workspace_id = current_setting('app.current_workspace_id', true)::uuid);

CREATE POLICY research_plans_workspace_policy ON public.research_plans
    FOR ALL USING (workspace_id = current_setting('app.current_workspace_id', true)::uuid);

CREATE POLICY research_tasks_workspace_policy ON public.research_tasks
    FOR ALL USING (workspace_id = current_setting('app.current_workspace_id', true)::uuid);

CREATE POLICY research_evidence_workspace_policy ON public.research_evidence
    FOR ALL USING (workspace_id = current_setting('app.current_workspace_id', true)::uuid);

CREATE POLICY research_reports_workspace_policy ON public.research_reports
    FOR ALL USING (workspace_id = current_setting('app.current_workspace_id', true)::uuid);
