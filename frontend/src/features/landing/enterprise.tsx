"use client";

import { motion } from "framer-motion";
import { Cpu, Lock, Shield, Zap, CheckCircle2 } from "lucide-react";
import { SectionHeader } from "./section-header";
import { SpotlightCard } from "@/animations/spotlight-card";
import { AnimatedCounter } from "@/animations/animated-counter";

export function EnterpriseSection() {
  const specs = [
    "SOC-2 Type II Certified Security Architecture",
    "Isolated Tenant Workspaces & Database Schemas",
    "Sub-50ms SSE Token Stream Delivery",
    "Cloud (OpenAI/Anthropic) & Local Ollama Support",
    "Role-Based Access Control (RBAC) Guardrails",
    "99.99% Uptime SLA for Enterprise Customers",
  ];

  const telemetry = [
    { label: "JWT Token Validation", value: "PASSED (256-bit)", color: "text-emerald-400" },
    { label: "Tenant Isolation Scope", value: "ws_default_01", color: "text-cyan-400" },
    { label: "Vector Index Engine", value: "pgvector HNSW", color: "text-violet-400" },
    { label: "Reflection Score", value: "0.96 / 1.00", color: "text-amber-400" },
  ];

  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center relative">
        <div className="space-y-8">
          <SectionHeader
            align="left"
            eyebrow="Enterprise Grade Architecture"
            title={
              <>
                Built for <span className="text-gradient-violet">Compliance</span> &
                Security-Conscious Organizations
              </>
            }
            subtitle="NEXUS AI ensures absolute tenant isolation, strict encryption at rest and in transit, and local offline AI model deployments via Ollama."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {specs.map((spec, i) => (
              <motion.div
                key={spec}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 text-[13px] text-slate-300 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>{spec}</span>
              </motion.div>
            ))}
          </div>

          {/* Counters */}
          <div className="grid grid-cols-3 gap-6 pt-2">
            {[
              { value: 99.99, decimals: 2, suffix: "%", label: "Uptime SLA" },
              { value: 50, prefix: "<", suffix: "ms", label: "Stream latency" },
              { value: 256, suffix: "-bit", label: "Encryption" },
            ].map((c) => (
              <div key={c.label} className="text-center sm:text-left">
                <div className="font-display text-2xl sm:text-3xl font-bold text-white">
                  <AnimatedCounter
                    value={c.value}
                    prefix={c.prefix ?? ""}
                    suffix={c.suffix}
                    decimals={c.decimals ?? 0}
                    className="text-gradient"
                  />
                </div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono mt-1">{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live security telemetry monitor */}
        <SpotlightCard>
          <div className="relative glass-card rounded-[28px] border-white/10 overflow-hidden p-7">
            <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />

            {/* Radar */}
            <div className="relative mx-auto mb-7 h-40 w-40">
              <div className="absolute inset-0 rounded-full border border-indigo-400/20" />
              <div className="absolute inset-4 rounded-full border border-indigo-400/20" />
              <div className="absolute inset-8 rounded-full border border-indigo-400/20" />
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-[conic-gradient(from_0deg,rgba(99,102,241,0.28),transparent_60deg,transparent)]"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 animate-pulse-ring" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400" />
                </span>
              </div>
              <Shield className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-6 w-6 text-indigo-400" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/8 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
                  <Cpu className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Security Telemetry</h3>
                  <span className="text-[10px] text-slate-500 font-mono">Real-Time Threat Prevention</span>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-400/25 flex items-center gap-1.5">
                <Lock className="h-3 w-3" />
                ENCRYPTED
              </span>
            </div>

            {/* Telemetry rows */}
            <div className="space-y-2.5 relative">
              {telemetry.map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3.5 rounded-xl bg-black/40 border border-white/8 flex justify-between text-xs items-center group hover:border-indigo-400/30 transition-all"
                >
                  <span className="text-slate-400 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
                    {row.label}
                  </span>
                  <span className={`font-bold font-mono ${row.color}`}>{row.value}</span>
                </motion.div>
              ))}
            </div>

            {/* Footer pulse */}
            <div className="mt-5 flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <Zap className="h-3 w-3 text-amber-400" />
              <span>Threats blocked this hour:</span>
              <span className="text-amber-300 font-bold">
                <AnimatedCounter value={1284} />
              </span>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
