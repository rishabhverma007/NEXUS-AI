import { agentRegistry, AgentDescriptor } from "@/features/agents/registry/agent-registry";

export interface AgentTaskItem {
  id: string;
  agentRole: string;
  taskTitle: string;
  status: "pending" | "running" | "completed" | "failed";
  durationMs: number;
}

export class AgentRepository {
  private static instance: AgentRepository;

  public static getInstance(): AgentRepository {
    if (!AgentRepository.instance) {
      AgentRepository.instance = new AgentRepository();
    }
    return AgentRepository.instance;
  }

  async getAgents(): Promise<AgentDescriptor[]> {
    return agentRegistry.getAgents();
  }

  async getTasks(): Promise<AgentTaskItem[]> {
    return [
      { id: "task_01", agentRole: "planner", taskTitle: "Deconstruct multi-agent goal graph", status: "completed", durationMs: 42 },
      { id: "task_02", agentRole: "research", taskTitle: "Retrieve RRF vector context from Module 5", status: "completed", durationMs: 110 },
      { id: "task_03", agentRole: "graph", taskTitle: "Expand 2-hop GraphRAG sub-graph from Module 9", status: "completed", durationMs: 48 },
      { id: "task_04", agentRole: "critic", taskTitle: "Evaluate factual consistency & hallucination score", status: "completed", durationMs: 85 },
    ];
  }
}

export const agentRepository = AgentRepository.getInstance();
