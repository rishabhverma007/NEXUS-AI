"use client";

import Link from "next/link";
import { BrainCircuit, ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl z-50 px-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-glow">
          <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <BrainCircuit className="h-4 w-4 text-cyan-400" />
          </div>
        </div>
        <span className="font-bold text-sm text-slate-100 tracking-tight flex items-center gap-1.5">
          NEXUS AI
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
            ENTERPRISE
          </span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
        <Link href="#features" className="hover:text-slate-100 transition-colors">Features</Link>
        <Link href="#enterprise" className="hover:text-slate-100 transition-colors">Architecture</Link>
        <Link href="#pricing" className="hover:text-slate-100 transition-colors">Pricing</Link>
        <Link href="#faq" className="hover:text-slate-100 transition-colors">FAQ</Link>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/chat">
          <Button variant="primary" size="sm" className="gap-2">
            <span>Launch Dashboard</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </nav>
  );
}
