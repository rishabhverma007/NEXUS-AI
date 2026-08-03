"use client";

import { Database, Network, Brain, Layers, FileText } from "lucide-react";

export function KnowledgeExplorerView() {
  const items = [
    { title: "Vector Index Collections", count: "12 Collections", detail: "145,000 dense chunks (1536-dim)", icon: Database, color: "text-cyan-400" },
    { title: "3D Knowledge Graph Topology", count: "1,420 Nodes", detail: "3,890 GraphRAG relationships", icon: Network, color: "text-indigo-400" },
    { title: "Long-Term Memory Store", count: "382 Memory Objects", detail: "Working, Episodic & Semantic memory", icon: Brain, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Database className="h-4 w-4 text-cyan-400" /> Platform Knowledge Explorer Visualizer
        </h3>
        <span className="text-xs text-slate-400">Integrated Knowledge Subsystems</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((it, idx) => {
          const Icon = it.icon;
          return (
            <div key={idx} className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">{it.title}</span>
                <Icon className={`h-5 w-5 ${it.color}`} />
              </div>

              <div className="text-xl font-bold text-slate-100">{it.count}</div>
              <p className="text-xs text-slate-400">{it.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
