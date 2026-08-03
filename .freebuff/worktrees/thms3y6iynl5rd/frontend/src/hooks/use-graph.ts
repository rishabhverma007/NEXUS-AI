"use client";

import { useQuery } from "@tanstack/react-query";
import { graphRepository } from "@/repositories/graph-repository";
import { useNexusStore } from "@/stores/nexus-store";

export function useGraph() {
  const { currentWorkspace } = useNexusStore();

  const graphQuery = useQuery({
    queryKey: ["knowledge_graph", currentWorkspace.id],
    queryFn: () => graphRepository.getGraph(currentWorkspace.id),
  });

  return {
    nodes: graphQuery.data?.nodes || [],
    edges: graphQuery.data?.edges || [],
    isLoadingGraph: graphQuery.isLoading,
  };
}
