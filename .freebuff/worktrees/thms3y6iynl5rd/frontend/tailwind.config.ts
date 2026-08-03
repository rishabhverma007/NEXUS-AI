import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
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
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#7C3AED",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e293b",
          900: "#0b0f19",
          950: "#05070d",
        },
        glass: {
          white: "rgba(255,255,255,.04)",
          border: "rgba(255,255,255,.08)",
          hover: "rgba(255,255,255,.12)",
        },
      },
      fontFamily: {
        sans: ["Geist", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["IBM Plex Mono", "SF Mono", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        glow: "0 0 20px -5px rgba(59, 130, 246, 0.5)",
        "glow-cyan": "0 0 20px -5px rgba(6, 182, 212, 0.5)",
        "glow-purple": "0 0 20px -5px rgba(124, 58, 237, 0.5)",
        "glow-lg": "0 0 40px -10px rgba(59, 130, 246, 0.4)",
        glass: "0 8px 32px rgba(0,0,0,0.3)",
        "glass-lg": "0 16px 48px rgba(0,0,0,0.4)",
        soft: "0 2px 8px rgba(0,0,0,0.2)",
        elevated: "0 8px 32px rgba(0,0,0,0.3)",
      },
      backdropBlur: {
        glass: "30px",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 12s linear infinite",
        "spin-slower": "spin 24s linear infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
        aurora: "aurora 8s ease-in-out infinite alternate",
        "aurora-slow": "aurora 12s ease-in-out infinite alternate",
        "grid-move": "gridMove 20s linear infinite",
        breathe: "breathe 4s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        aurora: {
          "0%": { transform: "translate(0%, 0%) scale(1)", opacity: "0.3" },
          "25%": { transform: "translate(5%, -5%) scale(1.1)", opacity: "0.4" },
          "50%": { transform: "translate(-5%, 5%) scale(0.9)", opacity: "0.3" },
          "75%": { transform: "translate(3%, -3%) scale(1.05)", opacity: "0.35" },
          "100%": { transform: "translate(-3%, 3%) scale(0.95)", opacity: "0.3" },
        },
        gridMove: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(50px, 50px)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "glass-shine": "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
