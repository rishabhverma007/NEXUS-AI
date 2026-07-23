import { AIState, AI_STATES } from "@/config/ai-states";
import { ICON_REGISTRY } from "@/config/icons";
import { Bot, Loader2 } from "lucide-react";

interface AIStatusBadgeProps {
  state: AIState;
  className?: string;
}

export function AIStatusBadge({ state, className = "" }: AIStatusBadgeProps) {
  const info = AI_STATES[state] || AI_STATES.idle;
  const isRunning = ["planning", "searching", "retrieving", "reasoning", "calling_tools", "generating", "reflecting", "validating"].includes(state);

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${info.bgColor} ${info.borderColor} ${info.color} ${className}`}
    >
      {isRunning ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Bot className="h-3.5 w-3.5" />
      )}
      <span>{info.label}</span>
    </div>
  );
}
