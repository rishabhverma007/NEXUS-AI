"use client";

import { UnifiedGraphRAGContext } from "../pipeline/graph-context-builder";
import { GitBranch, Layers, Network, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GraphRAGInspectorProps {
  context: UnifiedGraphRAGContext | null;
  onClose: () => void;
}

export function GraphRAGInspector({ context, onClose }: GraphRAGInspectorProps) {
  if (!context) return null;

  return (
    <aside className="w-80 h-full border-l border-nexus-border/80 bg-nexus-950/95 nexus-glass p-5 overflow-y-auto z-20 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-nexus-border">
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-nexus-accent" />
          <h3 className="text-xs font-semibold text-nexus-50 uppercase tracking-wider">
            GraphRAG Subgraph Inspector
          </h3>
        </div>
        <button onClick={onClose} className="text-nexus-400 hover:text-nexus-200 p-1 rounded hover:bg-nexus-850">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 text-xs">
        <div>
          <span className="text-[10px] text-nexus-500 font-mono block">Identified Seed Nodes</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {context.subgraph.seedNodes.map((s) => (
              <Badge key={s.id} variant="cyan">{s.name}</Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] text-nexus-500 font-mono block">Discovered Relationship Paths</span>
          {context.paths.map((p) => (
            <div key={p.id} className="p-3 rounded-xl bg-nexus-850/60 border border-nexus-border space-y-1 font-mono text-[11px]">
              <div className="text-nexus-accent font-bold">{p.pathChain.join(" → ")}</div>
              <div className="text-[10px] text-nexus-400">Path Weight: {p.pathWeight}</div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <span className="text-[10px] text-nexus-500 font-mono block">Graph Context Payload ({context.estimatedTokens} Tokens)</span>
          <pre className="p-3 rounded-xl bg-nexus-950 border border-nexus-border font-mono text-[10px] text-nexus-300 overflow-x-auto whitespace-pre-wrap">
            {context.compactGraphContextPayload}
          </pre>
        </div>
      </div>
    </aside>
  );
}
