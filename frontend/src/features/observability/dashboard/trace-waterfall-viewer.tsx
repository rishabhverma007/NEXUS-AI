"use client";

import { useTracing } from "@/hooks/use-tracing";
import { Activity, Clock, CheckCircle2, AlertTriangle, Layers } from "lucide-react";

export function TraceWaterfallViewer() {
  const { spans, isLoading } = useTracing();

  if (isLoading) {
    return (
      <div className="p-6 text-center border border-slate-800 rounded-xl bg-slate-900/60 animate-pulse">
        <Activity className="h-6 w-6 text-slate-400 mx-auto mb-2" />
        <span className="text-xs text-slate-400">Loading distributed trace spans...</span>
      </div>
    );
  }

  const maxLatency = Math.max(...spans.map((s) => s.latencyMs), 100);

  const getComponentBadgeColor = (comp: string) => {
    switch (comp) {
      case "retrieval":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      case "graphrag":
        return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
      case "memory":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "tool":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "agent":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "research":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" /> Distributed Tracing Inspector ({spans.length} Spans)
        </h3>
        <span className="text-xs font-mono text-slate-400">Trace ID: {spans[0]?.traceId || "N/A"}</span>
      </div>

      <div className="space-y-2.5">
        {spans.map((s) => {
          const widthPct = Math.max(8, Math.min(100, (s.latencyMs / maxLatency) * 100));

          return (
            <div
              key={s.id}
              className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 flex flex-col gap-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getComponentBadgeColor(s.component)}`}>
                    {s.component}
                  </span>
                  <span className="font-semibold text-slate-200">{s.operationName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-cyan-400 font-bold">{s.latencyMs} ms</span>
                  {s.status === "ok" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                  )}
                </div>
              </div>

              {/* Flamegraph Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${widthPct}%` }}
                />
              </div>

              {s.attributes && Object.keys(s.attributes).length > 0 && (
                <div className="text-[10px] font-mono text-slate-400 flex items-center gap-3 pt-1 border-t border-slate-800/40">
                  {Object.entries(s.attributes).map(([k, v]) => (
                    <span key={k}>
                      {k}: <strong className="text-slate-300">{JSON.stringify(v)}</strong>
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
