"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { WorkflowDefinition, WorkflowNode, WorkflowEdge } from "@/repositories/studio-repository";
import { WorkflowExecutionSummary } from "@/features/studio/pipeline/workflow-runner";
import { useNexusStore } from "@/stores/nexus-store";

export function useWorkflow(workflowId = "wf_01") {
  const { currentWorkspace } = useNexusStore();
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<WorkflowExecutionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGraph = useCallback(async () => {
    try {
      setIsLoading(true);
      const [wfs, graph] = await Promise.all([
        aiRuntime.studio.workflows(currentWorkspace.id),
        aiRuntime.studio.getWorkflowGraph(workflowId),
      ]);
      setWorkflows(wfs);
      setNodes(graph.nodes);
      setEdges(graph.edges);
    } catch (err) {
      console.error("[useWorkflow] Error fetching workflow graph:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspace.id, workflowId]);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  const executeWorkflow = async (inputPrompt: string) => {
    setIsRunning(true);
    try {
      const res = await aiRuntime.studio.runWorkflow(workflowId, currentWorkspace.id, inputPrompt);
      setExecutionResult(res);
      return res;
    } catch (err) {
      console.error("[useWorkflow] Error executing workflow:", err);
    } finally {
      setIsRunning(false);
    }
  };

  return {
    workflows,
    nodes,
    edges,
    isRunning,
    executionResult,
    isLoading,
    executeWorkflow,
    refresh: fetchGraph,
  };
}
