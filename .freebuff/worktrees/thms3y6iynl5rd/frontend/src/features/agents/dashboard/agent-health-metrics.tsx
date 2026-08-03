"use client";

import { Bot, Cpu, Layers, ShieldCheck, Zap } from "lucide-react";

export function AgentHealthMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Collaboration Latency</span>
          <Zap className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-cyan-400">65 ms</div>
        <p className="text-[11px] text-slate-500">Shared AIRuntimeSDK dispatch latency</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Specialized Agents</span>
          <Bot className="h-4 w-4 text-indigo-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100">11 Agents</div>
        <p className="text-[11px] text-slate-500">Supervisor, Planner, Research, Coding...</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>System Confidence</span>
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-emerald-400">98.6%</div>
        <p className="text-[11px] text-slate-500">Multi-agent agreement score</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Active Task Queue</span>
          <Layers className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100">4 Executing</div>
        <p className="text-[11px] text-slate-500">Parallel DAG task decomposition</p>
      </div>
    </div>
  );
}
