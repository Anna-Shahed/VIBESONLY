import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-space)", "ui-sans-serif", "system-ui"]
      },
      colors: {
        vibe: {
          bg: "var(--vo-bg)",
          surface: "var(--vo-surface)",
          surface2: "var(--vo-surface2)",
          accent: "var(--vo-accent)",
          accent2: "var(--vo-accent-2)",
          text: "var(--vo-text)",
          muted: "var(--vo-muted)",
          line: "var(--vo-border)",
          hi: "var(--vo-hi)"
        }
      }
    }
  },
  plugins: []
};
export default config;
