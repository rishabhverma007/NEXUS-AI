"use client";

import { useTheme } from "@/providers/theme-provider";
import { Check, Palette } from "lucide-react";

export function AppearanceSettings() {
  const { theme, setThemeId, availableThemes } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <Palette className="h-4 w-4 text-pink-400" />
          Enterprise Theme Engine
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Select a premium design system theme. Themes apply instantly across all workspaces.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableThemes.map((item) => {
          const isActive = theme.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setThemeId(item.id)}
              className={`p-5 rounded-2xl border text-left space-y-4 transition-all relative ${
                isActive
                  ? "bg-slate-900 border-blue-500/80 shadow-glow"
                  : "glass-panel border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100">{item.name}</span>
                {isActive && (
                  <span className="h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>

              {/* Theme Swatch Preview */}
              <div className="flex items-center gap-2 pt-2">
                <div className="h-5 w-5 rounded-full border border-slate-700" style={{ backgroundColor: item.bg }} />
                <div className="h-5 w-5 rounded-full border border-slate-700" style={{ backgroundColor: item.cardBg }} />
                <div className="h-5 w-5 rounded-full border border-slate-700" style={{ backgroundColor: item.primary }} />
                <div className="h-5 w-5 rounded-full border border-slate-700" style={{ backgroundColor: item.accent }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
