import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "cyan"
    | "emerald"
    | "amber"
    | "purple"
    | "premium";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-nexus-500/15 text-nexus-400 border-nexus-500/30",
    secondary: "bg-white/5 text-slate-300 border-white/10",
    outline: "border-white/10 text-slate-400",
    cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    premium:
      "bg-gradient-to-r from-nexus-400 to-cyan-400/20 text-transparent bg-clip-text bg-gradient-to-r from-nexus-400 to-cyan-400 border border-white/10",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-semibold transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
