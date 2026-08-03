"use client";

import { cn } from "@/lib/utils";

interface LiquidCardProps {
  children: React.ReactNode;
  className?: string;
  /** Toggle between the light `.liquid-glass` and the deep `.liquid-glass-strong`. */
  strong?: boolean;
}

/**
 * Liquid-glass wrapper card. Renders a translucent, blurred, gradient-bordered
 * surface that sits beautifully over cinematic video backgrounds.
 */
export function LiquidCard({ children, className, strong = false }: LiquidCardProps) {
  return (
    <div className={cn(strong ? "liquid-glass-strong" : "liquid-glass", className)}>
      {children}
    </div>
  );
}
