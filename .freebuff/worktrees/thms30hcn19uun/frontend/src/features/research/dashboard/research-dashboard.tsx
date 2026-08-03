"use client";

import { useState } from "react";
import { useResearch } from "@/hooks/use-research";
import { ResearchHealthMetrics } from "./research-health-metrics";
import { ResearchPlannerView } from "./research-planner-view";
import { EvidenceGraph } from "./evidence-graph";
import { ResearchReportViewer } from "./research-report-viewer";
import { Sparkles, Plus, Search, Layers, Shield, FileText, Activity } from "lucide-react";

export function ResearchDashboard() {
  const {
    sessions,
    selectedSession,
    selectedSessionId,
    setSelectedSessionId,
    evidenceList,
    hypotheses,
    report,
    isExecuting,
    executionMessage,
    progressPercent,
    startResearch,
  } = useResearch();

  const [activeTab, setActiveTab] = useState<"planner" | "evidence" | "report">("planner");
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newObjective, setNewObjective] = useState("");
  const [depthLevel, setDepthLevel] = useState<"fast" | "standard" | "deep" | "exhaustive">("standard");

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newObjective) return;
    setShowNewModal(false);
    await startResearch(newTitle, newObjective, depthLevel);
    setNewTitle("");
    setNewObjective("");
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2 tracking-tight">
            <Sparkles className="h-5 w-5 text-cyan-400" /> Enterprise Deep Research Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous multi-phase research orchestrator combining Hybrid Retrieval, GraphRAG, Memory Platform, and Sandboxed Tools.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center gap-2 shadow-glow transition-all"
        >
          <Plus className="h-4 w-4" /> New Deep Research Run
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <ResearchHealthMetrics />

      {/* Main Grid: Sessions List Sidebar + Research Detail Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Research Sessions Selector */}
        <div className="lg:col-span-1 p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 glass-panel space-y-4 h-[600px] flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Research Sessions ({sessions.length})</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {sessions.map((s) => {
              const isSelected = s.id === selectedSessionId;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSessionId(s.id)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                    isSelected
                      ? "bg-blue-600/15 border-blue-500/40 text-slate-100 shadow-glow"
                      : "bg-slate-950/40 border-slate-800/60 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-400">
                      {s.depthLevel}
                    </span>
                    <span className="text-[10px] text-slate-400">{(s.confidenceScore * 100).toFixed(0)}% Conf</span>
                  </div>
                  <h4 className="font-semibold text-slate-200 line-clamp-1">{s.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{s.objective}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Session Workstation Tabs & Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab("planner")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === "planner"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="h-4 w-4" /> Strategy & Hypotheses
            </button>

            <button
              onClick={() => setActiveTab("evidence")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === "evidence"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Shield className="h-4 w-4" /> Evidence Matrix ({evidenceList.length})
            </button>

            <button
              onClick={() => setActiveTab("report")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === "report"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="h-4 w-4" /> Compiled Report
            </button>
          </div>

          {/* Active Tab View */}
          {activeTab === "planner" && (
            <ResearchPlannerView
              session={selectedSession}
              hypotheses={hypotheses}
              isExecuting={isExecuting}
              progressPercent={progressPercent}
              executionMessage={executionMessage}
            />
          )}

          {activeTab === "evidence" && <EvidenceGraph evidenceList={evidenceList} />}

          {activeTab === "report" && <ResearchReportViewer report={report} />}
        </div>
      </div>

      {/* New Research Execution Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-slate-900 border border-slate-800 glass-panel shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" /> Launch New Deep Research Run
              </h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-200 text-xs">
                Cancel
              </button>
            </div>

            <form onSubmit={handleLaunch} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Research Session Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Multi-Modal RAG Subgraph Performance Benchmark 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Core Research Objective</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the research goal, specific queries to answer, or hypotheses to validate..."
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Depth Level</label>
                <select
                  value={depthLevel}
                  onChange={(e: any) => setDepthLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="fast">Fast (2 Iterations, Hybrid Retrieval focus)</option>
                  <option value="standard">Standard (3 Iterations, RAG + GraphRAG)</option>
                  <option value="deep">Deep (4 Iterations, Full Multi-Agent Synthesis)</option>
                  <option value="exhaustive">Exhaustive (5 Iterations, Sandboxed Tools + External)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-medium hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-glow flex items-center gap-2"
                >
                  <Activity className="h-4 w-4" /> Start Deep Research Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
