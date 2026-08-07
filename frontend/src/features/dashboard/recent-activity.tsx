"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, FileText, GitFork, Layers } from "lucide-react";
import { fetchStats } from "@/lib/api";
import type { Stats } from "@/types/nexus";

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const minutes = Math.max(0, Math.floor((Date.now() - then) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

const TYPE_META = {
  document: { label: "Document Ingestion", icon: FileText, color: "text-cyan-400" },
  thread: { label: "Agent Conversation", icon: GitFork, color: "text-indigo-400" },
  memory: { label: "Long-Term Memory", icon: Layers, color: "text-violet-400" },
} as const;

export function RecentActivityTable() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchStats()
      .then((s) => {
        if (!cancelled) setStats(s);
      })
      .catch(() => {
        // Backend unavailable — show nothing.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const activities = stats?.recent_activity ?? [];

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <Clock className="h-4 w-4 text-cyan-400" />
          Recent Knowledge Activity
        </h3>
        <span className="text-[10px] font-mono text-slate-400">Live System Log</span>
      </div>

      {activities.length === 0 ? (
        <p className="text-xs text-slate-500 py-6 text-center">
          No activity yet — ingest a document or start a conversation to populate the feed.
        </p>
      ) : (
        <div className="space-y-3">
          {activities.map((act, i) => {
            const meta = TYPE_META[act.type] ?? TYPE_META.thread;
            const Icon = meta.icon;
            // Thread rows carry the model name in `status` — render it as a
            // neutral detail instead of a green "verified"-style chip.
            const status = act.type === "thread" ? "Completed" : act.status;
            return (
              <div
                key={`${act.type}-${i}`}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="font-semibold text-slate-200 truncate">{act.title}</div>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                    <Icon className={`h-3 w-3 ${meta.color}`} />
                    <span>{meta.label}</span>
                    <span>•</span>
                    <span>{act.detail}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-slate-500">{timeAgo(act.timestamp)}</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
