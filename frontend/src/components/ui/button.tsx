"use client";

import React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "glow" | "premium";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-nexus-brand text-white hover:shadow-glow-brand hover:brightness-110 active:brightness-95 border border-transparent",
  secondary:
    "bg-nexus-800 text-nexus-50 hover:bg-nexus-700 border border-nexus-border hover:border-nexus-border-hover active:bg-nexus-800",
  outline:
    "bg-transparent text-nexus-300 hover:text-nexus-100 border border-nexus-border hover:border-nexus-border-hover hover:bg-white/[0.04] active:bg-white/[0.08]",
  ghost:
    "bg-transparent text-nexus-400 hover:text-nexus-200 hover:bg-white/[0.04] active:bg-white/[0.08]",
  destructive:
    "bg-nexus-rose/15 text-nexus-rose hover:bg-nexus-rose/25 hover:shadow-glow-rose border border-nexus-rose/25 active:bg-nexus-rose/30",
  glow:
    "bg-gradient-to-r from-nexus-brand via-nexus-500 to-nexus-accent text-white shadow-glow-brand hover:shadow-[0_0_40px_-8px_rgba(124,58,237,0.6)] active:brightness-95 border border-white/10",
  premium:
    "bg-gradient-to-br from-nexus-800 via-nexus-850 to-nexus-900 text-nexus-100 border border-nexus-border hover:border-nexus-brand/40 hover:shadow-glow-brand hover:bg-gradient-to-br hover:from-nexus-800 hover:via-nexus-brand/5 hover:to-nexus-900",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-2.5 py-1 text-[11px] gap-1.5 rounded-lg",
  sm: "px-3 py-1.5 text-xs gap-1.5 rounded-xl",
  md: "px-4 py-2 text-xs gap-2 rounded-xl",
  lg: "px-5 py-2.5 text-sm gap-2 rounded-2xl",
  xl: "px-6 py-3 text-sm gap-2.5 rounded-2xl",
  icon: "p-2 rounded-xl",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "nexus-button relative overflow-hidden",
          variantStyles[variant],
          sizeStyles[size],
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexus-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-nexus-950",
          className
        )}
        {...props}
      >
        {/* Shine effect on hover */}
        <span className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </span>

        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-3.5 w-3.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="opacity-70">{children || "Loading..."}</span>
          </span>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
