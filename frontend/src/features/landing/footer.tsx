"use client";

import Link from "next/link";
import { BrainCircuit, Github, Twitter, Linkedin, ArrowUpRight } from "lucide-react";

const footerLinks = {
  platform: [
    { label: "Agentic RAG Engine", href: "/chat" },
    { label: "3D GraphRAG Visualizer", href: "/graph" },
    { label: "Hybrid Vector Search", href: "/knowledge" },
    { label: "Multi-Agent Builder", href: "/agents" },
    { label: "Retrieval Playground", href: "/retrieval" },
  ],
  architecture: [
    { label: "pgvector HNSW", href: "#" },
    { label: "NetworkX Topology", href: "#" },
    { label: "FastAPI & LangGraph", href: "#" },
    { label: "Next.js 15 App Router", href: "#" },
    { label: "Docker & Kubernetes", href: "#" },
  ],
  company: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Status Page", href: "#" },
    { label: "Security Portal", href: "#" },
    { label: "Enterprise Sales", href: "/login" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="relative border-t border-nexus-border bg-nexus-950/80">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-border to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-nexus-brand to-nexus-accent p-0.5 shadow-glow-brand">
                <div className="h-full w-full bg-nexus-950 rounded-[14px] flex items-center justify-center">
                  <BrainCircuit className="h-5 w-5 text-nexus-accent" />
                </div>
              </div>
              <span className="font-bold text-lg text-nexus-50 tracking-tight">NEXUS AI</span>
            </div>
            <p className="text-sm text-nexus-400 leading-relaxed max-w-sm">
              Enterprise AI Knowledge Operating System uniting Multi-Agent RAG, GraphRAG, and Reflection Engine
              into a single unified platform.
            </p>

            {/* Status Indicator */}
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl nexus-glass border border-nexus-border">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexus-emerald opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-nexus-emerald" />
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-nexus-50">All Systems Operational</span>
                <span className="text-[10px] text-nexus-400">100% Uptime SLA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <button
                  key={i}
                  className="h-9 w-9 rounded-xl nexus-glass border border-nexus-border flex items-center justify-center
                  text-nexus-400 hover:text-nexus-50 hover:border-nexus-border-hover transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h4 className="text-xs font-semibold text-nexus-200 uppercase tracking-widest">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-nexus-400 hover:text-nexus-200 transition-colors duration-200"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-nexus-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-nexus-500">
            &copy; {new Date().getFullYear()} NEXUS AI Systems, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Security Portal"].map((item) => (
              <button
                key={item}
                className="text-xs text-nexus-500 hover:text-nexus-300 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
