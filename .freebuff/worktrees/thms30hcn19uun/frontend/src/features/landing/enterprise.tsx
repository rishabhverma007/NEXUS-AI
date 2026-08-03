"use client";

import { motion } from "framer-motion";
import { Cpu, Lock, Server, Shield, Zap, CheckCircle2 } from "lucide-react";

export function EnterpriseSection() {
  const specs = [
    "SOC-2 Type II Certified Security Architecture",
    "Isolated Tenant Workspaces & Database Schemas",
    "Sub-50ms SSE Token Stream Delivery",
    "Support for Cloud (OpenAI/Anthropic) & Local Ollama",
    "Role-Based Access Control (RBAC) Guardrails",
    "99.99% Uptime SLA for Enterprise Customers"
  ];

  return (
    <section className="py-24 px-6 relative border-t border-slate-800/80 bg-slate-950">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            Enterprise Grade Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-snug">
            Built for High Compliance & Security-Conscious Organizations
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            NEXUS AI ensures absolute tenant isolation, strict encryption at rest and in transit, and local offline AI model deployments via Ollama.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {specs.map((spec) => (
              <div key={spec} className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 bg-slate-900/40 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-cyan-400" />
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Security Telemetry</h3>
                <span className="text-[10px] text-slate-400 font-mono">Real-Time Threat Prevention</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
              ENCRYPTED
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between text-slate-300">
              <span className="text-slate-400">JWT Token Validation</span>
              <span className="text-emerald-400 font-bold">PASSED (256-bit)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between text-slate-300">
              <span className="text-slate-400">Tenant Isolation Scope</span>
              <span className="text-cyan-400 font-bold">ws_default_01</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between text-slate-300">
              <span className="text-slate-400">Vector Index Engine</span>
              <span className="text-indigo-400 font-bold">pgvector HNSW</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
