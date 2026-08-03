"use client";

import Link from "next/link";
import { Layout, Github, Twitter, Linkedin } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#05070A] py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-nexus-500 via-purple-500 to-cyan-500 p-[2px] shadow-lg shadow-nexus-500/25">
              <div className="h-full w-full bg-[#05070A] rounded-[10px] flex items-center justify-center">
                <Layout className="h-4 w-4 text-cyan-400" />
              </div>
            </div>
            <span className="font-bold text-sm text-slate-100">
              NEXUS AI
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            Enterprise AI Knowledge Operating System uniting Multi-Agent RAG,
            GraphRAG, and Reflection Engine.
          </p>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all">
              <Github className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all">
              <Twitter className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all">
              <Linkedin className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Platform */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Platform
          </h4>
          <ul className="space-y-2.5">
            {[
              { label: "Agentic RAG Engine", href: "/chat" },
              { label: "3D GraphRAG Visualizer", href: "/graph" },
              { label: "Hybrid Vector Search", href: "/knowledge" },
              { label: "Multi-Agent Builder", href: "/agents" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-slate-400 hover:text-slate-100 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Architecture */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Architecture
          </h4>
          <ul className="space-y-2.5">
            {[
              "pgvector HNSW",
              "NetworkX Topology",
              "FastAPI & LangGraph",
              "Next.js 15 App Router",
            ].map((item) => (
              <li key={item}>
                <span className="text-sm text-slate-400">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Status */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Security &amp; Status
          </h4>
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-sm font-semibold text-slate-200">
                Systems Operational
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              All agentic pipelines and vector stores running at 100% capacity.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 mt-16 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500">
          &copy; 2026 NEXUS AI Systems, Inc. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-xs text-slate-500">
          <button className="hover:text-slate-200 transition-colors">
            Privacy Policy
          </button>
          <button className="hover:text-slate-200 transition-colors">
            Terms of Service
          </button>
          <button className="hover:text-slate-200 transition-colors">
            Security Portal
          </button>
        </div>
      </div>
    </footer>
  );
}
