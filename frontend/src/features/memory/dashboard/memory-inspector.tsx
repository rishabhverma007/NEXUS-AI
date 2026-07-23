"use client";

import { MemoryObjectItem } from "@/repositories/memory-repository";
import { Brain, Info, ShieldCheck, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MemoryInspectorProps {
  memory: MemoryObjectItem | null;
  onClose: () => void;
}

export function MemoryInspector({ memory, onClose }: MemoryInspectorProps) {
  if (!memory) return null;

  return (
    <aside className="w-80 h-full border-l border-nexus-border/80 bg-nexus-950/95 nexus-glass p-5 overflow-y-auto z-20 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-nexus-border">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-nexus-accent" />
          <h3 className="text-xs font-semibold text-nexus-50 uppercase tracking-wider">
            Memory Inspector
          </h3>
        </div>
        <button onClick={onClose} className="text-nexus-400 hover:text-nexus-200 p-1 rounded hover:bg-nexus-850">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 text-xs">
        <div className="p-4 rounded-2xl bg-nexus-850/60 border border-nexus-border space-y-2">
          <Badge variant="cyan" className="uppercase">{memory.memoryType}</Badge>
          <h2 className="text-sm font-bold text-nexus-50 font-mono">{memory.key}</h2>
          <p className="text-nexus-300">{memory.value}</p>
        </div>

        <div className="p-3 rounded-xl bg-nexus-950 border border-nexus-border space-y-2 font-mono text-[11px]">
          <div className="flex justify-between">
            <span className="text-nexus-400">Importance Score:</span>
            <span className="text-nexus-accent font-bold">{(memory.importanceScore * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-nexus-400">Confidence Score:</span>
            <span className="text-nexus-emerald">{(memory.confidenceScore * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-nexus-400">Category:</span>
            <span className="text-nexus-200 uppercase">{memory.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-nexus-400">Last Accessed:</span>
            <span className="text-nexus-400">{memory.lastAccessedAt}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
