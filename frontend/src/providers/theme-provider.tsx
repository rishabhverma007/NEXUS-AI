"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { THEMES, ThemeConfig, ThemeId } from "@/config/themes";

interface ThemeContextType {
  theme: ThemeConfig;
  setThemeId: (id: ThemeId) => void;
  availableThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>("obsidian");

  useEffect(() => {
    const saved = localStorage.getItem("nexus_theme") as ThemeId;
    if (saved && THEMES[saved]) {
      setThemeIdState(saved);
    }
  }, []);

  const setThemeId = (id: ThemeId) => {
    if (THEMES[id]) {
      setThemeIdState(id);
      localStorage.setItem("nexus_theme", id);
    }
  };

  const theme = THEMES[themeId] || THEMES.obsidian;

  useEffect(() => {
    // Apply dynamic CSS background token
    document.documentElement.style.setProperty("--theme-bg", theme.bg);
    document.documentElement.style.setProperty("--theme-card-bg", theme.cardBg);
    document.documentElement.style.setProperty("--theme-primary", theme.primary);
    document.documentElement.style.setProperty("--theme-accent", theme.accent);
    document.documentElement.style.setProperty("--theme-glow", theme.glow);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setThemeId,
        availableThemes: Object.values(THEMES),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
