export interface OrganizationItem {
  id: string;
  name: string;
  domain: string;
  tier: "standard" | "pro" | "enterprise" | "enterprise_ultimate";
  maxWorkspaces: number;
  maxSeats: number;
  createdAt: string;
}

export interface DepartmentItem {
  id: string;
  orgId: string;
  name: string;
  leadUserId?: string;
  budgetUsd: number;
  createdAt: string;
}

export interface TeamItem {
  id: string;
  departmentId: string;
  orgId: string;
  name: string;
  createdAt: string;
}

export interface ProjectItem {
  id: string;
  teamId: string;
  workspaceId: string;
  name: string;
  status: "active" | "archived";
  createdAt: string;
}

export interface GovernancePolicy {
  id: string;
  orgId: string;
  workspaceId?: string;
  policyType: "workspace" | "tool" | "agent" | "prompt" | "research" | "retention" | "security";
  name: string;
  description: string;
  isEnforced: boolean;
  rules: Record<string, any>;
  approvalRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalRequest {
  id: string;
  orgId: string;
  workspaceId: string;
  requestType: "tool_execution" | "prompt_deployment" | "research_run" | "agent_deployment" | "model_access" | "policy_change";
  title: string;
  requesterId: string;
  assignedApproverId?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  reason?: string;
  payload: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityEventLog {
  id: string;
  orgId: string;
  workspaceId?: string;
  userId?: string;
  eventType: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
  ipAddress?: string;
  country?: string;
  details: string;
  createdAt: string;
}

export interface ComplianceReportItem {
  id: string;
  orgId: string;
  framework: "soc2_type2" | "iso_27001" | "gdpr" | "hipaa";
  readinessPercent: number;
  passedControls: number;
  totalControls: number;
  status: "compliant" | "in_review" | "non_compliant";
  generatedAt: string;
}

export interface LicenseItem {
  id: string;
  orgId: string;
  planName: string;
  seatsAllocated: number;
  seatsUsed: number;
  features: string[];
  expiresAt: string;
  createdAt: string;
}

export interface QuotaItem {
  id: string;
  orgId: string;
  workspaceId: string;
  monthlyTokenQuota: number;
  tokensConsumed: number;
  monthlyResearchQuota: number;
  researchesExecuted: number;
  updatedAt: string;
}

export class GovernanceRepository {
  private static instance: GovernanceRepository;

  private orgs: OrganizationItem[] = [
    {
      id: "org_default",
      name: "Acme Enterprise Global",
      domain: "acme.com",
      tier: "enterprise_ultimate",
      maxWorkspaces: 50,
      maxSeats: 500,
      createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
    },
  ];

  private departments: DepartmentItem[] = [
    { id: "dept_01", orgId: "org_default", name: "AI Research & Development", leadUserId: "usr_lead_01", budgetUsd: 50000, createdAt: new Date().toISOString() },
    { id: "dept_02", orgId: "org_default", name: "Enterprise Governance & Security", leadUserId: "usr_ciso", budgetUsd: 35000, createdAt: new Date().toISOString() },
  ];

  private teams: TeamItem[] = [
    { id: "team_01", departmentId: "dept_01", orgId: "org_default", name: "Multi-Agent Systems Team", createdAt: new Date().toISOString() },
    { id: "team_02", departmentId: "dept_02", orgId: "org_default", name: "Compliance & Risk Ops", createdAt: new Date().toISOString() },
  ];

  private projects: ProjectItem[] = [
    { id: "proj_01", teamId: "team_01", workspaceId: "ws_default", name: "NEXUS AI OS Core Deployment", status: "active", createdAt: new Date().toISOString() },
  ];

  private policies: GovernancePolicy[] = [
    {
      id: "pol_01",
      orgId: "org_default",
      policyType: "tool",
      name: "Sandboxed Tool Execution Approval Policy",
      description: "Requires SecOps approval before dispatching unrestricted shell tools or web scraping bots.",
      isEnforced: true,
      rules: { maxTimeoutMs: 15000, allowFileWrite: false },
      approvalRequired: true,
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "pol_02",
      orgId: "org_default",
      policyType: "security",
      name: "Zero Trust IP & Geo Restriction Policy",
      description: "Enforces MFA and restricts admin logins to authorized corporate IP ranges.",
      isEnforced: true,
      rules: { mfaRequired: true, allowedIpRanges: ["192.168.1.0/24", "10.0.0.0/8"] },
      approvalRequired: false,
      createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private approvals: ApprovalRequest[] = [
    {
      id: "appr_01",
      orgId: "org_default",
      workspaceId: "ws_default",
      requestType: "tool_execution",
      title: "Execute Sandboxed Python Script for Data Synthesis",
      requesterId: "usr_dev_04",
      assignedApproverId: "usr_ciso",
      status: "pending",
      reason: "Needs elevated network access to query external API endpoint.",
      payload: { toolId: "python_interpreter", timeoutMs: 10000 },
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "appr_02",
      orgId: "org_default",
      workspaceId: "ws_default",
      requestType: "prompt_deployment",
      title: "Deploy Agentic RAG System Prompt v4 to Production",
      requesterId: "usr_prompt_eng",
      assignedApproverId: "usr_lead_01",
      status: "approved",
      reason: "Passed all eval quality benchmarks (94.5% score).",
      payload: { promptVersionId: "pv_01" },
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private securityEvents: SecurityEventLog[] = [
    {
      id: "sec_01",
      orgId: "org_default",
      workspaceId: "ws_default",
      userId: "usr_unknown",
      eventType: "IP_GEOGRAPHIC_ANOMALY",
      severity: "high",
      ipAddress: "185.220.101.4",
      country: "Unknown / TOR Exit",
      details: "Blocked unauthorized login attempt outside authorized IP allowlist.",
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: "sec_02",
      orgId: "org_default",
      workspaceId: "ws_default",
      userId: "usr_dev_04",
      eventType: "KEY_ROTATION_SUCCESS",
      severity: "info",
      ipAddress: "192.168.1.42",
      country: "United States",
      details: "Automated 90-day Master Encryption Key rotation succeeded.",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  private complianceReports: ComplianceReportItem[] = [
    { id: "comp_01", orgId: "org_default", framework: "soc2_type2", readinessPercent: 98.5, passedControls: 42, totalControls: 44, status: "compliant", generatedAt: new Date().toISOString() },
    { id: "comp_02", orgId: "org_default", framework: "iso_27001", readinessPercent: 96.0, passedControls: 114, totalControls: 114, status: "compliant", generatedAt: new Date().toISOString() },
    { id: "comp_03", orgId: "org_default", framework: "gdpr", readinessPercent: 100.0, passedControls: 28, totalControls: 28, status: "compliant", generatedAt: new Date().toISOString() },
    { id: "comp_04", orgId: "org_default", framework: "hipaa", readinessPercent: 95.2, passedControls: 20, totalControls: 21, status: "compliant", generatedAt: new Date().toISOString() },
  ];

  private license: LicenseItem = {
    id: "lic_01",
    orgId: "org_default",
    planName: "Enterprise Ultimate Edition",
    seatsAllocated: 250,
    seatsUsed: 84,
    features: ["hybrid_retrieval", "graphrag", "long_term_memory", "mcp_tool_runtime", "multi_agent", "deep_research", "eval_observability", "governance_security"],
    expiresAt: new Date(Date.now() + 86400000 * 320).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
  };

  private quota: QuotaItem = {
    id: "quot_01",
    orgId: "org_default",
    workspaceId: "ws_default",
    monthlyTokenQuota: 10000000,
    tokensConsumed: 1456000,
    monthlyResearchQuota: 500,
    researchesExecuted: 42,
    updatedAt: new Date().toISOString(),
  };

  public static getInstance(): GovernanceRepository {
    if (!GovernanceRepository.instance) {
      GovernanceRepository.instance = new GovernanceRepository();
    }
    return GovernanceRepository.instance;
  }

  async getOrganization(orgId: string): Promise<OrganizationItem | undefined> {
    return this.orgs.find((o) => o.id === orgId || orgId === "org_default");
  }

  async getDepartments(orgId: string): Promise<DepartmentItem[]> {
    return this.departments.filter((d) => d.orgId === orgId || orgId === "org_default");
  }

  async getTeams(orgId: string): Promise<TeamItem[]> {
    return this.teams.filter((t) => t.orgId === orgId || orgId === "org_default");
  }

  async getProjects(orgId: string): Promise<ProjectItem[]> {
    return this.projects;
  }

  async getPolicies(orgId: string): Promise<GovernancePolicy[]> {
    return this.policies.filter((p) => p.orgId === orgId || orgId === "org_default");
  }

  async createPolicy(policy: Omit<GovernancePolicy, "id" | "createdAt" | "updatedAt">): Promise<GovernancePolicy> {
    const pol: GovernancePolicy = {
      ...policy,
      id: `pol_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.policies.unshift(pol);
    return pol;
  }

  async getApprovals(orgId: string): Promise<ApprovalRequest[]> {
    return this.approvals.filter((a) => a.orgId === orgId || orgId === "org_default");
  }

  async updateApprovalStatus(id: string, status: ApprovalRequest["status"], reason?: string): Promise<void> {
    const req = this.approvals.find((a) => a.id === id);
    if (req) {
      req.status = status;
      if (reason) req.reason = reason;
      req.updatedAt = new Date().toISOString();
    }
  }

  async getSecurityEvents(orgId: string): Promise<SecurityEventLog[]> {
    return this.securityEvents.filter((s) => s.orgId === orgId || orgId === "org_default");
  }

  async getComplianceReports(orgId: string): Promise<ComplianceReportItem[]> {
    return this.complianceReports.filter((c) => c.orgId === orgId || orgId === "org_default");
  }

  async getLicense(orgId: string): Promise<LicenseItem> {
    return this.license;
  }

  async getQuota(workspaceId: string): Promise<QuotaItem> {
    return this.quota;
  }
}

export const governanceRepository = GovernanceRepository.getInstance();
