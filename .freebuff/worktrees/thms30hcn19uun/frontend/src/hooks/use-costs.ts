"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { runtimeEventBus } from "@/runtime/events/event-bus";
import { useNexusStore } from "@/stores/nexus-store";

export interface WorkspaceCostSummary {
  totalTokens: number;
  totalCostUsd: number;
  agentCostBreakdown: Record<string, number>;
}

export function useCosts() {
  const { currentWorkspace } = useNexusStore();
  const [costSummary, setCostSummary] = useState<WorkspaceCostSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await aiRuntime.cost.report(currentWorkspace.id);
      setCostSummary(data);
    } catch (err) {
      console.error("[useCosts] Failed to fetch cost summary:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspace.id]);

  useEffect(() => {
    fetchCosts();
    const unsub = runtimeEventBus.subscribe("COST_UPDATED", () => {
      fetchCosts();
    });
    return () => unsub();
  }, [fetchCosts]);

  return {
    costSummary,
    isLoading,
    refresh: fetchCosts,
  };
}
