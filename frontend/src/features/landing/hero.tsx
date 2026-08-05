"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Play, Sparkles, Terminal } from "lucide-react";
import { ParticleField } from "@/animations/particle-field";
import { Magnetic } from "@/animations/magnetic";
import { TextReveal } from "@/animations/text-reveal";
import { EASE_OUT } from "@/animations/springs";

const HeroOrbCanvas = dynamic(
  () => import("@/three/hero-orb").then((mod) => mod.HeroOrbCanvas),
  { ssr: false }
);

const terminalLines = [
  { text: "> router_agent.analyze(intent='graph_rag')", type: "cmd" },
  { text: "✓ routed → hybrid_search · graph_traversal · reflection", type: "ok" },
  { text: "> retrieving pgvector HNSW top_k=24 …", type: "cmd" },
  { text: "✓ RRF fused 24 candidates in 41ms", type: "ok" },
  { text: "> reflection_evaluator.score(citations) = 0.96", type: "ok" },
  { text: "✓ streaming SSE tokens → client (sub-50ms)", type: "ok" },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-scrubbed parallax — the starter's <SpringTrigger mode="scrub">
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const terminalY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen pt-28 pb-10 px-6 overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Layered ambient backdrops */}
      <div className="absolute inset-0 tech-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_42%,black,transparent)] pointer-events-none" />
      <motion.div
        style={{ y: glowY }}
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[560px] bg-indigo-600/20 rounded-full blur-[160px] pointer-events-none animate-pulse-slow"
      />
      <motion.div
        style={{ y: glowY }}
        className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none animate-aurora-shift"
      />
      <div className="absolute bottom-0 right-0 w-[520px] h-[520px] bg-purple-600/12 rounded-full blur-[140px] pointer-events-none animate-aurora-shift [animation-delay:-6s]" />
      <ParticleField className="opacity-70" />

      <motion.div
        style={{ opacity: contentOpacity }}
        className="max-w-6xl mx-auto text-center space-y-8 relative z-10"
      >
        {/* Announcement pill */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel border border-indigo-400/25 text-xs font-semibold text-indigo-200 shadow-glow-violet"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 animate-pulse-ring" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
          </span>
          <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
          <span>NEXUS AI Enterprise OS 1.0 is live</span>
          <ArrowRight className="h-3.5 w-3.5 text-indigo-300" />
        </motion.div>

        {/* TextReveal headline — word-by-word spring reveal */}
        <TextReveal
          as="h1"
          align="center"
          delay={0.15}
          className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white max-w-5xl mx-auto leading-[1.05]"
        >
          The Enterprise AI{" "}
          <span className="text-gradient">Knowledge Operating System</span>
        </TextReveal>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: EASE_OUT }}
          className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Unite <span className="text-slate-200">Multi-Agent RAG</span>,{" "}
          <span className="text-slate-200">GraphRAG entity traversal</span>,{" "}
          <span className="text-slate-200">pgvector hybrid search</span> and{" "}
          <span className="text-slate-200">factual reflection loops</span> in one
          unified SaaS platform — engineered for a million users.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85, ease: EASE_OUT }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Magnetic strength={22}>
            <Link
              href="/chat"
              className="shine group px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500 text-white font-semibold text-sm flex items-center gap-2.5 shadow-glow-violet hover:shadow-glow transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Launch Operating System</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Magnetic>

          <Magnetic strength={16}>
            <Link
              href="/graph"
              className="px-7 py-4 rounded-2xl glass-panel border border-white/10 hover:border-indigo-400/40 text-slate-100 font-semibold text-sm flex items-center gap-2.5 transition-all hover:bg-white/5"
            >
              <Terminal className="h-4 w-4 text-cyan-300" />
              <span>Explore 3D GraphRAG</span>
            </Link>
          </Magnetic>
        </motion.div>

        {/* Live terminal ticker + 3D orb */}
        <div className="grid lg:grid-cols-2 gap-10 items-center pt-10 text-left">
          <motion.div
            style={{ y: terminalY }}
            className="order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 1, ease: EASE_OUT }}
              className="glow-border rounded-3xl shadow-card overflow-hidden"
            >
              <div className="flex items-center gap-2 px-5 py-3.5 bg-white/[0.03] border-b border-white/8">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                <span className="ml-3 text-[11px] font-mono text-slate-400">
                  nexus — live agent pipeline
                </span>
                <span className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  STREAMING
                </span>
              </div>
              <div className="bg-[#050510]/80 p-5 font-mono text-[12.5px] leading-7 min-h-[230px]">
                {terminalLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + i * 0.35 }}
                    className={
                      line.type === "cmd"
                        ? "text-indigo-300"
                        : "text-emerald-300/90"
                    }
                  >
                    {line.text}
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="inline-block h-4 w-2 bg-indigo-400 mt-1"
                />
              </div>
            </motion.div>
          </motion.div>

          <motion.div style={{ y: orbY, scale: orbScale }} className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.1, ease: EASE_OUT }}
            >
              <HeroOrbCanvas />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="h-8 w-px bg-gradient-to-b from-transparent via-indigo-400 to-transparent"
        />
      </motion.div>
    </section>
  );
}
