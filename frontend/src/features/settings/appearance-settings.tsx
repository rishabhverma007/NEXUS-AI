"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/providers/theme-provider";
import { Check, Palette, Sparkles } from "lucide-react";

export function AppearanceSettings() {
  const { theme, setThemeId, availableThemes } = useTheme();

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h3 className="text-base font-semibold text-nexus-50 flex items-center gap-2">
          <Palette className="h-4 w-4 text-pink-400" />
          Enterprise Theme Engine
        </h3>
        <p className="text-sm text-nexus-400 mt-1">
          Select a premium design system theme. Themes apply instantly across all workspaces.
        </p>
      </div>

      {/* Theme Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {availableThemes.map((item, idx) => {
          const isActive = theme.id === item.id;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => setThemeId(item.id)}
              className={`group relative p-6 rounded-3xl border text-left transition-all duration-300
                ${isActive
                  ? "border-nexus-brand/50 bg-nexus-brand/5 shadow-glow-brand"
                  : "nexus-glass border-nexus-border hover:border-nexus-border-hover hover:shadow-nexus-sm"
                }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-2.5 -right-2.5 h-6 w-6 rounded-full bg-nexus-brand border-2 border-nexus-950 flex items-center justify-center shadow-glow-brand">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-nexus-50">{item.name}</span>
                  {isActive && (
                    <Sparkles className="h-4 w-4 text-nexus-brand-light" />
                  )}
                </div>

                <p className="text-xs text-nexus-400 leading-relaxed">
                  {item.description}
                </p>

                {/* Theme Swatch Preview */}
                <div className="flex items-center gap-2">
                  {[item.bg, item.cardBg, item.primary, item.accent].map((color, i) => (
                    <div
                      key={i}
                      className="h-6 w-6 rounded-lg border border-nexus-border transition-transform group-hover:scale-110"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
