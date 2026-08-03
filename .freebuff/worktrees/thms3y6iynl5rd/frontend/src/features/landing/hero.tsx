"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Terminal,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/animations/magnetic";
import { Badge } from "@/components/ui/badge";

const HeroOrbCanvas = dynamic(
  () => import("@/three/hero-orb").then((mod) => mod.HeroOrbCanvas),
  { ssr: false }
);

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Aurora Background */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-blob" />
        <div className="aurora-blob" />
        <div className="aurora-blob" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 25%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 25%, transparent 70%)",
        }}
      />

      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#05070A] to-transparent z-[2]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto text-center space-y-8 relative z-10 px-6 pt-24"
      >
        {/* Announcement Badge */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <Badge variant="premium" size="md" className="gap-2">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Introducing NEXUS AI Enterprise OS 2.0</span>
            <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
          </Badge>
        </motion.div>

        {/* Main Headline */}
        <motion.div variants={itemVariants}>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-100 max-w-5xl mx-auto leading-[0.95]">
            <span className="block">The Enterprise AI</span>
            <span className="text-gradient-primary">
              Operating System
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed"
        >
          Knowledge. Reasoning. Memory. Agents. Research. Governance.
          <br />
          <span className="text-slate-400">
            Everything you need. One unified platform.
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <Magnetic strength={30}>
            <Link href="/chat">
              <Button variant="gradient" size="xl" className="gap-3">
                <Sparkles className="h-5 w-5" />
                <span>Launch Workspace</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </Magnetic>

          <Magnetic strength={20}>
            <Link href="#features">
              <Button variant="glass" size="xl" className="gap-2">
                <Terminal className="h-5 w-5 text-cyan-400" />
                <span>Explore Architecture</span>
              </Button>
            </Link>
          </Magnetic>

          <Link href="#pricing">
            <Button variant="ghost" size="xl" className="text-slate-400">
              View Pricing
            </Button>
          </Link>
        </motion.div>

        {/* 3D Orb Visualizer */}
        <motion.div
          variants={itemVariants}
          className="pt-8 min-h-[500px]"
        >
          <HeroOrbCanvas />
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
