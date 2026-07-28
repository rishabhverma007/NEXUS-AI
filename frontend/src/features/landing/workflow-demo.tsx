"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Database,
  GitFork,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    title: "Query Router",
    icon: Bot,
    desc: "Decomposes user query intent",
    color: "from-nexus-500/20 to-purple-500/10",
    iconColor: "text-nexus-400",
  },
  {
    title: "Hybrid Vector Search",
    icon: Database,
    desc: "pgvector + BM25 RRF fusion",
    color: "from-cyan-500/20 to-blue-500/10",
    iconColor: "text-cyan-400",
  },
  {
    title: "GraphRAG Traversal",
    icon: GitFork,
    desc: "Extracts 2-hop entity sub-graph",
    color: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-400",
  },
  {
    title: "Reflection Evaluator",
    icon: ShieldCheck,
    desc: "Verifies zero hallucination score",
    color: "from-amber-500/20 to-orange-500/10",
    iconColor: "text-amber-400",
  },
  {
    title: "SSE Synthesis",
    icon: Sparkles,
    desc: "Streams response with citations",
    color: "from-pink-500/20 to-rose-500/10",
    iconColor: "text-pink-400",
  },
];

export function WorkflowDemoSection() {
  return (
    <section className="relative py-28 px-6 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <Badge variant="premium" size="md">
            Autonomous Pipeline
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
            How the{" "}
            <span className="text-gradient-accent">
              Multi-Agent Engine
            </span>{" "}
            Reasons
          </h2>
          <p className="text-base text-slate-400">
            Step-by-step telemetry pipeline executing in parallel for every user
            query.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-nexus-500/40 via-cyan-500/40 to-transparent -translate-y-1/2 z-0" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-[1] group"
              >
                <div
                  className={`glass-card rounded-2xl p-6 flex flex-col items-center text-center space-y-4 bg-gradient-to-b ${step.color}`}
                >
                  <div
                    className={`p-3 rounded-xl border border-white/10 bg-white/5 ${step.iconColor}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-200 block">
                      {step.title}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">{step.desc}</p>
                  </div>

                  {/* Step number */}
                  <div className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-nexus-500/20 border border-nexus-500/30 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-nexus-400">
                      {i + 1}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
