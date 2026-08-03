import { studioRepository, WorkflowNode, WorkflowEdge } from "@/repositories/studio-repository";

export interface CompiledWorkflowStep {
  stepId: string;
  nodeType: WorkflowNode["nodeType"];
  label: string;
  dependencies: string[];
  config: Record<string, any>;
}

export interface CompiledWorkflowPlan {
  workflowId: string;
  totalSteps: number;
  executionOrder: CompiledWorkflowStep[];
}

export class WorkflowCompiler {
  static async compile(workflowId: string): Promise<CompiledWorkflowPlan> {
    const { nodes, edges } = await studioRepository.getWorkflowGraph(workflowId);

    const executionOrder: CompiledWorkflowStep[] = nodes.map((n) => {
      const incomingEdges = edges.filter((e) => e.targetNodeId === n.nodeId);
      const dependencies = incomingEdges.map((e) => e.sourceNodeId);

      return {
        stepId: n.nodeId,
        nodeType: n.nodeType,
        label: n.label,
        dependencies,
        config: n.config,
      };
    });

    return {
      workflowId,
      totalSteps: executionOrder.length,
      executionOrder,
    };
  }
}
