-- ====================================================================
-- NEXUS AI — Enterprise Multi-Agent Collaboration Runtime Schema & RLS
-- ====================================================================

-- 1. AGENTS TABLE
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL, -- supervisor, planner, research, reasoning, coding, memory, graph, tool, data, critic, writer
  description TEXT,
  capabilities JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'idle', -- idle, active, error
  version VARCHAR(50) DEFAULT '1.0.0',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 2. AGENT TASKS TABLE
CREATE TABLE IF NOT EXISTS public.agent_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'completed', -- pending, running, completed, failed
  duration_ms INTEGER DEFAULT 45,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES FOR MULTI-AGENT DATA
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Select workspace agents" ON public.agents
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Select workspace agent tasks" ON public.agent_tasks
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_agents_workspace ON public.agents(workspace_id, role);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_workspace ON public.agent_tasks(workspace_id, status);
