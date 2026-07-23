"use client";

import { useState } from "react";
import { VisualWorkflowBuilder } from "./visual-workflow-builder";
import { PromptPlayground } from "./prompt-playground";
import { AgentDesignerVIew } from "./agent-designer-view";
import { ToolBuilderView } from "./tool-builder-view";
import { KnowledgeExplorerView } from "./knowledge-explorer-view";
import { DeploymentCenterView } from "./deployment-center-view";
import { Sparkles, GitFork, Sliders, Bot, Wrench, Database, Rocket, FolderGit2 } from "lucide-react";

export function AIStudioDashboard() {
  const [activeTab, setActiveTab] = useState<"builder" | "prompt" | "agent" | "tool" | "knowledge" | "deployment">("builder");

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2 tracking-tight">
            <Sparkles className="h-5 w-5 text-cyan-400" /> Enterprise AI Studio & Visual Workflow Builder
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Low-code AI application development workspace. Visually build, test, and deploy AI workflows executing through the unified AIRuntimeSDK.
          </p>
        </div>
      </div>

      {/* Main Tabbed Studio Navigation */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("builder")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "builder"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <GitFork className="h-4 w-4" /> Visual Workflow Builder
          </button>

          <button
            onClick={() => setActiveTab("prompt")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "prompt"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sliders className="h-4 w-4" /> Prompt Studio
          </button>

          <button
            onClick={() => setActiveTab("agent")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "agent"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Bot className="h-4 w-4" /> Agent Designer
          </button>

          <button
            onClick={() => setActiveTab("tool")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "tool"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Wrench className="h-4 w-4" /> Tool Builder
          </button>

          <button
            onClick={() => setActiveTab("knowledge")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "knowledge"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Database className="h-4 w-4" /> Knowledge Explorer
          </button>

          <button
            onClick={() => setActiveTab("deployment")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "deployment"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Rocket className="h-4 w-4" /> Deployment Center
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === "builder" && <VisualWorkflowBuilder />}
        {activeTab === "prompt" && <PromptPlayground />}
        {activeTab === "agent" && <AgentDesignerVIew />}
        {activeTab === "tool" && <ToolBuilderView />}
        {activeTab === "knowledge" && <KnowledgeExplorerView />}
        {activeTab === "deployment" && <DeploymentCenterView />}
      </div>
    </div>
  );
}
