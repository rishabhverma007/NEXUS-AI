"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";

const faqs = [
  {
    id: "faq_1",
    question: "How does GraphRAG differ from traditional Vector RAG?",
    answer:
      "Traditional RAG retrieves isolated document chunks based purely on text embeddings. GraphRAG extracts entities and topological relationships, constructing a 2-hop sub-graph that synthesizes multi-entity connections for complex multi-step questions. This enables the model to understand not just what documents say, but how concepts relate to each other across your entire knowledge base.",
  },
  {
    id: "faq_2",
    question: "Can I run NEXUS AI with local offline AI models?",
    answer:
      "Yes! NEXUS AI natively supports local Ollama endpoints (such as Llama-3.3 and DeepSeek R1) alongside cloud APIs (OpenAI, Anthropic) with zero telemetry leakage. You can configure your default LLM provider, model temperature, and base URL for local inference directly from the settings panel — no data ever leaves your infrastructure when using local models.",
  },
  {
    id: "faq_3",
    question: "What is the Reflection Engine factual score?",
    answer:
      "The Reflection Engine runs a factual double-check verification step on all retrieved document citations and tool outputs before emitting final streaming SSE frames. It scores each response against the source material with configurable thresholds (default 0.85), ensuring zero hallucination risk. This is particularly critical for enterprise use cases like legal research, medical documentation, and financial compliance.",
  },
  {
    id: "faq_4",
    question: "Is multi-tenant workspace isolation guaranteed?",
    answer:
      "Yes. Every workspace has isolated PostgreSQL vector spaces, HNSW indices, and GraphRAG node networks scoped strictly by workspace ID with JWT RBAC enforcement. Tenant isolation is verified at every layer: database schemas, embedding namespaces, graph topology partitions, and memory stores. This meets SOC-2 Type II compliance requirements for multi-tenant enterprise deployments.",
  },
];

export function FAQSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-border to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full nexus-glass border border-nexus-accent/20">
            <HelpCircle className="h-3 w-3 text-nexus-accent" />
            <span className="text-[11px] font-semibold text-nexus-accent tracking-wide">
              Frequently Asked Questions
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-nexus-50 tracking-tight leading-[1.1]">
            Everything You{" "}
            <span className="bg-gradient-to-r from-nexus-accent to-nexus-emerald bg-clip-text text-transparent">
              Need to Know
            </span>
          </h2>
          <p className="text-sm text-nexus-400 max-w-xl mx-auto">
            Quick answers to common questions about our Enterprise AI Knowledge Operating System.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion items={faqs} />
        </motion.div>
      </div>
    </section>
  );
}
