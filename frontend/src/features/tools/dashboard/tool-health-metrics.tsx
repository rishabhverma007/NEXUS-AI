"use client";

import { Activity, Cpu, Layers, ShieldCheck, Zap } from "lucide-react";

export function ToolHealthMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-2">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Sandbox Execution Latency</span>
          <Zap className="h-4 w-4 text-nexus-accent" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-accent">14 ms</div>
        <p className="text-[11px] text-nexus-500">Isolated execution sandbox latency</p>
      </div>

      <div className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-2">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Execution Success Rate</span>
          <ShieldCheck className="h-4 w-4 text-nexus-emerald" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-emerald">99.8%</div>
        <p className="text-[11px] text-nexus-500">Zero unhandled sandbox exceptions</p>
      </div>

      <div className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-2">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Connected MCP Servers</span>
          <Cpu className="h-4 w-4 text-nexus-brand-light" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-brand-light">4 Active</div>
        <p className="text-[11px] text-nexus-500">GitHub, Postgres, Figma, Puppeteer</p>
      </div>

      <div className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-2">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Result Cache Hit Rate</span>
          <Layers className="h-4 w-4 text-nexus-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-50">88.4%</div>
        <p className="text-[11px] text-nexus-500">Workspace isolated tool cache</p>
      </div>
    </div>
  );
}
