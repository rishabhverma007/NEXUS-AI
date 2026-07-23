"use client";

import { useDeployment } from "@/hooks/use-deployment";
import { Rocket, CheckCircle2, RotateCcw, ShieldCheck, ArrowUpRight } from "lucide-react";

export function DeploymentCenterView() {
  const { deployments, isLoading, deploy } = useDeployment();

  const handlePromote = async (wfId: string, version: string, env: "staging" | "production") => {
    await deploy(wfId, version, env);
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center border border-slate-800 rounded-xl bg-slate-900/60 animate-pulse">
        <Rocket className="h-6 w-6 text-slate-400 mx-auto mb-2" />
        <span className="text-xs text-slate-400">Loading deployment records...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Rocket className="h-4 w-4 text-cyan-400" /> Deployment Center & Environment Promoter
        </h3>
        <span className="text-xs text-slate-400 font-mono">Current Target: PRODUCTION</span>
      </div>

      <div className="space-y-3">
        {deployments.map((d) => (
          <div
            key={d.id}
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-slate-700 transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 uppercase flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {d.targetEnvironment.toUpperCase()}
                </span>
                <span className="font-mono text-cyan-400 font-bold">{d.versionTag}</span>
              </div>
              <h4 className="font-bold text-slate-100">Workflow ID: {d.workflowId}</h4>
              <p className="text-slate-400 text-[11px]">Deployed by: {d.deployedBy} | {new Date(d.deployedAt).toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePromote(d.workflowId, d.versionTag, "production")}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-glow"
              >
                <ArrowUpRight className="h-3.5 w-3.5" /> Promote to Production
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
