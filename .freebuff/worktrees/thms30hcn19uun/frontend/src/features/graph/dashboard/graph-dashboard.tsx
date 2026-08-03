"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useGraph } from "@/hooks/use-graph";
import { GraphHealthCard } from "./graph-health-card";
import { GraphInspector } from "./graph-inspector";
import { GraphNodeItem } from "@/repositories/graph-repository";
import { Network, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const GraphVisualizer3D = dynamic(
  () => import("@/components/graph/graph-visualizer-3d").then((mod) => mod.GraphVisualizer3D),
  { ssr: false }
);

export function GraphDashboard() {
  const { nodes, edges } = useGraph();
  const [selectedNode, setSelectedNode] = useState<GraphNodeItem | null>(null);

  const handleNodeClick = (node: any) => {
    setSelectedNode({
      id: node.id,
      workspaceId: "ws_default_01",
      name: node.name,
      entityType: node.type || "Document",
      description: `Entity ${node.name} connected in knowledge graph network.`,
    });
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Network className="h-6 w-6 text-cyan-400" />
            Enterprise 3D Knowledge Graph Platform
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            WebGL 3D force-directed graph, 2-Hop sub-graph traversal, and entity-relationship topology.
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Re-cluster Graph</span>
        </Button>
      </div>

      <GraphHealthCard />

      <div className="flex gap-6 h-[500px]">
        <div className="flex-1 glass-panel border border-slate-800 rounded-2xl overflow-hidden relative">
          <GraphVisualizer3D onNodeSelect={handleNodeClick} />
        </div>

        {selectedNode && (
          <GraphInspector node={selectedNode} onClose={() => setSelectedNode(null)} />
        )}
      </div>
    </div>
  );
}
