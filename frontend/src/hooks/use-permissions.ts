"use client";

import { hasPermission, PermissionAction, WorkspaceRole } from "@/config/rbac";
import { useWorkspace } from "./use-workspace";

export function usePermissions() {
  const { members } = useWorkspace();
  
  // Current user mock role is 'owner'
  const userRole: WorkspaceRole = "owner";

  const can = (action: PermissionAction): boolean => {
    return hasPermission(userRole, action);
  };

  return {
    userRole,
    can,
  };
}
