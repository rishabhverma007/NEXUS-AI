export type ThemeId = "obsidian" | "midnight" | "aurora" | "carbon" | "cyberpunk";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  bg: string;
  cardBg: string;
  panelBg: string;
  primary: string;
  accent: string;
  border: string;
  glow: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  obsidian: {
    id: "obsidian",
    name: "Obsidian Deep",
    description: "Default enterprise deep black theme with electric blue glow.",
    bg: "#030712",
    cardBg: "#090d16",
    panelBg: "rgba(15, 23, 42, 0.65)",
    primary: "#3b82f6",
    accent: "#06b6d4",
    border: "rgba(255, 255, 255, 0.08)",
    glow: "rgba(59, 130, 246, 0.4)",
  },
  midnight: {
    id: "midnight",
    name: "Midnight Indigo",
    description: "Sleek dark indigo shade inspired by Linear & Cursor.",
    bg: "#0b0f19",
    cardBg: "#111827",
    panelBg: "rgba(17, 24, 39, 0.7)",
    primary: "#6366f1",
    accent: "#38bdf8",
    border: "rgba(255, 255, 255, 0.1)",
    glow: "rgba(99, 102, 241, 0.4)",
  },
  aurora: {
    id: "aurora",
    name: "Aurora Teal",
    description: "Cyan & purple ambient lighting theme inspired by Northern Lights.",
    bg: "#06111e",
    cardBg: "#0d1b2a",
    panelBg: "rgba(13, 27, 42, 0.75)",
    primary: "#06b6d4",
    accent: "#a855f7",
    border: "rgba(6, 182, 212, 0.2)",
    glow: "rgba(6, 182, 212, 0.4)",
  },
  carbon: {
    id: "carbon",
    name: "Carbon Monochrome",
    description: "High-contrast monochrome graphite theme for developer clarity.",
    bg: "#0e0f12",
    cardBg: "#16181d",
    panelBg: "rgba(22, 24, 29, 0.8)",
    primary: "#f4f4f5",
    accent: "#a1a1aa",
    border: "rgba(255, 255, 255, 0.12)",
    glow: "rgba(244, 244, 245, 0.25)",
  },
  cyberpunk: {
    id: "cyberpunk",
    name: "Cyberpunk Neon",
    description: "Vibrant hot magenta and neon violet futuristic glow theme.",
    bg: "#0a0518",
    cardBg: "#13092b",
    panelBg: "rgba(19, 9, 43, 0.8)",
    primary: "#ec4899",
    accent: "#8b5cf6",
    border: "rgba(236, 72, 153, 0.25)",
    glow: "rgba(236, 72, 153, 0.5)",
  },
};
