"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "away" | "busy";
}

export function Avatar({
  src,
  fallback = "US",
  size = "md",
  status,
  className,
  ...props
}: AvatarProps) {
  const sizes = {
    sm: "h-7 w-7 text-[10px]",
    md: "h-9 w-9 text-xs",
    lg: "h-11 w-11 text-sm",
    xl: "h-14 w-14 text-base",
  };

  const statusColors = {
    online: "bg-emerald-500",
    offline: "bg-slate-500",
    away: "bg-amber-500",
    busy: "bg-rose-500",
  };

  const statusSizes = {
    sm: "h-2 w-2 right-0 bottom-0",
    md: "h-2.5 w-2.5 right-0 bottom-0",
    lg: "h-3 w-3 right-0 bottom-0",
    xl: "h-3.5 w-3.5 right-0.5 bottom-0.5",
  };

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-800 font-bold text-slate-200 items-center justify-center shadow-md",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt="Avatar"
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <span>{fallback}</span>
      )}
      {status && (
        <span
          className={cn(
            "absolute rounded-full border-2 border-[#05070A]",
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
}
