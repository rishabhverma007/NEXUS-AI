"use client";

import { useQuery } from "@tanstack/react-query";
import { embeddingRepository } from "@/repositories/embedding-repository";
import { useNexusStore } from "@/stores/nexus-store";

export function useEmbeddingJobs() {
  const { currentWorkspace } = useNexusStore();

  const jobsQuery = useQuery({
    queryKey: ["embedding_jobs", currentWorkspace.id],
    queryFn: () => embeddingRepository.getJobs(currentWorkspace.id),
  });

  return {
    jobs: jobsQuery.data || [],
    isLoadingJobs: jobsQuery.isLoading,
  };
}
