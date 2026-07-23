"use client";

import { Bot, Cpu, Layers, ShieldCheck, Zap } from "lucide-react";

export function AgentHealthMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      <div className="nexus-glass rounded-2xl border border-nexus-border p-5 space-y-2 hover:border-nexus-border-hover transition-all duration-200">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Collaboration Latency</span>
          <Zap className="h-4 w-4 text-nexus-accent" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-accent">65 ms</div>
        <p className="text-xs text-nexus-500">Shared AIRuntimeSDK dispatch latency</p>
      </div>

      <div className="nexus-glass rounded-2xl border border-nexus-border p-5 space-y-2 hover:border-nexus-border-hover transition-all duration-200">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Specialized Agents</span>
          <Bot className="h-4 w-4 text-nexus-brand-light" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-50">11 Agents</div>
        <p className="text-xs text-nexus-500">Supervisor, Planner, Research, Coding...</p>
      </div>

      <div className="nexus-glass rounded-2xl border border-nexus-border p-5 space-y-2 hover:border-nexus-border-hover transition-all duration-200">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>System Confidence</span>
          <ShieldCheck className="h-4 w-4 text-nexus-emerald" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-emerald">98.6%</div>
        <p className="text-xs text-nexus-500">Multi-agent agreement score</p>
      </div>

      <div className="nexus-glass rounded-2xl border border-nexus-border p-5 space-y-2 hover:border-nexus-border-hover transition-all duration-200">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Active Task Queue</span>
          <Layers className="h-4 w-4 text-nexus-accent" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-50">4 Executing</div>
        <p className="text-xs text-nexus-500">Parallel DAG task decomposition</p>
      </div>
    </div>
  );
}
