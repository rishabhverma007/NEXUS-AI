"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  /** animation-duration in seconds */
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
}

/** Infinite horizontal marquee. Content is duplicated for a seamless loop. */
export function Marquee({
  children,
  className,
  duration = 40,
  reverse = false,
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div
      className={cn("group relative overflow-hidden w-full", className)}
    >
      <div
        className={cn(
          "flex w-max gap-6 pr-6 animate-marquee-x",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{ animationDuration: `${duration}s` }}
      >
        <div className="flex gap-6 shrink-0">{children}</div>
        <div className="flex gap-6 shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
