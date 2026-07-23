"use client";

import { useQuality } from "@/hooks/use-quality";
import { ShieldCheck, Database, Brain, Sparkles, Activity, CheckCircle2 } from "lucide-react";

export function QualityScoreWidget() {
  const { qualityScore, isLoading } = useQuality();

  if (isLoading || !qualityScore) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-20 bg-nexus-850/60 border border-nexus-border rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const items = [
    { label: "Overall Quality", val: qualityScore.overallQuality, icon: Sparkles, color: "text-nexus-accent", border: "border-cyan-500/40", bg: "bg-nexus-accent/10" },
    { label: "Retrieval Score", val: qualityScore.retrievalScore, icon: Database, color: "text-nexus-accent", border: "border-nexus-accent/30", bg: "bg-nexus-accent/10" },
    { label: "Grounding Score", val: qualityScore.groundingScore, icon: ShieldCheck, color: "text-nexus-emerald", border: "border-nexus-emerald/30", bg: "bg-nexus-emerald/10" },
    { label: "Reasoning Score", val: qualityScore.reasoningScore, icon: Brain, color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10" },
    { label: "Research Score", val: qualityScore.researchScore, icon: Activity, color: "text-nexus-brand-light", border: "border-nexus-brand-light/30", bg: "bg-indigo-500/10" },
    { label: "Reliability Score", val: qualityScore.reliabilityScore, icon: CheckCircle2, color: "text-teal-400", border: "border-teal-500/30", bg: "bg-teal-500/10" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
      {items.map((it, idx) => {
        const Icon = it.icon;
        const pct = (it.val * 100).toFixed(1);

        return (
          <div
            key={idx}
            className={`p-3.5 rounded-xl bg-nexus-850/80 border ${it.border} nexus-glass flex flex-col justify-between hover:border-nexus-border transition-all`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-nexus-400">{it.label}</span>
              <div className={`p-1 rounded-md ${it.bg}`}>
                <Icon className={`h-3.5 w-3.5 ${it.color}`} />
              </div>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <span className={`text-xl font-extrabold ${it.color} tracking-tight`}>{pct}%</span>
              <span className="text-[10px] text-nexus-400 font-mono">Target: 85%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
