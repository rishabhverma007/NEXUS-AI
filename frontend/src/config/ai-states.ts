export type AIState =
  | "idle"
  | "planning"
  | "searching"
  | "retrieving"
  | "reasoning"
  | "calling_tools"
  | "generating"
  | "reflecting"
  | "validating"
  | "finished"
  | "error"
  | "cancelled";

export interface AIStateInfo {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  iconName: string;
}

export const AI_STATES: Record<AIState, AIStateInfo> = {
  idle: {
    label: "Idle",
    description: "Awaiting next architectural instruction",
    color: "text-nexus-400",
    bgColor: "bg-nexus-800/40",
    borderColor: "border-nexus-border/60",
    iconName: "Bot",
  },
  planning: {
    label: "Planning Flow",
    description: "Decomposing task and routing agent DAG nodes",
    color: "text-nexus-accent",
    bgColor: "bg-nexus-accent/10",
    borderColor: "border-nexus-accent/30",
    iconName: "GitFork",
  },
  searching: {
    label: "Sparse BM25 Search",
    description: "Executing sparse keyword term matching",
    color: "text-nexus-accent",
    bgColor: "bg-nexus-accent/10",
    borderColor: "border-nexus-accent/30",
    iconName: "Search",
  },
  retrieving: {
    label: "Dense pgvector RAG",
    description: "Retrieving HNSW cosine vector embeddings",
    color: "text-nexus-brand-light",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-nexus-brand-light/30",
    iconName: "Database",
  },
  reasoning: {
    label: "GraphRAG Reasoning",
    description: "Traversing 2-hop entity sub-graph relationships",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    iconName: "Network",
  },
  calling_tools: {
    label: "Calling Tool",
    description: "Executing sandboxed tool integration",
    color: "text-nexus-amber",
    bgColor: "bg-nexus-amber/10",
    borderColor: "border-nexus-amber/30",
    iconName: "Cpu",
  },
  generating: {
    label: "Token Generation",
    description: "Streaming real-time SSE token response",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
    iconName: "Sparkles",
  },
  reflecting: {
    label: "Self-Reflection",
    description: "Evaluating factual correctness & context grounding",
    color: "text-teal-400",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/30",
    iconName: "ShieldCheck",
  },
  validating: {
    label: "Verifying Output",
    description: "Enforcing quality threshold and formatting",
    color: "text-nexus-emerald",
    bgColor: "bg-nexus-emerald/10",
    borderColor: "border-nexus-emerald/30",
    iconName: "CheckCircle2",
  },
  finished: {
    label: "Execution Complete",
    description: "Workflow finished with zero hallucination score",
    color: "text-nexus-emerald",
    bgColor: "bg-nexus-emerald/10",
    borderColor: "border-nexus-emerald/30",
    iconName: "Check",
  },
  error: {
    label: "Agent Error",
    description: "Execution halted due to agent pipeline error",
    color: "text-nexus-rose",
    bgColor: "bg-nexus-rose/10",
    borderColor: "border-nexus-rose/30",
    iconName: "AlertTriangle",
  },
  cancelled: {
    label: "Cancelled",
    description: "Workflow execution cancelled by user",
    color: "text-nexus-400",
    bgColor: "bg-nexus-800/40",
    borderColor: "border-nexus-border/60",
    iconName: "XCircle",
  },
};
