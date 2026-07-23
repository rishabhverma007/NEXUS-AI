"use client";

import { TaskNode } from "../pipeline/planner";
import { CheckCircle2, Clock, GitCommit, Layers, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExecutionDAGProps {
  nodes: TaskNode[];
}

export function ExecutionDAG({ nodes }: ExecutionDAGProps) {
  return (
    <div className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-nexus-50 flex items-center gap-2">
          <GitCommit className="h-4 w-4 text-nexus-accent" />
          Agentic Reasoning DAG Execution Graph
        </h3>
        <span className="text-[10px] font-mono text-nexus-500">Directed Acyclic Graph (DAG)</span>
      </div>

      <div className="space-y-3">
        {nodes.map((node, index) => (
          <div
            key={node.id}
            className="p-4 rounded-xl bg-nexus-850/60 border border-nexus-border flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-nexus-emerald border border-nexus-emerald/30 flex items-center justify-center font-mono font-bold text-[11px]">
                {index + 1}
              </div>
              <div>
                <div className="font-semibold text-nexus-50">{node.name}</div>
                <div className="text-[10px] text-nexus-500 font-mono">Type: {node.type}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-nexus-accent">{node.durationMs} ms</span>
              <Badge variant="emerald" className="uppercase">
                {node.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
