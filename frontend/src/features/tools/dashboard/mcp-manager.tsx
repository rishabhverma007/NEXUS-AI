"use client";

import { useEffect, useState } from "react";
import { mcpRuntime, MCPServerInfo } from "@/runtime/mcp/mcp-client";
import { Cpu, Plus, Radio, Server, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function MCPManager() {
  const [servers, setServers] = useState<MCPServerInfo[]>([]);

  useEffect(() => {
    async function loadServers() {
      const active = await mcpRuntime.listServers();
      setServers(active);
    }
    loadServers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-nexus-50 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-nexus-accent" />
            Model Context Protocol (MCP) Runtime Manager
          </h2>
          <p className="text-xs text-nexus-400">
            Connected MCP servers, JSON-RPC 2.0 SSE/WebSocket transports, and heartbeats.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="gap-2"
          onClick={async () => {
            const newServer = await mcpRuntime.connect("https://mcp.stripe.com/v1", "Stripe MCP Payments");
            setServers((prev) => [...prev, newServer]);
          }}
        >
          <Plus className="h-4 w-4" />
          <span>Connect MCP Server</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {servers.map((srv) => (
          <div
            key={srv.id}
            className="p-5 rounded-2xl bg-nexus-850/60 border border-nexus-border hover:border-nexus-border transition-all space-y-4 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-cyan-500/20 text-nexus-accent border border-nexus-accent/30 flex items-center justify-center">
                  <Server className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-nexus-50 text-sm">{srv.name}</h3>
                  <p className="text-[10px] font-mono text-nexus-500">{srv.serverUrl}</p>
                </div>
              </div>

              <Badge variant="emerald" className="uppercase font-mono text-[10px] flex items-center gap-1">
                <Radio className="h-3 w-3 animate-pulse text-nexus-emerald" />
                {srv.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-nexus-border/80 font-mono text-[11px]">
              <span className="text-nexus-400">Transport: <span className="text-nexus-accent uppercase">{srv.transportType}</span></span>
              <span className="text-nexus-400">Latency: <span className="text-nexus-emerald">{srv.latencyMs} ms</span></span>
              <span className="text-nexus-400">v{srv.version}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
