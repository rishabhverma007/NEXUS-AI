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
    <aside className="w-80 h-full border-l border-slate-800/80 bg-slate-950/95 glass-panel p-5 overflow-y-auto z-20 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-semibold text-slate-100 uppercase tracking-wider">
            Memory Inspector
          </h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-900">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 text-xs">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <Badge variant="cyan" className="uppercase">{memory.memoryType}</Badge>
          <h2 className="text-sm font-bold text-slate-100 font-mono">{memory.key}</h2>
          <p className="text-slate-300">{memory.value}</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-900 space-y-2 font-mono text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Importance Score:</span>
            <span className="text-cyan-400 font-bold">{(memory.importanceScore * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Confidence Score:</span>
            <span className="text-emerald-400">{(memory.confidenceScore * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Category:</span>
            <span className="text-slate-200 uppercase">{memory.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Last Accessed:</span>
            <span className="text-slate-400">{memory.lastAccessedAt}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
