"use client";

import { Star } from "lucide-react";
import { Marquee } from "@/animations/marquee";
import { SectionHeader } from "./section-header";

const reviews = [
  {
    name: "Elena Rostova",
    role: "VP of Engineering, CloudScale",
    quote: "NEXUS AI's GraphRAG engine transformed our knowledge retrieval. What used to take hours of manual research now streams in sub-seconds with complete citation lineage.",
  },
  {
    name: "Marcus Vance",
    role: "Chief AI Architect, DataNexus",
    quote: "The Reflection Engine factual verifier is a game-changer. Zero hallucinations and full offline Ollama support make it our default AI OS.",
  },
  {
    name: "Sophia Chen",
    role: "Head of Product, Veloce Tech",
    quote: "The 3D GraphRAG visualizer let our team trace entity dependencies across our entire codebase instantly. The design rivals Linear and Vercel.",
  },
  {
    name: "David Okafor",
    role: "CTO, Meridian Labs",
    quote: "We cut retrieval latency by 68% overnight. The hybrid pgvector + BM25 fusion is the most precise system we've benchmarked.",
  },
  {
    name: "Amara Diallo",
    role: "Director of AI, Northwind",
    quote: "Tenant isolation and RBAC guardrails passed our security review on the first pass. Rare for a platform this deep.",
  },
  {
    name: "Kenji Watanabe",
    role: "Staff Engineer, Kintaro",
    quote: "The SSE token streaming feels instant — our users think the answers are pre-cached. They aren't.",
  },
];

const logos = ["CloudScale", "DataNexus", "Veloce Tech", "Meridian Labs", "Northwind", "Kintaro", "Helios AI", "AuroraGrid"];

function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  return (
    <div className="w-[340px] shrink-0 glass-card rounded-3xl border-white/8 p-6 space-y-4 hover:border-indigo-400/30 hover:bg-white/[0.04] transition-all duration-300">
      <div className="flex items-center gap-1 text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
        ))}
      </div>
      <p className="text-[13px] text-slate-300 leading-relaxed">"{review.quote}"</p>
      <div className="pt-3 border-t border-white/8">
        <div className="text-xs font-bold text-white">{review.name}</div>
        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{review.role}</div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="absolute bottom-0 right-1/4 w-[460px] h-[460px] bg-cyan-500/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="max-w-6xl mx-auto space-y-16 relative">
        <SectionHeader
          eyebrow="Trusted by AI Leaders"
          title={
            <>
              What Enterprise Architects <span className="text-gradient-violet">Say</span>
            </>
          }
        />

        {/* Logo marquee */}
        <div className="space-y-4">
          <Marquee duration={32}>
            {logos.map((logo) => (
              <div
                key={logo}
                className="shrink-0 px-8 py-4 rounded-2xl border border-white/6 bg-white/[0.02] text-slate-500 hover:text-slate-200 transition-colors font-display font-semibold text-lg tracking-tight"
              >
                {logo}
              </div>
            ))}
          </Marquee>
        </div>

        {/* Dual-row review marquee */}
        <div className="space-y-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <Marquee duration={46}>
            {reviews.slice(0, 3).map((r) => (
              <ReviewCard key={r.name} review={r} />
            ))}
          </Marquee>
          <Marquee duration={52} reverse>
            {reviews.slice(3).map((r) => (
              <ReviewCard key={r.name} review={r} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
