"use client";

import { ResearchHypothesis, ResearchSession } from "@/repositories/research-repository";
import { Brain, CheckCircle2, HelpCircle, AlertTriangle, Layers, Target, Activity } from "lucide-react";

interface ResearchPlannerViewProps {
  session: ResearchSession | null;
  hypotheses: ResearchHypothesis[];
  isExecuting?: boolean;
  progressPercent?: number;
  executionMessage?: string;
}

export function ResearchPlannerView({
  session,
  hypotheses,
  isExecuting,
  progressPercent = 0,
  executionMessage,
}: ResearchPlannerViewProps) {
  if (!session) {
    return (
      <div className="p-8 text-center border border-dashed border-nexus-border rounded-xl bg-nexus-850/40">
        <Brain className="h-10 w-10 text-nexus-400 mx-auto mb-3" />
        <h3 className="text-sm font-medium text-nexus-300">No Active Research Selected</h3>
        <p className="text-xs text-nexus-400 mt-1">Select an existing session from the list or launch a new deep research run.</p>
      </div>
    );
  }

  const getStatusBadge = (status: ResearchSession["status"]) => {
    switch (status) {
      case "completed":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-nexus-emerald border border-nexus-emerald/30 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Completed</span>;
      case "executing":
      case "planning":
      case "synthesizing":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/20 text-nexus-accent border border-nexus-accent/30 flex items-center gap-1 animate-pulse"><Activity className="h-3 w-3" /> {status.toUpperCase()}</span>;
      case "failed":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/20 text-nexus-rose border border-nexus-rose/30 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Failed</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-nexus-800 text-nexus-300">{status.toUpperCase()}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Execution Live Progress Bar */}
      {isExecuting && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-nexus-950/80 via-nexus-850 to-nexus-950/80 border border-nexus-accent/30 nexus-glass shadow-glow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-semibold text-cyan-300">Deep Research Pipeline Running</span>
            </div>
            <span className="text-xs font-mono text-nexus-accent">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-nexus-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-nexus-accent via-nexus-accent to-nexus-brand-light transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] font-mono text-nexus-300 mt-2 truncate">{executionMessage || "Processing multi-stage research tasks..."}</p>
        </div>
      )}

      {/* Session Metadata Header */}
      <div className="p-5 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-nexus-accent/20 text-nexus-accent text-[10px] font-bold border border-nexus-accent/30 uppercase tracking-wider">
                {session.depthLevel} Mode
              </span>
              {getStatusBadge(session.status)}
            </div>
            <h2 className="text-lg font-bold text-nexus-50">{session.title}</h2>
          </div>
          <div className="text-right">
            <span className="text-xs text-nexus-400 block">Factual Confidence</span>
            <span className="text-xl font-extrabold text-nexus-accent">{(session.confidenceScore * 100).toFixed(1)}%</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-nexus-950/60 border border-nexus-border/60 text-xs text-nexus-300">
          <span className="font-semibold text-nexus-400 block mb-1 flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-nexus-accent" /> Research Objective
          </span>
          {session.objective}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-nexus-border/60 text-xs">
          <div>
            <span className="text-nexus-400 block">Iterations Completed</span>
            <span className="font-semibold text-nexus-200">{session.currentIteration} / {session.maxIterations}</span>
          </div>
          <div>
            <span className="text-nexus-400 block">Workspace ID</span>
            <span className="font-mono text-nexus-300 truncate block">{session.workspaceId}</span>
          </div>
          <div>
            <span className="text-nexus-400 block">Last Updated</span>
            <span className="font-semibold text-nexus-200">{new Date(session.updatedAt).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Primary Hypotheses Resolution Matrix */}
      <div className="p-5 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass space-y-4">
        <h3 className="text-sm font-semibold text-nexus-200 flex items-center gap-2">
          <Layers className="h-4 w-4 text-nexus-accent" /> Primary Hypotheses Matrix ({hypotheses.length})
        </h3>

        {hypotheses.length === 0 ? (
          <p className="text-xs text-nexus-400 italic">No hypotheses evaluated yet.</p>
        ) : (
          <div className="space-y-3">
            {hypotheses.map((hyp) => {
              const isSupported = hyp.status === "supported";
              const isRefuted = hyp.status === "refuted";

              return (
                <div
                  key={hyp.id}
                  className="p-3.5 rounded-lg bg-nexus-950/70 border border-nexus-border/80 flex flex-col gap-2 hover:border-nexus-border transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-xs font-medium text-nexus-200 flex-1">{hyp.statement}</p>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 ${
                        isSupported
                          ? "bg-emerald-500/20 text-nexus-emerald border border-nexus-emerald/30"
                          : isRefuted
                          ? "bg-rose-500/20 text-nexus-rose border border-nexus-rose/30"
                          : "bg-amber-500/20 text-nexus-amber border border-nexus-amber/30"
                      }`}
                    >
                      {isSupported ? <CheckCircle2 className="h-3 w-3" /> : isRefuted ? <AlertTriangle className="h-3 w-3" /> : <HelpCircle className="h-3 w-3" />}
                      {hyp.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-nexus-400 pt-2 border-t border-nexus-border/50">
                    <span>Confidence: <strong className="text-nexus-accent font-mono">{(hyp.confidence * 100).toFixed(1)}%</strong></span>
                    <span>Supporting Evidences: <strong className="text-nexus-200">{hyp.supportingEvidenceIds.length}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
