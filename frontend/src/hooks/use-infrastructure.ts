"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { ClusterNodeItem } from "@/repositories/operations-repository";

export function useInfrastructure() {
  const [nodes, setNodes] = useState<ClusterNodeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInfrastructure = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await aiRuntime.operations.infrastructure();
      setNodes(data);
    } catch (err) {
      console.error("[useInfrastructure] Failed to fetch cluster nodes:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInfrastructure();
  }, [fetchInfrastructure]);

  return {
    nodes,
    isLoading,
    refresh: fetchInfrastructure,
  };
}
