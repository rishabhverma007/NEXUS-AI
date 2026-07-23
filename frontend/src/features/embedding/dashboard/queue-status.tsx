"use client";

import { EmbeddingJobItem } from "@/repositories/embedding-repository";
import { CheckCircle2, Clock, Cpu, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QueueStatusProps {
  jobs: EmbeddingJobItem[];
}

export function QueueStatus({ jobs }: QueueStatusProps) {
  return (
    <div className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-nexus-50 flex items-center gap-2">
          <Clock className="h-4 w-4 text-nexus-accent" />
          Active Embedding Jobs Queue ({jobs.length})
        </h3>
        <span className="text-[10px] font-mono text-nexus-500">Real-Time Batch Scheduler</span>
      </div>

      <div className="space-y-3">
        {jobs.map((j) => (
          <div key={j.id} className="p-4 rounded-xl bg-nexus-850/60 border border-nexus-border flex items-center justify-between text-xs">
            <div className="space-y-1">
              <div className="font-semibold text-nexus-50">{j.documentTitle}</div>
              <div className="text-[10px] text-nexus-400 font-mono">
                Provider: {j.provider} • Model: {j.modelId} • {j.processedChunks}/{j.totalChunks} Chunks
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-nexus-accent">{j.durationMs} ms</span>
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
