"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { documentRepository, DocumentItem } from "@/repositories/document-repository";
import { useNexusStore } from "@/stores/nexus-store";

export function useDocuments(collectionId?: string) {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useNexusStore();

  const documentsQuery = useQuery({
    queryKey: ["documents", currentWorkspace.id, collectionId],
    queryFn: () => documentRepository.getDocuments(currentWorkspace.id, collectionId),
  });

  const createDocumentMutation = useMutation({
    mutationFn: ({ title, sourceType, fileSizeBytes }: { title: string; sourceType: string; fileSizeBytes: number }) =>
      documentRepository.createDocument(currentWorkspace.id, title, sourceType, fileSizeBytes, collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", currentWorkspace.id] });
    },
  });

  return {
    documents: documentsQuery.data || [],
    isLoadingDocuments: documentsQuery.isLoading,
    createDocument: createDocumentMutation.mutateAsync,
    isCreatingDocument: createDocumentMutation.isPending,
  };
}
