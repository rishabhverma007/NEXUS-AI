"use client";

import { ResearchEvidence } from "@/repositories/research-repository";
import { Database, Network, Brain, Wrench, Globe, ExternalLink, CheckCircle2, Shield } from "lucide-react";

interface EvidenceGraphProps {
  evidenceList: ResearchEvidence[];
}

export function EvidenceGraph({ evidenceList }: EvidenceGraphProps) {
  const getSourceIcon = (type: ResearchEvidence["sourceType"]) => {
    switch (type) {
      case "retrieval":
        return <Database className="h-4 w-4 text-nexus-accent" />;
      case "graphrag":
        return <Network className="h-4 w-4 text-nexus-brand-light" />;
      case "memory":
        return <Brain className="h-4 w-4 text-purple-400" />;
      case "tool":
        return <Wrench className="h-4 w-4 text-nexus-amber" />;
      case "web":
        return <Globe className="h-4 w-4 text-nexus-emerald" />;
      default:
        return <Database className="h-4 w-4 text-nexus-400" />;
    }
  };

  if (evidenceList.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-nexus-border rounded-xl bg-nexus-850/40">
        <Database className="h-10 w-10 text-nexus-400 mx-auto mb-3" />
        <h3 className="text-sm font-medium text-nexus-300">No Evidence Gathered Yet</h3>
        <p className="text-xs text-nexus-400 mt-1">Evidence nodes will populate as the research pipeline executes hybrid retrieval & graph subgraphs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-nexus-200 flex items-center gap-2">
          <Shield className="h-4 w-4 text-nexus-accent" /> Evidence Matrix ({evidenceList.length} Verified Nodes)
        </h3>
        <div className="text-xs text-nexus-400 font-mono">
          Avg Credibility: {(evidenceList.reduce((acc, e) => acc + e.credibilityScore, 0) / evidenceList.length * 100).toFixed(1)}%
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {evidenceList.map((ev) => (
          <div
            key={ev.id}
            className="p-4 rounded-xl bg-nexus-850/70 border border-nexus-border/80 nexus-glass flex flex-col justify-between gap-3 hover:border-nexus-border transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-nexus-800 text-[10px] font-bold uppercase tracking-wider text-nexus-300 flex items-center gap-1.5 border border-nexus-border">
                  {getSourceIcon(ev.sourceType)}
                  {ev.sourceType}
                </span>
                {ev.verified && (
                  <span className="text-[10px] text-nexus-emerald flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>

              <h4 className="text-xs font-bold text-nexus-50 line-clamp-1">{ev.sourceTitle}</h4>

              {ev.sourceUri && (
                <div className="flex items-center gap-1 text-[11px] text-nexus-accent font-mono truncate">
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  <span className="truncate">{ev.sourceUri}</span>
                </div>
              )}

              <p className="text-xs text-nexus-300 bg-nexus-950/60 p-2.5 rounded-lg border border-nexus-border/60 line-clamp-3">
                {ev.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-nexus-border/60 text-[11px] text-nexus-400 font-mono">
              <span>Relevance: <strong className="text-nexus-accent">{(ev.relevanceScore * 100).toFixed(0)}%</strong></span>
              <span>Credibility: <strong className="text-nexus-brand-light">{(ev.credibilityScore * 100).toFixed(0)}%</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
