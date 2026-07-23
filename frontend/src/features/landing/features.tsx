"use client";

import { motion } from "framer-motion";
import { Bot, Database, GitFork, Layers, Network, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { TiltCard } from "@/animations/tilt";

export function FeaturesSection() {
  const featureList = [
    {
      icon: Bot,
      title: "Multi-Agent RAG Orchestration",
      description: "Distributed agent collaboration featuring Router Agent, RAG Agent, Memory Agent, and Synthesis Agent.",
      badge: "LangGraph Powered",
      color: "from-blue-500/20 to-indigo-500/10",
      iconColor: "text-blue-400"
    },
    {
      icon: Network,
      title: "GraphRAG Entity Traversal",
      description: "NetworkX sub-graph extraction traversing 2-hop topological relationships between entities.",
      badge: "3D Topology",
      color: "from-cyan-500/20 to-blue-500/10",
      iconColor: "text-cyan-400"
    },
    {
      icon: Database,
      title: "pgvector Cosine Hybrid Search",
      description: "Dense vector embeddings fused with BM25 keyword matching via Reciprocal Rank Fusion (RRF).",
      badge: "HNSW Indexed",
      color: "from-emerald-500/20 to-teal-500/10",
      iconColor: "text-emerald-400"
    },
    {
      icon: ShieldCheck,
      title: "Reflection Factual Verifier",
      description: "Double-check evaluation loop scoring factual correctness before streaming SSE tokens.",
      badge: "0.96 Precision",
      color: "from-amber-500/20 to-orange-500/10",
      iconColor: "text-amber-400"
    },
    {
      icon: Layers,
      title: "Long-Term Memory Engine",
      description: "Distills conversation turns into semantic & episodic vectors for user preference retention.",
      badge: "Episodic Recall",
      color: "from-purple-500/20 to-pink-500/10",
      iconColor: "text-purple-400"
    },
    {
      icon: Sparkles,
      title: "Real-Time SSE Token Stream",
      description: "Low-latency streaming token responses with live agent step thought process drawer.",
      badge: "Sub-50ms Latency",
      color: "from-pink-500/20 to-rose-500/10",
      iconColor: "text-pink-400"
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-950/60 relative">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            Enterprise System Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Engineered for Million-User Scalability
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Every pipeline component is decoupled, modular, and optimized for high-throughput enterprise workloads.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <TiltCard key={feature.title} className="h-full">
                <div className={`glass-panel h-full p-6 rounded-3xl border border-slate-800 bg-gradient-to-b ${feature.color} flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-2xl bg-slate-900 border border-slate-800 ${feature.iconColor}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300">
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-100">{feature.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
