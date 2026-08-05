"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BrainCircuit, Github, Linkedin, Twitter, ArrowRight } from "lucide-react";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Agentic RAG Engine", href: "/chat" },
      { label: "3D GraphRAG Visualizer", href: "/graph" },
      { label: "Hybrid Vector Search", href: "/knowledge" },
      { label: "Multi-Agent Builder", href: "/agents" },
    ],
  },
  {
    title: "Architecture",
    links: [
      { label: "pgvector HNSW", href: "/embedding" },
      { label: "NetworkX Topology", href: "/graph" },
      { label: "FastAPI & LangGraph", href: "/chat" },
      { label: "Next.js 15 App Router", href: "/" },
    ],
  },
  {
    title: "Security & Status",
    links: [
      { label: "Governance Center", href: "/governance" },
      { label: "Audit Logs", href: "/audit" },
      { label: "API Keys", href: "/api-keys" },
      { label: "Operations Center", href: "/operations" },
    ],
  },
];

const socials = [
  { icon: Github, label: "GitHub" },
  { icon: Twitter, label: "Twitter" },
  { icon: Linkedin, label: "LinkedIn" },
];

export function LandingFooter() {
  return (
    <footer className="relative border-t border-white/8 bg-[#030209]/80 backdrop-blur-xl mt-10">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 p-[1.5px] shadow-glow-violet">
                <div className="h-full w-full bg-[#0a0918] rounded-[14px] flex items-center justify-center">
                  <BrainCircuit className="h-5 w-5 text-cyan-300" />
                </div>
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">NEXUS AI</span>
            </div>
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-sm">
              Enterprise AI Knowledge Operating System uniting Multi-Agent RAG, GraphRAG
              entity traversal, and factual reflection engines.
            </p>
            <div className="flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="p-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-indigo-400/40 hover:bg-white/5 transition-all hover:-translate-y-0.5"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title} className="space-y-4">
              <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-[0.18em]">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-slate-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1.5 group"
                    >
                      <span className="h-px w-0 bg-indigo-400 transition-all group-hover:w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Status + newsletter band */}
        <div className="mt-14 pt-8 border-t border-white/8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-pulse-ring" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-emerald-400 font-semibold">Systems Operational</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="hidden sm:inline">All agentic pipelines & vector stores at 100% capacity</span>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-2 w-full lg:w-auto"
          >
            <input
              type="email"
              placeholder="Enter your work email"
              className="glass-input flex-1 lg:w-64 px-4 py-3 rounded-xl text-xs"
            />
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="shrink-0 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-glow"
            >
              Get Updates
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          </form>
        </div>

        <div className="mt-10 pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>© 2026 NEXUS AI Systems, Inc. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Security Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
