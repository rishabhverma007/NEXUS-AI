"use client";

import { motion } from "framer-motion";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  containerVariants,
  itemVariants,
} from "@/animations/presets";

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
  {
    id: "faq_5",
    question: "What enterprise SSO providers do you support?",
    answer:
      "We support SAML 2.0, OpenID Connect, Okta, Azure AD, Google Workspace, and custom OAuth2 providers for enterprise SSO integration.",
  },
];

export function FAQSection() {
  return (
    <section className="relative py-28 px-6 border-t border-white/5 overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-4xl mx-auto space-y-12"
      >
        <div className="text-center space-y-4">
          <motion.div variants={itemVariants}>
            <Badge variant="premium" size="md">
              Frequently Asked Questions
            </Badge>
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight"
          >
            Everything You{" "}
            <span className="text-gradient-primary">Need to Know</span>
          </motion.h2>
        </div>

        <motion.div variants={itemVariants}>
          <Accordion items={faqs} />
        </motion.div>
      </motion.div>
    </section>
  );
}
