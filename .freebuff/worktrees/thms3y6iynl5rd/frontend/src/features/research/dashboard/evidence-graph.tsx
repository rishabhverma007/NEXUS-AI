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
        return <Database className="h-4 w-4 text-cyan-400" />;
      case "graphrag":
        return <Network className="h-4 w-4 text-indigo-400" />;
      case "memory":
        return <Brain className="h-4 w-4 text-purple-400" />;
      case "tool":
        return <Wrench className="h-4 w-4 text-amber-400" />;
      case "web":
        return <Globe className="h-4 w-4 text-emerald-400" />;
      default:
        return <Database className="h-4 w-4 text-slate-400" />;
    }
  };

  if (evidenceList.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/40">
        <Database className="h-10 w-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-sm font-medium text-slate-300">No Evidence Gathered Yet</h3>
        <p className="text-xs text-slate-400 mt-1">Evidence nodes will populate as the research pipeline executes hybrid retrieval & graph subgraphs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Shield className="h-4 w-4 text-cyan-400" /> Evidence Matrix ({evidenceList.length} Verified Nodes)
        </h3>
        <div className="text-xs text-slate-400 font-mono">
          Avg Credibility: {(evidenceList.reduce((acc, e) => acc + e.credibilityScore, 0) / evidenceList.length * 100).toFixed(1)}%
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {evidenceList.map((ev) => (
          <div
            key={ev.id}
            className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 glass-panel flex flex-col justify-between gap-3 hover:border-slate-700 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 border border-slate-700">
                  {getSourceIcon(ev.sourceType)}
                  {ev.sourceType}
                </span>
                {ev.verified && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>

              <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{ev.sourceTitle}</h4>

              {ev.sourceUri && (
                <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-mono truncate">
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  <span className="truncate">{ev.sourceUri}</span>
                </div>
              )}

              <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 line-clamp-3">
                {ev.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono">
              <span>Relevance: <strong className="text-cyan-400">{(ev.relevanceScore * 100).toFixed(0)}%</strong></span>
              <span>Credibility: <strong className="text-indigo-400">{(ev.credibilityScore * 100).toFixed(0)}%</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
