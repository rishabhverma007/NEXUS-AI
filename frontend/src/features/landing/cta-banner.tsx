"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Rocket } from "lucide-react";
import { ParticleField } from "@/animations/particle-field";
import { Magnetic } from "@/animations/magnetic";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CTABanner() {
  return (
    <section className="px-6 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 32 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative max-w-5xl mx-auto glow-border rounded-[36px] overflow-hidden"
      >
        {/* Inner gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/70 via-[#0a0a22]/80 to-cyan-950/60" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[560px] h-[280px] bg-indigo-500/25 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[360px] h-[240px] bg-cyan-400/15 rounded-full blur-[110px] pointer-events-none" />
        <ParticleField density={50} className="opacity-50" />

        <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-20 text-center space-y-7">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/12 text-[11px] font-semibold text-indigo-200 tracking-widest uppercase"
          >
            <Rocket className="h-3.5 w-3.5" />
            Deploy in minutes
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.7, ease: EASE }}
            className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.05]"
          >
            Ready to run your
            <br />
            <span className="text-gradient">AI Knowledge OS</span>?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base"
          >
            Spin up your first workspace, connect your models, and stream
            citation-grounded answers in under five minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Magnetic strength={20}>
              <Link
                href="/chat"
                className="shine group px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500 text-white font-semibold text-sm flex items-center gap-2.5 shadow-glow-violet hover:scale-[1.03] active:scale-[0.98] transition-transform"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <Link
              href="/graph"
              className="px-8 py-4 rounded-2xl glass-panel border border-white/12 text-slate-100 font-semibold text-sm hover:border-indigo-400/40 hover:bg-white/5 transition-all"
            >
              Explore 3D GraphRAG
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
