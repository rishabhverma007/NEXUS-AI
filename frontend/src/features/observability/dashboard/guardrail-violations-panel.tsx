"use client";

import { useGuardrails } from "@/hooks/use-guardrails";
import { ShieldAlert, Lock, AlertTriangle, EyeOff, CheckCircle2, ShieldCheck } from "lucide-react";

export function GuardrailViolationsPanel() {
  const { events, isLoading } = useGuardrails();

  if (isLoading) {
    return (
      <div className="p-6 text-center border border-nexus-border rounded-xl bg-nexus-850/60 animate-pulse">
        <ShieldAlert className="h-6 w-6 text-nexus-400 mx-auto mb-2" />
        <span className="text-xs text-nexus-400">Loading guardrail events...</span>
      </div>
    );
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case "blocked":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-nexus-rose border border-nexus-rose/30 flex items-center gap-1"><Lock className="h-3 w-3" /> BLOCKED</span>;
      case "masked":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-nexus-amber border border-nexus-amber/30 flex items-center gap-1"><EyeOff className="h-3 w-3" /> PII MASKED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-nexus-accent/20 text-nexus-accent border border-nexus-accent/30">{action.toUpperCase()}</span>;
    }
  };

  return (
    <div className="p-5 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-nexus-200 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-nexus-accent" /> Guardrails & Policy Violations Log ({events.length})
        </h3>
        <span className="text-xs text-nexus-400">Active Protections: PII, Prompt Injection, Unsafe Tools</span>
      </div>

      <div className="space-y-3">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="p-3.5 rounded-lg bg-nexus-950/70 border border-nexus-border/80 flex flex-col gap-2 hover:border-nexus-border transition-colors text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getActionBadge(ev.actionTaken)}
                <span className="font-mono text-nexus-300 text-[11px]">{ev.matchedRule}</span>
              </div>
              <span className="text-[10px] text-nexus-400">{new Date(ev.createdAt).toLocaleTimeString()}</span>
            </div>

            {ev.inputText && (
              <div className="p-2 rounded bg-nexus-850 border border-nexus-border text-nexus-300 font-mono text-[11px] truncate">
                Raw Input: {ev.inputText}
              </div>
            )}

            {ev.sanitizedText && (
              <div className="p-2 rounded bg-nexus-850/80 border border-nexus-border text-cyan-300 font-mono text-[11px] truncate">
                Sanitized: {ev.sanitizedText}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
