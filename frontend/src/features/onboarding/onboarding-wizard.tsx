"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Bot, BrainCircuit, Check, CheckCircle2, Cpu, Database, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  // Form States
  const [displayName, setDisplayName] = useState("Principal Architect");
  const [timezone, setTimezone] = useState("UTC");
  const [orgName, setOrgName] = useState("NEXUS AI Global Systems");
  const [industry, setIndustry] = useState("Enterprise AI Systems");
  const [workspaceName, setWorkspaceName] = useState("Nexus Enterprise Core");
  const [workspaceDescription, setWorkspaceDescription] = useState("Primary Knowledge RAG & Multi-Agent Workspace");

  const handleFinish = () => {
    setStep(4);
    setTimeout(() => {
      router.push("/chat");
    }, 2000);
  };

  return (
    <div className="w-full max-w-xl glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative">
      {/* Wizard Progress Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-cyan-400" />
          <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Enterprise Onboarding Wizard
          </span>
        </div>
        <span className="text-xs font-mono text-cyan-400 font-bold">Step {step} of 4</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
          initial={{ width: "25%" }}
          animate={{ width: `${step * 25}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-400" /> Step 1: Profile & Preferences
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Display Name</label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">System Timezone</label>
                <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
              </div>
            </div>
            <Button variant="primary" className="w-full mt-4 gap-2" onClick={() => setStep(2)}>
              <span>Next: Organization Setup</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Database className="h-4 w-4 text-cyan-400" /> Step 2: Create Organization
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Organization Name</label>
                <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Industry Focus</label>
                <Input value={industry} onChange={(e) => setIndustry(e.target.value)} />
              </div>
            </div>
            <Button variant="primary" className="w-full mt-4 gap-2" onClick={() => setStep(3)}>
              <span>Next: Primary Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-400" /> Step 3: Create Workspace
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Workspace Name</label>
                <Input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Workspace Description</label>
                <Input value={workspaceDescription} onChange={(e) => setWorkspaceDescription(e.target.value)} />
              </div>
            </div>
            <Button variant="primary" className="w-full mt-4 gap-2" onClick={handleFinish}>
              <span>Initialize Workspace & Launch</span>
              <Sparkles className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-4"
          >
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-glow">
              <CheckCircle2 className="h-8 w-8 animate-bounce" />
            </div>
            <h2 className="text-lg font-bold text-slate-100">Initializing NEXUS AI OS...</h2>
            <p className="text-xs text-slate-400">
              Provisioning RLS security policies, vector index namespaces, and multi-agent DAG pipelines...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
