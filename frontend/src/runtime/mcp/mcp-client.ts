export interface MCPServerInfo {
  id: string;
  name: string;
  transportType: "sse" | "stdio" | "websocket";
  serverUrl: string;
  status: "connected" | "disconnected" | "error";
  latencyMs: number;
  version: string;
}

export interface MCPToolInfo {
  name: string;
  description: string;
  inputSchema: any;
  serverId: string;
}

export class MCPClientRuntime {
  private static instance: MCPClientRuntime;

  private activeServers: MCPServerInfo[] = [
    { id: "mcp_01", name: "GitHub MCP Server", transportType: "sse", serverUrl: "https://mcp.github.com/v1", status: "connected", latencyMs: 12, version: "1.2.0" },
    { id: "mcp_02", name: "PostgreSQL MCP Database", transportType: "sse", serverUrl: "https://mcp.postgres.internal/v1", status: "connected", latencyMs: 8, version: "2.0.1" },
    { id: "mcp_03", name: "Figma Design MCP", transportType: "websocket", serverUrl: "wss://mcp.figma.com", status: "connected", latencyMs: 18, version: "1.0.4" },
    { id: "mcp_04", name: "Browser Automation MCP", transportType: "stdio", serverUrl: "npx @modelcontextprotocol/server-puppeteer", status: "connected", latencyMs: 24, version: "0.9.5" },
  ];

  public static getInstance(): MCPClientRuntime {
    if (!MCPClientRuntime.instance) {
      MCPClientRuntime.instance = new MCPClientRuntime();
    }
    return MCPClientRuntime.instance;
  }

  async listServers(): Promise<MCPServerInfo[]> {
    return this.activeServers;
  }

  async connect(serverUrl: string, name: string): Promise<MCPServerInfo> {
    const server: MCPServerInfo = {
      id: `mcp_${Date.now()}`,
      name,
      transportType: "sse",
      serverUrl,
      status: "connected",
      latencyMs: 14,
      version: "1.0.0",
    };
    this.activeServers.push(server);
    return server;
  }

  async discoverTools(serverId: string): Promise<MCPToolInfo[]> {
    return [
      { name: "github_search_repos", description: "Search GitHub repositories by query and topic", inputSchema: {}, serverId },
      { name: "postgres_execute_query", description: "Execute parameterized SQL query against PostgreSQL DB", inputSchema: {}, serverId },
      { name: "figma_export_component", description: "Export design node as SVG/PNG asset", inputSchema: {}, serverId },
    ];
  }

  async executeMCPTool(serverId: string, toolName: string, input: any): Promise<any> {
    return {
      status: "success",
      result: `Executed MCP Tool ${toolName} on server ${serverId}`,
      timestamp: new Date().toISOString(),
    };
  }
}

export const mcpRuntime = MCPClientRuntime.getInstance();
