-- ====================================================================
-- NEXUS AI — Enterprise Knowledge Graph Platform Database Schema & RLS
-- ====================================================================

-- 1. GRAPH NODES TABLE
CREATE TABLE IF NOT EXISTS public.graph_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  entity_type VARCHAR(50) NOT NULL DEFAULT 'Document', -- Person, Organization, Workspace, Document, Fact, Agent
  description TEXT,
  properties JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 2. GRAPH EDGES TABLE
CREATE TABLE IF NOT EXISTS public.graph_edges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  source_node_id UUID NOT NULL REFERENCES public.graph_nodes(id) ON DELETE CASCADE,
  target_node_id UUID NOT NULL REFERENCES public.graph_nodes(id) ON DELETE CASCADE,
  relation_type VARCHAR(50) NOT NULL DEFAULT 'references', -- belongs_to, references, contains, depends_on
  weight FLOAT DEFAULT 1.0,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES FOR GRAPH DATA
ALTER TABLE public.graph_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graph_edges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Select workspace graph nodes" ON public.graph_nodes
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Select workspace graph edges" ON public.graph_edges
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_graph_nodes_workspace ON public.graph_nodes(workspace_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_graph_edges_nodes ON public.graph_edges(source_node_id, target_node_id);
