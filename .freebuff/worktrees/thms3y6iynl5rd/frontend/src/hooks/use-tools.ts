"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toolRepository } from "@/repositories/tool-repository";
import { useNexusStore } from "@/stores/nexus-store";

export function useTools(category?: string) {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useNexusStore();

  const toolsQuery = useQuery({
    queryKey: ["workspace_tools", currentWorkspace.id, category],
    queryFn: () => toolRepository.getTools(currentWorkspace.id, category),
  });

  const registerToolMutation = useMutation({
    mutationFn: ({ name, category, description }: { name: string; category: string; description: string }) =>
      toolRepository.registerTool(currentWorkspace.id, name, category, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace_tools", currentWorkspace.id] });
    },
  });

  return {
    tools: toolsQuery.data || [],
    isLoadingTools: toolsQuery.isLoading,
    registerTool: registerToolMutation.mutateAsync,
  };
}
