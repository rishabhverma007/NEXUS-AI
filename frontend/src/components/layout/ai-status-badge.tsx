"use client";

import { Zap, FlaskConical, WifiOff } from "lucide-react";
import { useAiStatus } from "@/hooks/use-ai-status";

interface AiStatusBadgeProps {
  modelId: string;
}

/**
 * Shows whether the currently selected model will stream REAL LLM answers
 * (LIVE AI, green pulse) or run the deterministic simulation fallback
 * (Simulation, amber). Polls the backend /health endpoint every 30s.
 */
export function AiStatusBadge({ modelId }: AiStatusBadgeProps) {
  const { aiMode, modelAvailable, embeddingsMode } = useAiStatus(modelId);

  // First request still in flight — transient.
  if (aiMode === null) {
    return (
      <span
        className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/4 border border-white/10 text-[10px] font-semibold text-slate-500"
        title="Checking backend AI readiness..."
      >
        <span className="h-1.5 w-1.5 rounded-full bg-slate-600 animate-pulse" />
        CONNECTING
      </span>
    );
  }

  // Backend unreachable — explicit offline state, not perpetual CONNECTING.
  if (aiMode === "offline") {
    return (
      <span
        className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-400/25 text-[10px] font-semibold text-rose-300"
        title="Backend unreachable — check that the FastAPI server is running on port 8000."
      >
        <WifiOff className="h-2.5 w-2.5" />
        OFFLINE
      </span>
    );
  }

  if (modelAvailable) {
    return (
      <span
        className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-400/25 text-[10px] font-semibold text-emerald-300"
        title={`Real LLM provider configured — answers stream live (embeddings: ${embeddingsMode ?? "mock"})`}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        <Zap className="h-2.5 w-2.5" />
        LIVE AI
      </span>
    );
  }

  return (
    <span
      className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-400/25 text-[10px] font-semibold text-amber-300"
      title={`No LLM provider key configured for this model — deterministic fallback is active (embeddings: ${embeddingsMode ?? "mock"}). Add an API key to backend/.env or start Ollama.`}
    >
      <FlaskConical className="h-2.5 w-2.5" />
      SIMULATION
    </span>
  );
}
