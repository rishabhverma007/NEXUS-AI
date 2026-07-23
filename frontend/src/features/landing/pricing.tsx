"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter Architect",
    monthly: "$49",
    annual: "$39",
    description: "For small teams building modern AI RAG pipelines.",
    features: [
      "Up to 5 Workspace Members",
      "Hybrid Vector Search (pgvector)",
      "Standard Multi-Agent RAG",
      "100,000 Token Monthly Quota",
      "Community Support",
    ],
    popular: false,
  },
  {
    name: "Enterprise Core",
    monthly: "$199",
    annual: "$169",
    description: "Complete AI Knowledge OS with GraphRAG & Reflection Engine.",
    features: [
      "Unlimited Workspace Members",
      "3D GraphRAG Visualizer & Traversal",
      "Reflection Factual Verification",
      "Long-Term Memory Engine",
      "Local Ollama & Cloud Model Support",
      "Dedicated SLA & Support",
    ],
    popular: true,
  },
  {
    name: "Custom Enterprise",
    monthly: "Custom",
    annual: "Custom",
    description: "On-premise deployment, SOC2 compliance, & dedicated GPU clusters.",
    features: [
      "Air-Gapped On-Premise Deployment",
      "Custom Graph Topology Fine-Tuning",
      "Custom Embedding Models",
      "24/7 Enterprise Architect Support",
      "99.99% Uptime Guarantee",
    ],
    popular: false,
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(true);

  const toggleAnnual = () => setAnnual(!annual);

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-border to-transparent" />
        <div className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full opacity-[0.03] blur-[100px]"
          style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.3), transparent)" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full nexus-glass border border-nexus-emerald/20">
            <Sparkles className="h-3 w-3 text-nexus-emerald" />
            <span className="text-[11px] font-semibold text-nexus-emerald tracking-wide">
              Transparent Enterprise Pricing
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-nexus-50 tracking-tight leading-[1.1]">
            Scale Your AI{" "}
            <span className="bg-gradient-to-r from-nexus-emerald to-nexus-accent bg-clip-text text-transparent">
              Knowledge OS
            </span>
          </h2>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <span className={`text-sm font-medium transition-colors ${!annual ? "text-nexus-50" : "text-nexus-400"}`}>
              Monthly
            </span>
            <button
              onClick={toggleAnnual}
              className="relative h-7 w-14 rounded-full bg-nexus-800 border border-nexus-border transition-colors hover:border-nexus-border-hover"
            >
              <motion.div
                className="absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-gradient-to-r from-nexus-brand to-nexus-accent shadow-glow-brand"
                animate={{ x: annual ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${annual ? "text-nexus-50" : "text-nexus-400"}`}>
              Annual
              <span className="ml-1.5 text-xs font-mono text-nexus-emerald font-semibold">Save 20%</span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="relative group"
            >
              <div
                className={`relative h-full p-8 rounded-3xl border flex flex-col justify-between space-y-8
                transition-all duration-500 hover:-translate-y-1
                ${plan.popular
                  ? "nexus-glass-elevated border-nexus-brand/40 shadow-glow-brand"
                  : "nexus-glass border-nexus-border hover:border-nexus-border-hover hover:shadow-nexus-lg"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-nexus-brand to-nexus-accent text-white text-[10px] font-bold uppercase tracking-widest shadow-glow-brand">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-nexus-50">{plan.name}</h3>
                  <p className="text-sm text-nexus-400 leading-relaxed">{plan.description}</p>

                  {/* Price */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={annual ? "annual" : "monthly"}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-baseline gap-1 pt-2"
                    >
                      <span className="text-5xl font-extrabold text-nexus-50 tracking-tight">
                        {annual ? plan.annual : plan.monthly}
                      </span>
                      {plan.monthly !== "Custom" && (
                        <span className="text-sm text-nexus-400 font-medium">/month</span>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Features */}
                <div className="space-y-4 flex-1">
                  <div className="h-px bg-gradient-to-r from-nexus-border via-nexus-border to-transparent" />
                  <div className="space-y-3">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-3 text-sm">
                        <Check className="h-4 w-4 text-nexus-emerald flex-shrink-0 mt-0.5" />
                        <span className="text-nexus-300">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button
                  className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300
                  ${plan.popular
                    ? "bg-gradient-to-r from-nexus-brand to-nexus-accent text-white shadow-glow-brand hover:shadow-[0_0_40px_-8px_rgba(124,58,237,0.5)] hover:-translate-y-0.5"
                    : "nexus-glass border border-nexus-border text-nexus-200 hover:border-nexus-border-hover hover:bg-white/[0.04]"
                  }`}
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
