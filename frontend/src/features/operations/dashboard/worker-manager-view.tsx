"use client";

import { useWorkers } from "@/hooks/use-workers";
import { Cpu, Activity, CheckCircle2, Zap } from "lucide-react";

export function WorkerManagerView() {
  const { workers, isLoading } = useWorkers();

  if (isLoading) {
    return (
      <div className="p-6 text-center border border-slate-800 rounded-xl bg-slate-900/60 animate-pulse">
        <Cpu className="h-6 w-6 text-slate-400 mx-auto mb-2" />
        <span className="text-xs text-slate-400">Loading worker cluster pool...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Cpu className="h-4 w-4 text-cyan-400" /> Background Worker Cluster Pool ({workers.length} Pools)
        </h3>
        <span className="text-xs text-slate-400">Auto-scaling Background Execution Layer</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workers.map((w) => (
          <div key={w.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-bold border border-cyan-500/30 uppercase">
                {w.workerType} WORKER
              </span>
              <span className={`text-[10px] font-semibold flex items-center gap-1 ${w.status === "busy" ? "text-cyan-400 animate-pulse" : "text-emerald-400"}`}>
                <Activity className="h-3 w-3" /> {w.status.toUpperCase()}
              </span>
            </div>

            <h4 className="font-bold text-slate-100 font-mono">{w.workerId}</h4>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <span>Concurrency Limit: <strong className="text-slate-200">{w.concurrencyLimit} Tasks</strong></span>
              <span>Jobs Processed: <strong className="text-cyan-400 font-mono">{w.jobsCompleted.toLocaleString()}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
