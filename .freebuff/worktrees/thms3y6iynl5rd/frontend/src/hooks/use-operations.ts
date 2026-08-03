"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { ClusterNodeItem } from "@/repositories/operations-repository";

export function useOperations() {
  const [healthStatus, setHealthStatus] = useState<{ nodes: ClusterNodeItem[]; systemStatus: "healthy" | "degraded" | "critical" }>({
    nodes: [],
    systemStatus: "healthy",
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchHealth = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await aiRuntime.operations.health();
      setHealthStatus(res);
    } catch (err) {
      console.error("[useOperations] Failed to fetch ops health:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  return {
    healthStatus,
    isLoading,
    refresh: fetchHealth,
  };
}
