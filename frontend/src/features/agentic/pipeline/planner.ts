export interface TaskNode {
  id: string;
  name: string;
  type: "Planning" | "Retrieval" | "Reasoning" | "Reflection" | "Synthesis";
  status: "pending" | "running" | "completed" | "failed";
  durationMs?: number;
}

export interface ExecutionPlan {
  planId: string;
  userQuery: string;
  reasoningMode: "fast" | "balanced" | "deep" | "research";
  nodes: TaskNode[];
  estimatedComplexity: number;
}

export class TaskPlanner {
  static createPlan(
    query: string,
    mode: "fast" | "balanced" | "deep" | "research" = "balanced"
  ): ExecutionPlan {
    const planId = `plan_${Date.now()}`;
    const nodes: TaskNode[] = [
      { id: "node_01", name: "Intent Analysis & Task Planning", type: "Planning", status: "completed", durationMs: 45 },
      { id: "node_02", name: "Hybrid RRF Retrieval Pass", type: "Retrieval", status: "completed", durationMs: 120 },
      { id: "node_03", name: "Evidence Aggregation & Conflict Check", type: "Reasoning", status: "completed", durationMs: 80 },
    ];

    if (mode === "deep" || mode === "research") {
      nodes.push({ id: "node_04", name: "Iterative Knowledge Expansion", type: "Retrieval", status: "completed", durationMs: 150 });
    }

    nodes.push(
      { id: "node_05", name: "Factual Reflection & Hallucination Verification", type: "Reflection", status: "completed", durationMs: 95 },
      { id: "node_06", name: "Structured Answer Generation", type: "Synthesis", status: "completed", durationMs: 210 }
    );

    return {
      planId,
      userQuery: query,
      reasoningMode: mode,
      nodes,
      estimatedComplexity: mode === "research" ? 0.95 : 0.65,
    };
  }
}
