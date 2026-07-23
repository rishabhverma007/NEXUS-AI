"use client";

import { Activity, Cpu, Layers, ShieldCheck, Zap } from "lucide-react";

export function ToolHealthMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Sandbox Execution Latency</span>
          <Zap className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-cyan-400">14 ms</div>
        <p className="text-[11px] text-slate-500">Isolated execution sandbox latency</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Execution Success Rate</span>
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-emerald-400">99.8%</div>
        <p className="text-[11px] text-slate-500">Zero unhandled sandbox exceptions</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Connected MCP Servers</span>
          <Cpu className="h-4 w-4 text-indigo-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-indigo-400">4 Active</div>
        <p className="text-[11px] text-slate-500">GitHub, Postgres, Figma, Puppeteer</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Result Cache Hit Rate</span>
          <Layers className="h-4 w-4 text-slate-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100">88.4%</div>
        <p className="text-[11px] text-slate-500">Workspace isolated tool cache</p>
      </div>
    </div>
  );
}
