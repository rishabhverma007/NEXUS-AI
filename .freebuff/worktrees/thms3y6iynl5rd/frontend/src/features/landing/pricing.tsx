"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  containerVariants,
  itemVariants,
} from "@/animations/presets";

const plans = [
  {
    name: "Starter Architect",
    price: { monthly: "$59", annual: "$49" },
    period: "/month",
    description:
      "For small teams building modern AI RAG pipelines.",
    features: [
      "Up to 5 Workspace Members",
      "Hybrid Vector Search (pgvector)",
      "Standard Multi-Agent RAG",
      "100,000 Token Monthly Quota",
      "Community Support",
    ],
    popular: false,
    gradient: "from-slate-500/10 to-transparent",
    borderColor: "border-white/10",
  },
  {
    name: "Enterprise Core",
    price: { monthly: "$249", annual: "$199" },
    period: "/month",
    description:
      "Complete AI Knowledge OS with GraphRAG & Reflection Engine.",
    features: [
      "Unlimited Workspace Members",
      "3D GraphRAG Visualizer & Traversal",
      "Reflection Factual Verification",
      "Long-Term Memory Engine",
      "Local Ollama & Cloud Model Support",
      "Dedicated SLA & Support",
    ],
    popular: true,
    gradient: "from-nexus-500/20 via-purple-500/10 to-cyan-500/10",
    borderColor: "border-nexus-500/50",
  },
  {
    name: "Custom Enterprise",
    price: { monthly: "Custom", annual: "Custom" },
    period: "",
    description:
      "On-premise deployment, SOC2 compliance, & dedicated GPU clusters.",
    features: [
      "Air-Gapped On-Premise Deployment",
      "Custom Graph Topology Fine-Tuning",
      "Custom Embedding Models",
      "24/7 Enterprise Architect Support",
      "99.99% Uptime Guarantee",
    ],
    popular: false,
    gradient: "from-slate-500/10 to-transparent",
    borderColor: "border-white/10",
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <section className="relative py-28 px-6 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nexus-500/[0.02] to-transparent pointer-events-none" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-7xl mx-auto space-y-16"
      >
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div variants={itemVariants}>
            <Badge variant="premium" size="md">
              Transparent Enterprise Pricing
            </Badge>
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight"
          >
            Scale Your{" "}
            <span className="text-gradient-primary">
              AI Operating System
            </span>
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 pt-2"
          >
            <span
              className={`text-sm font-medium transition-colors ${
                !annual ? "text-slate-100" : "text-slate-500"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-14 h-7 rounded-full bg-white/10 border border-white/10 p-1 flex items-center transition-all cursor-pointer"
            >
              <motion.div
                animate={{ x: annual ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="h-5 w-5 rounded-full bg-gradient-to-r from-nexus-500 to-cyan-500 shadow-lg"
              />
            </button>
            <span
              className={`text-sm font-medium transition-colors ${
                annual ? "text-slate-100" : "text-slate-500"
              }`}
            >
              Annual
              <span className="ml-1.5 text-xs text-emerald-400 font-semibold">
                Save 20%
              </span>
            </span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className={`glass-card rounded-3xl p-8 flex flex-col justify-between space-y-6 relative bg-gradient-to-b ${plan.gradient} ${plan.borderColor} ${
                plan.popular ? "shadow-glow-purple scale-[1.02]" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge variant="premium" size="md" className="gap-1.5">
                    <Sparkles className="h-3 w-3 text-amber-400" />
                    <span>Most Popular</span>
                  </Badge>
                </div>
              )}

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-100">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-extrabold text-slate-100">
                    {annual ? plan.price.annual : plan.price.monthly}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-slate-500">
                      {plan.period}
                    </span>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 space-y-3">
                  {plan.features.map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-3 text-sm text-slate-300"
                    >
                      <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant={plan.popular ? "gradient" : "glass"}
                size="lg"
                className="w-full"
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
