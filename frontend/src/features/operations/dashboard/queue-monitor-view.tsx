"use client";

import { useQueues } from "@/hooks/use-queues";
import { Layers, Activity, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export function QueueMonitorView() {
  const { queues, isLoading } = useQueues();

  if (isLoading) {
    return (
      <div className="p-6 text-center border border-slate-800 rounded-xl bg-slate-900/60 animate-pulse">
        <Layers className="h-6 w-6 text-slate-400 mx-auto mb-2" />
        <span className="text-xs text-slate-400">Loading task queue telemetry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" /> Distributed Priority Task Queues ({queues.length} Queues)
        </h3>
        <span className="text-xs text-slate-400 font-mono">Total Rate Limit: 1,600 req/sec</span>
      </div>

      <div className="space-y-3">
        {queues.map((q) => (
          <div
            key={q.id}
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-slate-700 transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">
                  Priority P{q.priority}
                </span>
                <h4 className="font-mono font-bold text-slate-100">{q.queueName}</h4>
              </div>
              <div className="text-[11px] text-slate-400">Rate Limit Cap: {q.rateLimitPerSec} req/sec</div>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Pending</span>
                <span className="font-bold text-amber-400">{q.pendingJobs} Jobs</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Processing</span>
                <span className="font-bold text-cyan-400">{q.processingJobs} Jobs</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Dead Letter (DLQ)</span>
                <span className={`font-bold ${q.deadLetterJobs > 0 ? "text-rose-400" : "text-slate-400"}`}>
                  {q.deadLetterJobs} Jobs
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
