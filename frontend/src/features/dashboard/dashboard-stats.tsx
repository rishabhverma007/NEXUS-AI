"use client";

import { useEffect, useState } from "react";
import { Bot, Database, Network, ShieldCheck } from "lucide-react";
import { fetchStats } from "@/lib/api";
import type { Stats } from "@/types/nexus";

export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchStats()
      .then((s) => {
        if (!cancelled) setStats(s);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const reflectionPct =
    stats?.avg_reflection_score != null
      ? `${(stats.avg_reflection_score * 100).toFixed(1)}% Avg Accuracy`
      : "No scores yet";

  const metrics = [
    {
      title: "Active Knowledge Workspaces",
      value: stats
        ? `${stats.counts.workspaces} Workspace${stats.counts.workspaces === 1 ? "" : "s"}`
        : "—",
      icon: Database,
      color: "text-blue-400",
    },
    {
      title: "GraphRAG Topology Nodes",
      value: stats
        ? `${stats.counts.graph_entities} Entities / ${stats.counts.graph_relations} Relations`
        : "—",
      icon: Network,
      color: "text-indigo-400",
    },
    {
      title: "Agent Conversations",
      value: stats
        ? `${stats.counts.threads} Threads · ${stats.counts.messages} Messages`
        : "—",
      icon: Bot,
      color: "text-cyan-400",
    },
    {
      title: "Reflection Factual Score",
      value: stats ? reflectionPct : "—",
      icon: ShieldCheck,
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div key={m.title} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">{m.title}</span>
              <Icon className={`h-4 w-4 ${m.color}`} />
            </div>
            <div className="text-base font-bold text-slate-100 font-mono">{m.value}</div>
            {!stats && !failed && (
              <div className="h-1 w-16 rounded bg-slate-800 overflow-hidden">
                <div className="h-full w-1/2 bg-indigo-500/60 animate-pulse" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
