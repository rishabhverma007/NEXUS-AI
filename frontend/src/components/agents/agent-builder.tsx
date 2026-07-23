"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Bot, 
  Cpu, 
  Database, 
  GitFork, 
  Layers, 
  ShieldCheck, 
  Sliders, 
  Sparkles, 
  Check 
} from "lucide-react";

export function AgentBuilder() {
  const [reflectionThreshold, setReflectionThreshold] = useState(0.85);
  const [hybridSearchTopK, setHybridSearchTopK] = useState(10);
  const [graphDepth, setGraphDepth] = useState(2);

  const agents = [
    {
      name: "RouterAgent",
      type: "Intent Classifier",
      description: "Classifies user queries, decomposes multi-step instructions, and selects execution pipeline.",
      icon: Bot,
      status: "Active",
      color: "from-nexus-accent to-nexus-brand-light"
    },
    {
      name: "VectorRAGAgent",
      type: "Hybrid Retriever",
      description: "Queries pgvector dense cosine embeddings + BM25 sparse index using Reciprocal Rank Fusion (RRF).",
      icon: Database,
      status: "Active",
      color: "from-nexus-accent to-nexus-accent"
    },
    {
      name: "GraphRAGAgent",
      type: "Topology Traverser",
      description: "Traverses NetworkX entity/relationship graphs to build multi-hop context sub-graphs.",
      icon: GitFork,
      status: "Active",
      color: "from-nexus-brand-light to-purple-500"
    },
    {
      name: "MemoryAgent",
      type: "Context Injector",
      description: "Queries episodic and semantic memory stores for personalized workspace parameters.",
      icon: Layers,
      status: "Active",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "ReflectionAgent",
      type: "Factuality Evaluator",
      description: "Verifies hallucination score, cross-checks context citations, and enforces quality threshold.",
      icon: ShieldCheck,
      status: "Active",
      color: "from-nexus-amber to-nexus-emerald"
    },
    {
      name: "SynthesisAgent",
      type: "Stream Generator",
      description: "Synthesizes final response in Markdown with streaming SSE tokens and citation tags.",
      icon: Sparkles,
      status: "Active",
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-50 tracking-tight flex items-center gap-2">
            <Cpu className="h-6 w-6 text-nexus-brand-light" />
            Multi-Agent Orchestration & Reflection Engine
          </h1>
          <p className="text-xs text-nexus-400 mt-1">
            Configure agentic collaboration pipelines, factual reflection thresholds, and GraphRAG parameters.
          </p>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, idx) => {
          const Icon = agent.icon;
          return (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-4 relative overflow-hidden"
            >
              <div className={`h-1 w-full bg-gradient-to-r ${agent.color} absolute top-0 left-0`} />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-nexus-850 border border-nexus-border text-nexus-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-nexus-50">{agent.name}</h3>
                    <span className="text-[10px] text-nexus-400 font-mono">{agent.type}</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-nexus-emerald/10 border border-nexus-emerald/30 text-[10px] font-bold text-nexus-emerald flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  {agent.status}
                </span>
              </div>

              <p className="text-xs text-nexus-400 leading-relaxed">{agent.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Engine Threshold Controls */}
      <div className="nexus-glass p-6 rounded-2xl border border-nexus-border space-y-6">
        <h2 className="text-sm font-semibold text-nexus-200 flex items-center gap-2">
          <Sliders className="h-4 w-4 text-nexus-accent" />
          Pipeline Parameter Controls
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-nexus-300">Reflection Evaluation Threshold</span>
              <span className="font-mono text-nexus-accent font-bold">{Math.round(reflectionThreshold * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.99"
              step="0.01"
              value={reflectionThreshold}
              onChange={(e) => setReflectionThreshold(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-nexus-800 rounded-lg appearance-none cursor-pointer accent-nexus-accent"
            />
            <p className="text-[10px] text-nexus-500">Minimum factual score required to pass reflection verification.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-nexus-300">Hybrid Search Top-K Chunks</span>
              <span className="font-mono text-nexus-accent font-bold">{hybridSearchTopK}</span>
            </div>
            <input
              type="range"
              min="3"
              max="20"
              step="1"
              value={hybridSearchTopK}
              onChange={(e) => setHybridSearchTopK(parseInt(e.target.value))}
              className="w-full h-1.5 bg-nexus-800 rounded-lg appearance-none cursor-pointer accent-nexus-accent"
            />
            <p className="text-[10px] text-nexus-500">Number of document chunks retrieved via RRF fusion.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-nexus-300">GraphRAG Traversal Depth</span>
              <span className="font-mono text-nexus-accent font-bold">{graphDepth} Hops</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={graphDepth}
              onChange={(e) => setGraphDepth(parseInt(e.target.value))}
              className="w-full h-1.5 bg-nexus-800 rounded-lg appearance-none cursor-pointer accent-nexus-accent"
            />
            <p className="text-[10px] text-nexus-500">Maximum node hops during entity sub-graph query.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
