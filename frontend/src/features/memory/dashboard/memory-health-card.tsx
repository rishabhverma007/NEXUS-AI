"use client";

import { Brain, CheckCircle2, Layers, ShieldCheck } from "lucide-react";

export function MemoryHealthCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-2">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Memory Health Score</span>
          <ShieldCheck className="h-4 w-4 text-nexus-emerald" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-emerald">100%</div>
        <p className="text-[11px] text-nexus-500">Zero stale or expired memory facts</p>
      </div>

      <div className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-2">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Active Memory Objects</span>
          <Brain className="h-4 w-4 text-nexus-accent" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-50">128 Facts</div>
        <p className="text-[11px] text-nexus-500">Across Working, Episodic & Semantic</p>
      </div>

      <div className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-2">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Hierarchical Compression</span>
          <Layers className="h-4 w-4 text-nexus-brand-light" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-brand-light">78.4%</div>
        <p className="text-[11px] text-nexus-500">Memory token compression ratio</p>
      </div>

      <div className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-2">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Fact Verification</span>
          <CheckCircle2 className="h-4 w-4 text-nexus-emerald" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-50">98.2%</div>
        <p className="text-[11px] text-nexus-500">High confidence extracted facts</p>
      </div>
    </div>
  );
}
