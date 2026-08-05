"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl";
    
    const variants = {
      primary: "bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400 text-white shadow-glow-violet hover:shadow-glow",
      secondary: "bg-white/5 hover:bg-white/10 text-slate-100 border border-white/10",
      outline: "border border-white/10 hover:border-indigo-400/40 hover:bg-white/5 text-slate-200",
      ghost: "hover:bg-white/5 text-slate-300 hover:text-slate-100",
      destructive: "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/20",
      glass: "glass-panel border-white/10 hover:border-indigo-400/30 text-slate-100 backdrop-blur-md",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-xs font-semibold",
      lg: "px-6 py-3 text-sm font-semibold",
      icon: "p-2 rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
