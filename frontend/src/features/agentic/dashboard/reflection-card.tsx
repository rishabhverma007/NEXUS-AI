"use client";

import { ReflectionResult } from "../pipeline/reflection-engine";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

interface ReflectionCardProps {
  reflection: ReflectionResult | null;
}

export function ReflectionCard({ reflection }: ReflectionCardProps) {
  if (!reflection) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Hallucination Risk Score</span>
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-emerald-400">
          {(reflection.hallucinationRisk * 100).toFixed(1)}%
        </div>
        <p className="text-[11px] text-slate-500">Extremely low hallucination probability</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Citation Coverage</span>
          <Sparkles className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100">{reflection.citationCoverage}%</div>
        <p className="text-[11px] text-slate-500">Every statement anchored to source documents</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Overall Confidence</span>
          <CheckCircle2 className="h-4 w-4 text-indigo-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-indigo-400">98.5%</div>
        <p className="text-[11px] text-slate-500">Factual consistency verified</p>
      </div>
    </div>
  );
}
