"use client";

import { GraphNodeItem } from "@/repositories/graph-repository";
import { Network, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GraphInspectorProps {
  node: GraphNodeItem | null;
  onClose: () => void;
}

export function GraphInspector({ node, onClose }: GraphInspectorProps) {
  if (!node) return null;

  return (
    <aside className="w-80 h-full border-l border-nexus-border/80 bg-nexus-950/95 nexus-glass p-5 overflow-y-auto z-20 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-nexus-border">
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-nexus-accent" />
          <h3 className="text-xs font-semibold text-nexus-50 uppercase tracking-wider">
            Graph Entity Inspector
          </h3>
        </div>
        <button onClick={onClose} className="text-nexus-400 hover:text-nexus-200 p-1 rounded hover:bg-nexus-850">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 text-xs">
        <div className="p-4 rounded-2xl bg-nexus-850/60 border border-nexus-border space-y-2">
          <Badge variant="cyan" className="uppercase">{node.entityType}</Badge>
          <h2 className="text-sm font-bold text-nexus-50">{node.name}</h2>
          <p className="text-nexus-300">{node.description}</p>
        </div>

        <div className="p-3 rounded-xl bg-nexus-950 border border-nexus-border space-y-2 font-mono text-[11px]">
          <span className="text-[10px] text-nexus-400 uppercase font-mono block">Topological Connections</span>
          <div className="flex justify-between">
            <span className="text-nexus-400">Connected Documents:</span>
            <span className="text-nexus-accent">3 Docs</span>
          </div>
          <div className="flex justify-between">
            <span className="text-nexus-400">Connected Memories:</span>
            <span className="text-nexus-brand-light">2 Facts</span>
          </div>
          <div className="flex justify-between">
            <span className="text-nexus-400">2-Hop Subgraph Hops:</span>
            <span className="text-nexus-emerald">2 Hops</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
