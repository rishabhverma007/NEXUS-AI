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
      <div className="p-6 text-center border border-slate-800 rounded-xl bg-slate-900/60 animate-pulse">
        <FileCode className="h-6 w-6 text-slate-400 mx-auto mb-2" />
        <span className="text-xs text-slate-400">Loading prompt registry versions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Sliders className="h-4 w-4 text-cyan-400" /> Enterprise Prompt Registry & A/B Experimentation
        </h3>
        <span className="text-xs text-slate-400">Active Version Control & Eval Scoring</span>
      </div>

      <div className="space-y-3">
        {prompts.map((pv) => (
          <div
            key={pv.id}
            className={`p-4 rounded-xl border glass-panel space-y-3 transition-all ${
              pv.isActive
                ? "bg-blue-600/10 border-blue-500/40 shadow-glow"
                : "bg-slate-900/70 border-slate-800/80 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-400 border border-slate-700">
                  v{pv.versionNumber}
                </span>
                <h4 className="text-xs font-bold text-slate-100">{pv.promptName}</h4>
                {pv.isActive && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> ACTIVE PRODUCTION
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-cyan-400">Eval Score: <strong>{(pv.evalScore * 100).toFixed(1)}%</strong></span>
                {!pv.isActive && (
                  <button className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1">
                    <RotateCcw className="h-3 w-3" /> Rollback to v{pv.versionNumber}
                  </button>
                )}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs font-mono text-slate-300 space-y-1">
              <span className="text-[10px] text-slate-400 block font-sans">System Prompt</span>
              <p className="line-clamp-2">{pv.systemPrompt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
