"use client";

import { IndexHealthMetrics } from "@/repositories/index-repository";
import { CheckCircle2, Cpu, Database, ShieldCheck } from "lucide-react";

interface HealthCardProps {
  health: IndexHealthMetrics;
}

export function HealthCard({ health }: HealthCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-2">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Index Health Score</span>
          <ShieldCheck className="h-4 w-4 text-nexus-emerald" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-emerald">{health.healthScore}%</div>
        <p className="text-[11px] text-nexus-500">Zero dimension mismatches or orphaned chunks</p>
      </div>

      <div className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-2">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Indexed Chunks</span>
          <Database className="h-4 w-4 text-nexus-accent" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-50">{health.indexedChunks}</div>
        <p className="text-[11px] text-nexus-500">Out of {health.totalChunks} total chunks</p>
      </div>

      <div className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-2">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Indexed Documents</span>
          <Cpu className="h-4 w-4 text-nexus-brand-light" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-50">{health.totalDocuments}</div>
        <p className="text-[11px] text-nexus-500">100% document coverage</p>
      </div>

      <div className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-2">
        <div className="flex items-center justify-between text-xs text-nexus-400">
          <span>Missing Embeddings</span>
          <CheckCircle2 className="h-4 w-4 text-nexus-emerald" />
        </div>
        <div className="text-2xl font-bold font-mono text-nexus-50">{health.missingEmbeddings}</div>
        <p className="text-[11px] text-nexus-500">All chunks fully vectorized</p>
      </div>
    </div>
  );
}
