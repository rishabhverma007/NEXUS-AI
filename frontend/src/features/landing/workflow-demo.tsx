"use client";

import { motion } from "framer-motion";
import { Bot, Cpu, Database, GitFork, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

export function WorkflowDemoSection() {
  const steps = [
    { title: "Query Router", icon: Bot, desc: "Decomposes user query intent" },
    { title: "Hybrid Vector Search", icon: Database, desc: "pgvector + BM25 RRF fusion" },
    { title: "GraphRAG Traversal", icon: GitFork, desc: "Extracts 2-hop entity sub-graph" },
    { title: "Reflection Evaluator", icon: ShieldCheck, desc: "Verifies zero hallucination score" },
    { title: "SSE Synthesis", icon: Sparkles, desc: "Streams response with citations" },
  ];

  return (
    <section className="py-24 px-6 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            Autonomous Pipeline
          </span>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            How the Multi-Agent Engine Reason
          </h2>
          <p className="text-xs text-slate-400">
            Step-by-step telemetry pipeline executing in parallel for every user query.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col items-center text-center space-y-3 relative"
              >
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-slate-200">{step.title}</span>
                <p className="text-[11px] text-slate-400">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
