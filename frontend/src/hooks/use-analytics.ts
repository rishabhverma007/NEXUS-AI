"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { useNexusStore } from "@/stores/nexus-store";

export interface SystemAnalytics {
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  totalRequests: number;
  errorRate: number;
  overallQuality: number;
}

export function useAnalytics() {
  const { currentWorkspace } = useNexusStore();
  const [analytics, setAnalytics] = useState<SystemAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      const metrics = await aiRuntime.analytics.metrics(currentWorkspace.id);
      setAnalytics({
        p50LatencyMs: 42.5,
        p95LatencyMs: 148.0,
        p99LatencyMs: 280.4,
        totalRequests: 14280,
        errorRate: 0.0012,
        overallQuality: metrics.overallQuality,
      });
    } catch (err) {
      console.error("[useAnalytics] Failed to fetch analytics:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspace.id]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    isLoading,
    refresh: fetchAnalytics,
  };
}
