"use client";

import { useState } from "react";
import { useWorkflow } from "@/hooks/use-workflow";
import { GitFork, Play, Sparkles, Database, Network, Brain, Wrench, CheckCircle2, ArrowRight, Layers } from "lucide-react";

export function VisualWorkflowBuilder() {
  const { nodes, edges, isRunning, executionResult, executeWorkflow } = useWorkflow("wf_01");
  const [inputPrompt, setInputPrompt] = useState("Evaluate hybrid RAG vs GraphRAG performance metrics.");

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "retriever":
        return <Database className="h-4 w-4 text-nexus-accent" />;
      case "graphrag":
        return <Network className="h-4 w-4 text-nexus-brand-light" />;
      case "memory":
        return <Brain className="h-4 w-4 text-purple-400" />;
      case "agent":
        return <Sparkles className="h-4 w-4 text-nexus-accent" />;
      case "tool_call":
        return <Wrench className="h-4 w-4 text-nexus-amber" />;
      default:
        return <Layers className="h-4 w-4 text-nexus-400" />;
    }
  };

  const handleRun = async () => {
    if (!inputPrompt) return;
    await executeWorkflow(inputPrompt);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="p-4 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <label className="text-xs text-nexus-400 block mb-1 font-medium">Test Prompt Input</label>
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-nexus-950 border border-nexus-border text-xs text-nexus-50 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <button
          onClick={handleRun}
          disabled={isRunning}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-nexus-accent to-nexus-brand-light hover:from-nexus-accent hover:to-nexus-brand-light text-white font-medium text-xs flex items-center gap-2 shadow-glow transition-all shrink-0 disabled:opacity-50"
        >
          <Play className="h-4 w-4" /> {isRunning ? "Executing DAG..." : "Run Visual Workflow"}
        </button>
      </div>

      {/* Visual Canvas Visualizer */}
      <div className="p-6 rounded-xl bg-nexus-950 border border-nexus-border min-h-[380px] relative overflow-hidden flex flex-col justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div className="flex items-center justify-between relative z-10 mb-4">
          <span className="text-xs font-semibold text-nexus-300 flex items-center gap-2">
            <GitFork className="h-4 w-4 text-nexus-accent" /> Visual Workflow Canvas (5 Nodes, 5 Edges)
          </span>
          <span className="text-[10px] font-mono text-nexus-accent bg-nexus-accent/10 px-2 py-0.5 rounded border border-cyan-500/20">
            DAG Engine Ready
          </span>
        </div>

        {/* Nodes Canvas Grid Representation */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10 my-auto">
          {nodes.map((node, idx) => (
            <div key={node.id} className="flex items-center gap-2">
              <div className="p-4 rounded-xl bg-nexus-850/90 border border-nexus-border nexus-glass shadow-lg flex-1 flex flex-col gap-2 hover:border-cyan-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-1.5 py-0.5 rounded bg-nexus-800 text-[9px] font-mono text-cyan-300 uppercase">
                    {node.nodeType}
                  </span>
                  {getNodeIcon(node.nodeType)}
                </div>
                <h4 className="text-xs font-bold text-nexus-50 line-clamp-1">{node.label}</h4>
                <div className="text-[10px] text-nexus-400 font-mono">#{node.nodeId}</div>
              </div>
              {idx < nodes.length - 1 && <ArrowRight className="h-4 w-4 text-nexus-600 shrink-0 hidden md:block" />}
            </div>
          ))}
        </div>

        {/* Execution Output Panel */}
        {executionResult && (
          <div className="mt-4 p-4 rounded-xl bg-nexus-850/90 border border-nexus-emerald/30 nexus-glass relative z-10 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-nexus-emerald flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Execution Success ({executionResult.stepResults.length} Steps)
              </span>
              <span className="text-[10px] font-mono text-nexus-400">{executionResult.finalOutput}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 pt-2 border-t border-nexus-border/60">
              {executionResult.stepResults.map((step) => (
                <div key={step.stepId} className="p-2 rounded bg-nexus-950 border border-nexus-border text-[10px] font-mono">
                  <div className="text-nexus-200 truncate">{step.label}</div>
                  <div className="text-nexus-accent mt-0.5">{step.durationMs} ms</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
