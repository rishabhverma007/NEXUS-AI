export type AgentMode = "agentic_rag" | "graph_rag" | "memory_search" | "deep_research";

export interface AgentStep {
  step_id: string;
  agent_name: "RouterAgent" | "VectorRAGAgent" | "GraphRAGAgent" | "MemoryAgent" | "ReflectionAgent" | "SynthesisAgent";
  status: "pending" | "running" | "completed" | "failed";
  thought: string;
  output?: any;
  timestamp?: string;
}

export interface Citation {
  chunk_id: string;
  document_id: string;
  content: string;
  token_count: number;
  rrf_score: number;
  metadata?: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  agentSteps?: AgentStep[];
  citations?: Citation[];
  reflectionScore?: number;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  title: string;
  model: string;
  agent_mode: AgentMode;
  updated_at: string;
}

export interface KnowledgeDocument {
  id: string;
  workspace_id: string;
  title: string;
  source_type: string;
  status: "pending" | "processing" | "indexed" | "error";
  chunk_count: number;
  file_size_bytes: number;
  created_at: string;
}

export interface KGNode {
  id: string;
  name: string;
  entity_type: string;
  description: string;
  properties?: Record<string, any>;
}

export interface KGEdge {
  id: string;
  source: string;
  target: string;
  relation_type: string;
  weight: number;
  description: string;
}

export interface KGVisualizationData {
  nodes: KGNode[];
  edges: KGEdge[];
  stats: {
    total_nodes: number;
    total_edges: number;
  };
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
}
