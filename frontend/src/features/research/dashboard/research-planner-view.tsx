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
      <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/40">
        <Brain className="h-10 w-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-sm font-medium text-slate-300">No Active Research Selected</h3>
        <p className="text-xs text-slate-400 mt-1">Select an existing session from the list or launch a new deep research run.</p>
      </div>
    );
  }

  const getStatusBadge = (status: ResearchSession["status"]) => {
    switch (status) {
      case "completed":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Completed</span>;
      case "executing":
      case "planning":
      case "synthesizing":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1 animate-pulse"><Activity className="h-3 w-3" /> {status.toUpperCase()}</span>;
      case "failed":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Failed</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300">{status.toUpperCase()}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Execution Live Progress Bar */}
      {isExecuting && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-cyan-500/30 glass-panel shadow-glow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-semibold text-cyan-300">Deep Research Pipeline Running</span>
            </div>
            <span className="text-xs font-mono text-cyan-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] font-mono text-slate-300 mt-2 truncate">{executionMessage || "Processing multi-stage research tasks..."}</p>
        </div>
      )}

      {/* Session Metadata Header */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 text-[10px] font-bold border border-blue-500/30 uppercase tracking-wider">
                {session.depthLevel} Mode
              </span>
              {getStatusBadge(session.status)}
            </div>
            <h2 className="text-lg font-bold text-slate-100">{session.title}</h2>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Factual Confidence</span>
            <span className="text-xl font-extrabold text-cyan-400">{(session.confidenceScore * 100).toFixed(1)}%</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs text-slate-300">
          <span className="font-semibold text-slate-400 block mb-1 flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-cyan-400" /> Research Objective
          </span>
          {session.objective}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-800/60 text-xs">
          <div>
            <span className="text-slate-400 block">Iterations Completed</span>
            <span className="font-semibold text-slate-200">{session.currentIteration} / {session.maxIterations}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Workspace ID</span>
            <span className="font-mono text-slate-300 truncate block">{session.workspaceId}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Last Updated</span>
            <span className="font-semibold text-slate-200">{new Date(session.updatedAt).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Primary Hypotheses Resolution Matrix */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" /> Primary Hypotheses Matrix ({hypotheses.length})
        </h3>

        {hypotheses.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No hypotheses evaluated yet.</p>
        ) : (
          <div className="space-y-3">
            {hypotheses.map((hyp) => {
              const isSupported = hyp.status === "supported";
              const isRefuted = hyp.status === "refuted";

              return (
                <div
                  key={hyp.id}
                  className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex flex-col gap-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-xs font-medium text-slate-200 flex-1">{hyp.statement}</p>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 ${
                        isSupported
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : isRefuted
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {isSupported ? <CheckCircle2 className="h-3 w-3" /> : isRefuted ? <AlertTriangle className="h-3 w-3" /> : <HelpCircle className="h-3 w-3" />}
                      {hyp.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/50">
                    <span>Confidence: <strong className="text-cyan-400 font-mono">{(hyp.confidence * 100).toFixed(1)}%</strong></span>
                    <span>Supporting Evidences: <strong className="text-slate-200">{hyp.supportingEvidenceIds.length}</strong></span>
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
