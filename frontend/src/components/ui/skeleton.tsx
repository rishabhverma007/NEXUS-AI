"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "card" | "text" | "circle";
}

export function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
  const variants = {
    default: "bg-gradient-to-r from-nexus-800 via-nexus-700 to-nexus-800",
    card: "bg-gradient-to-br from-nexus-800/80 via-nexus-700/60 to-nexus-800/80 border border-nexus-border",
    text: "bg-gradient-to-r from-nexus-800/60 via-nexus-700/40 to-nexus-800/60",
    circle: "bg-gradient-to-br from-nexus-800 via-nexus-700 to-nexus-800",
  };

  const radius = {
    default: "rounded-xl",
    card: "rounded-2xl",
    text: "rounded-md",
    circle: "rounded-full",
  };

  return (
    <div
      className={cn(
        "animate-shimmer bg-[length:200%_100%]",
        variants[variant],
        radius[variant],
        className
      )}
      {...props}
    />
  );
}
