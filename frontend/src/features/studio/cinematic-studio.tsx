"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Route,
  DatabaseZap,
  Share2,
  BrainCircuit,
  RefreshCcw,
  Sparkles,
  ArrowUpRight,
  Orbit,
} from "lucide-react";
import { FadingVideo } from "@/components/ui/fading-video";
import { LiquidCard } from "@/components/ui/liquid-card";
import { BlurText } from "@/components/ui/blur-text";

// Local, same-origin asset (free-to-use starfield timelapse, vendored in
// frontend/public/videos/). No external dependency means the cinematic
// background always plays — no hotlink/CORS risk.
const SPACE_VIDEO = "/videos/starfield-timelapse.mp4";

const AGENT_MODULES = [
  {
    icon: Route,
    title: "Router Agent",
    description:
      "Intents and routes every query to the optimal execution path across the multi-agent pipeline.",
    accent: "text-cyan-300",
    ring: "from-cyan-400/30 to-transparent",
  },
  {
    icon: DatabaseZap,
    title: "Vector RAG Agent",
    description:
      "Semantic retrieval over pgvector embeddings with dense cosine scoring for precision recall.",
    accent: "text-blue-300",
    ring: "from-blue-400/30 to-transparent",
  },
  {
    icon: Share2,
    title: "Graph RAG Agent",
    description:
      "Traverses the enterprise knowledge graph, following multi-hop relational paths to surface entities.",
    accent: "text-indigo-300",
    ring: "from-indigo-400/30 to-transparent",
  },
  {
    icon: BrainCircuit,
    title: "Memory Agent",
    description:
      "Persists episodic and semantic memory across sessions, personalizing every future interaction.",
    accent: "text-violet-300",
    ring: "from-violet-400/30 to-transparent",
  },
  {
    icon: RefreshCcw,
    title: "Reflection Engine",
    description:
      "Self-verifies generated claims against retrieved evidence, refining answers before delivery.",
    accent: "text-emerald-300",
    ring: "from-emerald-400/30 to-transparent",
  },
  {
    icon: Sparkles,
    title: "Synthesis Agent",
    description:
      "Fuses routed, retrieved, and reasoned signals into a coherent, citation-grounded response.",
    accent: "text-amber-300",
    ring: "from-amber-400/30 to-transparent",
  },
];

export function CinematicStudio() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Cinematic space background spanning the full viewport height */}
      <FadingVideo src={SPACE_VIDEO} className="absolute inset-0 z-0 h-full w-full" />

      {/* Content layer */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-16 md:py-24">
        {/* Centered Hero */}
        <header className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="liquid-glass flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium tracking-[0.22em] text-white/70 uppercase"
          >
            <Orbit className="h-3.5 w-3.5 text-cyan-300" />
            Visual Low-Code AI Studio
          </motion.div>

          <h1 className="mt-8 max-w-3xl text-5xl leading-[1.05] text-white md:text-7xl">
            <BlurText
              text="Compose your enterprise"
              className="font-serif italic"
              delay={0.15}
            />
            <br />
            <BlurText
              text="agent orchestra"
              className="font-serif italic text-white/60"
              delay={0.55}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed font-light text-white/60 md:text-lg"
          >
            Drag, connect, and orchestrate the six sovereign agents that power ZHĪ AI —
            visually, without a single line of code.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/studio/workspace"
              className="liquid-glass-strong group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.03]"
            >
              Launch the Studio
              <ArrowUpRight className="h-4 w-4 text-cyan-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <a
              href="#agents"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white/70 transition-colors duration-300 hover:text-white"
            >
              Explore the agents
            </a>
          </motion.div>
        </header>

        {/* Agent Module Grid */}
        <section id="agents" className="mt-20 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-28">
          {AGENT_MODULES.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={agent.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: (i % 3) * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <LiquidCard
                  strong
                  className="group h-full rounded-[28px] p-7 transition-transform duration-300 hover:-translate-y-1.5"
                >
                  <div
                    className={`pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-tr ${agent.ring} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  />
                  <div className="relative">
                    <div
                      className={`liquid-glass inline-flex h-12 w-12 items-center justify-center rounded-2xl ${agent.accent}`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <span className="absolute top-0 right-0 text-[11px] font-medium tracking-widest text-white/25">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="mt-6 font-serif text-2xl text-white italic">{agent.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed font-light text-white/55">
                      {agent.description}
                    </p>
                  </div>
                </LiquidCard>
              </motion.div>
            );
          })}
        </section>

        {/* Footer CTA */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 mb-8 text-center md:mt-24"
        >
          <p className="text-xs tracking-[0.3em] text-white/30 uppercase">
            ZHĪ AI · Enterprise Knowledge Operating System
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
