"use client";

import { useCosts } from "@/hooks/use-costs";
import { DollarSign, Cpu, Layers, Zap, PieChart } from "lucide-react";

export function CostAnalyticsView() {
  const { costSummary, isLoading } = useCosts();

  if (isLoading || !costSummary) {
    return (
      <div className="p-6 text-center border border-slate-800 rounded-xl bg-slate-900/60 animate-pulse">
        <DollarSign className="h-6 w-6 text-slate-400 mx-auto mb-2" />
        <span className="text-xs text-slate-400">Loading cost analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Cost Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Total Workspace Cost</span>
            <span className="text-2xl font-extrabold text-cyan-400">${costSummary.totalCostUsd.toFixed(4)}</span>
          </div>
          <div className="p-2 rounded-lg bg-cyan-500/10">
            <DollarSign className="h-5 w-5 text-cyan-400" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Total Token Consumed</span>
            <span className="text-2xl font-extrabold text-blue-400">{costSummary.totalTokens.toLocaleString()}</span>
          </div>
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Cpu className="h-5 w-5 text-blue-400" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Average Cost per 1K Tokens</span>
            <span className="text-2xl font-extrabold text-emerald-400">$0.0003</span>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Zap className="h-5 w-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Per Agent Cost Breakdown */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <PieChart className="h-4 w-4 text-cyan-400" /> Agent & Tool Token Cost Distribution
        </h3>

        <div className="space-y-3">
          {Object.entries(costSummary.agentCostBreakdown).map(([role, cost]) => (
            <div key={role} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 text-[10px] font-bold uppercase border border-blue-500/30">
                  {role}
                </span>
                <span className="text-slate-200 font-semibold">{role.toUpperCase()} Agent Workflow</span>
              </div>
              <div className="font-mono text-cyan-400 font-bold">${cost.toFixed(6)} USD</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
