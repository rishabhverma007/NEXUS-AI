"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle2, Lock, Server, Zap, Users, Building2 } from "lucide-react";

const specs = [
  "SOC-2 Type II Certified Security Architecture",
  "Isolated Tenant Workspaces & Database Schemas",
  "Sub-50ms SSE Token Stream Delivery",
  "Support for Cloud (OpenAI/Anthropic) & Local Ollama",
  "Role-Based Access Control (RBAC) Guardrails",
  "99.99% Uptime SLA for Enterprise Customers",
];

export function EnterpriseSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-border to-transparent" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full opacity-[0.04] blur-[120px]"
          style={{ background: "radial-gradient(ellipse at center, rgba(56,189,248,0.3), transparent)" }}
        />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full opacity-[0.03] blur-[100px]"
          style={{ background: "radial-gradient(ellipse at center, rgba(16,185,129,0.3), transparent)" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full nexus-glass border border-nexus-emerald/20">
              <Building2 className="h-3 w-3 text-nexus-emerald" />
              <span className="text-[11px] font-semibold text-nexus-emerald tracking-wide">
                Enterprise Grade Architecture
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-nexus-50 tracking-tight leading-[1.1]">
              Built for High Compliance &{" "}
              <span className="bg-gradient-to-r from-nexus-emerald to-nexus-accent bg-clip-text text-transparent">
                Security-Conscious
              </span>{" "}
              Organizations
            </h2>

            <p className="text-base text-nexus-400 leading-relaxed">
              NEXUS AI ensures absolute tenant isolation, strict encryption at rest and in transit,
              and local offline AI model deployments via Ollama — no data ever leaves your infrastructure.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {specs.map((spec, idx) => (
                <motion.div
                  key={spec}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.03 }}
                  className="flex items-start gap-3 text-sm text-nexus-300 group"
                >
                  <CheckCircle2 className="h-5 w-5 text-nexus-emerald flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span>{spec}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Security Telemetry Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="nexus-glass-elevated rounded-3xl border border-nexus-border p-8 space-y-6 relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-[0.08] blur-[80px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.5), transparent)" }}
              />

              {/* Header */}
              <div className="flex items-center justify-between border-b border-nexus-border pb-5 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-nexus-accent/10 border border-nexus-accent/20">
                    <Shield className="h-5 w-5 text-nexus-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-nexus-50">Security Telemetry</h3>
                    <p className="text-xs text-nexus-400 font-mono">Real-Time Threat Prevention</p>
                  </div>
                </div>
                <div className="nexus-badge-emerald flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-nexus-emerald animate-pulse" />
                  <span>ENCRYPTED</span>
                </div>
              </div>

              {/* Telemetry Rows */}
              <div className="space-y-3 relative z-10">
                <div className="p-4 rounded-2xl bg-nexus-850/80 border border-nexus-border flex items-center justify-between group hover:border-nexus-emerald/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock className="h-4 w-4 text-nexus-400 group-hover:text-nexus-emerald transition-colors" />
                    <span className="text-sm text-nexus-300 font-mono">JWT Token Validation</span>
                  </div>
                  <span className="nexus-badge-emerald text-xs flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    PASSED (256-bit)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-nexus-850/80 border border-nexus-border flex items-center justify-between group hover:border-nexus-accent/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-nexus-400 group-hover:text-nexus-accent transition-colors" />
                    <span className="text-sm text-nexus-300 font-mono">Tenant Isolation Scope</span>
                  </div>
                  <span className="nexus-badge-accent text-xs">ws_default_01</span>
                </div>

                <div className="p-4 rounded-2xl bg-nexus-850/80 border border-nexus-border flex items-center justify-between group hover:border-nexus-brand/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Server className="h-4 w-4 text-nexus-400 group-hover:text-nexus-brand-light transition-colors" />
                    <span className="text-sm text-nexus-300 font-mono">Vector Index Engine</span>
                  </div>
                  <span className="nexus-badge-default text-xs">pgvector HNSW</span>
                </div>

                <div className="p-4 rounded-2xl bg-nexus-850/80 border border-nexus-border flex items-center justify-between group hover:border-nexus-amber/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-nexus-400 group-hover:text-nexus-amber transition-colors" />
                    <span className="text-sm text-nexus-300 font-mono">Inference Latency P99</span>
                  </div>
                  <span className="nexus-badge-amber text-xs">42ms</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
