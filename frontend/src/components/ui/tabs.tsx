"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  variant?: "pills" | "underline" | "glass";
}

export function Tabs({ tabs, defaultTab, className, variant = "glass" }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  const variants = {
    pills:
      "bg-nexus-900/80 p-1 rounded-xl border border-nexus-border",
    underline:
      "border-b border-nexus-border gap-0",
    glass:
      "nexus-glass p-1 rounded-2xl",
  };

  const tabVariants = {
    pills: (isActive: boolean) =>
      cn(
        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
        isActive
          ? "bg-nexus-brand text-white shadow-glow-brand"
          : "text-nexus-400 hover:text-nexus-200"
      ),
    underline: (isActive: boolean) =>
      cn(
        "px-4 py-2.5 text-xs font-semibold transition-all relative",
        isActive ? "text-nexus-50" : "text-nexus-400 hover:text-nexus-200"
      ),
    glass: (isActive: boolean) =>
      cn(
        "px-4 py-2 rounded-xl text-xs font-semibold transition-all relative",
        isActive
          ? "text-nexus-50 bg-nexus-800 shadow-nexus-sm"
          : "text-nexus-400 hover:text-nexus-200"
      ),
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className={cn("flex items-center gap-1 w-fit", variants[variant])}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(tabVariants[variant](isActive), "flex items-center gap-2")}
            >
              {Icon && <Icon className={cn("h-3.5 w-3.5", isActive ? "opacity-100" : "opacity-50")} />}
              <span>{tab.label}</span>
              {variant === "underline" && isActive && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-nexus-brand rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {activeContent}
      </motion.div>
    </div>
  );
}
