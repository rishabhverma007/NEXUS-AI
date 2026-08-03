"use client";

import { useQuery } from "@tanstack/react-query";
import { indexRepository } from "@/repositories/index-repository";
import { useNexusStore } from "@/stores/nexus-store";

export function useIndexHealth() {
  const { currentWorkspace } = useNexusStore();

  const healthQuery = useQuery({
    queryKey: ["index_health", currentWorkspace.id],
    queryFn: () => indexRepository.getHealthMetrics(currentWorkspace.id),
  });

  return {
    health: healthQuery.data || {
      totalDocuments: 0,
      totalChunks: 0,
      indexedChunks: 0,
      missingEmbeddings: 0,
      orphanedChunks: 0,
      healthScore: 100,
    },
    isLoadingHealth: healthQuery.isLoading,
  };
}
