import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ src, fallback = "US", size = "md", className, ...props }: AvatarProps) {
  const sizes = {
    sm: "h-7 w-7 text-[10px]",
    md: "h-9 w-9 text-xs",
    lg: "h-11 w-11 text-sm",
  };

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 font-bold text-slate-200 items-center justify-center shadow-md",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt="Avatar" className="aspect-square h-full w-full object-cover" />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
}
