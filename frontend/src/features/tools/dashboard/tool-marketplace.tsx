"use client";

import { useState } from "react";
import { ToolItem } from "@/repositories/tool-repository";
import { Cpu, Search, ShieldCheck, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ToolMarketplaceProps {
  tools: ToolItem[];
}

export function ToolMarketplace({ tools }: ToolMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-nexus-500" />
          <Input
            placeholder="Search enterprise tools, MCP servers, SQL connectors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-nexus-850/60 border-nexus-border text-xs"
          />
        </div>

        <span className="text-xs text-nexus-500 font-mono">Showing {filteredTools.length} Tools</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="p-5 rounded-2xl bg-nexus-850/60 border border-nexus-border hover:border-nexus-border transition-all space-y-4 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-indigo-500/20 text-nexus-brand-light border border-nexus-brand-light/30 flex items-center justify-center">
                  <Wrench className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-nexus-50 text-sm">{tool.name}</h3>
                  <p className="text-[10px] font-mono text-nexus-500">v{tool.version}</p>
                </div>
              </div>

              <Badge variant={tool.isMCPTool ? "cyan" : "secondary"} className="uppercase font-mono text-[10px]">
                {tool.category}
              </Badge>
            </div>

            <p className="text-nexus-300 text-xs">{tool.description}</p>

            <div className="flex items-center justify-between pt-3 border-t border-nexus-border/80">
              <Badge variant="emerald" className="uppercase font-mono text-[10px]">
                {tool.healthStatus}
              </Badge>

              <Button variant="outline" size="sm" className="h-7 text-[11px]">
                Configure Permissions
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
