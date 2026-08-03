-- ============================================================================
-- NEXUS AI — Enterprise AI Evaluation, Guardrails & Observability Database Schema
-- Module 13 Extension
-- ============================================================================

-- 1. Evaluation Runs Table
CREATE TABLE IF NOT EXISTS public.evaluation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    session_id UUID,
    evaluation_type VARCHAR(50) NOT NULL CHECK (evaluation_type IN ('retrieval', 'graphrag', 'memory', 'tool', 'agent', 'research', 'full_pipeline')),
    status VARCHAR(30) NOT NULL DEFAULT 'completed' CHECK (status IN ('running', 'completed', 'failed')),
    overall_score NUMERIC(5,4) NOT NULL DEFAULT 0.9000,
    metrics_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Evaluation Metrics Detail Table
CREATE TABLE IF NOT EXISTS public.evaluation_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_run_id UUID NOT NULL REFERENCES public.evaluation_runs(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_category VARCHAR(50) NOT NULL,
    value NUMERIC(8,4) NOT NULL,
    target_threshold NUMERIC(8,4) DEFAULT 0.8500,
    passed BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Runtime Traces Table (Distributed Tracing)
CREATE TABLE IF NOT EXISTS public.runtime_traces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trace_id VARCHAR(100) NOT NULL,
    parent_span_id VARCHAR(100),
    span_id VARCHAR(100) NOT NULL,
    workspace_id UUID NOT NULL,
    operation_name VARCHAR(150) NOT NULL,
    component VARCHAR(50) NOT NULL CHECK (component IN ('retrieval', 'graphrag', 'memory', 'tool', 'agent', 'research', 'embedding', 'llm', 'system')),
    latency_ms NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ok' CHECK (status IN ('ok', 'error', 'cancelled')),
    attributes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Guardrail Events Log Table
CREATE TABLE IF NOT EXISTS public.guardrail_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    user_id UUID,
    guardrail_type VARCHAR(50) NOT NULL CHECK (guardrail_type IN ('prompt_validation', 'output_validation', 'pii_detection', 'sensitive_data', 'policy_violation', 'unsafe_tool')),
    severity VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    action_taken VARCHAR(30) NOT NULL DEFAULT 'blocked' CHECK (action_taken IN ('flagged', 'masked', 'blocked', 'rejected')),
    input_text TEXT,
    sanitized_text TEXT,
    matched_rule VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Policy Violations Table
CREATE TABLE IF NOT EXISTS public.policy_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    policy_name VARCHAR(150) NOT NULL,
    rule_id VARCHAR(100) NOT NULL,
    violator_id VARCHAR(100) NOT NULL,
    violation_details TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'resolved', 'ignored')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Cost Reports Table (Token & Cost Analytics)
CREATE TABLE IF NOT EXISTS public.cost_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    model_id VARCHAR(100) NOT NULL,
    agent_role VARCHAR(50),
    tool_id VARCHAR(100),
    prompt_tokens INT NOT NULL DEFAULT 0,
    completion_tokens INT NOT NULL DEFAULT 0,
    embedding_tokens INT NOT NULL DEFAULT 0,
    total_tokens INT NOT NULL DEFAULT 0,
    estimated_cost_usd NUMERIC(10,6) NOT NULL DEFAULT 0.000000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Prompt Versions Table
CREATE TABLE IF NOT EXISTS public.prompt_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    prompt_name VARCHAR(150) NOT NULL,
    version_number INT NOT NULL DEFAULT 1,
    system_prompt TEXT NOT NULL,
    user_template TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    author_id VARCHAR(100) NOT NULL,
    eval_score NUMERIC(5,4) DEFAULT 0.9000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Prompt Experiments Table (A/B Testing)
CREATE TABLE IF NOT EXISTS public.prompt_experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    experiment_name VARCHAR(150) NOT NULL,
    variant_a_id UUID NOT NULL REFERENCES public.prompt_versions(id) ON DELETE CASCADE,
    variant_b_id UUID NOT NULL REFERENCES public.prompt_versions(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'running' CHECK (status IN ('draft', 'running', 'concluded')),
    winner_variant_id UUID REFERENCES public.prompt_versions(id) ON DELETE SET NULL,
    traffic_split_percent INT NOT NULL DEFAULT 50,
    metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Quality Scores Table
CREATE TABLE IF NOT EXISTS public.quality_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    overall_quality NUMERIC(5,4) NOT NULL DEFAULT 0.9200,
    retrieval_score NUMERIC(5,4) NOT NULL DEFAULT 0.9000,
    grounding_score NUMERIC(5,4) NOT NULL DEFAULT 0.9400,
    reasoning_score NUMERIC(5,4) NOT NULL DEFAULT 0.9100,
    research_score NUMERIC(5,4) NOT NULL DEFAULT 0.9300,
    reliability_score NUMERIC(5,4) NOT NULL DEFAULT 0.9500,
    snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Analytics Snapshots Table
CREATE TABLE IF NOT EXISTS public.analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    time_window VARCHAR(20) NOT NULL DEFAULT '1h' CHECK (time_window IN ('15m', '1h', '24h', '7d', '30d')),
    p50_latency_ms NUMERIC(10,2) NOT NULL DEFAULT 45.0,
    p95_latency_ms NUMERIC(10,2) NOT NULL DEFAULT 180.0,
    p99_latency_ms NUMERIC(10,2) NOT NULL DEFAULT 320.0,
    total_requests INT NOT NULL DEFAULT 0,
    error_rate NUMERIC(5,4) NOT NULL DEFAULT 0.0000,
    total_cost_usd NUMERIC(10,4) NOT NULL DEFAULT 0.0000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for Fast Analytics Querying
CREATE INDEX IF NOT EXISTS idx_runtime_traces_workspace ON public.runtime_traces(workspace_id, trace_id);
CREATE INDEX IF NOT EXISTS idx_guardrail_events_workspace ON public.guardrail_events(workspace_id, guardrail_type);
CREATE INDEX IF NOT EXISTS idx_cost_reports_workspace ON public.cost_reports(workspace_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_runs_workspace ON public.evaluation_runs(workspace_id);

-- Enable Row Level Security
ALTER TABLE public.evaluation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.runtime_traces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardrail_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Multi-Tenant Workspace Isolation
CREATE POLICY evaluation_runs_workspace_policy ON public.evaluation_runs
    FOR ALL USING (workspace_id = current_setting('app.current_workspace_id', true)::uuid);

CREATE POLICY runtime_traces_workspace_policy ON public.runtime_traces
    FOR ALL USING (workspace_id = current_setting('app.current_workspace_id', true)::uuid);

CREATE POLICY guardrail_events_workspace_policy ON public.guardrail_events
    FOR ALL USING (workspace_id = current_setting('app.current_workspace_id', true)::uuid);

CREATE POLICY cost_reports_workspace_policy ON public.cost_reports
    FOR ALL USING (workspace_id = current_setting('app.current_workspace_id', true)::uuid);

CREATE POLICY quality_scores_workspace_policy ON public.quality_scores
    FOR ALL USING (workspace_id = current_setting('app.current_workspace_id', true)::uuid);
