"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "brand" | "accent" | "cyan" | "emerald" | "amber" | "rose";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "nexus-badge-default",
    secondary: "nexus-badge-secondary",
    outline: "bg-transparent text-nexus-400 border-nexus-border",
    brand: "nexus-badge-default",
    accent: "nexus-badge-accent",
    cyan: "nexus-badge-accent",
    emerald: "nexus-badge-emerald",
    amber: "nexus-badge-amber",
    rose: "bg-nexus-rose/12 text-nexus-rose border-nexus-rose/25",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold leading-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "emerald" && "bg-nexus-emerald",
            variant === "amber" && "bg-nexus-amber",
            variant === "accent" && "bg-nexus-accent",
            variant === "rose" && "bg-nexus-rose",
            variant === "brand" && "bg-nexus-brand-light",
            (variant === "default" || variant === "outline" || variant === "secondary") && "bg-nexus-400"
          )}
        />
      )}
      {children}
    </div>
  );
}
