"use client";

import { useState } from "react";
import { useTools } from "@/hooks/use-tools";
import { ToolHealthMetrics } from "./tool-health-metrics";
import { ToolMarketplace } from "./tool-marketplace";
import { MCPManager } from "./mcp-manager";
import { Cpu, Store, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ToolDashboard() {
  const { tools } = useTools();
  const [activeTab, setActiveTab] = useState<"marketplace" | "mcp">("marketplace");

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-50 tracking-tight flex items-center gap-2">
            <Wrench className="h-6 w-6 text-nexus-accent" />
            Enterprise Tool Ecosystem & MCP Runtime
          </h1>
          <p className="text-sm text-nexus-400 mt-1">
            Universal execution sandbox, tool permissions, rate limiting, and Model Context Protocol (MCP) server runtime.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={activeTab === "marketplace" ? "primary" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setActiveTab("marketplace")}
          >
            <Store className="h-4 w-4" />
            <span>Tool Marketplace</span>
          </Button>
          <Button
            variant={activeTab === "mcp" ? "primary" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setActiveTab("mcp")}
          >
            <Cpu className="h-4 w-4" />
            <span>MCP Servers</span>
          </Button>
        </div>
      </div>

      <ToolHealthMetrics />

      {activeTab === "marketplace" ? <ToolMarketplace tools={tools} /> : <MCPManager />}
    </div>
  );
}
