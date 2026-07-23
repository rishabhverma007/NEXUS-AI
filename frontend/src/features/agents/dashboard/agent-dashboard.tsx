"use client";

import { useState } from "react";
import { useAgents } from "@/hooks/use-agents";
import { AgentHealthMetrics } from "./agent-health-metrics";
import { AgentGrid } from "./agent-grid";
import { AgentInspector } from "./agent-inspector";
import { AgentDescriptor } from "../registry/agent-registry";
import { Bot, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AgentDashboard() {
  const { agents } = useAgents();
  const [selectedAgent, setSelectedAgent] = useState<AgentDescriptor | null>(null);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-50 tracking-tight flex items-center gap-2">
            <Bot className="h-6 w-6 text-nexus-accent" />
            Enterprise Multi-Agent Collaboration Runtime
          </h1>
          <p className="text-sm text-nexus-400 mt-1">
            11 Specialized Agents collaborating through shared Runtime SDK (Retrieval, Memory, GraphRAG, Tools).
          </p>
        </div>

        <Button variant="primary" size="sm" className="gap-2">
          <Play className="h-4 w-4" />
          <span>Execute Multi-Agent Workflow</span>
        </Button>
      </div>

      <AgentHealthMetrics />

      <div className="flex gap-6">
        <div className="flex-1">
          <AgentGrid
            agents={agents}
            selectedAgent={selectedAgent}
            onSelectAgent={setSelectedAgent}
          />
        </div>

        {selectedAgent && (
          <AgentInspector agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
        )}
      </div>
    </div>
  );
}
