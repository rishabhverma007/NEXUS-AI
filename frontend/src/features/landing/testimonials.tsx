"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Elena Rostova",
    role: "VP of Engineering, CloudScale",
    quote: "NEXUS AI's GraphRAG engine transformed our knowledge retrieval. What used to take hours of manual documentation research now streams in sub-seconds with complete citation lineage.",
    stars: 5,
    initials: "ER",
    gradient: "from-nexus-brand to-nexus-accent",
  },
  {
    name: "Marcus Vance",
    role: "Chief AI Architect, DataNexus",
    quote: "The Reflection Engine factual verifier is a game-changer for enterprise deployment. Zero hallucinations and full offline Ollama support make it our default AI OS.",
    stars: 5,
    initials: "MV",
    gradient: "from-nexus-emerald to-nexus-accent",
  },
  {
    name: "Sophia Chen",
    role: "Head of Product, Veloce Tech",
    quote: "The UI design rivals Linear and Vercel. The 3D GraphRAG visualizer allowed our team to visually trace entity dependencies across our entire codebase instantly.",
    stars: 5,
    initials: "SC",
    gradient: "from-nexus-amber to-pink-500",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-border to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full nexus-glass border border-nexus-brand/20">
            <Quote className="h-3 w-3 text-nexus-brand-light" />
            <span className="text-[11px] font-semibold text-nexus-brand-light tracking-wide">
              Trusted by AI Leaders
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-nexus-50 tracking-tight leading-[1.1]">
            What Enterprise{" "}
            <span className="bg-gradient-to-r from-nexus-brand-light to-nexus-accent bg-clip-text text-transparent">
              Architects
            </span>{" "}
            Say
          </h2>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className="h-full nexus-glass rounded-3xl border border-nexus-border p-7 space-y-6 flex flex-col justify-between
              transition-all duration-500 hover:border-nexus-border-hover hover:shadow-nexus-lg hover:-translate-y-1">
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: rev.stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-nexus-amber text-nexus-amber"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-nexus-300 leading-relaxed flex-1">
                  &ldquo;{rev.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-nexus-border">
                  <div
                    className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${rev.gradient} flex items-center justify-center text-xs font-bold text-white`}
                  >
                    {rev.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-nexus-50">{rev.name}</div>
                    <div className="text-xs text-nexus-400 font-mono">{rev.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
