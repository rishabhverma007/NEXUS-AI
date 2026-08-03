"use client";

import { CheckCircle2, Clock, FileText, GitFork } from "lucide-react";

export function RecentActivityTable() {
  const activities = [
    {
      id: "act_1",
      title: "NEXUS AI Master Architecture Blueprint",
      type: "Markdown Spec Ingestion",
      status: "Indexed (HNSW)",
      chunks: "12 Chunks",
      time: "10 minutes ago"
    },
    {
      id: "act_2",
      title: "Multi-Agent System Sub-Graph",
      type: "GraphRAG Traversal",
      status: "Verified (0.96 Acc)",
      chunks: "4 Nodes / 3 Edges",
      time: "25 minutes ago"
    },
    {
      id: "act_3",
      title: "User Preferred Architecture Parameters",
      type: "Long-Term Memory",
      status: "Stored in Vector",
      chunks: "Episodic Entry",
      time: "1 hour ago"
    }
  ];

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <Clock className="h-4 w-4 text-cyan-400" />
          Recent Knowledge Activity
        </h3>
        <span className="text-[10px] font-mono text-slate-400">Live System Log</span>
      </div>

      <div className="space-y-3">
        {activities.map((act) => (
          <div key={act.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
            <div className="space-y-1">
              <div className="font-semibold text-slate-200">{act.title}</div>
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <span>{act.type}</span>
                <span>•</span>
                <span>{act.chunks}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-500">{act.time}</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {act.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
