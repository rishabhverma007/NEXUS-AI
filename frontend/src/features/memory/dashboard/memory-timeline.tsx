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
    <div className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-nexus-50 flex items-center gap-2">
          <Clock className="h-4 w-4 text-nexus-accent" />
          Chronological Memory Timeline ({memories.length})
        </h3>
        <span className="text-[10px] font-mono text-nexus-500">Working • Episodic • Semantic</span>
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
                  ? "border-cyan-500/60 bg-nexus-accent/10 shadow-glow"
                  : "border-nexus-border/80 bg-nexus-850/60 hover:border-nexus-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-nexus-accent">{mem.key}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="cyan" className="uppercase text-[10px]">
                    {mem.memoryType}
                  </Badge>
                  <span className="text-[10px] font-mono text-nexus-emerald font-bold">
                    {(mem.importanceScore * 100).toFixed(0)}% Importance
                  </span>
                </div>
              </div>

              <p className="text-nexus-300 text-xs font-mono">{mem.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
