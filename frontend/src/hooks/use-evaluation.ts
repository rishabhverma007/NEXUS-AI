"use client";

import { useState, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { ComprehensiveEvaluationResult } from "@/features/observability/pipeline/evaluation-engine";
import { useNexusStore } from "@/stores/nexus-store";

export function useEvaluation() {
  const { currentWorkspace } = useNexusStore();
  const [evalResult, setEvalResult] = useState<ComprehensiveEvaluationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runEvaluation = useCallback(async (sessionId?: string) => {
    setIsRunning(true);
    try {
      const res = await aiRuntime.evaluate.run(currentWorkspace.id, sessionId);
      setEvalResult(res);
      return res;
    } catch (err) {
      console.error("[useEvaluation] Failed to run evaluation:", err);
    } finally {
      setIsRunning(false);
    }
  }, [currentWorkspace.id]);

  return {
    evalResult,
    isRunning,
    runEvaluation,
  };
}
