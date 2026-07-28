"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Network,
  Database,
  ShieldCheck,
  Layers,
  Sparkles,
} from "lucide-react";
import { TiltCard } from "@/animations/tilt";
import { Badge } from "@/components/ui/badge";
import {
  containerVariants,
  itemVariants,
} from "@/animations/presets";

const featureList = [
  {
    icon: Bot,
    title: "Multi-Agent RAG Orchestration",
    description:
      "Distributed agent collaboration featuring Router Agent, RAG Agent, Memory Agent, and Synthesis Agent.",
    badge: "LangGraph Powered",
    gradient: "from-nexus-500/20 via-purple-500/10 to-transparent",
    iconBg: "bg-nexus-500/20 text-nexus-400",
    badgeVariant: "premium" as const,
  },
  {
    icon: Network,
    title: "GraphRAG Entity Traversal",
    description:
      "NetworkX sub-graph extraction traversing 2-hop topological relationships between entities.",
    badge: "3D Topology",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    iconBg: "bg-cyan-500/20 text-cyan-400",
    badgeVariant: "cyan" as const,
  },
  {
    icon: Database,
    title: "pgvector Hybrid Search",
    description:
      "Dense vector embeddings fused with BM25 keyword matching via Reciprocal Rank Fusion (RRF).",
    badge: "HNSW Indexed",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    iconBg: "bg-emerald-500/20 text-emerald-400",
    badgeVariant: "emerald" as const,
  },
  {
    icon: ShieldCheck,
    title: "Reflection Factual Verifier",
    description:
      "Double-check evaluation loop scoring factual correctness before streaming SSE tokens.",
    badge: "0.96 Precision",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    iconBg: "bg-amber-500/20 text-amber-400",
    badgeVariant: "amber" as const,
  },
  {
    icon: Layers,
    title: "Long-Term Memory Engine",
    description:
      "Distills conversation turns into semantic & episodic vectors for user preference retention.",
    badge: "Episodic Recall",
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
    iconBg: "bg-purple-500/20 text-purple-400",
    badgeVariant: "purple" as const,
  },
  {
    icon: Sparkles,
    title: "Real-Time SSE Token Stream",
    description:
      "Low-latency streaming token responses with live agent step thought process drawer.",
    badge: "Sub-50ms Latency",
    gradient: "from-pink-500/20 via-rose-500/10 to-transparent",
    iconBg: "bg-pink-500/20 text-pink-400",
    badgeVariant: "default" as const,
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-nexus-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="space-y-16"
        >
          {/* Section Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <motion.div variants={itemVariants}>
              <Badge variant="premium" size="md">
                Enterprise System Capabilities
              </Badge>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight"
            >
              Engineered for{" "}
              <span className="text-gradient-primary">
                Million-User Scale
              </span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-base text-slate-400 leading-relaxed max-w-lg mx-auto"
            >
              Every pipeline component is decoupled, modular, and optimized for
              high-throughput enterprise workloads.
            </motion.p>
          </div>

          {/* Bento Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featureList.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} variants={itemVariants}>
                  <TiltCard className="h-full group" intensity={10}>
                    <div className="glass-card h-full p-7 rounded-2xl bg-gradient-to-br flex flex-col justify-between space-y-5 relative overflow-hidden">
                      {/* Hover shine effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent" />
                      </div>

                      <div className="space-y-4 relative z-[1]">
                        <div className="flex items-center justify-between">
                          <div
                            className={`p-3 rounded-xl border border-white/10 ${feature.iconBg}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <Badge variant={feature.badgeVariant}>
                            {feature.badge}
                          </Badge>
                        </div>

                        <h3 className="text-lg font-bold text-slate-100">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
