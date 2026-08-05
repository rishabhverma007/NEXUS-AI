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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          indigo: "hsl(var(--accent-indigo))",
          cyan: "hsl(var(--accent-cyan))",
          violet: "hsl(var(--accent-violet))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        nexus: {
          50: "#f0f4ff",
          100: "#e0e9fe",
          200: "#bae6fd",
          500: "#3b82f6",
          600: "#2563eb",
          900: "#0b0f19",
          950: "#05070d",
        },

      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "var(--font-display)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glow: "0 0 20px -5px rgba(59, 130, 246, 0.5)",
        "glow-cyan": "0 0 20px -5px rgba(6, 182, 212, 0.5)",
        "glow-violet": "0 0 24px -6px rgba(139, 92, 246, 0.55)",
        "glow-soft": "0 8px 40px -12px rgba(56, 189, 248, 0.25)",
        "card": "0 0 0 1px rgba(255,255,255,0.04), 0 20px 60px -20px rgba(0,0,0,0.6)",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "marquee-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "aurora-shift": {
          "0%, 100%": {
            transform: "translate3d(0,0,0) scale(1)",
            opacity: "0.55",
          },
          "33%": {
            transform: "translate3d(4%, -6%, 0) scale(1.15)",
            opacity: "0.8",
          },
          "66%": {
            transform: "translate3d(-5%, 4%, 0) scale(0.92)",
            opacity: "0.6",
          },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        "grid-pan": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "48px 48px" },
        },
        "scan-line": {
          "0%": { top: "-10%" },
          "100%": { top: "110%" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.9" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        "ticker": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "orbit": {
          "0%": { transform: "rotate(0deg) translateX(220px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(220px) rotate(-360deg)" },
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin-slow 12s linear infinite",
        "marquee-x": "marquee-x 40s linear infinite",
        "float-y": "float-y 7s ease-in-out infinite",
        "aurora-shift": "aurora-shift 14s ease-in-out infinite",
        "gradient-x": "gradient-x 6s ease infinite",
        shimmer: "shimmer 2.2s ease-in-out infinite",
        "grid-pan": "grid-pan 3s linear infinite",
        "scan-line": "scan-line 4s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        ticker: "ticker 14s linear infinite",
        blink: "blink 1.1s step-end infinite",
        orbit: "orbit 26s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
