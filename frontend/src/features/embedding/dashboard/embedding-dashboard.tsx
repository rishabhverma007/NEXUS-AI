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
          <h1 className="text-2xl font-bold text-nexus-50 tracking-tight flex items-center gap-2">
            <Zap className="h-6 w-6 text-nexus-accent" />
            Enterprise Embedding & Indexing Subsystem
          </h1>
          <p className="text-sm text-nexus-400 mt-1">
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
      <div className="nexus-glass-elevated rounded-2xl border border-nexus-border p-6 space-y-4">
        <h3 className="text-sm font-bold text-nexus-50 flex items-center gap-2">
          <Database className="h-4 w-4 text-nexus-brand-light" />
          Active Vector Index Configurations
        </h3>

        <div className="space-y-3">
          {indexes.map((idx) => (
            <div key={idx.id} className="p-4 rounded-xl bg-nexus-850/60 border border-nexus-border flex items-center justify-between text-sm hover:border-nexus-border-hover transition-all">
              <div className="space-y-1">
                <div className="font-semibold text-nexus-50">{idx.name}</div>
                <div className="text-xs text-nexus-400 font-mono">
                  Model: {idx.modelId} • Distance Metric: {idx.distanceMetric} • Type: {idx.indexType.toUpperCase()}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-nexus-accent font-bold">{idx.totalVectors} Vectors</span>
                <Badge variant="accent" className="uppercase">
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
