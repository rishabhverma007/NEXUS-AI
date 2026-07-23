"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Bot, BrainCircuit, CheckCircle2, Cpu, Database, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StarsBackground, AuroraBackground, NoiseOverlay } from "@/components/ui/background";

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const router = useRouter();

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

  const steps = [
    { num: 1, icon: User, label: "Profile", color: "text-nexus-brand-light" },
    { num: 2, icon: Database, label: "Organization", color: "text-nexus-accent" },
    { num: 3, icon: Cpu, label: "Workspace", color: "text-nexus-emerald" },
    { num: 4, icon: Sparkles, label: "Launch", color: "text-nexus-amber" },
  ];

  return (
    <>
      <StarsBackground />
      <AuroraBackground />
      <NoiseOverlay />

      <div className="relative z-10 w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="nexus-glass-elevated rounded-3xl border border-nexus-border p-8 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-nexus-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-nexus-brand/10 border border-nexus-brand/20">
                <BrainCircuit className="h-4 w-4 text-nexus-brand-light" />
              </div>
              <span className="text-sm font-bold text-nexus-50 tracking-wide">
                Enterprise Onboarding
              </span>
            </div>
            <span className="text-xs font-mono text-nexus-accent font-bold">
              Step {step} of 4
            </span>
          </div>

          {/* Steps Progress */}
          <div className="flex items-center justify-between px-2">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = step >= s.num;
              const isDone = step > s.num;
              return (
                <div key={s.num} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300
                    ${isDone
                      ? "bg-nexus-emerald text-white"
                      : isActive
                      ? `${s.color} bg-nexus-800 border border-nexus-border`
                      : "bg-nexus-800/60 border border-nexus-border text-nexus-500"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className={`text-[10px] font-mono font-medium ${isActive ? "text-nexus-300" : "text-nexus-600"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-nexus-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-nexus-brand via-nexus-accent to-nexus-emerald rounded-full"
              initial={{ width: "25%" }}
              animate={{ width: `${step * 25}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Steps Content */}
          <AnimatePresence mode="wait">
            {/* Step 1: Profile */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <h2 className="text-base font-semibold text-nexus-50 flex items-center gap-2">
                  <User className="h-4 w-4 text-nexus-brand-light" /> Step 1: Profile & Preferences
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-nexus-300">Display Name</label>
                    <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} variant="premium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-nexus-300">System Timezone</label>
                    <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} variant="premium" />
                  </div>
                </div>
                <Button variant="primary" className="w-full" onClick={() => setStep(2)} rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Next: Organization Setup
                </Button>
              </motion.div>
            )}

            {/* Step 2: Organization */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <h2 className="text-base font-semibold text-nexus-50 flex items-center gap-2">
                  <Database className="h-4 w-4 text-nexus-accent" /> Step 2: Create Organization
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-nexus-300">Organization Name</label>
                    <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} variant="premium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-nexus-300">Industry Focus</label>
                    <Input value={industry} onChange={(e) => setIndustry(e.target.value)} variant="premium" />
                  </div>
                </div>
                <Button variant="primary" className="w-full" onClick={() => setStep(3)} rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Next: Create Workspace
                </Button>
              </motion.div>
            )}

            {/* Step 3: Workspace */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <h2 className="text-base font-semibold text-nexus-50 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-nexus-emerald" /> Step 3: Create Workspace
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-nexus-300">Workspace Name</label>
                    <Input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} variant="premium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-nexus-300">Workspace Description</label>
                    <Input value={workspaceDescription} onChange={(e) => setWorkspaceDescription(e.target.value)} variant="premium" />
                  </div>
                </div>
                <Button variant="glow" className="w-full" onClick={handleFinish} rightIcon={<Sparkles className="h-4 w-4" />}>
                  Initialize Workspace & Launch
                </Button>
              </motion.div>
            )}

            {/* Step 4: Complete */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8 space-y-5"
              >
                <div className="h-20 w-20 rounded-full bg-nexus-emerald/15 border border-nexus-emerald/30 flex items-center justify-center mx-auto shadow-glow-emerald">
                  <CheckCircle2 className="h-10 w-10 text-nexus-emerald animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-nexus-50">Initializing NEXUS AI OS...</h2>
                  <p className="text-sm text-nexus-400 max-w-sm mx-auto">
                    Provisioning RLS security policies, vector index namespaces, and multi-agent DAG pipelines...
                  </p>
                </div>
                {/* Loading dots */}
                <div className="flex items-center justify-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-2 w-2 rounded-full bg-nexus-emerald"
                      style={{
                        animation: `typing-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
