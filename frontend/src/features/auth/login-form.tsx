"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BrainCircuit, Github, KeyRound, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
      <div className="text-center space-y-2">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-glow mx-auto flex items-center justify-center">
          <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <BrainCircuit className="h-6 w-6 text-cyan-400" />
          </div>
        </div>
        <h1 className="text-xl font-bold text-slate-100 tracking-tight">Sign in to NEXUS AI</h1>
        <p className="text-xs text-slate-400">Enterprise AI Knowledge Operating System</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-medium text-slate-400">Password</label>
            <Link href="/forgot-password" className="text-[10px] text-cyan-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="pl-9"
              required
            />
          </div>
        </div>

        <Button variant="primary" className="w-full gap-2" isLoading={isLoading} type="submit">
          <span>Authenticate</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-800 w-full" />
        <span className="bg-slate-950 px-3 text-[10px] text-slate-500 font-mono uppercase">OR SINGLE SIGN-ON</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" size="sm" className="gap-2 text-xs">
          <Github className="h-4 w-4" />
          <span>GitHub</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-2 text-xs">
          <KeyRound className="h-4 w-4 text-cyan-400" />
          <span>Google SSO</span>
        </Button>
      </div>

      <p className="text-[11px] text-center text-slate-400">
        Don't have an enterprise account?{" "}
        <Link href="/signup" className="text-cyan-400 hover:underline font-semibold">
          Sign up
        </Link>
      </p>
    </div>
  );
}
