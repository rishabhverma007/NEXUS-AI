"use client";

import { usePolicies } from "@/hooks/use-policies";
import { Sliders, ShieldCheck, CheckCircle2, Lock, Plus } from "lucide-react";

export function PolicyCenterView() {
  const { policies, isLoading } = usePolicies();

  if (isLoading) {
    return (
      <div className="p-6 text-center border border-slate-800 rounded-xl bg-slate-900/60 animate-pulse">
        <Sliders className="h-6 w-6 text-slate-400 mx-auto mb-2" />
        <span className="text-xs text-slate-400">Loading governance policies...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Sliders className="h-4 w-4 text-cyan-400" /> Active Governance Policies ({policies.length})
        </h3>
        <span className="text-xs text-slate-400">Automated Policy Enforcement Plane</span>
      </div>

      <div className="space-y-3">
        {policies.map((pol) => (
          <div
            key={pol.id}
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel flex flex-col gap-3 hover:border-slate-700 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 text-[10px] font-bold border border-blue-500/30 uppercase">
                    {pol.policyType} POLICY
                  </span>
                  {pol.isEnforced && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> ENFORCED
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-100">{pol.name}</h4>
                <p className="text-xs text-slate-300 mt-1">{pol.description}</p>
              </div>

              {pol.approvalRequired && (
                <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 text-[11px] font-semibold border border-amber-500/30 flex items-center gap-1 shrink-0">
                  <Lock className="h-3 w-3" /> Requires Approval
                </span>
              )}
            </div>

            {pol.rules && Object.keys(pol.rules).length > 0 && (
              <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800/80 text-[11px] font-mono text-slate-300 flex items-center gap-4">
                {Object.entries(pol.rules).map(([k, v]) => (
                  <span key={k}>
                    {k}: <strong className="text-cyan-400">{JSON.stringify(v)}</strong>
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
