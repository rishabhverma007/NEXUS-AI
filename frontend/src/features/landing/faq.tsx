"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";

const faqs = [
  {
    id: "faq_1",
    question: "How does GraphRAG differ from traditional Vector RAG?",
    answer:
      "Traditional RAG retrieves isolated document chunks based purely on text embeddings. GraphRAG extracts entities and topological relationships, constructing a 2-hop sub-graph that synthesizes multi-entity connections for complex multi-step questions.",
  },
  {
    id: "faq_2",
    question: "Can I run NEXUS AI with local offline AI models?",
    answer:
      "Yes! NEXUS AI natively supports local Ollama endpoints (such as Llama-3.3 and DeepSeek R1) alongside cloud APIs (OpenAI, Anthropic) with zero telemetry leakage.",
  },
  {
    id: "faq_3",
    question: "What is the Reflection Engine factual score?",
    answer:
      "The Reflection Engine runs a factual double-check verification step on all retrieved document citations and tool outputs before emitting final streaming SSE frames, ensuring zero hallucination risk.",
  },
  {
    id: "faq_4",
    question: "Is multi-tenant workspace isolation guaranteed?",
    answer:
      "Yes. Every workspace has isolated PostgreSQL vector spaces, HNSW indices, and GraphRAG node networks scoped strictly by workspace ID with JWT RBAC enforcement.",
  },
];

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(faqs[0].id);

  return (
    <section className="relative py-28 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <SectionHeader
          eyebrow="Frequently Asked Questions"
          title={
            <>
              Everything You Need to <span className="text-gradient">Know</span>
            </>
          }
        />

        <div className="space-y-3.5">
          {faqs.map((item) => {
            const isOpen = openId === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={cn(
                  "rounded-2xl border transition-all duration-300 overflow-hidden",
                  isOpen
                    ? "border-indigo-400/30 bg-white/[0.04] shadow-glow-violet"
                    : "border-white/8 bg-white/[0.02] hover:border-white/20"
                )}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 group"
                  aria-expanded={isOpen}
                >
                  <span className={cn("text-sm font-semibold transition-colors", isOpen ? "text-white" : "text-slate-200 group-hover:text-white")}>
                    {item.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={cn(
                      "h-8 w-8 shrink-0 rounded-full border flex items-center justify-center transition-colors",
                      isOpen
                        ? "bg-gradient-to-r from-indigo-500 to-cyan-500 border-transparent text-white"
                        : "border-white/15 text-slate-400 group-hover:text-white"
                    )}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-5 pb-5 text-[13px] text-slate-400 leading-relaxed border-t border-white/8 pt-4">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
