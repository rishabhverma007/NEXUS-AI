import { WorkflowFailureError } from "../utils/runtime-errors";

export interface WorkflowNode {
  id: string;
  name: string;
  type: "router" | "vector_rag" | "graph_rag" | "memory" | "reflection" | "synthesis";
  execute: (state: Record<string, any>) => Promise<Record<string, any>>;
}

export interface WorkflowEdge {
  from: string;
  to: string;
  condition?: (state: Record<string, any>) => boolean;
}

export interface WorkflowExecutionLog {
  nodeId: string;
  status: "pending" | "running" | "completed" | "failed";
  output?: any;
  durationMs: number;
}

export class WorkflowEngine {
  private nodes: Map<string, WorkflowNode> = new Map();
  private edges: WorkflowEdge[] = [];

  addNode(node: WorkflowNode) {
    this.nodes.set(node.id, node);
  }

  addEdge(edge: WorkflowEdge) {
    this.edges.push(edge);
  }

  async executeWorkflow(workflowId: string, initialState: Record<string, any>): Promise<{ finalState: Record<string, any>; logs: WorkflowExecutionLog[] }> {
    let state = { ...initialState };
    const logs: WorkflowExecutionLog[] = [];

    for (const [nodeId, node] of this.nodes) {
      const startTime = Date.now();
      try {
        const output = await node.execute(state);
        state = { ...state, ...output };
        logs.push({
          nodeId,
          status: "completed",
          output,
          durationMs: Date.now() - startTime,
        });
      } catch (err: any) {
        logs.push({
          nodeId,
          status: "failed",
          output: err.message,
          durationMs: Date.now() - startTime,
        });
        throw new WorkflowFailureError(workflowId, nodeId);
      }
    }

    return { finalState: state, logs };
  }
}
