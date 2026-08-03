"use client";

import { Wrench, Code, Database, Globe, CheckCircle2 } from "lucide-react";

export function ToolBuilderView() {
  const tools = [
    { name: "REST Web Search API Connector", category: "rest", endpoint: "https://api.search.internal/v1", status: "verified" },
    { name: "PostgreSQL Analytics Connector", category: "sql", endpoint: "postgresql://cluster-prod:5432/analytics", status: "verified" },
    { name: "Python Data Processing Sandbox", category: "python", endpoint: "sandbox://python-worker-01", status: "verified" },
    { name: "Model Context Protocol (MCP) Server", category: "mcp", endpoint: "mcp://localhost:8000/mcp", status: "verified" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Wrench className="h-4 w-4 text-cyan-400" /> Custom Tool & MCP Connector Builder
        </h3>
        <span className="text-xs text-slate-400">Low-Code Integration Runtime</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((t, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30 uppercase">
                {t.category} TOOL
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[10px]">
                <CheckCircle2 className="h-3 w-3" /> VERIFIED
              </span>
            </div>

            <h4 className="font-bold text-slate-100">{t.name}</h4>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-400 truncate">
              {t.endpoint}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
