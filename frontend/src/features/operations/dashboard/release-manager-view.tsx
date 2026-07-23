"use client";

import { useDeployments } from "@/hooks/use-deployments";
import { Rocket, CheckCircle2, RotateCcw, GitCommit } from "lucide-react";

export function ReleaseManagerView() {
  const { releases, isLoading } = useDeployments();

  if (isLoading) {
    return (
      <div className="p-6 text-center border border-slate-800 rounded-xl bg-slate-900/60 animate-pulse">
        <Rocket className="h-6 w-6 text-slate-400 mx-auto mb-2" />
        <span className="text-xs text-slate-400">Loading release pipeline history...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Rocket className="h-4 w-4 text-cyan-400" /> CI/CD Deployment Pipeline & Release History
        </h3>
        <span className="text-xs text-slate-400 font-mono">Current Live Tag: v1.16.0</span>
      </div>

      <div className="space-y-3">
        {releases.map((rel) => (
          <div
            key={rel.id}
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-slate-700 transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 uppercase flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {rel.status.toUpperCase()}
                </span>
                <span className="font-mono text-cyan-400 font-bold">{rel.releaseTag}</span>
              </div>
              <h4 className="font-bold text-slate-100 flex items-center gap-1.5">
                <GitCommit className="h-3.5 w-3.5 text-slate-400" /> Commit SHA: {rel.commitSha}
              </h4>
              <p className="text-slate-400 text-[11px]">Deployed by: {rel.deployedBy} | {new Date(rel.deployedAt).toLocaleString()}</p>
            </div>

            <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 shrink-0">
              <RotateCcw className="h-3.5 w-3.5" /> Rollback Release
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
