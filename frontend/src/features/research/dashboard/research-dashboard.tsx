"use client";

import { useState } from "react";
import { useResearch } from "@/hooks/use-research";
import { ResearchHealthMetrics } from "./research-health-metrics";
import { ResearchPlannerView } from "./research-planner-view";
import { EvidenceGraph } from "./evidence-graph";
import { ResearchReportViewer } from "./research-report-viewer";
import { Sparkles, Plus, Search, Layers, Shield, FileText, Activity, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabButton } from "@/components/ui/tab-button";

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
      <div className="flex items-center justify-between px-8 pt-8">
        <div>
          <h1 className="text-xl font-bold text-nexus-50 flex items-center gap-2 tracking-tight">
            <Sparkles className="h-5 w-5 text-nexus-accent" /> Enterprise Deep Research Engine
          </h1>
          <p className="text-sm text-nexus-400 mt-1">
            Autonomous multi-phase research orchestrator combining Hybrid Retrieval, GraphRAG, Memory Platform, and Sandboxed Tools.
          </p>
        </div>

        <Button
          variant="glow"
          size="sm"
          className="gap-2"
          onClick={() => setShowNewModal(true)}
        >
          <Plus className="h-4 w-4" /> New Deep Research Run
        </Button>
      </div>

      {/* Analytics Metric Cards */}
      <div className="px-8">
        <ResearchHealthMetrics />
      </div>

      {/* Main Grid: Sessions List Sidebar + Research Detail Workspace */}
      <div className="px-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Research Sessions Selector */}
        <div className="lg:col-span-1 nexus-glass rounded-2xl border border-nexus-border p-4 space-y-4 h-[600px] flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-nexus-border">
            <h3 className="text-xs font-semibold text-nexus-300 uppercase tracking-wider">Sessions ({sessions.length})</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {sessions.map((s) => {
              const isSelected = s.id === selectedSessionId;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSessionId(s.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                    isSelected
                      ? "bg-nexus-brand/10 border-nexus-brand/20 text-nexus-50"
                      : "bg-nexus-850/40 border-nexus-border text-nexus-400 hover:bg-nexus-850/80 hover:text-nexus-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="nexus-badge-accent text-[10px]">{s.depthLevel}</span>
                    <span className="text-[10px] text-nexus-400">{(s.confidenceScore * 100).toFixed(0)}% Conf</span>
                  </div>
                  <h4 className="font-semibold text-nexus-200 line-clamp-1">{s.title}</h4>
                  <p className="text-[11px] text-nexus-400 line-clamp-2 mt-1">{s.objective}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Session Workstation Tabs & Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-nexus-border pb-2">
            <TabButton active={activeTab === "planner"} onClick={() => setActiveTab("planner")} icon={Layers} label="Strategy & Hypotheses" />
            <TabButton active={activeTab === "evidence"} onClick={() => setActiveTab("evidence")} icon={Shield} label={`Evidence Matrix (${evidenceList.length})`} />
            <TabButton active={activeTab === "report"} onClick={() => setActiveTab("report")} icon={FileText} label="Compiled Report" />
          </div>

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
        <div className="fixed inset-0 z-50 bg-nexus-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg nexus-glass-elevated rounded-2xl border border-nexus-border p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-nexus-border pb-3">
              <h3 className="text-base font-bold text-nexus-50 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-nexus-accent" /> Launch New Deep Research Run
              </h3>
              <button onClick={() => setShowNewModal(false)} className="text-nexus-400 hover:text-nexus-200 text-xs">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleLaunch} className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <label className="text-nexus-300 font-medium text-xs">Research Session Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Multi-Modal RAG Subgraph Performance Benchmark 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="nexus-input"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-nexus-300 font-medium text-xs">Core Research Objective</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the research goal, specific queries to answer, or hypotheses to validate..."
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  className="nexus-input resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-nexus-300 font-medium text-xs">Depth Level</label>
                <select
                  value={depthLevel}
                  onChange={(e: any) => setDepthLevel(e.target.value)}
                  className="nexus-input"
                >
                  <option value="fast">Fast (2 Iterations, Hybrid Retrieval focus)</option>
                  <option value="standard">Standard (3 Iterations, RAG + GraphRAG)</option>
                  <option value="deep">Deep (4 Iterations, Full Multi-Agent Synthesis)</option>
                  <option value="exhaustive">Exhaustive (5 Iterations, Sandboxed Tools + External)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-nexus-border">
                <Button variant="outline" size="sm" onClick={() => setShowNewModal(false)}>
                  Cancel
                </Button>
                <Button variant="glow" size="sm" type="submit" className="gap-2">
                  <Activity className="h-4 w-4" /> Start Deep Research
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


