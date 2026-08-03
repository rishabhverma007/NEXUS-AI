"use client";

import { MemoryObjectItem } from "@/repositories/memory-repository";
import { Brain, Clock, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MemoryTimelineProps {
  memories: MemoryObjectItem[];
  selectedMemory: MemoryObjectItem | null;
  onSelectMemory: (mem: MemoryObjectItem) => void;
}

export function MemoryTimeline({ memories, selectedMemory, onSelectMemory }: MemoryTimelineProps) {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Clock className="h-4 w-4 text-cyan-400" />
          Chronological Memory Timeline ({memories.length})
        </h3>
        <span className="text-[10px] font-mono text-slate-500">Working • Episodic • Semantic</span>
      </div>

      <div className="space-y-3">
        {memories.map((mem) => {
          const isSelected = selectedMemory?.id === mem.id;
          return (
            <div
              key={mem.id}
              onClick={() => onSelectMemory(mem)}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 text-xs ${
                isSelected
                  ? "border-cyan-500/60 bg-blue-600/10 shadow-glow"
                  : "border-slate-800/80 bg-slate-900/60 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-cyan-400">{mem.key}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="cyan" className="uppercase text-[10px]">
                    {mem.memoryType}
                  </Badge>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {(mem.importanceScore * 100).toFixed(0)}% Importance
                  </span>
                </div>
              </div>

              <p className="text-slate-300 text-xs font-mono">{mem.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
