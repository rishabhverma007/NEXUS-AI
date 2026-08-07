"use client";

import { useEffect, useRef, useState } from "react";
import { fetchHealth, HealthStatus } from "@/lib/api";

const POLL_INTERVAL_MS = 30_000;

export interface AiStatus {
  /** null = first request still in flight; "offline" = backend unreachable. */
  aiMode: "live" | "simulation" | "offline" | null;
  modelAvailable: boolean | null;
  embeddingsMode: "live" | "mock" | null;
}

/**
 * Polls the backend /health readiness probe every 30s.
 * - `models[modelId]` tells whether the selected model streams real LLM tokens
 * - when the backend is unreachable, `aiMode` becomes "offline" (distinct from
 *   the transient null of the first in-flight request)
 */
export function useAiStatus(modelId: string): AiStatus {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [offline, setOffline] = useState(false);
  const inFlightRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      if (inFlightRef.current) return; // skip overlapping polls
      inFlightRef.current = true;
      try {
        const next = await fetchHealth();
        if (!cancelled) {
          setStatus(next);
          setOffline(false);
        }
      } catch {
        if (!cancelled) setOffline(true);
      } finally {
        inFlightRef.current = false;
      }
    };

    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (offline) return { aiMode: "offline", modelAvailable: false, embeddingsMode: null };
  if (!status) return { aiMode: null, modelAvailable: null, embeddingsMode: null };
  return {
    aiMode: status.ai_mode as "live" | "simulation",
    modelAvailable: status.models[modelId] ?? false,
    embeddingsMode: (status.embeddings?.mode as "live" | "mock") ?? "mock",
  };
}
