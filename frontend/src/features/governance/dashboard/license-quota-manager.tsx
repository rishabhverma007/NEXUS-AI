"use client";

import { useLicenses } from "@/hooks/use-licenses";
import { Sparkles, Users, Cpu, ShieldCheck, CheckCircle2 } from "lucide-react";

export function LicenseQuotaManager() {
  const { license, quota, isLoading } = useLicenses();

  if (isLoading || !license) {
    return (
      <div className="p-6 text-center border border-nexus-border rounded-xl bg-nexus-850/60 animate-pulse">
        <Sparkles className="h-6 w-6 text-nexus-400 mx-auto mb-2" />
        <span className="text-xs text-nexus-400">Loading license entitlements...</span>
      </div>
    );
  }

  const tokenUsagePct = quota ? Math.min(100, (quota.tokensConsumed / quota.monthlyTokenQuota) * 100) : 15;

  return (
    <div className="space-y-6">
      {/* Top Plan Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-nexus-850 via-nexus-950/50 to-nexus-850 border border-nexus-border nexus-glass space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-nexus-accent text-[10px] font-bold border border-nexus-accent/30 uppercase flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> ACTIVE SUBSCRIPTION
              </span>
            </div>
            <h2 className="text-xl font-bold text-nexus-50 mt-1">{license.planName}</h2>
          </div>

          <div className="text-right">
            <span className="text-xs text-nexus-400 block">Seat Utilization</span>
            <span className="text-xl font-extrabold text-nexus-accent">{license.seatsUsed} / {license.seatsAllocated} Seats</span>
          </div>
        </div>

        {/* Feature Entitlements Badges */}
        <div className="space-y-2 pt-2 border-t border-nexus-border/60 text-xs">
          <span className="text-nexus-400 font-semibold">Active Enterprise Entitlements:</span>
          <div className="flex flex-wrap gap-2">
            {license.features.map((feat) => (
              <span key={feat} className="px-2.5 py-1 rounded bg-nexus-950/80 border border-nexus-border text-nexus-200 text-[11px] font-mono flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-nexus-emerald" /> {feat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quota Analytics Cards */}
      {quota && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-nexus-200 flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-nexus-accent" /> Monthly Token Quota
              </span>
              <span className="font-mono text-nexus-accent">{tokenUsagePct.toFixed(1)}% Used</span>
            </div>

            <div className="w-full h-2 rounded-full bg-nexus-950 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-nexus-accent to-nexus-accent rounded-full transition-all duration-300"
                style={{ width: `${tokenUsagePct}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] font-mono text-nexus-400">
              <span>Consumed: {quota.tokensConsumed.toLocaleString()}</span>
              <span>Quota: {quota.monthlyTokenQuota.toLocaleString()}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-nexus-200 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-nexus-brand-light" /> Monthly Deep Research Quota
              </span>
              <span className="font-mono text-nexus-brand-light">{((quota.researchesExecuted / quota.monthlyResearchQuota) * 100).toFixed(1)}% Used</span>
            </div>

            <div className="w-full h-2 rounded-full bg-nexus-950 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${(quota.researchesExecuted / quota.monthlyResearchQuota) * 100}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] font-mono text-nexus-400">
              <span>Executed: {quota.researchesExecuted}</span>
              <span>Quota: {quota.monthlyResearchQuota} Runs</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
