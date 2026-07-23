"use client";

import { Network, GitBranch, Layers, ShieldCheck } from "lucide-react";

export function GraphHealthCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Graph Health Score</span>
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-emerald-400">100%</div>
        <p className="text-[11px] text-slate-500">Zero broken edges or orphan nodes</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Entity Nodes</span>
          <Network className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100">1,240</div>
        <p className="text-[11px] text-slate-500">Across 14 enterprise entity types</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Relation Edges</span>
          <GitBranch className="h-4 w-4 text-indigo-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-indigo-400">3,890</div>
        <p className="text-[11px] text-slate-500">Connected topological relationships</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Graph Density</span>
          <Layers className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100">0.42</div>
        <p className="text-[11px] text-slate-500">High-connectivity sub-graph network</p>
      </div>
    </div>
  );
}
