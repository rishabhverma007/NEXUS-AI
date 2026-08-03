"use client";

import Link from "next/link";
import { BrainCircuit, Github, Twitter, Linkedin } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-16 px-6 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-glow">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="h-4 w-4 text-cyan-400" />
              </div>
            </div>
            <span className="font-bold text-slate-100 text-sm">NEXUS AI</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Enterprise AI Knowledge Operating System uniting Multi-Agent RAG, GraphRAG, and Reflection Engine.
          </p>
          <div className="flex items-center gap-3 text-slate-400">
            <Github className="h-4 w-4 hover:text-slate-200 cursor-pointer" />
            <Twitter className="h-4 w-4 hover:text-slate-200 cursor-pointer" />
            <Linkedin className="h-4 w-4 hover:text-slate-200 cursor-pointer" />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">Platform</h4>
          <ul className="space-y-2">
            <li><Link href="/chat" className="hover:text-slate-200">Agentic RAG Engine</Link></li>
            <li><Link href="/graph" className="hover:text-slate-200">3D GraphRAG Visualizer</Link></li>
            <li><Link href="/knowledge" className="hover:text-slate-200">Hybrid Vector Search</Link></li>
            <li><Link href="/agents" className="hover:text-slate-200">Multi-Agent Builder</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">Architecture</h4>
          <ul className="space-y-2">
            <li><span className="hover:text-slate-200">pgvector HNSW</span></li>
            <li><span className="hover:text-slate-200">NetworkX Topology</span></li>
            <li><span className="hover:text-slate-200">FastAPI & LangGraph</span></li>
            <li><span className="hover:text-slate-200">Next.js 15 App Router</span></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">Security & Status</h4>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-200 font-semibold">Systems Operational</span>
            </div>
            <p className="text-[10px] text-slate-400">All agentic pipelines and vector stores running at 100% capacity.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-12 mt-12 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
        <div>© 2026 NEXUS AI Systems, Inc. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
          <span className="hover:text-slate-200 cursor-pointer">Security Portal</span>
        </div>
      </div>
    </footer>
  );
}
