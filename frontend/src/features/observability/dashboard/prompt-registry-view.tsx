"use client";

import { useState, useEffect } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { PromptVersion } from "@/repositories/observability-repository";
import { useNexusStore } from "@/stores/nexus-store";
import { FileCode, CheckCircle2, RotateCcw, Sliders } from "lucide-react";

export function PromptRegistryView() {
  const { currentWorkspace } = useNexusStore();
  const [prompts, setPrompts] = useState<PromptVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrompts = async () => {
    try {
      setIsLoading(true);
      const data = await aiRuntime.prompts.listVersions(currentWorkspace.id);
      setPrompts(data);
    } catch (err) {
      console.error("[PromptRegistryView] Error fetching prompts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [currentWorkspace.id]);

  if (isLoading) {
    return (
      <div className="p-6 text-center border border-nexus-border rounded-xl bg-nexus-850/60 animate-pulse">
        <FileCode className="h-6 w-6 text-nexus-400 mx-auto mb-2" />
        <span className="text-xs text-nexus-400">Loading prompt registry versions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-nexus-200 flex items-center gap-2">
          <Sliders className="h-4 w-4 text-nexus-accent" /> Enterprise Prompt Registry & A/B Experimentation
        </h3>
        <span className="text-xs text-nexus-400">Active Version Control & Eval Scoring</span>
      </div>

      <div className="space-y-3">
        {prompts.map((pv) => (
          <div
            key={pv.id}
            className={`p-4 rounded-xl border nexus-glass space-y-3 transition-all ${
              pv.isActive
                ? "bg-nexus-accent/10 border-nexus-accent/40 shadow-glow"
                : "bg-nexus-850/70 border-nexus-border/80 hover:border-nexus-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-nexus-800 text-[10px] font-mono text-nexus-accent border border-nexus-border">
                  v{pv.versionNumber}
                </span>
                <h4 className="text-xs font-bold text-nexus-50">{pv.promptName}</h4>
                {pv.isActive && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-nexus-emerald text-[10px] font-bold border border-nexus-emerald/30 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> ACTIVE PRODUCTION
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-nexus-accent">Eval Score: <strong>{(pv.evalScore * 100).toFixed(1)}%</strong></span>
                {!pv.isActive && (
                  <button className="px-2.5 py-1 rounded bg-nexus-800 hover:bg-nexus-700 text-nexus-200 text-[11px] font-semibold flex items-center gap-1">
                    <RotateCcw className="h-3 w-3" /> Rollback to v{pv.versionNumber}
                  </button>
                )}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-nexus-950/80 border border-nexus-border/80 text-xs font-mono text-nexus-300 space-y-1">
              <span className="text-[10px] text-nexus-400 block font-sans">System Prompt</span>
              <p className="line-clamp-2">{pv.systemPrompt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
