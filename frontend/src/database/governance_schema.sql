-- ============================================================================
-- NEXUS AI — Enterprise Governance, Administration & Security Database Schema
-- Module 14 Extension
-- ============================================================================

-- 1. Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL UNIQUE,
    tier VARCHAR(50) NOT NULL DEFAULT 'enterprise_ultimate' CHECK (tier IN ('standard', 'pro', 'enterprise', 'enterprise_ultimate')),
    max_workspaces INT NOT NULL DEFAULT 50,
    max_seats INT NOT NULL DEFAULT 500,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    lead_user_id VARCHAR(100),
    budget_usd NUMERIC(12,2) DEFAULT 10000.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Teams Table
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Enterprise Roles Table (RBAC / ABAC)
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN NOT NULL DEFAULT FALSE,
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. User Group Bindings Table
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    sso_group_mapping VARCHAR(255),
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Governance Policies Table
CREATE TABLE IF NOT EXISTS public.policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    workspace_id UUID,
    policy_type VARCHAR(50) NOT NULL CHECK (policy_type IN ('workspace', 'tool', 'agent', 'prompt', 'research', 'retention', 'security')),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_enforced BOOLEAN NOT NULL DEFAULT TRUE,
    rules JSONB NOT NULL DEFAULT '{}'::jsonb,
    approval_required BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Approval Queue Table
CREATE TABLE IF NOT EXISTS public.approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    request_type VARCHAR(50) NOT NULL CHECK (request_type IN ('tool_execution', 'prompt_deployment', 'research_run', 'agent_deployment', 'model_access', 'policy_change')),
    title VARCHAR(255) NOT NULL,
    requester_id VARCHAR(100) NOT NULL,
    assigned_approver_id VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    reason TEXT,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Security Events Audit Table
CREATE TABLE IF NOT EXISTS public.security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    workspace_id UUID,
    user_id VARCHAR(100),
    event_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'low', 'medium', 'high', 'critical')),
    ip_address VARCHAR(50),
    country VARCHAR(50),
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Compliance Reports Table
CREATE TABLE IF NOT EXISTS public.compliance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    framework VARCHAR(50) NOT NULL CHECK (framework IN ('soc2_type2', 'iso_27001', 'gdpr', 'hipaa')),
    readiness_percent NUMERIC(5,2) NOT NULL DEFAULT 98.50,
    passed_controls INT NOT NULL DEFAULT 42,
    total_controls INT NOT NULL DEFAULT 44,
    status VARCHAR(30) NOT NULL DEFAULT 'compliant' CHECK (status IN ('compliant', 'in_review', 'non_compliant')),
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Licenses Table
CREATE TABLE IF NOT EXISTS public.licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID UNIQUE NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    plan_name VARCHAR(100) NOT NULL DEFAULT 'Enterprise Ultimate',
    seats_allocated INT NOT NULL DEFAULT 250,
    seats_used INT NOT NULL DEFAULT 84,
    features JSONB NOT NULL DEFAULT '["graphrag", "deep_research", "multi_agent", "custom_mcp", "soar_security"]'::jsonb,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '365 days',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Usage Quotas Table
CREATE TABLE IF NOT EXISTS public.quotas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    monthly_token_quota INT NOT NULL DEFAULT 10000000,
    tokens_consumed INT NOT NULL DEFAULT 1245000,
    monthly_research_quota INT NOT NULL DEFAULT 500,
    researches_executed INT NOT NULL DEFAULT 42,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Audit Exports Table
CREATE TABLE IF NOT EXISTS public.audit_exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    export_format VARCHAR(20) NOT NULL DEFAULT 'json' CHECK (export_format IN ('json', 'csv', 'parquet')),
    record_count INT NOT NULL DEFAULT 0,
    download_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for Governance Queries
CREATE INDEX IF NOT EXISTS idx_approvals_org_status ON public.approvals(org_id, status);
CREATE INDEX IF NOT EXISTS idx_policies_org ON public.policies(org_id);
CREATE INDEX IF NOT EXISTS idx_security_events_org ON public.security_events(org_id, severity);

-- Enable Row Level Security
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotas ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Organization & Tenant Isolation
CREATE POLICY org_isolation_policy ON public.organizations
    FOR ALL USING (id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY policies_org_isolation ON public.policies
    FOR ALL USING (org_id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY approvals_org_isolation ON public.approvals
    FOR ALL USING (org_id = current_setting('app.current_org_id', true)::uuid);
