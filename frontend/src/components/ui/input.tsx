import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "glass" | "ghost";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "glass", ...props }, ref) => {
    const variants = {
      default:
        "bg-[#0D1117] border-white/10 focus:border-nexus-500/50",
      glass:
        "glass-input",
      ghost:
        "bg-transparent border-transparent focus:border-white/20",
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-nexus-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
