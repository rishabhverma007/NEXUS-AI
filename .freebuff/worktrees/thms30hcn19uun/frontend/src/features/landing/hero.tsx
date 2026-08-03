"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Sparkles, Terminal } from "lucide-react";
import { Magnetic } from "@/animations/magnetic";

const HeroOrbCanvas = dynamic(
  () => import("@/three/hero-orb").then((mod) => mod.HeroOrbCanvas),
  { ssr: false }
);

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 px-6 overflow-hidden flex flex-col items-center justify-center">
      {/* Background Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
        {/* Top Announcement Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-blue-500/30 text-xs font-semibold text-cyan-400 shadow-glow"
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>Announcing NEXUS AI Enterprise OS 1.0</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 max-w-4xl mx-auto leading-[1.15]"
        >
          The Enterprise AI{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Knowledge Operating System
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Unite Multi-Agent RAG, GraphRAG entity traversal, pgvector hybrid search, and factual reflection loops in a single unified SaaS platform.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <Magnetic strength={25}>
            <Link
              href="/chat"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center gap-2 shadow-glow transition-all"
            >
              <BrainCircuit className="h-4 w-4" />
              <span>Launch Operating System</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Magnetic>

          <Magnetic strength={20}>
            <Link
              href="/graph"
              className="px-6 py-3.5 rounded-2xl glass-panel border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <Terminal className="h-4 w-4 text-cyan-400" />
              <span>Explore 3D GraphRAG</span>
            </Link>
          </Magnetic>
        </motion.div>

        {/* 3D Orb Visualizer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pt-8 min-h-[450px]"
        >
          <HeroOrbCanvas />
        </motion.div>
      </div>
    </section>
  );
}
