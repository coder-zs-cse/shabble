import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-muted": "var(--surface-muted)",
        "text-muted": "var(--text-muted)",
        "border-muted": "var(--border-muted)",
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
  safelist: [
    'grid-cols-5',
    'grid-rows-5',
    'grid-cols-6',
    'grid-rows-6',
    'grid-cols-7',
    'grid-rows-7',
  ],
};
export default config;
