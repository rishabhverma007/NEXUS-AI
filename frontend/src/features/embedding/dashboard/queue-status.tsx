"use client";

import { EmbeddingJobItem } from "@/repositories/embedding-repository";
import { CheckCircle2, Clock, Cpu, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QueueStatusProps {
  jobs: EmbeddingJobItem[];
}

export function QueueStatus({ jobs }: QueueStatusProps) {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Clock className="h-4 w-4 text-cyan-400" />
          Active Embedding Jobs Queue ({jobs.length})
        </h3>
        <span className="text-[10px] font-mono text-slate-500">Real-Time Batch Scheduler</span>
      </div>

      <div className="space-y-3">
        {jobs.map((j) => (
          <div key={j.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
            <div className="space-y-1">
              <div className="font-semibold text-slate-100">{j.documentTitle}</div>
              <div className="text-[10px] text-slate-400 font-mono">
                Provider: {j.provider} • Model: {j.modelId} • {j.processedChunks}/{j.totalChunks} Chunks
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-cyan-400">{j.durationMs} ms</span>
              <Badge variant="emerald" className="uppercase">
                {j.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
