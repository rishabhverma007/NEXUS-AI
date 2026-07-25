"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, BrainCircuit, Github, KeyRound, Mail, Lock, User,
  Eye, EyeOff, Check, X, ShieldCheck, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/hooks/use-auth";

export function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");

  const { signUp, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_]/.test(password),
    match: password === confirmPassword && confirmPassword.length > 0,
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    await signUp(email, password, fullName);

    const state = useAuthStore.getState();
    if (state.isAuthenticated) {
      setStep("success");
      setTimeout(() => router.push("/chat"), 2000);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {step === "form" ? (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
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
                <h1 className="text-xl font-bold text-nexus-50 tracking-tight">Create your enterprise account</h1>
                <p className="text-sm text-nexus-400 mt-1">Start building with NEXUS AI Enterprise OS</p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-nexus-rose/10 border border-nexus-rose/20"
              >
                <X className="h-4 w-4 text-nexus-rose mt-0.5 flex-shrink-0" />
                <p className="text-xs text-nexus-rose leading-relaxed">{error}</p>
                <button onClick={clearError} className="ml-auto flex-shrink-0 text-nexus-rose/60 hover:text-nexus-rose transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-nexus-300">Full Name</label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dr. Elena Rostova"
                  leftIcon={<User className="h-4 w-4" />}
                  variant="premium"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-nexus-300">Work Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="architect@company.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                  variant="premium"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-nexus-300">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    leftIcon={<Lock className="h-4 w-4" />}
                    variant="premium"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-nexus-500 hover:text-nexus-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-nexus-300">Confirm Password</label>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    leftIcon={<ShieldCheck className="h-4 w-4" />}
                    variant="premium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-nexus-500 hover:text-nexus-300 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              {password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-1.5 p-3 rounded-xl bg-nexus-800/40 border border-nexus-border"
                >
                  <p className="text-[10px] font-medium text-nexus-400 uppercase tracking-wider mb-2">Password Requirements</p>
                  {[
                    { key: "length", label: "At least 8 characters", met: passwordChecks.length },
                    { key: "upper", label: "One uppercase letter", met: passwordChecks.upper },
                    { key: "lower", label: "One lowercase letter", met: passwordChecks.lower },
                    { key: "number", label: "One number", met: passwordChecks.number },
                  { key: "special", label: "One special character", met: passwordChecks.special },
                    { key: "match", label: "Passwords match", met: passwordChecks.match },
                  ].map((check) => (
                    <div key={check.key} className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                          check.met ? "bg-nexus-emerald/20" : "bg-nexus-700/50"
                        }`}
                      >
                        {check.met ? (
                          <Check className="h-2.5 w-2.5 text-nexus-emerald" />
                        ) : (
                          <div className="h-1.5 w-1.5 rounded-full bg-nexus-500" />
                        )}
                      </div>
                      <span
                        className={`text-xs transition-colors duration-300 ${
                          check.met ? "text-nexus-emerald" : "text-nexus-500"
                        }`}
                      >
                        {check.label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                disabled={!isPasswordValid || !fullName || !email}
                rightIcon={!isLoading ? <ArrowRight className="h-4 w-4" /> : undefined}
              >
                <span>Create Enterprise Account</span>
              </Button>
            </form>

            {/* SSO Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-nexus-border w-full" />
              <span className="bg-nexus-950 px-3 text-[10px] text-nexus-500 font-mono uppercase tracking-wider">OR SSO</span>
            </div>

            {/* SSO Buttons */}
            <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" size="md" leftIcon={<Github className="h-4 w-4" />} disabled>
              GitHub
            </Button>
            <Button variant="secondary" size="md" leftIcon={<KeyRound className="h-4 w-4 text-nexus-accent" />} disabled>
              Google SSO
            </Button>
            </div>

            {/* Sign In Link */}
            <p className="text-xs text-center text-nexus-400">
              Already have an enterprise account?{" "}
              <Link href="/login" className="text-nexus-accent hover:text-nexus-accent/80 font-semibold transition-colors">
                Sign in
              </Link>
            </p>

            {/* Enterprise Badge */}
            <div className="flex items-center justify-center gap-1.5">
              <Building2 className="h-3 w-3 text-nexus-500" />
              <span className="text-[10px] text-nexus-500 font-mono">
                SOC-2 Type II · Enterprise Grade Security
              </span>
              <ShieldCheck className="h-3 w-3 text-nexus-emerald" />
            </div>
          </div>
        </motion.div>
      ) : (
        /* ── Success State ── */
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 w-full max-w-md text-center"
        >
          <div className="nexus-glass-elevated rounded-3xl border border-nexus-emerald/20 p-10 space-y-6">
            <div className="h-16 w-16 rounded-full bg-nexus-emerald/10 border border-nexus-emerald/20 mx-auto flex items-center justify-center">
              <Check className="h-8 w-8 text-nexus-emerald" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-nexus-50">Account created successfully!</h2>
              <p className="text-sm text-nexus-400 mt-2">
                Welcome to NEXUS AI Enterprise OS. Redirecting to your workspace...
              </p>
            </div>
            <div className="flex justify-center">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full bg-nexus-accent"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
