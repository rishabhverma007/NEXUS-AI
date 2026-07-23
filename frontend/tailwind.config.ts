import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/animations/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/three/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // NEXUS Design System Colors
        nexus: {
          50: "#F8FAFC",
          100: "#E2E8F0",
          200: "#CBD5E1",
          300: "#94A3B8",
          400: "#64748B",
          500: "#475569",
          600: "#334155",
          700: "#1E293B",
          800: "#131822",
          850: "#0D1117",
          900: "#0A0D14",
          950: "#05070A",
          brand: "#7C3AED",
          "brand-light": "#8B5CF6",
          "brand-dark": "#6D28D9",
          accent: "#38BDF8",
          "accent-dim": "#0284C7",
          emerald: "#10B981",
          "emerald-dim": "#059669",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
        background: "#05070A",
        foreground: "#F8FAFC",
        card: {
          DEFAULT: "#0D1117",
          foreground: "#F8FAFC",
        },
        popover: {
          DEFAULT: "#0D1117",
          foreground: "#F8FAFC",
        },
        primary: {
          DEFAULT: "#7C3AED",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#131822",
          foreground: "#F8FAFC",
        },
        muted: {
          DEFAULT: "#0A0D14",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#38BDF8",
          foreground: "#05070A",
        },
        destructive: {
          DEFAULT: "#F43F5E",
          foreground: "#FFFFFF",
        },
        border: "rgba(255, 255, 255, 0.08)",
        input: "rgba(13, 17, 23, 0.8)",
        ring: "#7C3AED",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["IBM Plex Mono", "JetBrains Mono", "Fira Code", "Cascadia Code", "monospace"],
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        "nexus-sm": "0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)",
        "nexus-md": "0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -2px rgba(0,0,0,0.2)",
        "nexus-lg": "0 10px 15px -3px rgba(0,0,0,0.4), 0 4px 6px -4px rgba(0,0,0,0.3)",
        "nexus-xl": "0 20px 25px -5px rgba(0,0,0,0.5), 0 8px 10px -6px rgba(0,0,0,0.4)",
        "glow-brand": "0 0 24px -4px rgba(124, 58, 237, 0.4)",
        "glow-accent": "0 0 24px -4px rgba(56, 189, 248, 0.4)",
        "glow-emerald": "0 0 24px -4px rgba(16, 185, 129, 0.4)",
        "glow-amber": "0 0 24px -4px rgba(245, 158, 11, 0.4)",
        "glow-rose": "0 0 24px -4px rgba(244, 63, 94, 0.4)",
      },
      backdropBlur: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "40px",
        "2xl": "64px",
      },
      animation: {
        "aurora": "aurora 8s ease-in-out infinite",
        "aurora-slow": "aurora-slow 12s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "orbit": "orbit 12s linear infinite",
        "orbit-reverse": "orbit-reverse 15s linear infinite",
        "breathe": "breathe 6s ease-in-out infinite",
        "loading-bar": "loading-bar 2s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "scale-pulse": "scale-pulse 2s ease-in-out infinite",
      },
      keyframes: {
        aurora: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: "0.3" },
          "25%": { transform: "translate(100px, -50px) scale(1.1)", opacity: "0.4" },
          "50%": { transform: "translate(50px, 50px) scale(0.9)", opacity: "0.25" },
          "75%": { transform: "translate(-50px, 100px) scale(1.05)", opacity: "0.35" },
        },
        "aurora-slow": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: "0.2" },
          "33%": { transform: "translate(-80px, 60px) scale(1.15)", opacity: "0.3" },
          "66%": { transform: "translate(80px, -30px) scale(0.95)", opacity: "0.15" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-6px) rotate(0.5deg)" },
          "66%": { transform: "translateY(3px) rotate(-0.3deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(120px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(120px) rotate(-360deg)" },
        },
        "orbit-reverse": {
          "0%": { transform: "rotate(360deg) translateX(80px) rotate(-360deg)" },
          "100%": { transform: "rotate(0deg) translateX(80px) rotate(0deg)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", filter: "brightness(1)" },
          "50%": { transform: "scale(1.02)", filter: "brightness(1.15)" },
        },
        "loading-bar": {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "scale-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "nexus-brand-glow": "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(124,58,237,0.08), transparent)",
        "nexus-accent-glow": "radial-gradient(ellipse 60% 60% at 80% 20%, rgba(56,189,248,0.05), transparent)",
        "nexus-emerald-glow": "radial-gradient(ellipse 60% 60% at 20% 80%, rgba(16,185,129,0.04), transparent)",
      },
    },
  },
  plugins: [],
};

export default config;
