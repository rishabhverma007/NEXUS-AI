export interface StudioProjectItem {
  id: string;
  workspaceId: string;
  userId: string;
  name: string;
  description: string;
  category: "workflow" | "agent" | "prompt" | "tool" | "research";
  status: "draft" | "active" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowDefinition {
  id: string;
  projectId: string;
  workspaceId: string;
  name: string;
  description: string;
  currentVersion: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowNode {
  id: string;
  workflowId: string;
  nodeId: string;
  nodeType: "prompt" | "llm" | "retriever" | "graphrag" | "memory" | "tool_call" | "agent" | "condition" | "loop" | "approval" | "human_review" | "output" | "branch" | "merge";
  label: string;
  positionX: number;
  positionY: number;
  config: Record<string, any>;
  createdAt: string;
}

export interface WorkflowEdge {
  id: string;
  workflowId: string;
  edgeId: string;
  sourceNodeId: string;
  targetNodeId: string;
  conditionLabel?: string;
  createdAt: string;
}

export interface PromptTemplateItem {
  id: string;
  projectId?: string;
  workspaceId: string;
  name: string;
  systemPrompt: string;
  userTemplate: string;
  variables: string[];
  modelId: string;
  createdAt: string;
}

export interface DeploymentRecordItem {
  id: string;
  workflowId: string;
  workspaceId: string;
  versionTag: string;
  targetEnvironment: "dev" | "staging" | "production";
  status: "active" | "rolled_back" | "failed";
  deployedBy: string;
  deployedAt: string;
}

export class StudioRepository {
  private static instance: StudioRepository;

  private projects: StudioProjectItem[] = [
    {
      id: "proj_01",
      workspaceId: "ws_default",
      userId: "usr_01",
      name: "Enterprise Multi-Agent RAG Pipeline",
      description: "Visual low-code workflow combining Hybrid Retrieval, GraphRAG 2-hop, and Critic Agent verification.",
      category: "workflow",
      status: "active",
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "proj_02",
      workspaceId: "ws_default",
      userId: "usr_01",
      name: "Deep Research Orchestration Strategy",
      description: "Low-code research designer for automated hypothesis testing.",
      category: "research",
      status: "active",
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private workflows: WorkflowDefinition[] = [
    {
      id: "wf_01",
      projectId: "proj_01",
      workspaceId: "ws_default",
      name: "Multi-Agent Hybrid RAG Workflow",
      description: "End-to-end RAG + GraphRAG visual DAG execution plan.",
      currentVersion: "v1.2.0",
      isPublished: true,
      createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private nodes: WorkflowNode[] = [
    { id: "node_1", workflowId: "wf_01", nodeId: "n_user_query", nodeType: "prompt", label: "User Input & Guardrail Scan", positionX: 50, positionY: 150, config: { validatePII: true }, createdAt: new Date().toISOString() },
    { id: "node_2", workflowId: "wf_01", nodeId: "n_retriever", nodeType: "retriever", label: "Hybrid RRF Retrieval (Module 5)", positionX: 300, positionY: 100, config: { mode: "research", topK: 10 }, createdAt: new Date().toISOString() },
    { id: "node_3", workflowId: "wf_01", nodeId: "n_graphrag", nodeType: "graphrag", label: "GraphRAG Subgraph (Module 9)", positionX: 300, positionY: 220, config: { maxHops: 2 }, createdAt: new Date().toISOString() },
    { id: "node_4", workflowId: "wf_01", nodeId: "n_agent", nodeType: "agent", label: "Reasoning & Critic Agent (Module 11)", positionX: 550, positionY: 150, config: { role: "critic" }, createdAt: new Date().toISOString() },
    { id: "node_5", workflowId: "wf_01", nodeId: "n_output", nodeType: "output", label: "Streaming Output Builder", positionX: 800, positionY: 150, config: { format: "markdown" }, createdAt: new Date().toISOString() },
  ];

  private edges: WorkflowEdge[] = [
    { id: "edge_1", workflowId: "wf_01", edgeId: "e1", sourceNodeId: "n_user_query", targetNodeId: "n_retriever", createdAt: new Date().toISOString() },
    { id: "edge_2", workflowId: "wf_01", edgeId: "e2", sourceNodeId: "n_user_query", targetNodeId: "n_graphrag", createdAt: new Date().toISOString() },
    { id: "edge_3", workflowId: "wf_01", edgeId: "e3", sourceNodeId: "n_retriever", targetNodeId: "n_agent", createdAt: new Date().toISOString() },
    { id: "edge_4", workflowId: "wf_01", edgeId: "e4", sourceNodeId: "n_graphrag", targetNodeId: "n_agent", createdAt: new Date().toISOString() },
    { id: "edge_5", workflowId: "wf_01", edgeId: "e5", sourceNodeId: "n_agent", targetNodeId: "n_output", createdAt: new Date().toISOString() },
  ];

  private promptTemplates: PromptTemplateItem[] = [
    {
      id: "pt_01",
      projectId: "proj_01",
      workspaceId: "ws_default",
      name: "Enterprise Multi-Agent RAG System Prompt",
      systemPrompt: "You are Antigravity, an enterprise AI assistant for NEXUS AI OS. Ground every claim using retrieved evidence nodes.",
      userTemplate: "Context: {vectorContext}\nQuery: {userPrompt}\nAnswer:",
      variables: ["vectorContext", "userPrompt"],
      modelId: "gemini-3.6-flash",
      createdAt: new Date().toISOString(),
    },
  ];

  private deployments: DeploymentRecordItem[] = [
    {
      id: "dep_01",
      workflowId: "wf_01",
      workspaceId: "ws_default",
      versionTag: "v1.2.0",
      targetEnvironment: "production",
      status: "active",
      deployedBy: "usr_admin",
      deployedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ];

  public static getInstance(): StudioRepository {
    if (!StudioRepository.instance) {
      StudioRepository.instance = new StudioRepository();
    }
    return StudioRepository.instance;
  }

  async getProjects(workspaceId: string): Promise<StudioProjectItem[]> {
    return this.projects.filter((p) => p.workspaceId === workspaceId || workspaceId === "ws_default");
  }

  async createProject(project: Omit<StudioProjectItem, "id" | "createdAt" | "updatedAt">): Promise<StudioProjectItem> {
    const p: StudioProjectItem = {
      ...project,
      id: `proj_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.unshift(p);
    return p;
  }

  async getWorkflows(workspaceId: string): Promise<WorkflowDefinition[]> {
    return this.workflows.filter((w) => w.workspaceId === workspaceId || workspaceId === "ws_default");
  }

  async getWorkflowGraph(workflowId: string): Promise<{ nodes: WorkflowNode[]; edges: WorkflowEdge[] }> {
    const n = this.nodes.filter((node) => node.workflowId === workflowId);
    const e = this.edges.filter((edge) => edge.workflowId === workflowId);
    return { nodes: n, edges: e };
  }

  async addNode(node: Omit<WorkflowNode, "id" | "createdAt">): Promise<WorkflowNode> {
    const n: WorkflowNode = {
      ...node,
      id: `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    this.nodes.push(n);
    return n;
  }

  async getPromptTemplates(workspaceId: string): Promise<PromptTemplateItem[]> {
    return this.promptTemplates.filter((pt) => pt.workspaceId === workspaceId || workspaceId === "ws_default");
  }

  async getDeployments(workspaceId: string): Promise<DeploymentRecordItem[]> {
    return this.deployments.filter((d) => d.workspaceId === workspaceId || workspaceId === "ws_default");
  }

  async createDeployment(dep: Omit<DeploymentRecordItem, "id" | "deployedAt">): Promise<DeploymentRecordItem> {
    const d: DeploymentRecordItem = {
      ...dep,
      id: `dep_${Date.now()}`,
      deployedAt: new Date().toISOString(),
    };
    this.deployments.unshift(d);
    return d;
  }
}

export const studioRepository = StudioRepository.getInstance();
