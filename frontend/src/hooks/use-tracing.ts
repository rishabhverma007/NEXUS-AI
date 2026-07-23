"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { runtimeEventBus } from "@/runtime/events/event-bus";
import { RuntimeTraceSpan } from "@/repositories/observability-repository";
import { useNexusStore } from "@/stores/nexus-store";

export function useTracing() {
  const { currentWorkspace } = useNexusStore();
  const [spans, setSpans] = useState<RuntimeTraceSpan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSpans = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await aiRuntime.tracing.listSpans(currentWorkspace.id);
      setSpans(data);
    } catch (err) {
      console.error("[useTracing] Failed to fetch trace spans:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspace.id]);

  useEffect(() => {
    fetchSpans();
    const unsub = runtimeEventBus.subscribe("TRACE_COMPLETED", () => {
      fetchSpans();
    });
    return () => unsub();
  }, [fetchSpans]);

  return {
    spans,
    isLoading,
    refresh: fetchSpans,
  };
}
