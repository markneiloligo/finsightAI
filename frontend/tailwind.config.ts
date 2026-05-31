import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        muted: "#5f6b76",
        line: "#d7dde2",
        panel: "#f7f9fb",
        brand: "#0f766e",
        accent: "#2563eb",
      },
    },
  },
  plugins: [],
};

export default config;
