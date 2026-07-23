"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Github, KeyRound, Mail, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StarsBackground, GridBackground, AuroraBackground, NoiseOverlay } from "@/components/ui/background";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/onboarding");
    }, 800);
  };

  return (
    <>
      <StarsBackground />
      <GridBackground />
      <AuroraBackground />
      <NoiseOverlay />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="nexus-glass-elevated rounded-3xl border border-nexus-border p-8 space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-nexus-brand to-nexus-accent p-0.5 shadow-glow-brand mx-auto">
              <div className="h-full w-full bg-nexus-950 rounded-[14px] flex items-center justify-center">
                <BrainCircuit className="h-7 w-7 text-nexus-accent" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-nexus-50 tracking-tight">Sign in to NEXUS AI</h1>
              <p className="text-sm text-nexus-400 mt-1">Enterprise AI Knowledge Operating System</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-nexus-300">Work Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="architect@nexus.ai"
                leftIcon={<Mail className="h-4 w-4" />}
                variant="premium"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-nexus-300">Password</label>
                <Link href="/forgot-password" className="text-[11px] text-nexus-accent hover:text-nexus-accent/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                variant="premium"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              rightIcon={!isLoading ? <ArrowRight className="h-4 w-4" /> : undefined}
            >
              <span>Authenticate</span>
            </Button>
          </form>

          {/* SSO Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-nexus-border w-full" />
            <span className="bg-nexus-950 px-3 text-[10px] text-nexus-500 font-mono uppercase tracking-wider">OR SSO</span>
          </div>

          {/* SSO Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" size="md" leftIcon={<Github className="h-4 w-4" />}>
              GitHub
            </Button>
            <Button variant="secondary" size="md" leftIcon={<KeyRound className="h-4 w-4 text-nexus-accent" />}>
              Google SSO
            </Button>
          </div>

          {/* Signup Link */}
          <p className="text-xs text-center text-nexus-400">
            Don&apos;t have an enterprise account?{" "}
            <Link href="/signup" className="text-nexus-accent hover:text-nexus-accent/80 font-semibold transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </>
  );
}
