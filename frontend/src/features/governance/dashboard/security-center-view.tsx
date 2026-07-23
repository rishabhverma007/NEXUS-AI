"use client";

import { useSecurity } from "@/hooks/use-security";
import { ShieldCheck, KeyRound, Globe, Lock, AlertTriangle, CheckCircle2 } from "lucide-react";

export function SecurityCenterView() {
  const { events, isLoading } = useSecurity();

  if (isLoading) {
    return (
      <div className="p-6 text-center border border-nexus-border rounded-xl bg-nexus-850/60 animate-pulse">
        <ShieldCheck className="h-6 w-6 text-nexus-400 mx-auto mb-2" />
        <span className="text-xs text-nexus-400">Loading security controls...</span>
      </div>
    );
  }

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "high":
      case "critical":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-nexus-rose border border-nexus-rose/30 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {sev.toUpperCase()}</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-nexus-accent/20 text-nexus-accent border border-nexus-accent/30 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {sev.toUpperCase()}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass space-y-1">
          <span className="text-xs text-nexus-400 block">Encryption Status</span>
          <span className="text-base font-bold text-nexus-emerald flex items-center gap-1.5">
            <Lock className="h-4 w-4" /> AES-256 GCM (Enforced)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass space-y-1">
          <span className="text-xs text-nexus-400 block">Key Rotation Schedule</span>
          <span className="text-base font-bold text-nexus-accent flex items-center gap-1.5">
            <KeyRound className="h-4 w-4" /> 90-Day Auto Rotate
          </span>
        </div>

        <div className="p-4 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass space-y-1">
          <span className="text-xs text-nexus-400 block">IP / Geo Restrictions</span>
          <span className="text-base font-bold text-nexus-brand-light flex items-center gap-1.5">
            <Globe className="h-4 w-4" /> Zero Trust Allowlist
          </span>
        </div>

        <div className="p-4 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass space-y-1">
          <span className="text-xs text-nexus-400 block">MFA Enforcement</span>
          <span className="text-base font-bold text-purple-400 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> 100% Admin Users
          </span>
        </div>
      </div>

      {/* Security Events Audit Log */}
      <div className="p-5 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass space-y-4">
        <h3 className="text-sm font-semibold text-nexus-200 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-nexus-accent" /> Security Audit Event Stream ({events.length})
        </h3>

        <div className="space-y-3">
          {events.map((sec) => (
            <div key={sec.id} className="p-3.5 rounded-lg bg-nexus-950/70 border border-nexus-border/80 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getSeverityBadge(sec.severity)}
                  <span className="font-bold text-nexus-200 font-mono">{sec.eventType}</span>
                </div>
                <span className="text-[10px] text-nexus-400">{new Date(sec.createdAt).toLocaleTimeString()}</span>
              </div>
              <p className="text-nexus-300">{sec.details}</p>
              <div className="text-[10px] text-nexus-400 font-mono flex items-center gap-4 pt-1 border-t border-nexus-border/50">
                <span>IP: <strong className="text-nexus-accent">{sec.ipAddress || "N/A"}</strong></span>
                <span>Country: <strong className="text-nexus-brand-light">{sec.country || "N/A"}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
