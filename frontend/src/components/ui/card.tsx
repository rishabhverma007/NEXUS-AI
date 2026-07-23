"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "elevated" | "glow";
  hover?: boolean;
}

export function Card({
  className,
  variant = "default",
  hover = true,
  children,
  ...props
}: CardProps) {
  const variants = {
    default:
      "nexus-panel",
    glass:
      "nexus-glass",
    elevated:
      "nexus-glass-elevated",
    glow:
      "relative bg-nexus-850 border border-nexus-border shadow-nexus-md",
  };

  return (
    <div
      className={cn(
        variants[variant],
        hover && "transition-all duration-300 hover:border-nexus-border-hover hover:shadow-nexus-lg hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {variant === "glow" && (
        <div
          className="absolute -inset-[1px] rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(56,189,248,0.15), transparent)",
            filter: "blur(8px)",
          }}
        />
      )}
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 pb-4 border-b border-nexus-border",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-sm font-semibold tracking-tight text-nexus-50",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xs text-nexus-400 leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pt-4", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center pt-4 mt-4 border-t border-nexus-border",
        className
      )}
      {...props}
    />
  );
}
