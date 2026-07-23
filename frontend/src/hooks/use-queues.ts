"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { TaskQueueItem } from "@/repositories/operations-repository";

export function useQueues() {
  const [queues, setQueues] = useState<TaskQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQueues = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await aiRuntime.operations.queues();
      setQueues(data);
    } catch (err) {
      console.error("[useQueues] Failed to fetch task queues:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueues();
  }, [fetchQueues]);

  return {
    queues,
    isLoading,
    refresh: fetchQueues,
  };
}
