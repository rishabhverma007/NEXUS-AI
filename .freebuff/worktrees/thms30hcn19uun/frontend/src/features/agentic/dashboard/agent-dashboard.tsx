"use client";

import { useEffect, useState } from "react";
import { useAgent } from "@/hooks/use-agent";
import { ExecutionDAG } from "./execution-dag";
import { ReflectionCard } from "./reflection-card";
import { Bot, Cpu, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AgentDashboard() {
  const { plan, reflection, isExecuting, runAgent } = useAgent();

  useEffect(() => {
    runAgent("Explain distributed multi-agent RAG workflow", "balanced");
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Bot className="h-6 w-6 text-cyan-400" />
            Agentic RAG Orchestration Inspector
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Task planning, DAG workflow graph, iterative retrieval passes, reflection evaluation, and hallucination verification.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="gap-2"
          onClick={() => runAgent("Decompose sub-graph traversal pipeline", "deep")}
          isLoading={isExecuting}
        >
          <Play className="h-4 w-4" />
          <span>Execute Agentic Workflow</span>
        </Button>
      </div>

      <ReflectionCard reflection={reflection} />

      {plan && <ExecutionDAG nodes={plan.nodes} />}
    </div>
  );
}
