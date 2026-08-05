"use client";

import { motion } from "framer-motion";
import { Bot, Cpu, Database, GitFork, ShieldCheck, Sparkles } from "lucide-react";
import { SectionHeader } from "./section-header";

export function WorkflowDemoSection() {
  const steps = [
    { title: "Query Router", icon: Bot, desc: "Decomposes user query intent", color: "from-indigo-500 to-blue-600" },
    { title: "Hybrid Vector Search", icon: Database, desc: "pgvector + BM25 RRF fusion", color: "from-cyan-500 to-teal-500" },
    { title: "GraphRAG Traversal", icon: GitFork, desc: "Extracts 2-hop entity sub-graph", color: "from-violet-500 to-purple-600" },
    { title: "Reflection Evaluator", icon: ShieldCheck, desc: "Verifies zero hallucination score", color: "from-amber-500 to-orange-600" },
    { title: "SSE Synthesis", icon: Sparkles, desc: "Streams response with citations", color: "from-rose-500 to-pink-600" },
  ];

  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="absolute top-1/3 right-0 w-[420px] h-[420px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="max-w-6xl mx-auto space-y-16 relative">
        <SectionHeader
          eyebrow="Autonomous Pipeline"
          title={
            <>
              How the Multi-Agent Engine <span className="text-gradient">Reasons</span>
            </>
          }
          subtitle="Step-by-step telemetry pipeline executing in parallel for every user query."
        />

        <div className="relative">
          {/* Flow line behind steps */}
          <div className="absolute top-10 left-[10%] right-[10%] hidden md:block h-px bg-white/5" />
          <div className="absolute top-10 left-[10%] right-[10%] hidden md:block h-px overflow-hidden">
            <motion.div
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              animate={{ x: ["-100%", "400%"] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative glass-card p-6 rounded-3xl border-white/8 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Node marker on the line */}
                  <div className="hidden md:flex absolute -top-10 left-1/2 -translate-x-1/2 items-center justify-center">
                    <span className="relative flex h-3.5 w-3.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 animate-pulse-ring" />
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gradient-to-br from-cyan-300 to-indigo-500" />
                    </span>
                  </div>

                  <div className="flex flex-col items-center text-center space-y-4">
                    <motion.div
                      whileHover={{ scale: 1.12, rotate: 6 }}
                      className={`p-4 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg shadow-black/40`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold text-white">{step.title}</h3>
                      <p className="text-[11px] text-slate-400 leading-relaxed max-w-[160px] mx-auto">{step.desc}</p>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 group-hover:text-cyan-300 transition-colors">
                      STEP {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Metrics band */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glow-border rounded-3xl p-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-6"
        >
          {[
            { k: "2-hop", v: "Graph traversal depth" },
            { k: "24", v: "Top-k candidates fused" },
            { k: "41ms", v: "Retrieval latency" },
            { k: "0.96", v: "Reflection precision" },
          ].map((m) => (
            <div key={m.k} className="text-center">
              <div className="font-display text-3xl font-bold text-gradient">{m.k}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-1 font-mono">{m.v}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
