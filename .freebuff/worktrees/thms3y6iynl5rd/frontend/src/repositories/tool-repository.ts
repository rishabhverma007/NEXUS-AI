export interface ToolItem {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  category: "rest_api" | "graphql" | "sql" | "vector_search" | "knowledge" | "python" | "shell" | "mcp";
  description: string;
  version: string;
  isInstalled: boolean;
  isMCPTool: boolean;
  healthStatus: "healthy" | "degraded" | "offline";
}

export class ToolRepository {
  private static instance: ToolRepository;

  private mockTools: ToolItem[] = [
    { id: "tool_01", workspaceId: "ws_default_01", name: "Hybrid Search Engine", slug: "hybrid-retrieval", category: "knowledge", description: "BM25 + pgvector Reciprocal Rank Fusion", version: "2.1.0", isInstalled: true, isMCPTool: false, healthStatus: "healthy" },
    { id: "tool_02", workspaceId: "ws_default_01", name: "GitHub MCP Server", slug: "github-mcp", category: "mcp", description: "Repository, PRs, and Issue Tracker Tooling", version: "1.2.0", isInstalled: true, isMCPTool: true, healthStatus: "healthy" },
    { id: "tool_03", workspaceId: "ws_default_01", name: "Python Execution Sandbox", slug: "python-sandbox", category: "python", description: "Sandboxed Python 3.11 Runtime Execution", version: "3.11.4", isInstalled: true, isMCPTool: false, healthStatus: "healthy" },
    { id: "tool_04", workspaceId: "ws_default_01", name: "PostgreSQL Database Connector", slug: "postgres-mcp", category: "sql", description: "Multi-tenant SQL query executor with RLS", version: "2.0.1", isInstalled: true, isMCPTool: true, healthStatus: "healthy" },
  ];

  public static getInstance(): ToolRepository {
    if (!ToolRepository.instance) {
      ToolRepository.instance = new ToolRepository();
    }
    return ToolRepository.instance;
  }

  async getTools(workspaceId: string, category?: string): Promise<ToolItem[]> {
    let tools = this.mockTools.filter((t) => t.workspaceId === workspaceId);
    if (category) {
      tools = tools.filter((t) => t.category === category);
    }
    return tools;
  }

  async registerTool(workspaceId: string, name: string, category: any, description: string): Promise<ToolItem> {
    const tool: ToolItem = {
      id: `tool_${Date.now()}`,
      workspaceId,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      category,
      description,
      version: "1.0.0",
      isInstalled: true,
      isMCPTool: category === "mcp",
      healthStatus: "healthy",
    };
    this.mockTools.push(tool);
    return tool;
  }
}

export const toolRepository = ToolRepository.getInstance();
