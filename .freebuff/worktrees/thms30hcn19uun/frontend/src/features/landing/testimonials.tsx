"use client";

import { Star } from "lucide-react";

export function TestimonialsSection() {
  const reviews = [
    {
      name: "Elena Rostova",
      role: "VP of Engineering, CloudScale",
      quote: "NEXUS AI's GraphRAG engine transformed our knowledge retrieval. What used to take hours of manual documentation research now streams in sub-seconds with complete citation lineage.",
      stars: 5
    },
    {
      name: "Marcus Vance",
      role: "Chief AI Architect, DataNexus",
      quote: "The Reflection Engine factual verifier is a game-changer for enterprise deployment. Zero hallucinations and full offline Ollama support make it our default AI OS.",
      stars: 5
    },
    {
      name: "Sophia Chen",
      role: "Head of Product, Veloce Tech",
      quote: "The UI design rivals Linear and Vercel. The 3D GraphRAG visualizer allowed our team to visually trace entity dependencies across our entire codebase instantly.",
      stars: 5
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            Trusted by AI Leaders
          </span>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            What Enterprise Architects Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div key={rev.name} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">"{rev.quote}"</p>
              </div>

              <div className="pt-3 border-t border-slate-800/60">
                <div className="text-xs font-semibold text-slate-100">{rev.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">{rev.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
