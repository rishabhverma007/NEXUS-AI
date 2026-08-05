"use client";

import { motion } from "framer-motion";
import { Bot, Database, GitFork, Layers, Network, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { SectionHeader } from "./section-header";
import { SpotlightCard } from "@/animations/spotlight-card";

export function FeaturesSection() {
  const featureList = [
    {
      icon: Bot,
      title: "Multi-Agent RAG Orchestration",
      description: "Distributed agent collaboration featuring Router, RAG, Memory and Synthesis agents.",
      badge: "LangGraph",
      iconBg: "from-indigo-500 to-blue-600",
      glow: "group-hover:shadow-indigo-500/30",
      ring: "group-hover:border-indigo-400/40",
      large: true,
    },
    {
      icon: Network,
      title: "GraphRAG Entity Traversal",
      description: "NetworkX sub-graph extraction traversing 2-hop topological relationships.",
      badge: "3D Topology",
      iconBg: "from-cyan-500 to-teal-500",
      glow: "group-hover:shadow-cyan-500/30",
      ring: "group-hover:border-cyan-400/40",
    },
    {
      icon: Database,
      title: "pgvector Hybrid Search",
      description: "Dense embeddings fused with BM25 via Reciprocal Rank Fusion (RRF).",
      badge: "HNSW Indexed",
      iconBg: "from-emerald-500 to-teal-600",
      glow: "group-hover:shadow-emerald-500/30",
      ring: "group-hover:border-emerald-400/40",
    },
    {
      icon: ShieldCheck,
      title: "Reflection Factual Verifier",
      description: "Double-check evaluation loop scoring factual correctness before streaming.",
      badge: "0.96 Precision",
      iconBg: "from-amber-500 to-orange-600",
      glow: "group-hover:shadow-amber-500/30",
      ring: "group-hover:border-amber-400/40",
    },
    {
      icon: Layers,
      title: "Long-Term Memory Engine",
      description: "Distills conversations into semantic & episodic vectors for preference retention.",
      badge: "Episodic Recall",
      iconBg: "from-fuchsia-500 to-purple-600",
      glow: "group-hover:shadow-fuchsia-500/30",
      ring: "group-hover:border-fuchsia-400/40",
    },
    {
      icon: Zap,
      title: "Real-Time SSE Token Stream",
      description: "Low-latency streaming token responses with live agent thought-process drawer.",
      badge: "Sub-50ms",
      iconBg: "from-rose-500 to-pink-600",
      glow: "group-hover:shadow-rose-500/30",
      ring: "group-hover:border-rose-400/40",
    },
  ];

  return (
    <section className="relative py-28 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto space-y-16 relative">
        <SectionHeader
          eyebrow="Enterprise System Capabilities"
          title={
            <>
              Engineered for{" "}
              <span className="text-gradient-violet">Million-User</span> Scalability
            </>
          }
          subtitle="Every pipeline component is decoupled, modular and optimized for high-throughput enterprise workloads."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <SpotlightCard
                key={feature.title}
                delay={idx * 0.06}
                className={feature.large ? "md:col-span-2 lg:col-span-1 lg:row-span-1" : ""}
              >
                <div
                  className={`group glass-card h-full p-7 rounded-3xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:bg-white/[0.05] border-white/8 ${feature.ring} ${feature.glow}`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16 }}
                      className={`p-3.5 rounded-2xl bg-gradient-to-br ${feature.iconBg} shadow-lg`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <span className="text-[10px] font-mono font-semibold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 tracking-wide">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2.5">{feature.title}</h3>
                  <p className="text-[13px] text-slate-400 leading-relaxed">{feature.description}</p>

                  {/* Hover underline sweep */}
                  <div className="mt-6 h-px w-full bg-white/5 overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-indigo-400 to-cyan-400 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
