"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memoryRepository } from "@/repositories/memory-repository";
import { useNexusStore } from "@/stores/nexus-store";

export function useMemory(memoryType?: string) {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useNexusStore();

  const memoryQuery = useQuery({
    queryKey: ["memory_objects", currentWorkspace.id, memoryType],
    queryFn: () => memoryRepository.getMemories(currentWorkspace.id, memoryType),
  });

  const saveMemoryMutation = useMutation({
    mutationFn: ({ key, value, type, category }: { key: string; value: string; type?: string; category?: string }) =>
      memoryRepository.saveMemory(currentWorkspace.id, key, value, type, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memory_objects", currentWorkspace.id] });
    },
  });

  return {
    memories: memoryQuery.data || [],
    isLoadingMemory: memoryQuery.isLoading,
    saveMemory: saveMemoryMutation.mutateAsync,
    isSavingMemory: saveMemoryMutation.isPending,
  };
}
