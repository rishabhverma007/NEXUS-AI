import { WorkspaceRole } from "@/config/rbac";

export interface WorkspaceItem {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  ownerId: string;
  createdAt: string;
}

export interface WorkspaceMemberItem {
  id: string;
  workspaceId: string;
  profileId: string;
  name: string;
  email: string;
  role: WorkspaceRole;
  joinedAt: string;
}

export class WorkspaceRepository {
  private static instance: WorkspaceRepository;

  private mockWorkspaces: WorkspaceItem[] = [
    {
      id: "ws_default_01",
      organizationId: "org_nexus_01",
      name: "Nexus Enterprise Core",
      slug: "nexus-enterprise-core",
      description: "Default Enterprise Knowledge Workspace for RAG & Multi-Agent Systems",
      icon: "Database",
      color: "blue",
      ownerId: "usr_principal_01",
      createdAt: new Date().toISOString()
    },
    {
      id: "ws_graph_02",
      organizationId: "org_nexus_01",
      name: "GraphRAG Deep Research Lab",
      slug: "graphrag-deep-research",
      description: "Sub-graph topological entity traversal lab",
      icon: "Network",
      color: "cyan",
      ownerId: "usr_principal_01",
      createdAt: new Date().toISOString()
    }
  ];

  private mockMembers: WorkspaceMemberItem[] = [
    {
      id: "wm_01",
      workspaceId: "ws_default_01",
      profileId: "usr_principal_01",
      name: "Principal Architect",
      email: "architect@nexus.ai",
      role: "owner",
      joinedAt: "2026-01-01T00:00:00Z"
    },
    {
      id: "wm_02",
      workspaceId: "ws_default_01",
      profileId: "usr_lead_02",
      name: "Lead Systems Engineer",
      email: "lead@nexus.ai",
      role: "admin",
      joinedAt: "2026-02-15T00:00:00Z"
    }
  ];

  public static getInstance(): WorkspaceRepository {
    if (!WorkspaceRepository.instance) {
      WorkspaceRepository.instance = new WorkspaceRepository();
    }
    return WorkspaceRepository.instance;
  }

  async getWorkspaces(orgId: string): Promise<WorkspaceItem[]> {
    return this.mockWorkspaces.filter((w) => w.organizationId === orgId);
  }

  async createWorkspace(name: string, description: string, icon = "Database", color = "blue"): Promise<WorkspaceItem> {
    const slug = name.toLowerCase().replace(/ /g, "-");
    const ws: WorkspaceItem = {
      id: `ws_${Date.now()}`,
      organizationId: "org_nexus_01",
      name,
      slug,
      description,
      icon,
      color,
      ownerId: "usr_principal_01",
      createdAt: new Date().toISOString()
    };
    this.mockWorkspaces.push(ws);
    return ws;
  }

  async getMembers(workspaceId: string): Promise<WorkspaceMemberItem[]> {
    return this.mockMembers.filter((m) => m.workspaceId === workspaceId);
  }

  async inviteMember(workspaceId: string, email: string, role: WorkspaceRole): Promise<WorkspaceMemberItem> {
    const name = email.split("@")[0];
    const member: WorkspaceMemberItem = {
      id: `wm_${Date.now()}`,
      workspaceId,
      profileId: `usr_${Date.now()}`,
      name,
      email,
      role,
      joinedAt: new Date().toISOString()
    };
    this.mockMembers.push(member);
    return member;
  }
}

export const workspaceRepository = WorkspaceRepository.getInstance();
