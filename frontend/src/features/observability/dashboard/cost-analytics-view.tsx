"use client";

import { useCosts } from "@/hooks/use-costs";
import { DollarSign, Cpu, Layers, Zap, PieChart } from "lucide-react";

export function CostAnalyticsView() {
  const { costSummary, isLoading } = useCosts();

  if (isLoading || !costSummary) {
    return (
      <div className="p-6 text-center border border-nexus-border rounded-xl bg-nexus-850/60 animate-pulse">
        <DollarSign className="h-6 w-6 text-nexus-400 mx-auto mb-2" />
        <span className="text-xs text-nexus-400">Loading cost analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Cost Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass flex items-center justify-between">
          <div>
            <span className="text-xs text-nexus-400 block font-medium">Total Workspace Cost</span>
            <span className="text-2xl font-extrabold text-nexus-accent">${costSummary.totalCostUsd.toFixed(4)}</span>
          </div>
          <div className="p-2 rounded-lg bg-nexus-accent/10">
            <DollarSign className="h-5 w-5 text-nexus-accent" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass flex items-center justify-between">
          <div>
            <span className="text-xs text-nexus-400 block font-medium">Total Token Consumed</span>
            <span className="text-2xl font-extrabold text-nexus-accent">{costSummary.totalTokens.toLocaleString()}</span>
          </div>
          <div className="p-2 rounded-lg bg-nexus-accent/10">
            <Cpu className="h-5 w-5 text-nexus-accent" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass flex items-center justify-between">
          <div>
            <span className="text-xs text-nexus-400 block font-medium">Average Cost per 1K Tokens</span>
            <span className="text-2xl font-extrabold text-nexus-emerald">$0.0003</span>
          </div>
          <div className="p-2 rounded-lg bg-nexus-emerald/10">
            <Zap className="h-5 w-5 text-nexus-emerald" />
          </div>
        </div>
      </div>

      {/* Per Agent Cost Breakdown */}
      <div className="p-5 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass space-y-4">
        <h3 className="text-sm font-semibold text-nexus-200 flex items-center gap-2">
          <PieChart className="h-4 w-4 text-nexus-accent" /> Agent & Tool Token Cost Distribution
        </h3>

        <div className="space-y-3">
          {Object.entries(costSummary.agentCostBreakdown).map(([role, cost]) => (
            <div key={role} className="p-3 rounded-lg bg-nexus-950/70 border border-nexus-border/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-nexus-accent/20 text-nexus-accent text-[10px] font-bold uppercase border border-nexus-accent/30">
                  {role}
                </span>
                <span className="text-nexus-200 font-semibold">{role.toUpperCase()} Agent Workflow</span>
              </div>
              <div className="font-mono text-nexus-accent font-bold">${cost.toFixed(6)} USD</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
