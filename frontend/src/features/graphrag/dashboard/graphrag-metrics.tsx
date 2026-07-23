"use client";

import { Clock, GitBranch, Layers, Network, ShieldCheck, Zap } from "lucide-react";

export function GraphRAGMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      <div className="nexus-glass rounded-2xl border border-nexus-border p-5 space-y-2 hover:border-nexus-border-hover transition-all duration-200">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Expansion Latency</span>
          <Zap className="h-4 w-4 text-nexus-accent" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-accent">48 ms</div>
        <p className="text-xs text-nexus-500">Fast 2-hop topological traversal</p>
      </div>

      <div className="nexus-glass rounded-2xl border border-nexus-border p-5 space-y-2 hover:border-nexus-border-hover transition-all duration-200">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Average Hop Depth</span>
          <Layers className="h-4 w-4 text-nexus-brand-light" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-50">2.0 Hops</div>
        <p className="text-xs text-nexus-500">Adaptive sub-graph expansion</p>
      </div>

      <div className="nexus-glass rounded-2xl border border-nexus-border p-5 space-y-2 hover:border-nexus-border-hover transition-all duration-200">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Subgraph Node Size</span>
          <Network className="h-4 w-4 text-nexus-emerald" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-emerald">32 Nodes</div>
        <p className="text-xs text-nexus-500">Across 14 enterprise entity types</p>
      </div>

      <div className="nexus-glass rounded-2xl border border-nexus-border p-5 space-y-2 hover:border-nexus-border-hover transition-all duration-200">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Graph Cache Hit Rate</span>
          <ShieldCheck className="h-4 w-4 text-nexus-accent" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-50">92.4%</div>
        <p className="text-xs text-nexus-500">Sub-graph path cache hit ratio</p>
      </div>
    </div>
  );
}
