"use client";

import { motion } from "framer-motion";
import {
  Bot, Database, Network, ShieldCheck, Layers, Sparkles,
  GitBranch, Workflow, Cpu, Zap
} from "lucide-react";
import { TiltCard } from "@/animations/tilt";

const features = [
  {
    icon: Bot,
    title: "Multi-Agent RAG Orchestration",
    description:
      "Distributed agent collaboration featuring Router Agent, RAG Agent, Memory Agent, and Synthesis Agent running on LangGraph.",
    badge: "LangGraph Powered",
    color: "from-nexus-brand/10 to-nexus-500/5",
    iconColor: "text-nexus-brand-light",
    borderColor: "border-nexus-brand/20 group-hover:border-nexus-brand/40",
  },
  {
    icon: Network,
    title: "GraphRAG Entity Traversal",
    description:
      "NetworkX sub-graph extraction traversing 2-hop topological relationships between entities for complex multi-step reasoning.",
    badge: "3D Topology",
    color: "from-nexus-accent/10 to-nexus-accent-dim/5",
    iconColor: "text-nexus-accent",
    borderColor: "border-nexus-accent/20 group-hover:border-nexus-accent/40",
  },
  {
    icon: Database,
    title: "pgvector Cosine Hybrid Search",
    description:
      "Dense vector embeddings fused with BM25 keyword matching via Reciprocal Rank Fusion (RRF) for maximum retrieval precision.",
    badge: "HNSW Indexed",
    color: "from-nexus-emerald/10 to-nexus-emerald-dim/5",
    iconColor: "text-nexus-emerald",
    borderColor: "border-nexus-emerald/20 group-hover:border-nexus-emerald/40",
  },
  {
    icon: ShieldCheck,
    title: "Reflection Factual Verifier",
    description:
      "Double-check evaluation loop scoring factual correctness before streaming SSE tokens to ensure zero hallucination risk.",
    badge: "0.96 Precision",
    color: "from-nexus-amber/10 to-nexus-amber/5",
    iconColor: "text-nexus-amber",
    borderColor: "border-nexus-amber/20 group-hover:border-nexus-amber/40",
  },
  {
    icon: Layers,
    title: "Long-Term Memory Engine",
    description:
      "Distills conversation turns into semantic and episodic vector embeddings for persistent user preference retention across sessions.",
    badge: "Episodic Recall",
    color: "from-purple-500/10 to-pink-500/5",
    iconColor: "text-purple-400",
    borderColor: "border-purple-500/20 group-hover:border-purple-500/40",
  },
  {
    icon: Zap,
    title: "Real-Time SSE Token Stream",
    description:
      "Low-latency streaming token responses with live agent step thought process drawer and citation lineage tracking.",
    badge: "Sub-50ms Latency",
    color: "from-pink-500/10 to-rose-500/5",
    iconColor: "text-pink-400",
    borderColor: "border-pink-500/20 group-hover:border-pink-500/40",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-border to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full opacity-[0.03] blur-[100px]"
          style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.5), transparent)" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full nexus-glass border border-nexus-accent/20">
            <Sparkles className="h-3 w-3 text-nexus-accent" />
            <span className="text-[11px] font-semibold text-nexus-accent tracking-wide">
              Enterprise System Capabilities
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-nexus-50 tracking-tight leading-[1.1]">
            Engineered for{" "}
            <span className="bg-gradient-to-r from-nexus-brand-light to-nexus-accent bg-clip-text text-transparent">
              Million-User
            </span>{" "}
            Scalability
          </h2>
          <p className="text-base text-nexus-400 max-w-2xl mx-auto leading-relaxed">
            Every pipeline component is decoupled, modular, and optimized for high-throughput enterprise workloads
            with sub-50ms latency across all retrieval paths.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
              >
                <TiltCard className="h-full" intensity={8} glare={true}>
                  <div
                    className={`group relative h-full p-7 rounded-3xl border ${feature.borderColor} bg-gradient-to-b ${feature.color} 
                    transition-all duration-500 hover:shadow-nexus-lg hover:-translate-y-1
                    nexus-shine`}
                  >
                    {/* Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={`p-3 rounded-2xl bg-nexus-800/80 border border-nexus-border ${feature.iconColor}
                        group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-nexus-800/60 border border-nexus-border text-nexus-400
                      group-hover:text-nexus-300 transition-colors">
                        {feature.badge}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-base font-bold text-nexus-50 mb-2 group-hover:text-nexus-100 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-nexus-400 leading-relaxed group-hover:text-nexus-300 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
