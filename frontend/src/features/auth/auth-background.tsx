"use client";

import { ParticleField } from "@/animations/particle-field";

export function AuthBackground() {
  return (
    <>
      <div className="absolute inset-0 tech-grid opacity-30 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] pointer-events-none" />
      <div className="absolute -top-32 left-1/4 w-[520px] h-[520px] bg-indigo-600/20 rounded-full blur-[150px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[460px] h-[460px] bg-cyan-500/12 rounded-full blur-[140px] pointer-events-none animate-aurora-shift" />
      <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] bg-violet-600/12 rounded-full blur-[130px] pointer-events-none animate-aurora-shift [animation-delay:-6s]" />
      <ParticleField className="opacity-60" />
    </>
  );
}
