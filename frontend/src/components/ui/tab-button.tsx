"use client";

import { cn } from "@/lib/utils";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  className?: string;
}

export function TabButton({ active, onClick, icon: Icon, label, className }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 duration-200",
        active
          ? "bg-nexus-brand/10 text-nexus-brand-light border border-nexus-brand/20 shadow-glow-brand"
          : "text-nexus-400 hover:text-nexus-200 hover:bg-white/[0.03] border border-transparent",
        className
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
