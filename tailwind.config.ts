import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        paper: "#f8fafc",
        ocean: "#166f7a",
        leaf: "#2f7d46",
        sunrise: "#f2b84b",
        berry: "#9f355d",
        night: "#111827"
      },
      boxShadow: {
        soft: "0 16px 40px rgba(23, 32, 51, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
