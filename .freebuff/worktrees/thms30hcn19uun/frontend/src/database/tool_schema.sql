-- ====================================================================
-- NEXUS AI — Enterprise Tool Ecosystem & MCP Runtime Schema & RLS
-- ====================================================================

-- 1. TOOLS TABLE
CREATE TABLE IF NOT EXISTS public.tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL DEFAULT 'rest_api', -- rest_api, graphql, sql, vector_search, knowledge, python, shell, mcp
  description TEXT,
  version VARCHAR(50) DEFAULT '1.0.0',
  is_installed BOOLEAN DEFAULT true,
  is_mcp_tool BOOLEAN DEFAULT false,
  mcp_server_id UUID,
  health_status VARCHAR(50) DEFAULT 'healthy', -- healthy, degraded, offline
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 2. MCP SERVERS TABLE
CREATE TABLE IF NOT EXISTS public.mcp_servers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  transport_type VARCHAR(50) DEFAULT 'sse', -- sse, stdio, websocket
  server_url VARCHAR(512) NOT NULL,
  status VARCHAR(50) DEFAULT 'connected', -- connected, disconnected, error
  version VARCHAR(50) DEFAULT '1.0.0',
  latency_ms INTEGER DEFAULT 14,
  last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TOOL EXECUTIONS LOG TABLE
CREATE TABLE IF NOT EXISTS public.tool_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'completed', -- pending, running, completed, failed
  duration_ms INTEGER DEFAULT 25,
  input_params JSONB DEFAULT '{}'::jsonb,
  output_result JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcp_servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Select workspace tools" ON public.tools
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Select workspace mcp servers" ON public.mcp_servers
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_tools_workspace ON public.tools(workspace_id, category);
CREATE INDEX IF NOT EXISTS idx_mcp_servers_workspace ON public.mcp_servers(workspace_id, status);
