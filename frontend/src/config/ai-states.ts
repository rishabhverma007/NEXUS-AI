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
    color: "text-slate-400",
    bgColor: "bg-slate-800/40",
    borderColor: "border-slate-700/60",
    iconName: "Bot",
  },
  planning: {
    label: "Planning Flow",
    description: "Decomposing task and routing agent DAG nodes",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    iconName: "GitFork",
  },
  searching: {
    label: "Sparse BM25 Search",
    description: "Executing sparse keyword term matching",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    iconName: "Search",
  },
  retrieving: {
    label: "Dense pgvector RAG",
    description: "Retrieving HNSW cosine vector embeddings",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
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
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
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
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    iconName: "CheckCircle2",
  },
  finished: {
    label: "Execution Complete",
    description: "Workflow finished with zero hallucination score",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    iconName: "Check",
  },
  error: {
    label: "Agent Error",
    description: "Execution halted due to agent pipeline error",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    iconName: "AlertTriangle",
  },
  cancelled: {
    label: "Cancelled",
    description: "Workflow execution cancelled by user",
    color: "text-slate-400",
    bgColor: "bg-slate-800/40",
    borderColor: "border-slate-700/60",
    iconName: "XCircle",
  },
};
