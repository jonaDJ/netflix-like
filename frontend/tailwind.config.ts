import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "ui-sans-serif", "sans-serif"],
        display: ["var(--font-display)", "Impact", "sans-serif"],
      },
      fontSize: {
        "brand-display": [
          "clamp(2.75rem, 6vw, 5.5rem)",
          { lineHeight: "0.92", letterSpacing: "0.04em", fontWeight: "400" },
        ],
        "brand-title": [
          "clamp(1.125rem, 1.6vw, 1.6rem)",
          { lineHeight: "1.25", letterSpacing: "0.01em", fontWeight: "700" },
        ],
        "brand-body": [
          "clamp(0.95rem, 1vw, 1.15rem)",
          { lineHeight: "1.5", letterSpacing: "0", fontWeight: "500" },
        ],
        "brand-nav": [
          "clamp(0.84rem, 0.95vw, 1rem)",
          { lineHeight: "1.4", letterSpacing: "0.015em", fontWeight: "500" },
        ],
        "brand-button": [
          "clamp(0.9rem, 0.9vw, 1.05rem)",
          { lineHeight: "1.2", letterSpacing: "0.02em", fontWeight: "700" },
        ],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bgBlack: "var(--bg-color)",
        brand: {
          bg: "var(--color-bg-base)",
          surface: "var(--color-bg-surface)",
          elevated: "var(--color-bg-elevated)",
          overlay: "var(--color-bg-overlay-85)",
          overlaySoft: "var(--color-bg-overlay-70)",
          overlaySubtle: "var(--color-bg-overlay-45)",
          border: "var(--color-border-subtle)",
          text: "var(--color-text-primary)",
          textSecondary: "var(--color-text-secondary)",
          textMuted: "var(--color-text-muted)",
          inverse: "var(--color-text-inverse)",
          accent: "var(--color-accent)",
          accentHover: "var(--color-accent-hover)",
          error: "var(--color-status-error)",
          indicatorIdle: "var(--color-indicator-idle)",
          progressTrack: "var(--color-progress-track)",
          progressFill: "var(--color-progress-fill)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
