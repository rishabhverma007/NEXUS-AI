export type WorkspaceRole = "owner" | "admin" | "editor" | "viewer" | "guest";

export type PermissionAction =
  | "create_documents"
  | "delete_documents"
  | "upload_files"
  | "run_agents"
  | "manage_memory"
  | "manage_settings"
  | "invite_members"
  | "manage_api_keys"
  | "export_data"
  | "view_analytics";

export const PERMISSION_MATRIX: Record<WorkspaceRole, Record<PermissionAction, boolean>> = {
  owner: {
    create_documents: true,
    delete_documents: true,
    upload_files: true,
    run_agents: true,
    manage_memory: true,
    manage_settings: true,
    invite_members: true,
    manage_api_keys: true,
    export_data: true,
    view_analytics: true,
  },
  admin: {
    create_documents: true,
    delete_documents: true,
    upload_files: true,
    run_agents: true,
    manage_memory: true,
    manage_settings: true,
    invite_members: true,
    manage_api_keys: true,
    export_data: true,
    view_analytics: true,
  },
  editor: {
    create_documents: true,
    delete_documents: false,
    upload_files: true,
    run_agents: true,
    manage_memory: true,
    manage_settings: false,
    invite_members: false,
    manage_api_keys: false,
    export_data: true,
    view_analytics: true,
  },
  viewer: {
    create_documents: false,
    delete_documents: false,
    upload_files: false,
    run_agents: false,
    manage_memory: false,
    manage_settings: false,
    invite_members: false,
    manage_api_keys: false,
    export_data: false,
    view_analytics: true,
  },
  guest: {
    create_documents: false,
    delete_documents: false,
    upload_files: false,
    run_agents: false,
    manage_memory: false,
    manage_settings: false,
    invite_members: false,
    manage_api_keys: false,
    export_data: false,
    view_analytics: false,
  },
};

export function hasPermission(role: WorkspaceRole, action: PermissionAction): boolean {
  return PERMISSION_MATRIX[role]?.[action] ?? false;
}
