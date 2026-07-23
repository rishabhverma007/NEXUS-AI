"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, Database, Network, Plus, ShieldCheck, Sparkles } from "lucide-react";

const actions = [
  {
    title: "New Agentic RAG Session",
    desc: "Start multi-agent collaboration with live reflection drawer",
    href: "/chat",
    icon: Bot,
    gradient: "from-nexus-brand to-nexus-500",
    iconColor: "text-nexus-brand-light",
    borderColor: "group-hover:border-nexus-brand/40",
  },
  {
    title: "Ingest Document Spec",
    desc: "Upload markdown or PDF docs into pgvector vector store",
    href: "/knowledge",
    icon: Database,
    gradient: "from-nexus-emerald to-nexus-emerald-dim",
    iconColor: "text-nexus-emerald",
    borderColor: "group-hover:border-nexus-emerald/40",
  },
  {
    title: "Explore 3D GraphRAG",
    desc: "Interactive 3D WebGL node-edge topology visualizer",
    href: "/graph",
    icon: Network,
    gradient: "from-nexus-accent to-nexus-accent-dim",
    iconColor: "text-nexus-accent",
    borderColor: "group-hover:border-nexus-accent/40",
  },
  {
    title: "Configure Reflection Engine",
    desc: "Adjust factual accuracy threshold and Top-K retrieval parameters",
    href: "/agents",
    icon: ShieldCheck,
    gradient: "from-nexus-amber to-orange-500",
    iconColor: "text-nexus-amber",
    borderColor: "group-hover:border-nexus-amber/40",
  },
];

export function QuickActionsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {actions.map((act, idx) => {
        const Icon = act.icon;
        return (
          <motion.div
            key={act.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
          >
            <Link href={act.href}>
              <div
                className={`group relative p-6 rounded-3xl border border-nexus-border bg-nexus-850/60 backdrop-blur-sm
                transition-all duration-300 hover:-translate-y-1 hover:shadow-nexus-lg ${act.borderColor}
                nexus-shine h-full flex flex-col justify-between`}
              >
                {/* Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-2xl bg-nexus-800/80 border border-nexus-border ${act.iconColor}
                    group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div
                    className="h-8 w-8 rounded-xl bg-nexus-800/60 border border-nexus-border flex items-center justify-center
                    text-nexus-500 group-hover:text-nexus-200 group-hover:border-nexus-border-hover transition-all duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-nexus-50 group-hover:text-nexus-100 transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-xs text-nexus-400 leading-relaxed group-hover:text-nexus-300 transition-colors">
                    {act.desc}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
