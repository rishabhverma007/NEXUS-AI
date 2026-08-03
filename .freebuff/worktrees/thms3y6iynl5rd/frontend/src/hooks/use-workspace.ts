"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceRepository } from "@/repositories/workspace-repository";
import { useNexusStore } from "@/stores/nexus-store";
import { WorkspaceRole } from "@/config/rbac";

export function useWorkspace() {
  const queryClient = useQueryClient();
  const { currentWorkspace, setCurrentWorkspace } = useNexusStore();

  const workspacesQuery = useQuery({
    queryKey: ["workspaces"],
    queryFn: () => workspaceRepository.getWorkspaces("org_nexus_01"),
  });

  const membersQuery = useQuery({
    queryKey: ["workspace_members", currentWorkspace.id],
    queryFn: () => workspaceRepository.getMembers(currentWorkspace.id),
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: ({ name, description }: { name: string; description: string }) =>
      workspaceRepository.createWorkspace(name, description),
    onSuccess: (newWs) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      setCurrentWorkspace({
        id: newWs.id,
        name: newWs.name,
        slug: newWs.slug,
        description: newWs.description
      });
    },
  });

  const inviteMemberMutation = useMutation({
    mutationFn: ({ email, role }: { email: string; role: WorkspaceRole }) =>
      workspaceRepository.inviteMember(currentWorkspace.id, email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace_members", currentWorkspace.id] });
    },
  });

  return {
    currentWorkspace,
    workspaces: workspacesQuery.data || [],
    isLoadingWorkspaces: workspacesQuery.isLoading,
    members: membersQuery.data || [],
    isLoadingMembers: membersQuery.isLoading,
    createWorkspace: createWorkspaceMutation.mutateAsync,
    isCreatingWorkspace: createWorkspaceMutation.isPending,
    inviteMember: inviteMemberMutation.mutateAsync,
    isInvitingMember: inviteMemberMutation.isPending,
    switchWorkspace: setCurrentWorkspace,
  };
}
