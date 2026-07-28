"use client";

import { motion } from "framer-motion";
import {
  Shield,
  CheckCircle2,
  Lock,
  Cpu,
  Server,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  containerVariants,
  itemVariants,
} from "@/animations/presets";

const specs = [
  "SOC-2 Type II Certified Security Architecture",
  "Isolated Tenant Workspaces & Database Schemas",
  "Sub-50ms SSE Token Stream Delivery",
  "Support for Cloud & Local Ollama Models",
  "Role-Based Access Control (RBAC) Guardrails",
  "99.99% Uptime SLA for Enterprise Customers",
];

export function EnterpriseSection() {
  return (
    <section className="relative py-28 px-6 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nexus-500/5 to-transparent pointer-events-none" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
      >
        {/* Left: Text Content */}
        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <Badge variant="premium" size="md">
              Enterprise Grade Architecture
            </Badge>
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight"
          >
            Built for{" "}
            <span className="text-gradient-primary">
              High Compliance
            </span>
            <br />
            &amp; Security-Conscious Orgs
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-base text-slate-400 leading-relaxed"
          >
            NEXUS AI ensures absolute tenant isolation, strict encryption at
            rest and in transit, and local offline AI model deployments via
            Ollama.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2"
          >
            {specs.map((spec) => (
              <div
                key={spec}
                className="flex items-center gap-3 text-sm text-slate-300 group"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span>{spec}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Security Telemetry Panel */}
        <motion.div variants={itemVariants}>
          <div className="glass-card rounded-3xl p-8 space-y-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-nexus-500/10 rounded-full blur-[60px]" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-[60px]" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-[1]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-nexus-500/20 text-nexus-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    Security Telemetry
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    Real-Time Threat Prevention
                  </span>
                </div>
              </div>
              <Badge variant="emerald" size="sm">
                ACTIVE
              </Badge>
            </div>

            <div className="space-y-3 font-mono text-xs relative z-[1]">
              {[
                { label: "JWT Token Validation", value: "PASSED (256-bit)", color: "text-emerald-400" },
                { label: "Tenant Isolation Scope", value: "ws_default_01", color: "text-cyan-400" },
                { label: "Vector Index Engine", value: "pgvector HNSW", color: "text-nexus-400" },
                { label: "Encryption at Rest", value: "AES-256-GCM", color: "text-emerald-400" },
                { label: "Rate Limiting", value: "10K RPM", color: "text-amber-400" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center"
                >
                  <span className="text-slate-400">{item.label}</span>
                  <span className={`font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
