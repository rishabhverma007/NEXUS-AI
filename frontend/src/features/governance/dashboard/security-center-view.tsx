"use client";

import { useSecurity } from "@/hooks/use-security";
import { ShieldCheck, KeyRound, Globe, Lock, AlertTriangle, CheckCircle2 } from "lucide-react";

export function SecurityCenterView() {
  const { events, isLoading } = useSecurity();

  if (isLoading) {
    return (
      <div className="p-6 text-center border border-slate-800 rounded-xl bg-slate-900/60 animate-pulse">
        <ShieldCheck className="h-6 w-6 text-slate-400 mx-auto mb-2" />
        <span className="text-xs text-slate-400">Loading security controls...</span>
      </div>
    );
  }

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "high":
      case "critical":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {sev.toUpperCase()}</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {sev.toUpperCase()}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel space-y-1">
          <span className="text-xs text-slate-400 block">Encryption Status</span>
          <span className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
            <Lock className="h-4 w-4" /> AES-256 GCM (Enforced)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel space-y-1">
          <span className="text-xs text-slate-400 block">Key Rotation Schedule</span>
          <span className="text-base font-bold text-cyan-400 flex items-center gap-1.5">
            <KeyRound className="h-4 w-4" /> 90-Day Auto Rotate
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel space-y-1">
          <span className="text-xs text-slate-400 block">IP / Geo Restrictions</span>
          <span className="text-base font-bold text-indigo-400 flex items-center gap-1.5">
            <Globe className="h-4 w-4" /> Zero Trust Allowlist
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel space-y-1">
          <span className="text-xs text-slate-400 block">MFA Enforcement</span>
          <span className="text-base font-bold text-purple-400 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> 100% Admin Users
          </span>
        </div>
      </div>

      {/* Security Events Audit Log */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-cyan-400" /> Security Audit Event Stream ({events.length})
        </h3>

        <div className="space-y-3">
          {events.map((sec) => (
            <div key={sec.id} className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getSeverityBadge(sec.severity)}
                  <span className="font-bold text-slate-200 font-mono">{sec.eventType}</span>
                </div>
                <span className="text-[10px] text-slate-400">{new Date(sec.createdAt).toLocaleTimeString()}</span>
              </div>
              <p className="text-slate-300">{sec.details}</p>
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-4 pt-1 border-t border-slate-800/50">
                <span>IP: <strong className="text-cyan-400">{sec.ipAddress || "N/A"}</strong></span>
                <span>Country: <strong className="text-indigo-400">{sec.country || "N/A"}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
