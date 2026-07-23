"use client";

import { useQuery } from "@tanstack/react-query";
import { indexRepository } from "@/repositories/index-repository";
import { useNexusStore } from "@/stores/nexus-store";

export function useIndex() {
  const { currentWorkspace } = useNexusStore();

  const indexQuery = useQuery({
    queryKey: ["vector_indexes", currentWorkspace.id],
    queryFn: () => indexRepository.getIndexes(currentWorkspace.id),
  });

  return {
    indexes: indexQuery.data || [],
    isLoadingIndex: indexQuery.isLoading,
  };
}
