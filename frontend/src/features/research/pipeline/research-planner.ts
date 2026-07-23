export interface ResearchPlanStrategy {
  strategySummary: string;
  subQueries: { query: string; assignedRole: string; depth: number }[];
  initialHypotheses: string[];
  estimatedIterations: number;
}

export class ResearchPlanner {
  static createPlan(objective: string, depthLevel: "fast" | "standard" | "deep" | "exhaustive" = "standard"): ResearchPlanStrategy {
    const isExhaustive = depthLevel === "deep" || depthLevel === "exhaustive";
    const estimatedIterations = depthLevel === "fast" ? 2 : depthLevel === "standard" ? 3 : 5;

    return {
      strategySummary: `Multi-phase research strategy for: "${objective}". Deploying hybrid retrieval fusion, GraphRAG 2-hop topology expansion, long-term memory lookup, and specialized multi-agent verification.`,
      subQueries: [
        {
          query: `Hybrid vector retrieval & RRF context for objective: ${objective}`,
          assignedRole: "research",
          depth: 1,
        },
        {
          query: `Knowledge Graph entity relationship expansion for: ${objective}`,
          assignedRole: "graph",
          depth: 1,
        },
        {
          query: `Workspace semantic memory recall for historic facts on: ${objective}`,
          assignedRole: "memory",
          depth: 1,
        },
        ...(isExhaustive
          ? [
              {
                query: `Sandboxed tool verification & external API execution for: ${objective}`,
                assignedRole: "tool",
                depth: 2,
              },
              {
                query: `Contradiction detection & hallucination risk analysis for: ${objective}`,
                assignedRole: "critic",
                depth: 2,
              },
            ]
          : []),
      ],
      initialHypotheses: [
        `Primary Hypothesis H1: Objective "${objective.slice(0, 60)}..." can be substantiated using evidence from existing knowledge bases and GraphRAG nodes.`,
        `Secondary Hypothesis H2: Entity relationship topology reveals non-trivial cross-domain dependencies.`,
      ],
      estimatedIterations,
    };
  }
}
