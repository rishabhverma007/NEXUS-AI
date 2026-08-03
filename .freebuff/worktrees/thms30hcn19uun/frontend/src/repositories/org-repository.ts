export interface OrganizationItem {
  id: string;
  name: string;
  slug: string;
  industry: string;
  logoUrl?: string;
  ownerId: string;
  createdAt: string;
}

export interface OrgInvitation {
  id: string;
  email: string;
  role: string;
  status: "pending" | "accepted" | "declined";
  sentAt: string;
}

export class OrgRepository {
  private static instance: OrgRepository;

  private mockOrg: OrganizationItem = {
    id: "org_nexus_01",
    name: "NEXUS AI Global Systems",
    slug: "nexus-ai-global",
    industry: "Enterprise AI Systems & Knowledge OS",
    ownerId: "usr_principal_01",
    createdAt: "2026-01-01T00:00:00Z"
  };

  private mockInvitations: OrgInvitation[] = [
    {
      id: "inv_01",
      email: "engineer@cloudscale.io",
      role: "admin",
      status: "pending",
      sentAt: new Date().toISOString()
    }
  ];

  public static getInstance(): OrgRepository {
    if (!OrgRepository.instance) {
      OrgRepository.instance = new OrgRepository();
    }
    return OrgRepository.instance;
  }

  async getOrganization(): Promise<OrganizationItem> {
    return this.mockOrg;
  }

  async updateOrganization(name: string, industry: string): Promise<OrganizationItem> {
    this.mockOrg.name = name;
    this.mockOrg.industry = industry;
    return this.mockOrg;
  }

  async getInvitations(): Promise<OrgInvitation[]> {
    return this.mockInvitations;
  }

  async sendInvitation(email: string, role = "member"): Promise<OrgInvitation> {
    const inv: OrgInvitation = {
      id: `inv_${Date.now()}`,
      email,
      role,
      status: "pending",
      sentAt: new Date().toISOString()
    };
    this.mockInvitations.push(inv);
    return inv;
  }
}

export const orgRepository = OrgRepository.getInstance();
