"use client";

import { useState } from "react";
import { QualityScoreWidget } from "./quality-score-widget";
import { TraceWaterfallViewer } from "./trace-waterfall-viewer";
import { GuardrailViolationsPanel } from "./guardrail-violations-panel";
import { CostAnalyticsView } from "./cost-analytics-view";
import { PromptRegistryView } from "./prompt-registry-view";
import { useEvaluation } from "@/hooks/use-evaluation";
import { ShieldCheck, Activity, Layers, DollarSign, Sliders, Play, Sparkles, Clock, AlertTriangle } from "lucide-react";

export function OperationsDashboard() {
  const { runEvaluation, isRunning, evalResult } = useEvaluation();
  const [activeTab, setActiveTab] = useState<"traces" | "guardrails" | "costs" | "prompts">("traces");

  const handleRunEval = async () => {
    await runEvaluation();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2 tracking-tight">
            <ShieldCheck className="h-5 w-5 text-cyan-400" /> Enterprise AI Operations Center & Quality Platform
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry, distributed tracing, automated evaluation engines, PII/prompt guardrails, cost tracking & prompt registry.
          </p>
        </div>

        <button
          onClick={handleRunEval}
          disabled={isRunning}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center gap-2 shadow-glow transition-all disabled:opacity-50"
        >
          {isRunning ? <Activity className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {isRunning ? "Running Suite..." : "Run Full AI Evaluation Suite"}
        </button>
      </div>

      {/* Quality Score Metrics Banner */}
      <QualityScoreWidget />

      {/* Evaluation Results Banner (If Executed) */}
      {evalResult && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-cyan-500/30 glass-panel shadow-glow flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-cyan-400 shrink-0" />
            <div>
              <span className="font-bold text-slate-100 block">Evaluation Suite Completed Successfully</span>
              <span className="text-slate-400">
                MRR: <strong className="text-cyan-400">{evalResult.retrievalMetrics.mrr}</strong> | NDCG:{" "}
                <strong className="text-blue-400">{evalResult.retrievalMetrics.ndcg}</strong> | Citation Coverage:{" "}
                <strong className="text-emerald-400">{(evalResult.citationCoverage * 100).toFixed(1)}%</strong>
              </span>
            </div>
          </div>
          <div className="text-right font-mono text-cyan-400 font-extrabold text-base">
            {(evalResult.evaluationRun.overallScore * 100).toFixed(1)}% Overall
          </div>
        </div>
      )}

      {/* Main Tabbed Operations Interface */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("traces")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "traces"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="h-4 w-4" /> Distributed Tracing Waterfall
          </button>

          <button
            onClick={() => setActiveTab("guardrails")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "guardrails"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <AlertTriangle className="h-4 w-4" /> Guardrails & Violations
          </button>

          <button
            onClick={() => setActiveTab("costs")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "costs"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <DollarSign className="h-4 w-4" /> Token & Cost Analytics
          </button>

          <button
            onClick={() => setActiveTab("prompts")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "prompts"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sliders className="h-4 w-4" /> Prompt Registry & A/B
          </button>
        </div>

        {/* Tab Content Views */}
        {activeTab === "traces" && <TraceWaterfallViewer />}
        {activeTab === "guardrails" && <GuardrailViolationsPanel />}
        {activeTab === "costs" && <CostAnalyticsView />}
        {activeTab === "prompts" && <PromptRegistryView />}
      </div>
    </div>
  );
}
