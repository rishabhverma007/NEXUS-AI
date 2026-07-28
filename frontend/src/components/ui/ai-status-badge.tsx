"use client";

import { type AIState, AI_STATES } from "@/config/ai-states";
import { cn } from "@/lib/utils";
import { Loader2, Bot } from "lucide-react";

interface AIStatusBadgeProps {
  state: AIState;
  className?: string;
  size?: "sm" | "md";
}

export function AIStatusBadge({
  state,
  className = "",
  size = "sm",
}: AIStatusBadgeProps) {
  const info = AI_STATES[state] || AI_STATES.idle;
  const isRunning = [
    "planning",
    "searching",
    "retrieving",
    "reasoning",
    "calling_tools",
    "generating",
    "reflecting",
    "validating",
  ].includes(state);

  const sizes = {
    sm: "px-2.5 py-1 text-[10px] gap-1.5",
    md: "px-3 py-1.5 text-xs gap-2",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-semibold",
        info.bgColor,
        info.borderColor,
        info.color,
        sizes[size],
        className
      )}
    >
      {isRunning ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Bot className="h-3 w-3" />
      )}
      <span>{info.label}</span>
    </div>
  );
}
