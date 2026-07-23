"use client";

import { motion } from "framer-motion";
import { Bot, Database, GitFork, ShieldCheck, Sparkles, ArrowRight, Activity } from "lucide-react";

const steps = [
  { title: "Query Router", icon: Bot, desc: "Decomposes user query intent and routes to optimal pipeline", color: "from-nexus-brand/20 to-nexus-500/10", iconColor: "text-nexus-brand-light" },
  { title: "Hybrid Vector Search", icon: Database, desc: "pgvector + BM25 RRF fusion for max recall", color: "from-nexus-emerald/20 to-nexus-emerald-dim/10", iconColor: "text-nexus-emerald" },
  { title: "GraphRAG Traversal", icon: GitFork, desc: "Extracts 2-hop entity sub-graph topology", color: "from-nexus-accent/20 to-nexus-accent-dim/10", iconColor: "text-nexus-accent" },
  { title: "Reflection Evaluator", icon: ShieldCheck, desc: "Verifies zero hallucination factual score", color: "from-nexus-amber/20 to-nexus-amber/10", iconColor: "text-nexus-amber" },
  { title: "SSE Synthesis", icon: Sparkles, desc: "Streams response with full citation lineage", color: "from-pink-500/20 to-rose-500/10", iconColor: "text-pink-400" },
];

export function WorkflowDemoSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-nexus-900/50 via-transparent to-nexus-900/50" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-border to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full nexus-glass border border-nexus-brand/20">
            <Activity className="h-3 w-3 text-nexus-brand-light" />
            <span className="text-[11px] font-semibold text-nexus-brand-light tracking-wide">
              Autonomous Pipeline
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-nexus-50 tracking-tight leading-[1.1]">
            How the{" "}
            <span className="bg-gradient-to-r from-nexus-brand-light to-nexus-accent bg-clip-text text-transparent">
              Multi-Agent Engine
            </span>{" "}
            Reasons
          </h2>
          <p className="text-sm text-nexus-400 max-w-xl mx-auto">
            Step-by-step telemetry pipeline executing in parallel for every user query with sub-50ms latency.
          </p>
        </motion.div>

        {/* Pipeline Steps */}
        <div className="relative">
          {/* Connecting Line (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-px -translate-y-1/2">
            <div className="h-full bg-gradient-to-r from-nexus-border via-nexus-border to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="relative group"
                >
                  <div
                    className={`relative p-6 rounded-3xl border border-nexus-border bg-gradient-to-b ${step.color}
                    transition-all duration-500 group-hover:border-nexus-border-hover group-hover:shadow-nexus-lg group-hover:-translate-y-1
                    flex flex-col items-center text-center space-y-4`}
                  >
                    {/* Step Number */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-nexus-800 border border-nexus-border text-[10px] font-mono font-bold text-nexus-400 z-10">
                      Step {i + 1}
                    </div>

                    {/* Icon */}
                    <div
                      className={`p-3.5 rounded-2xl bg-nexus-800/80 border border-nexus-border ${step.iconColor}
                      group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Text */}
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold text-nexus-50 group-hover:text-nexus-100 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-xs text-nexus-400 leading-relaxed group-hover:text-nexus-300 transition-colors">
                        {step.desc}
                      </p>
                    </div>

                    {/* Arrow connector */}
                    {i < steps.length - 1 && (
                      <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                        <div className="h-8 w-8 rounded-full bg-nexus-800 border border-nexus-border flex items-center justify-center group-hover:border-nexus-brand/30 group-hover:shadow-glow-brand transition-all duration-300">
                          <ArrowRight className="h-3.5 w-3.5 text-nexus-400 group-hover:text-nexus-brand-light transition-colors" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
