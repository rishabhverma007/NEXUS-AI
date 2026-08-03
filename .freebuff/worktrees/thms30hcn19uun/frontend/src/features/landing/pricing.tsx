"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        "Community Support"
      ],
      popular: false
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
        "Dedicated SLA & Support"
      ],
      popular: true
    },
    {
      name: "Custom Enterprise",
      price: "Custom",
      period: "",
      description: "On-premise deployment, SOC2 compliance, & dedicated GPU clusters.",
      features: [
        "Air-Gapped On-Premise Deployment",
        "Custom Graph Topology Fine-Tuning",
        "Custom Embedding Models",
        "24/7 Enterprise Architect Support",
        "99.99% Uptime Guarantee"
      ],
      popular: false
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            Transparent Enterprise Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Scale Your AI Knowledge Operating System
          </h2>

          <div className="flex items-center justify-center gap-3 pt-2">
            <span className={`text-xs ${!annual ? "text-slate-100 font-bold" : "text-slate-400"}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="w-12 h-6 rounded-full bg-slate-800 p-1 flex items-center transition-all border border-slate-700"
            >
              <div className={`h-4 w-4 rounded-full bg-cyan-400 transition-all ${annual ? "translate-x-6" : ""}`} />
            </button>
            <span className={`text-xs ${annual ? "text-slate-100 font-bold" : "text-slate-400"}`}>
              Annual <span className="text-emerald-400 text-[10px] font-mono">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass-panel p-8 rounded-3xl border flex flex-col justify-between space-y-6 relative ${
                plan.popular ? "border-blue-500/60 bg-blue-950/20 shadow-glow" : "border-slate-800"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-glow">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-100">{plan.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-100">{plan.price}</span>
                  <span className="text-xs text-slate-400">{plan.period}</span>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant={plan.popular ? "primary" : "outline"} className="w-full">
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
