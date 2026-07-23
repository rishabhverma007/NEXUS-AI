-- ============================================================================
-- NEXUS AI — Enterprise AI Studio, Prompt Studio & Workflow Builder Database Schema
-- Module 15 Extension
-- ============================================================================

-- 1. Studio Projects Table
CREATE TABLE IF NOT EXISTS public.studio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL DEFAULT 'workflow' CHECK (category IN ('workflow', 'agent', 'prompt', 'tool', 'research')),
    status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Workflow Definitions Table
CREATE TABLE IF NOT EXISTS public.workflow_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.studio_projects(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    current_version VARCHAR(30) NOT NULL DEFAULT 'v1.0.0',
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Workflow Versions Table
CREATE TABLE IF NOT EXISTS public.workflow_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES public.workflow_definitions(id) ON DELETE CASCADE,
    version_tag VARCHAR(30) NOT NULL,
    environment VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (environment IN ('draft', 'dev', 'staging', 'production')),
    changelog TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Workflow Nodes Table (Visual DAG Nodes)
CREATE TABLE IF NOT EXISTS public.workflow_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES public.workflow_definitions(id) ON DELETE CASCADE,
    node_id VARCHAR(100) NOT NULL,
    node_type VARCHAR(50) NOT NULL CHECK (node_type IN ('prompt', 'llm', 'retriever', 'graphrag', 'memory', 'tool_call', 'agent', 'condition', 'loop', 'approval', 'human_review', 'output', 'branch', 'merge')),
    label VARCHAR(255) NOT NULL,
    position_x NUMERIC(8,2) NOT NULL DEFAULT 0.0,
    position_y NUMERIC(8,2) NOT NULL DEFAULT 0.0,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Workflow Edges Table (Visual DAG Connections)
CREATE TABLE IF NOT EXISTS public.workflow_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES public.workflow_definitions(id) ON DELETE CASCADE,
    edge_id VARCHAR(100) NOT NULL,
    source_node_id VARCHAR(100) NOT NULL,
    target_node_id VARCHAR(100) NOT NULL,
    condition_label VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Prompt Templates Table
CREATE TABLE IF NOT EXISTS public.prompt_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.studio_projects(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    system_prompt TEXT NOT NULL,
    user_template TEXT NOT NULL,
    variables JSONB NOT NULL DEFAULT '[]'::jsonb,
    model_id VARCHAR(100) NOT NULL DEFAULT 'gemini-3.6-flash',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Agent Templates Table
CREATE TABLE IF NOT EXISTS public.agent_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.studio_projects(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    role VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    capabilities JSONB NOT NULL DEFAULT '[]'::jsonb,
    allowed_tools JSONB NOT NULL DEFAULT '[]'::jsonb,
    memory_type VARCHAR(50) NOT NULL DEFAULT 'semantic',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Tool Templates Table
CREATE TABLE IF NOT EXISTS public.tool_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.studio_projects(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'rest' CHECK (category IN ('rest', 'graphql', 'sql', 'python', 'mcp')),
    schema_definition JSONB NOT NULL DEFAULT '{}'::jsonb,
    code_content TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Deployment Records Table
CREATE TABLE IF NOT EXISTS public.deployment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES public.workflow_definitions(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    version_tag VARCHAR(30) NOT NULL,
    target_environment VARCHAR(30) NOT NULL CHECK (target_environment IN ('dev', 'staging', 'production')),
    status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'rolled_back', 'failed')),
    deployed_by VARCHAR(100) NOT NULL,
    deployed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Studio Assets Table
CREATE TABLE IF NOT EXISTS public.studio_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.studio_projects(id) ON DELETE CASCADE,
    asset_type VARCHAR(50) NOT NULL,
    asset_name VARCHAR(255) NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for Studio Queries
CREATE INDEX IF NOT EXISTS idx_workflow_nodes_wf ON public.workflow_nodes(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_edges_wf ON public.workflow_edges(workflow_id);
CREATE INDEX IF NOT EXISTS idx_studio_projects_ws ON public.studio_projects(workspace_id);

-- Enable Row Level Security
ALTER TABLE public.studio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployment_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Tenant & Workspace Isolation
CREATE POLICY studio_projects_workspace_policy ON public.studio_projects
    FOR ALL USING (workspace_id = current_setting('app.current_workspace_id', true)::uuid);

CREATE POLICY workflow_definitions_workspace_policy ON public.workflow_definitions
    FOR ALL USING (workspace_id = current_setting('app.current_workspace_id', true)::uuid);
