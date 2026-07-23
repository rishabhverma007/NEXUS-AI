"use client";

import { useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, BrainCircuit, Play, ChevronDown } from "lucide-react";
import { Magnetic } from "@/animations/magnetic";

const HeroOrbCanvas = dynamic(
  () => import("@/three/hero-orb").then((mod) => mod.HeroOrbCanvas),
  { ssr: false }
);

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const orbOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Deep Background Aurora */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-[150px] animate-aurora"
          style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.3), rgba(56,189,248,0.1) 50%, transparent 70%)" }}
        />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px] animate-aurora-slow"
          style={{ background: "radial-gradient(ellipse at center, rgba(56,189,248,0.2), rgba(16,185,129,0.08) 50%, transparent 70%)" }}
        />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px] animate-float-slow"
          style={{ background: "radial-gradient(ellipse at center, rgba(139,92,246,0.2), transparent 60%)" }}
        />
      </div>

      {/* Floating particles / glyphs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full"
            style={{
              background: i % 2 === 0 ? "rgba(124,58,237,0.3)" : "rgba(56,189,248,0.2)",
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              filter: "blur(1px)",
            }}
            animate={{
              y: [0, -15 - i * 5, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 max-w-6xl mx-auto text-center px-6 pt-32 pb-20 flex flex-col items-center"
      >
        {/* Top Announcement Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full nexus-glass border border-nexus-brand/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexus-emerald opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-nexus-emerald" />
            </span>
            <span className="text-[11px] font-semibold text-nexus-accent tracking-wide">
              Announcing NEXUS AI Enterprise OS 2.0
            </span>
            <ArrowRight className="h-3 w-3 text-nexus-accent" />
          </div>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] max-w-5xl mx-auto"
        >
          <span className="text-nexus-50">The Enterprise AI</span>
          <br />
          <span className="bg-gradient-to-r from-nexus-brand-light via-nexus-accent to-nexus-emerald bg-clip-text text-transparent">
            Knowledge Operating System
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-6 text-base sm:text-lg text-nexus-300 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Knowledge. Reasoning. Memory. Agents. Research. Governance.
          <br />
          <span className="text-nexus-400">Everything. One Platform.</span>
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic strength={25} glowColor="rgba(124,58,237,0.2)">
            <Link
              href="/chat"
              className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-nexus-brand via-nexus-brand-light to-nexus-accent text-white font-semibold text-sm shadow-glow-brand hover:shadow-[0_0_40px_-8px_rgba(124,58,237,0.6)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <BrainCircuit className="h-4 w-4 relative z-10" />
              <span className="relative z-10">Launch Operating System</span>
              <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Magnetic>

          <Magnetic strength={20} glowColor="rgba(56,189,248,0.15)">
            <Link
              href="/graph"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl nexus-glass border border-nexus-border hover:border-nexus-border-hover text-nexus-200 font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.04]"
            >
              <Play className="h-4 w-4 text-nexus-accent" />
              <span>Explore Architecture</span>
            </Link>
          </Magnetic>

          <Magnetic strength={15} glowColor="rgba(16,185,129,0.12)">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-nexus-border text-nexus-400 hover:text-nexus-200 font-medium text-sm transition-all duration-300 hover:border-nexus-border-hover hover:bg-white/[0.03]"
            >
              <Sparkles className="h-4 w-4" />
              <span>Book Demo</span>
            </Link>
          </Magnetic>
        </motion.div>

        {/* 3D Orb */}
        <motion.div
          style={{ scale: orbScale, opacity: orbOpacity }}
          className="mt-12 w-full max-w-2xl mx-auto"
        >
          <div className="aspect-square max-h-[500px]">
            <HeroOrbCanvas />
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-5 w-5 text-nexus-400" />
      </motion.div>
    </section>
  );
}
