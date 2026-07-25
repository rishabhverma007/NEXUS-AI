import { SignUpForm } from "@/features/auth/signup-form";

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full opacity-20 blur-[150px] animate-aurora pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.25), rgba(56,189,248,0.08) 50%, transparent 70%)" }}
      />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 blur-[120px] animate-aurora-slow pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(16,185,129,0.15), rgba(56,189,248,0.05) 50%, transparent 70%)" }}
      />
      <div className="absolute top-1/3 right-1/3 w-[1px] h-32 bg-gradient-to-b from-transparent via-nexus-brand/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[1px] h-24 bg-gradient-to-b from-transparent via-nexus-accent/20 to-transparent pointer-events-none" />

      <SignUpForm />
    </div>
  );
}
