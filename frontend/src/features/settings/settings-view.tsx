"use client";

import { useState } from "react";
import { Cpu, Palette, Settings, Shield, Sliders, User } from "lucide-react";
import { AppearanceSettings } from "./appearance-settings";
import { ModelSettings } from "./model-settings";

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<"appearance" | "models" | "workspace">("appearance");

  const tabs = [
    { id: "appearance", label: "Appearance & Themes", icon: Palette },
    { id: "models", label: "AI Models & Inference", icon: Cpu },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-slate-400" />
          Enterprise Settings & Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage system design tokens, active themes, AI inference models, and workspace parameters.
        </p>
      </div>

      <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="pt-2">
        {activeTab === "appearance" && <AppearanceSettings />}
        {activeTab === "models" && <ModelSettings />}
      </div>
    </div>
  );
}
