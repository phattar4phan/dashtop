import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dt-bg": "#000000",
        "dt-text": "#DFDEDC",
        "dt-muted": "#A6A7A2",
        "dt-border": "#464545",
        "dt-accent": "#00ACAC",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
