"use client";

import { Accordion } from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      id: "faq_1",
      question: "How does GraphRAG differ from traditional Vector RAG?",
      answer: "Traditional RAG retrieves isolated document chunks based purely on text embeddings. GraphRAG extracts entities and topological relationships, constructing a 2-hop sub-graph that synthesizes multi-entity connections for complex multi-step questions."
    },
    {
      id: "faq_2",
      question: "Can I run NEXUS AI with local offline AI models?",
      answer: "Yes! NEXUS AI natively supports local Ollama endpoints (such as Llama-3.3 and DeepSeek R1) alongside cloud APIs (OpenAI, Anthropic) with zero telemetry leakage."
    },
    {
      id: "faq_3",
      question: "What is the Reflection Engine factual score?",
      answer: "The Reflection Engine runs a factual double-check verification step on all retrieved document citations and tool outputs before emitting final streaming SSE frames, ensuring zero hallucination risk."
    },
    {
      id: "faq_4",
      question: "Is multi-tenant workspace isolation guaranteed?",
      answer: "Yes. Every workspace has isolated PostgreSQL vector spaces, HNSW indices, and GraphRAG node networks scoped strictly by workspace ID with JWT RBAC enforcement."
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Everything You Need to Know
          </h2>
        </div>

        <Accordion items={faqs} />
      </div>
    </section>
  );
}
