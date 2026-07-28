"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "glass"
    | "gradient"
    | "premium";
  size?: "sm" | "md" | "lg" | "xl" | "icon";
  isLoading?: boolean;
  magnetic?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      magnetic = false,
      children,
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!magnetic || !buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      buttonRef.current.style.setProperty("--x", `${x}px`);
      buttonRef.current.style.setProperty("--y", `${y}px`);
    };

    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#05070A] disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const variants = {
      primary:
        "bg-nexus-500 hover:bg-nexus-600 text-white shadow-lg shadow-nexus-500/25 hover:shadow-nexus-500/40 active:scale-[0.98]",
      secondary:
        "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/80 active:scale-[0.98]",
      outline:
        "border border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-300 hover:text-slate-100 active:scale-[0.98]",
      ghost:
        "hover:bg-white/5 text-slate-400 hover:text-slate-200 active:scale-[0.98]",
      destructive:
        "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/30 active:scale-[0.98]",
      glass:
        "glass-card text-slate-200 hover:text-white active:scale-[0.98]",
      gradient:
        "bg-gradient-to-r from-nexus-500 via-purple-500 to-cyan-500 hover:from-nexus-600 hover:via-purple-600 hover:to-cyan-600 text-white shadow-lg shadow-nexus-500/30 hover:shadow-nexus-500/50 active:scale-[0.98]",
      premium:
        "relative overflow-hidden bg-[#0D1117] border border-white/10 text-white group before:absolute before:inset-0 before:bg-gradient-to-r before:from-nexus-500/20 before:via-transparent before:to-cyan-500/20 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 hover:border-white/20 active:scale-[0.98]",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
      md: "h-10 px-4 text-sm rounded-xl gap-2",
      lg: "h-12 px-6 text-base rounded-xl gap-2.5",
      xl: "h-14 px-8 text-lg rounded-2xl gap-3",
      icon: "h-10 w-10 rounded-xl",
    };

    return (
      <button
        ref={(node) => {
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
          buttonRef.current = node;
        }}
        onMouseMove={handleMouseMove}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          magnetic && "ripple",
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
