"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, BrainCircuit, Loader2, Lock, Mail, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";

export function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const register = useAuthStore((s) => s.register);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await register(fullName, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md glow-border rounded-[28px] p-8 space-y-6 shadow-card backdrop-blur-xl">
      <div className="text-center space-y-2">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 p-[1.5px] shadow-glow-violet mx-auto flex items-center justify-center">
          <div className="h-full w-full bg-[#0a0918] rounded-[14px] flex items-center justify-center">
            <BrainCircuit className="h-6 w-6 text-cyan-300" />
          </div>
        </div>
        <h1 className="text-xl font-display font-bold text-white tracking-tight">Create your workspace</h1>
        <p className="text-xs text-slate-400">
          Your personal workspace ships preloaded with the enterprise corpus
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-3 text-xs text-rose-200">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-300" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Full Name</label>
          <div className="relative">
            <User className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ada Architect"
              className="pl-9"
              required
              autoComplete="name"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Work Email</label>
          <div className="relative">
            <Mail className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="architect@nexus.ai"
              className="pl-9"
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Password</label>
          <div className="relative">
            <Lock className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="pl-9"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Confirm Password</label>
          <div className="relative">
            <Lock className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="pl-9"
              required
              autoComplete="new-password"
            />
          </div>
        </div>

        <Button variant="primary" className="w-full gap-2 shine rounded-2xl" isLoading={isLoading} type="submit">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Create workspace</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="text-[11px] text-center text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="text-cyan-400 hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  );
}
