"use client";

import { Clock, GitBranch, Layers, Network, ShieldCheck, Zap } from "lucide-react";

export function GraphRAGMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Expansion Latency</span>
          <Zap className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-cyan-400">48 ms</div>
        <p className="text-[11px] text-slate-500">Fast 2-hop topological traversal</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Average Hop Depth</span>
          <Layers className="h-4 w-4 text-indigo-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100">2.0 Hops</div>
        <p className="text-[11px] text-slate-500">Adaptive sub-graph expansion</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Subgraph Node Size</span>
          <Network className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-emerald-400">32 Nodes</div>
        <p className="text-[11px] text-slate-500">Across 14 enterprise entity types</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Graph Cache Hit Rate</span>
          <ShieldCheck className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100">92.4%</div>
        <p className="text-[11px] text-slate-500">Sub-graph path cache hit ratio</p>
      </div>
    </div>
  );
}
