"use client";

import { useState } from "react";
import { useIndex } from "@/hooks/use-index";
import { useIndexHealth } from "@/hooks/use-index-health";
import { useEmbeddingJobs } from "@/hooks/use-embedding-jobs";
import { HealthCard } from "./health-card";
import { QueueStatus } from "./queue-status";
import { Cpu, Database, RefreshCw, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function EmbeddingDashboard() {
  const { indexes } = useIndex();
  const { health } = useIndexHealth();
  const { jobs } = useEmbeddingJobs();
  const [isReindexing, setIsReindexing] = useState(false);

  const handleReindex = () => {
    setIsReindexing(true);
    setTimeout(() => {
      setIsReindexing(false);
    }, 1200);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Zap className="h-6 w-6 text-cyan-400" />
            Enterprise Embedding & Indexing Subsystem
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Batch vector generation, pgvector indexing, index health scoring, and model migration triggers.
          </p>
        </div>

        <Button variant="primary" size="sm" className="gap-2" onClick={handleReindex} isLoading={isReindexing}>
          <RefreshCw className="h-4 w-4" />
          <span>Trigger Full Reindex</span>
        </Button>
      </div>

      <HealthCard health={health} />

      {/* Vector Index Inspector */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Database className="h-4 w-4 text-indigo-400" />
          Active Vector Index Configurations
        </h3>

        <div className="space-y-3">
          {indexes.map((idx) => (
            <div key={idx.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="font-semibold text-slate-100">{idx.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Model: {idx.modelId} • Distance Metric: {idx.distanceMetric} • Type: {idx.indexType.toUpperCase()}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-cyan-400 font-bold">{idx.totalVectors} Vectors</span>
                <Badge variant="cyan" className="uppercase">
                  {idx.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <QueueStatus jobs={jobs} />
    </div>
  );
}
