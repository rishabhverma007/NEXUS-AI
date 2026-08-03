"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useGraphRAG } from "@/hooks/use-graphrag";
import { GraphRAGMetrics } from "./graphrag-metrics";
import { GraphRAGInspector } from "./graphrag-inspector";
import { Network, Play, RefreshCw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const GraphVisualizer3D = dynamic(
  () => import("@/components/graph/graph-visualizer-3d").then((mod) => mod.GraphVisualizer3D),
  { ssr: false }
);

export function GraphRAGDashboard() {
  const { graphContext, isExpanding, runGraphRAG } = useGraphRAG();
  const [showInspector, setShowInspector] = useState(true);

  useEffect(() => {
    runGraphRAG("Decompose sub-graph traversal pipeline", 2);
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Zap className="h-6 w-6 text-cyan-400" />
            Enterprise GraphRAG Intelligence Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Orchestrating Hybrid Retrieval + 3D Knowledge Graph + Long-Term Memory into graph-aware evidence payloads.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="gap-2"
          onClick={() => runGraphRAG("Analyze multi-agent system architecture", 2)}
          isLoading={isExpanding}
        >
          <Play className="h-4 w-4" />
          <span>Execute GraphRAG Traversal</span>
        </Button>
      </div>

      <GraphRAGMetrics />

      <div className="flex gap-6 h-[500px]">
        <div className="flex-1 glass-panel border border-slate-800 rounded-2xl overflow-hidden relative">
          <GraphVisualizer3D />
        </div>

        {graphContext && showInspector && (
          <GraphRAGInspector context={graphContext} onClose={() => setShowInspector(false)} />
        )}
      </div>
    </div>
  );
}
