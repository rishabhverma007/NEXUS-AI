import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { runtimeEventBus } from "@/runtime/events/event-bus";
import { WorkflowCompiler, CompiledWorkflowPlan } from "./workflow-compiler";

export interface WorkflowStepResult {
  stepId: string;
  label: string;
  status: "success" | "failed";
  output: any;
  durationMs: number;
}

export interface WorkflowExecutionSummary {
  workflowId: string;
  status: "completed" | "failed";
  stepResults: WorkflowStepResult[];
  finalOutput: any;
}

export class WorkflowRunner {
  static async run(
    workflowId: string,
    workspaceId: string,
    inputPrompt: string
  ): Promise<WorkflowExecutionSummary> {
    const plan = await WorkflowCompiler.compile(workflowId);
    const stepResults: WorkflowStepResult[] = [];
    let accumulatedContext = inputPrompt;

    runtimeEventBus.publish("TRACE_STARTED", {
      workspaceId,
      operationName: `WorkflowRunner.run:${workflowId}`,
      component: "system",
    });

    for (const step of plan.executionOrder) {
      const startTime = performance.now();
      let stepOutput: any = null;

      try {
        switch (step.nodeType) {
          case "retriever":
            stepOutput = await aiRuntime.retrieve(accumulatedContext, workspaceId, "research");
            break;
          case "graphrag":
            const graph = await aiRuntime.graph.query(workspaceId);
            stepOutput = aiRuntime.graphrag.expand((graph?.nodes || []).slice(0, 3), 2);
            break;
          case "memory":
            stepOutput = await aiRuntime.recall(workspaceId, "semantic");
            break;
          case "agent":
            stepOutput = await aiRuntime.agents.execute(step.config?.role || "critic", accumulatedContext);
            break;
          case "tool_call":
            stepOutput = await aiRuntime.tools.execute(step.config?.toolId || "web_search", { query: accumulatedContext });
            break;
          default:
            stepOutput = { status: "processed", nodeLabel: step.label, input: accumulatedContext };
        }

        const durationMs = Number((performance.now() - startTime).toFixed(2));
        stepResults.push({
          stepId: step.stepId,
          label: step.label,
          status: "success",
          output: stepOutput,
          durationMs,
        });
      } catch (err: any) {
        const durationMs = Number((performance.now() - startTime).toFixed(2));
        stepResults.push({
          stepId: step.stepId,
          label: step.label,
          status: "failed",
          output: { error: err.message },
          durationMs,
        });
      }
    }

    return {
      workflowId,
      status: "completed",
      stepResults,
      finalOutput: `Workflow visual execution completed across ${stepResults.length} steps.`,
    };
  }
}
