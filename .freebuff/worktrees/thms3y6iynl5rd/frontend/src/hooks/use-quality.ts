"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { runtimeEventBus } from "@/runtime/events/event-bus";
import { QualityScore } from "@/repositories/observability-repository";
import { useNexusStore } from "@/stores/nexus-store";

export function useQuality() {
  const { currentWorkspace } = useNexusStore();
  const [qualityScore, setQualityScore] = useState<QualityScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFetchingRef = useRef(false);

  const fetchQuality = useCallback(async () => {
    // Guard against re-entrant calls — calculateLatestScore publishes
    // QUALITY_UPDATED synchronously, which would loop back here.
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      setIsLoading(true);
      const score = await aiRuntime.evaluate.report(currentWorkspace.id);
      setQualityScore(score);
    } catch (err) {
      console.error("[useQuality] Failed to fetch quality scores:", err);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentWorkspace.id]);

  useEffect(() => {
    fetchQuality();
    const unsub = runtimeEventBus.subscribe("QUALITY_UPDATED", () => {
      fetchQuality();
    });
    return () => unsub();
  }, [fetchQuality]);

  return {
    qualityScore,
    isLoading,
    refresh: fetchQuality,
  };
}
