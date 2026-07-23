"use client";

import { Network, GitBranch, Layers, ShieldCheck } from "lucide-react";

export function GraphHealthCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-2">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Graph Health Score</span>
          <ShieldCheck className="h-4 w-4 text-nexus-emerald" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-emerald">100%</div>
        <p className="text-[11px] text-nexus-500">Zero broken edges or orphan nodes</p>
      </div>

      <div className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-2">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Entity Nodes</span>
          <Network className="h-4 w-4 text-nexus-accent" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-50">1,240</div>
        <p className="text-[11px] text-nexus-500">Across 14 enterprise entity types</p>
      </div>

      <div className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-2">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Relation Edges</span>
          <GitBranch className="h-4 w-4 text-nexus-brand-light" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-brand-light">3,890</div>
        <p className="text-[11px] text-nexus-500">Connected topological relationships</p>
      </div>

      <div className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-2">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Graph Density</span>
          <Layers className="h-4 w-4 text-nexus-accent" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-50">0.42</div>
        <p className="text-[11px] text-nexus-500">High-connectivity sub-graph network</p>
      </div>
    </div>
  );
}
