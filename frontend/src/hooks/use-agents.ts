"use client";

import { useQuery } from "@tanstack/react-query";
import { agentRepository } from "@/repositories/agent-repository";

export function useAgents() {
  const agentsQuery = useQuery({
    queryKey: ["specialized_agents"],
    queryFn: () => agentRepository.getAgents(),
  });

  const tasksQuery = useQuery({
    queryKey: ["agent_tasks"],
    queryFn: () => agentRepository.getTasks(),
  });

  return {
    agents: agentsQuery.data || [],
    tasks: tasksQuery.data || [],
    isLoadingAgents: agentsQuery.isLoading,
  };
}
