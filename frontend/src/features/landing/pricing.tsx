"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./section-header";
import { SpotlightCard } from "@/animations/spotlight-card";

export function PricingSection() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: "Starter Architect",
      price: annual ? "$49" : "$59",
      period: "/month",
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
      price: annual ? "$199" : "$249",
      period: "/month",
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
      price: "Custom",
      period: "",
      description: "On-premise deployment, SOC2 compliance & dedicated GPU clusters.",
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

  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="max-w-6xl mx-auto space-y-14 relative">
        <SectionHeader
          eyebrow="Transparent Enterprise Pricing"
          title={
            <>
              Scale Your AI <span className="text-gradient">Knowledge OS</span>
            </>
          }
        />

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4"
        >
          <span className={`text-sm ${!annual ? "text-white font-semibold" : "text-slate-400"}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            aria-label="Toggle billing period"
            className="w-16 h-9 rounded-full bg-white/8 border border-white/15 p-1 flex items-center transition-colors hover:border-indigo-400/40"
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className={`h-7 w-7 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-glow ${
                annual ? "ml-auto" : "ml-0"
              }`}
            />
          </button>
          <span className={`text-sm ${annual ? "text-white font-semibold" : "text-slate-400"}`}>
            Annual{" "}
            <span className="text-emerald-400 text-xs font-mono ml-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/25">
              Save 20%
            </span>
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-stretch">
          {plans.map((plan, idx) => (
            <SpotlightCard key={plan.name} delay={idx * 0.08} className="h-full">
              <div
                className={`relative h-full p-8 rounded-[28px] flex flex-col space-y-6 transition-all duration-300 hover:-translate-y-1.5 ${
                  plan.popular
                    ? "glow-border shadow-glow-violet"
                    : "glass-card border-white/8 hover:border-white/20"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 text-white font-bold text-[10px] uppercase tracking-wider shadow-glow-violet flex items-center gap-1.5 whitespace-nowrap">
                    <Crown className="h-3 w-3" />
                    Most Popular
                  </span>
                )}

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white font-display">{plan.name}</h3>
                  <p className="text-[13px] text-slate-400 leading-relaxed">{plan.description}</p>
                  <div className="flex items-baseline gap-1.5 pt-2">
                    <motion.span
                      key={plan.price}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-display text-5xl font-bold text-white tracking-tight"
                    >
                      {plan.price}
                    </motion.span>
                    <span className="text-sm text-slate-400">{plan.period}</span>
                  </div>
                </div>

                <div className="flex-1 pt-4 border-t border-white/10 space-y-3">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-3 text-[13px] text-slate-300">
                      <span className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-500/25 to-cyan-500/25 border border-indigo-400/30 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-cyan-300" />
                      </span>
                      {f}
                    </div>
                  ))}
                </div>

                <Button
                  variant={plan.popular ? "primary" : "glass"}
                  size="lg"
                  className="w-full rounded-2xl"
                >
                  Get Started
                </Button>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
