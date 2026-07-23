"use client";

import { usePolicies } from "@/hooks/use-policies";
import { Sliders, ShieldCheck, CheckCircle2, Lock, Plus } from "lucide-react";

export function PolicyCenterView() {
  const { policies, isLoading } = usePolicies();

  if (isLoading) {
    return (
      <div className="p-6 text-center border border-nexus-border rounded-xl bg-nexus-850/60 animate-pulse">
        <Sliders className="h-6 w-6 text-nexus-400 mx-auto mb-2" />
        <span className="text-xs text-nexus-400">Loading governance policies...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-nexus-200 flex items-center gap-2">
          <Sliders className="h-4 w-4 text-nexus-accent" /> Active Governance Policies ({policies.length})
        </h3>
        <span className="text-xs text-nexus-400">Automated Policy Enforcement Plane</span>
      </div>

      <div className="space-y-3">
        {policies.map((pol) => (
          <div
            key={pol.id}
            className="p-4 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass flex flex-col gap-3 hover:border-nexus-border transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-nexus-accent/20 text-nexus-accent text-[10px] font-bold border border-nexus-accent/30 uppercase">
                    {pol.policyType} POLICY
                  </span>
                  {pol.isEnforced && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-nexus-emerald text-[10px] font-bold border border-nexus-emerald/30 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> ENFORCED
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-nexus-50">{pol.name}</h4>
                <p className="text-xs text-nexus-300 mt-1">{pol.description}</p>
              </div>

              {pol.approvalRequired && (
                <span className="px-2.5 py-1 rounded bg-amber-500/20 text-nexus-amber text-[11px] font-semibold border border-nexus-amber/30 flex items-center gap-1 shrink-0">
                  <Lock className="h-3 w-3" /> Requires Approval
                </span>
              )}
            </div>

            {pol.rules && Object.keys(pol.rules).length > 0 && (
              <div className="p-2.5 rounded bg-nexus-950/70 border border-nexus-border/80 text-[11px] font-mono text-nexus-300 flex items-center gap-4">
                {Object.entries(pol.rules).map(([k, v]) => (
                  <span key={k}>
                    {k}: <strong className="text-nexus-accent">{JSON.stringify(v)}</strong>
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
