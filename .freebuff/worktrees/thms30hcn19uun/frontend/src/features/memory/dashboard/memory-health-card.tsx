"use client";

import { Brain, CheckCircle2, Layers, ShieldCheck } from "lucide-react";

export function MemoryHealthCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Memory Health Score</span>
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-emerald-400">100%</div>
        <p className="text-[11px] text-slate-500">Zero stale or expired memory facts</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Active Memory Objects</span>
          <Brain className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100">128 Facts</div>
        <p className="text-[11px] text-slate-500">Across Working, Episodic & Semantic</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Hierarchical Compression</span>
          <Layers className="h-4 w-4 text-indigo-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-indigo-400">78.4%</div>
        <p className="text-[11px] text-slate-500">Memory token compression ratio</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Fact Verification</span>
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100">98.2%</div>
        <p className="text-[11px] text-slate-500">High confidence extracted facts</p>
      </div>
    </div>
  );
}
