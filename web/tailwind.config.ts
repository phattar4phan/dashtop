import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dt-bg": "#D9D9D9",
        "dt-text": "#262626",
        "dt-muted": "#7A7B7D",
        "dt-border": "#7A7B7D",
        "dt-surface": "#C4C4C4",
        "dt-accent": "#FF6F61",
        "dt-accent-text": "#D9D9D9",
        "dt-accent-alt": "#F4A300",
      },
      borderWidth: {
        "3": "3px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
