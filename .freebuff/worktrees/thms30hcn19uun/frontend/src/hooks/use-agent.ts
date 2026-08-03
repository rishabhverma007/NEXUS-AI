"use client";

import { useState } from "react";
import { TaskPlanner, ExecutionPlan } from "@/features/agentic/pipeline/planner";
import { ReflectionEngine, ReflectionResult } from "@/features/agentic/pipeline/reflection-engine";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { useNexusStore } from "@/stores/nexus-store";

export function useAgent() {
  const { currentWorkspace } = useNexusStore();
  const [plan, setPlan] = useState<ExecutionPlan | null>(null);
  const [reflection, setReflection] = useState<ReflectionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const runAgent = async (query: string, mode: "fast" | "balanced" | "deep" | "research" = "balanced") => {
    setIsExecuting(true);
    const createdPlan = TaskPlanner.createPlan(query, mode);
    setPlan(createdPlan);

    // Retrieve via Module 5 Retrieval Engine
    const retrievalRes = await aiRuntime.retrieve(query, currentWorkspace.id, mode);
    const ref = ReflectionEngine.evaluate("Sample verified response", retrievalRes.chunks.length);
    setReflection(ref);

    setIsExecuting(false);
  };

  return {
    plan,
    reflection,
    isExecuting,
    runAgent,
  };
}
