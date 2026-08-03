"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionRepository } from "@/repositories/collection-repository";
import { useNexusStore } from "@/stores/nexus-store";

export function useCollections() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useNexusStore();

  const collectionsQuery = useQuery({
    queryKey: ["knowledge_collections", currentWorkspace.id],
    queryFn: () => collectionRepository.getCollections(currentWorkspace.id),
  });

  const createCollectionMutation = useMutation({
    mutationFn: ({ name, description, color }: { name: string; description: string; color?: string }) =>
      collectionRepository.createCollection(currentWorkspace.id, name, description, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge_collections", currentWorkspace.id] });
    },
  });

  return {
    collections: collectionsQuery.data || [],
    isLoadingCollections: collectionsQuery.isLoading,
    createCollection: createCollectionMutation.mutateAsync,
    isCreatingCollection: createCollectionMutation.isPending,
  };
}
