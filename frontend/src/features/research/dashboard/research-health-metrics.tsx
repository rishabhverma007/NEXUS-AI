"use client";

import { Brain, FileText, CheckCircle2, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { useResearchMetrics } from "@/hooks/use-research-metrics";

export function ResearchHealthMetrics() {
  const { metrics, isLoading } = useResearchMetrics();

  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 bg-nexus-850/60 border border-nexus-border rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Researches Completed",
      value: metrics.totalResearchesExecuted,
      subtext: "Across 4 execution modes",
      icon: Sparkles,
      color: "from-nexus-accent to-nexus-brand-light",
      textColor: "text-nexus-accent",
    },
    {
      title: "Evidence Nodes Gathered",
      value: metrics.totalEvidenceNodesCollected,
      subtext: "Hybrid RAG + GraphRAG",
      icon: FileText,
      color: "from-nexus-accent to-nexus-accent",
      textColor: "text-nexus-accent",
    },
    {
      title: "Hypotheses Validated",
      value: metrics.totalHypothesesValidated,
      subtext: "Supported by evidence",
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-500",
      textColor: "text-nexus-emerald",
    },
    {
      title: "Avg Research Speed",
      value: `${metrics.averageResearchDurationSeconds}s`,
      subtext: "Per multi-phase run",
      icon: Clock,
      color: "from-amber-500 to-orange-500",
      textColor: "text-nexus-amber",
    },
    {
      title: "Average Confidence Rating",
      value: `${(metrics.averageConfidenceScore * 100).toFixed(1)}%`,
      subtext: "Factual consistency score",
      icon: ShieldCheck,
      color: "from-purple-500 to-violet-500",
      textColor: "text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="p-4 rounded-xl bg-nexus-850/70 border border-nexus-border/80 nexus-glass flex flex-col justify-between hover:border-nexus-border transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-nexus-400 font-medium">{c.title}</span>
              <div className={`p-1.5 rounded-lg bg-gradient-to-tr ${c.color} bg-opacity-15`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="mt-3">
              <div className={`text-2xl font-bold ${c.textColor} tracking-tight`}>{c.value}</div>
              <div className="text-[11px] text-nexus-400 mt-0.5">{c.subtext}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
