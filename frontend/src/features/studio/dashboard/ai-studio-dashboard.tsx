"use client";

import { useState } from "react";
import { VisualWorkflowBuilder } from "./visual-workflow-builder";
import { PromptPlayground } from "./prompt-playground";
import { AgentDesignerVIew } from "./agent-designer-view";
import { ToolBuilderView } from "./tool-builder-view";
import { KnowledgeExplorerView } from "./knowledge-explorer-view";
import { DeploymentCenterView } from "./deployment-center-view";
import { Sparkles, GitFork, Sliders, Bot, Wrench, Database, Rocket } from "lucide-react";
import { TabButton } from "@/components/ui/tab-button";

export function AIStudioDashboard() {
  const [activeTab, setActiveTab] = useState<"builder" | "prompt" | "agent" | "tool" | "knowledge" | "deployment">("builder");

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between px-8 pt-8">
        <div>
          <h1 className="text-xl font-bold text-nexus-50 flex items-center gap-2 tracking-tight">
            <Sparkles className="h-5 w-5 text-nexus-accent" /> Enterprise AI Studio & Visual Workflow Builder
          </h1>
          <p className="text-sm text-nexus-400 mt-1">
            Low-code AI application development workspace. Visually build, test, and deploy AI workflows executing through the unified AIRuntimeSDK.
          </p>
        </div>
      </div>

      {/* Main Tabbed Studio Navigation */}
      <div className="px-8 space-y-4">
        <div className="flex items-center gap-1.5 border-b border-nexus-border pb-2 overflow-x-auto">
          <TabButton active={activeTab === "builder"} onClick={() => setActiveTab("builder")} icon={GitFork} label="Visual Workflow Builder" />
          <TabButton active={activeTab === "prompt"} onClick={() => setActiveTab("prompt")} icon={Sliders} label="Prompt Studio" />
          <TabButton active={activeTab === "agent"} onClick={() => setActiveTab("agent")} icon={Bot} label="Agent Designer" />
          <TabButton active={activeTab === "tool"} onClick={() => setActiveTab("tool")} icon={Wrench} label="Tool Builder" />
          <TabButton active={activeTab === "knowledge"} onClick={() => setActiveTab("knowledge")} icon={Database} label="Knowledge Explorer" />
          <TabButton active={activeTab === "deployment"} onClick={() => setActiveTab("deployment")} icon={Rocket} label="Deployment Center" />
        </div>

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


