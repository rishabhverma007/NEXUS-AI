"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { ResearchMetrics } from "@/repositories/research-repository";
import { useNexusStore } from "@/stores/nexus-store";

export function useResearchMetrics() {
  const { currentWorkspace } = useNexusStore();
  const [metrics, setMetrics] = useState<ResearchMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await aiRuntime.research.getMetrics(currentWorkspace.id);
      setMetrics(data);
    } catch (err) {
      console.error("[useResearchMetrics] Failed to fetch metrics:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspace.id]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    isLoading,
    refresh: fetchMetrics,
  };
}
