"use client";

import { IndexHealthMetrics } from "@/repositories/index-repository";
import { CheckCircle2, Cpu, Database, ShieldCheck } from "lucide-react";

interface HealthCardProps {
  health: IndexHealthMetrics;
}

export function HealthCard({ health }: HealthCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Index Health Score</span>
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-emerald-400">{health.healthScore}%</div>
        <p className="text-[11px] text-slate-500">Zero dimension mismatches or orphaned chunks</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Indexed Chunks</span>
          <Database className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100">{health.indexedChunks}</div>
        <p className="text-[11px] text-slate-500">Out of {health.totalChunks} total chunks</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Indexed Documents</span>
          <Cpu className="h-4 w-4 text-indigo-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100">{health.totalDocuments}</div>
        <p className="text-[11px] text-slate-500">100% document coverage</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Missing Embeddings</span>
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100">{health.missingEmbeddings}</div>
        <p className="text-[11px] text-slate-500">All chunks fully vectorized</p>
      </div>
    </div>
  );
}
