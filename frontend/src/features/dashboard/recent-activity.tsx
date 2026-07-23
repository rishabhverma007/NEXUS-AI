"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, FileText, GitFork, BrainCircuit, Sparkles } from "lucide-react";

const activities = [
  {
    id: "act_1",
    title: "NEXUS AI Master Architecture Blueprint",
    type: "Markdown Spec Ingestion",
    status: "Indexed (HNSW)",
    chunks: "12 Chunks",
    time: "10 minutes ago",
    icon: FileText,
    color: "text-nexus-accent",
    bg: "bg-nexus-accent/10",
    border: "border-nexus-accent/20",
  },
  {
    id: "act_2",
    title: "Multi-Agent System Sub-Graph",
    type: "GraphRAG Traversal",
    status: "Verified (0.96 Acc)",
    chunks: "4 Nodes / 3 Edges",
    time: "25 minutes ago",
    icon: GitFork,
    color: "text-nexus-brand-light",
    bg: "bg-nexus-brand/10",
    border: "border-nexus-brand/20",
  },
  {
    id: "act_3",
    title: "User Preferred Architecture Parameters",
    type: "Long-Term Memory",
    status: "Stored in Vector",
    chunks: "Episodic Entry",
    time: "1 hour ago",
    icon: BrainCircuit,
    color: "text-nexus-emerald",
    bg: "bg-nexus-emerald/10",
    border: "border-nexus-emerald/20",
  },
];

export function RecentActivityTable() {
  return (
    <div className="nexus-glass-elevated rounded-3xl border border-nexus-border p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-nexus-amber/10 border border-nexus-amber/20">
            <Clock className="h-4 w-4 text-nexus-amber" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-nexus-50">Recent Knowledge Activity</h3>
            <p className="text-[10px] text-nexus-400 font-mono">Live System Log</p>
          </div>
        </div>
        <Sparkles className="h-4 w-4 text-nexus-500" />
      </div>

      {/* Activity Feed */}
      <div className="space-y-3">
        {activities.map((act, idx) => {
          const Icon = act.icon;
          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-4 rounded-2xl ${act.bg} ${act.border} border flex items-center justify-between gap-4
              hover:shadow-nexus-sm transition-all duration-200`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`p-2.5 rounded-xl ${act.bg} ${act.border} border ${act.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-nexus-50 truncate">{act.title}</div>
                  <div className="text-xs text-nexus-400 font-mono flex items-center gap-2 mt-0.5">
                    <span>{act.type}</span>
                    <span className="text-nexus-600">•</span>
                    <span>{act.chunks}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-[10px] text-nexus-500">{act.time}</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-nexus-emerald/10 border border-nexus-emerald/25 text-[10px] font-bold text-nexus-emerald whitespace-nowrap">
                  <CheckCircle2 className="h-3 w-3" />
                  {act.status}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
