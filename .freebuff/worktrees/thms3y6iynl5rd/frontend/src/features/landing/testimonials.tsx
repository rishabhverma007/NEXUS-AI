"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  containerVariants,
  itemVariants,
} from "@/animations/presets";

const reviews = [
  {
    name: "Elena Rostova",
    role: "VP of Engineering, CloudScale",
    quote:
      "NEXUS AI's GraphRAG engine transformed our knowledge retrieval. What used to take hours of manual documentation research now streams in sub-seconds with complete citation lineage.",
    stars: 5,
  },
  {
    name: "Marcus Vance",
    role: "Chief AI Architect, DataNexus",
    quote:
      "The Reflection Engine factual verifier is a game-changer for enterprise deployment. Zero hallucinations and full offline Ollama support make it our default AI OS.",
    stars: 5,
  },
  {
    name: "Sophia Chen",
    role: "Head of Product, Veloce Tech",
    quote:
      "The UI design rivals Linear and Vercel. The 3D GraphRAG visualizer allowed our team to visually trace entity dependencies across our entire codebase instantly.",
    stars: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative py-28 px-6 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="space-y-16"
        >
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <motion.div variants={itemVariants}>
              <Badge variant="premium" size="md">
                Trusted by AI Leaders
              </Badge>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight"
            >
              What Enterprise{" "}
              <span className="text-gradient-accent">Architects</span> Say
            </motion.h2>
          </div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {reviews.map((rev) => (
              <motion.div
                key={rev.name}
                variants={itemVariants}
                className="glass-card rounded-2xl p-8 space-y-6 flex flex-col justify-between relative group"
              >
                {/* Quote icon */}
                <div className="absolute top-4 right-4 text-white/5">
                  <Quote className="h-12 w-12" />
                </div>

                <div className="space-y-4 relative z-[1]">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rev.stars }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 relative z-[1]">
                  <div className="text-sm font-semibold text-slate-100">
                    {rev.name}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    {rev.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
