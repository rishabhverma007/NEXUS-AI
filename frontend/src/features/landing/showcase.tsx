"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Maximize2, Pause, Play, Volume2 } from "lucide-react";
import { SectionHeader } from "./section-header";

const EASE = [0.22, 1, 0.36, 1] as const;

function DashboardMockup({ playing }: { playing: boolean }) {
  const bars = [38, 62, 45, 78, 52, 90, 66, 74, 42, 84, 58, 96];
  return (
    <div className="bg-[#07071a] rounded-2xl border border-white/10 overflow-hidden text-left">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/8">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-3 text-[10px] font-mono text-slate-400">app.nexus.ai/operating-system</span>
      </div>

      <div className="p-6 grid grid-cols-12 gap-4">
        {/* Sidebar skeleton */}
        <div className="col-span-3 hidden sm:flex flex-col gap-3">
          <div className="h-7 w-3/4 rounded-lg bg-gradient-to-r from-indigo-500/40 to-violet-500/40 animate-pulse-slow" />
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="h-4 rounded-md bg-white/8"
              animate={playing ? { opacity: [0.4, 0.9, 0.4] } : { opacity: 0.6 }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
            />
          ))}
        </div>

        {/* Main panel */}
        <div className="col-span-12 sm:col-span-9 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-40 rounded-md bg-white/10 animate-pulse-slow" />
            <div className="h-7 w-24 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500" />
          </div>

          {/* Chart */}
          <div className="h-32 rounded-xl border border-white/8 bg-white/[0.02] p-4 flex items-end gap-1.5">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-indigo-600 to-cyan-400"
                initial={{ height: "12%" }}
                animate={playing ? { height: `${h}%` } : { height: h * 0.6 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.6, delay: i * 0.08 }}
              />
            ))}
          </div>

          {/* Streaming log */}
          <div className="space-y-2">
            {[
              { t: "router → hybrid_search", w: "w-3/4" },
              { t: "graph traversal · 2-hop", w: "w-2/3" },
              { t: "reflection score 0.96 ✓", w: "w-5/6" },
            ].map((row, i) => (
              <motion.div
                key={i}
                className="h-3 rounded-full bg-white/6"
                animate={playing ? { opacity: [0.35, 0.85, 0.35] } : { opacity: 0.55 }}
                transition={{ repeat: Infinity, duration: 2.4, delay: i * 0.4 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShowcaseSection() {
  const [playing, setPlaying] = useState(true);

  return (
    <section className="relative py-28 px-6">
      <div className="max-w-5xl mx-auto space-y-14">
        <SectionHeader
          eyebrow="Product Film"
          title={
            <>
              One Operating System. <span className="text-gradient">Every Agent.</span>
            </>
          }
          subtitle="Watch the entire multi-agent pipeline — routing, retrieval, graph traversal, reflection and streaming synthesis — orchestrated in real time."
        />

        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative"
        >
          {/* Glow under the video */}
          <div className="absolute -inset-6 bg-gradient-to-r from-indigo-600/20 via-violet-600/20 to-cyan-500/20 blur-3xl rounded-[40px] pointer-events-none" />

          <div className="relative glow-border rounded-[28px] shadow-card overflow-hidden">
            <DashboardMockup playing={playing} />

            {/* Scanline overlay */}
            <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40">
              <motion.div
                className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-cyan-300/10 to-transparent"
                animate={playing ? { top: ["-10%", "110%"] } : { top: "50%" }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              />
            </div>

            {/* Play controls bar */}
            <div className="relative flex items-center gap-4 px-6 py-4 bg-[#0a0a20]/90 border-t border-white/10 backdrop-blur-xl">
              <button
                onClick={() => setPlaying((p) => !p)}
                className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-glow hover:scale-105 active:scale-95 transition-transform"
                aria-label={playing ? "Pause demo" : "Play demo"}
              >
                {playing ? <Pause className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white ml-0.5" />}
              </button>

              {/* Progress bar */}
              <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400"
                  animate={playing ? { width: ["0%", "100%"] } : {}}
                  transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                />
              </div>
              <span className="font-mono text-[10px] text-slate-400 w-24 text-right">0:12 / 2:47</span>
              <Volume2 className="h-4 w-4 text-slate-500" />
              <Maximize2 className="h-4 w-4 text-slate-500" />
            </div>

            {/* Watermark */}
            <div className="absolute top-5 right-6 flex items-center gap-2 text-[11px] font-mono text-white/70 bg-black/40 backdrop-blur px-3 py-1.5 rounded-full border border-white/15">
              <BrainCircuit className="h-3.5 w-3.5 text-cyan-300" />
              NEXUS AI · CAPTURE
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
