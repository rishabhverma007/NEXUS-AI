"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Palette, Settings, Sparkles } from "lucide-react";
import { AppearanceSettings } from "./appearance-settings";
import { ModelSettings } from "./model-settings";

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<"appearance" | "models">("appearance");

  const tabs = [
    { id: "appearance", label: "Appearance & Themes", icon: Palette },
    { id: "models", label: "AI Models & Inference", icon: Cpu },
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-nexus-50 tracking-tight flex items-center gap-3">
          <div className="p-2 rounded-xl bg-nexus-800/80 border border-nexus-border">
            <Settings className="h-5 w-5 text-nexus-400" />
          </div>
          Enterprise Settings & Configuration
        </h1>
        <p className="text-sm text-nexus-400 mt-2 ml-12">
          Manage system design tokens, active themes, AI inference models, and workspace parameters.
        </p>
      </div>

      {/* Tabs */}
      <div className="nexus-glass p-1 rounded-2xl border border-nexus-border w-fit">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200
                  ${isActive
                    ? "bg-nexus-brand text-white shadow-glow-brand"
                    : "text-nexus-400 hover:text-nexus-200"
                  }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {activeTab === "appearance" && <AppearanceSettings />}
          {activeTab === "models" && <ModelSettings />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
