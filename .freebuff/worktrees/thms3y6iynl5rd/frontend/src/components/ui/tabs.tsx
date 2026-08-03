"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
  icon?: React.ElementType;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  variant?: "pills" | "underline" | "segmented";
}

export function Tabs({
  tabs,
  defaultTab,
  className,
  variant = "pills",
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "flex items-center gap-1.5",
          variant === "segmented" &&
            "bg-white/5 p-1 rounded-xl border border-white/10 w-fit",
          variant === "underline" && "border-b border-white/10 pb-0"
        )}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg relative",
                variant === "pills" &&
                  cn(
                    isActive
                      ? "bg-nexus-500/20 text-nexus-400 border border-nexus-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                  ),
                variant === "segmented" &&
                  cn(
                    isActive
                      ? "bg-nexus-500 text-white shadow-lg shadow-nexus-500/25"
                      : "text-slate-400 hover:text-slate-200"
                  ),
                variant === "underline" &&
                  cn(
                    isActive
                      ? "text-nexus-400 border-b-2 border-nexus-500 rounded-none"
                      : "text-slate-400 hover:text-slate-200 border-b-2 border-transparent rounded-none"
                  )
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{tab.label}</span>
              {isActive && variant === "segmented" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-nexus-500 rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {tabs.find((t) => t.id === activeTab)?.content}
      </motion.div>
    </div>
  );
}
