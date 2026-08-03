"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { BackgroundWorkerItem } from "@/repositories/operations-repository";

export function useWorkers() {
  const [workers, setWorkers] = useState<BackgroundWorkerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await aiRuntime.operations.workers();
      setWorkers(data);
    } catch (err) {
      console.error("[useWorkers] Failed to fetch background workers:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  return {
    workers,
    isLoading,
    refresh: fetchWorkers,
  };
}
