export interface AgentDescriptor {
  id: string;
  name: string;
  role: "supervisor" | "planner" | "research" | "reasoning" | "coding" | "memory" | "graph" | "tool" | "data" | "critic" | "writer";
  description: string;
  capabilities: string[];
  status: "idle" | "active" | "error";
  tasksCompleted: number;
}

export class AgentRegistry {
  private static instance: AgentRegistry;

  private defaultAgents: AgentDescriptor[] = [
    { id: "agent_01", name: "Supervisor Agent", role: "supervisor", description: "Top-level DAG orchestrator & user communication controller", capabilities: ["orchestration", "routing", "synthesis"], status: "active", tasksCompleted: 142 },
    { id: "agent_02", name: "Planner Agent", role: "planner", description: "Decomposes complex user goals into DAG execution nodes", capabilities: ["task_decomposition", "dag_building"], status: "idle", tasksCompleted: 98 },
    { id: "agent_03", name: "Research Agent", role: "research", description: "Executes hybrid retrieval and external knowledge synthesis", capabilities: ["hybrid_retrieval", "web_synthesis"], status: "idle", tasksCompleted: 115 },
    { id: "agent_04", name: "Reasoning Agent", role: "reasoning", description: "Performs formal multi-step logic & contradiction checks", capabilities: ["formal_logic", "reflection"], status: "idle", tasksCompleted: 87 },
    { id: "agent_05", name: "Coding Agent", role: "coding", description: "Generates production-grade TypeScript / Python code", capabilities: ["typescript_generation", "python_runtime"], status: "idle", tasksCompleted: 204 },
    { id: "agent_06", name: "Memory Agent", role: "memory", description: "Interfaces with Module 7 Long-Term Memory Platform", capabilities: ["fact_extraction", "reconciliation"], status: "idle", tasksCompleted: 76 },
    { id: "agent_07", name: "Graph Agent", role: "graph", description: "Queries 3D Knowledge Graph & 2-Hop GraphRAG subgraphs", capabilities: ["graph_traversal", "subgraph_expansion"], status: "idle", tasksCompleted: 64 },
    { id: "agent_08", name: "Tool Agent", role: "tool", description: "Dispatches sandboxed executions to Module 10 Tool Runtime", capabilities: ["sandbox_execution", "mcp_dispatch"], status: "idle", tasksCompleted: 153 },
    { id: "agent_09", name: "Data Agent", role: "data", description: "Aggregates structured CSV / JSON / SQL datasets", capabilities: ["sql_parsing", "data_cleaning"], status: "idle", tasksCompleted: 45 },
    { id: "agent_10", name: "Critic Agent", role: "critic", description: "Reviews factual consistency & hallucination risk scores", capabilities: ["fact_checking", "confidence_scoring"], status: "idle", tasksCompleted: 110 },
    { id: "agent_11", name: "Writer Agent", role: "writer", description: "Formats final Markdown reports with verified citations", capabilities: ["markdown_formatting", "citation_linking"], status: "idle", tasksCompleted: 189 },
  ];

  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  getAgents(): AgentDescriptor[] {
    return this.defaultAgents;
  }
}

export const agentRegistry = AgentRegistry.getInstance();
