"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "glass" | "premium";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, variant = "default", ...props }, ref) => {
    const variants = {
      default:
        "bg-nexus-850/80 border-nexus-border text-nexus-50 placeholder:text-nexus-500 focus:border-nexus-brand focus:shadow-[0_0_0_3px_rgba(124,58,237,0.12),0_0_20px_-4px_rgba(124,58,237,0.2)]",
      glass:
        "nexus-glass text-nexus-50 placeholder:text-nexus-500 focus:border-nexus-brand focus:shadow-[0_0_0_3px_rgba(124,58,237,0.12)]",
      premium:
        "bg-gradient-to-br from-nexus-900/90 to-nexus-850/90 border-nexus-border text-nexus-50 placeholder:text-nexus-500 focus:border-nexus-brand focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15),0_0_30px_-6px_rgba(124,58,237,0.25)]",
    };

    return (
      <div className="relative group">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-nexus-500 group-focus-within:text-nexus-brand transition-colors duration-200">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-200",
            "hover:border-nexus-border-hover",
            "outline-none disabled:cursor-not-allowed disabled:opacity-40",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            variants[variant],
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-nexus-500 group-focus-within:text-nexus-brand transition-colors duration-200">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
