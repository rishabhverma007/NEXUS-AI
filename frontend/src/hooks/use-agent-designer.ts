"use client";

import { useState, useCallback } from "react";
import { AgentDesignerEngine, CustomAgentDescriptor } from "@/features/studio/pipeline/agent-designer-engine";

export function useAgentDesigner() {
  const [createdAgents, setCreatedAgents] = useState<CustomAgentDescriptor[]>([
    {
      role: "custom_research_agent",
      description: "Custom low-code agent specialized in web synthesis & GraphRAG traversal.",
      capabilities: ["hybrid_retrieval", "subgraph_expansion", "memory_recall"],
      allowedTools: ["web_search", "python_interpreter"],
      memoryType: "semantic",
    },
  ]);

  const createAgent = useCallback(
    (role: string, description: string, capabilities: string[], allowedTools: string[], memoryType = "semantic") => {
      const agent = AgentDesignerEngine.createAgentDescriptor(role, description, capabilities, allowedTools, memoryType);
      setCreatedAgents((prev) => [agent, ...prev]);
      return agent;
    },
    []
  );

  return {
    createdAgents,
    createAgent,
  };
}
