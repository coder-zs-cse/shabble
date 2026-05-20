import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
      },
      // ADDING KEYFRAMES (How the animation moves over a timeline)
      keyframes: {
        radarGlow: {
          '0%': { backgroundColor: 'rgb(254 240 138)', transform: 'scale(1)' },   // Soft yellow flash
          '50%': { transform: 'scale(0.96)' },                                  // Subtle compression squeeze
          '100%': { backgroundColor: 'transparent', transform: 'scale(1)' }     // Smoothly fade back to normal grid style
        }
      },
      // ADDING THE ANIMATION TRIGGER (Hooking it up to a CSS class name)
      animation: {
        radarGlow: 'radarGlow 0.8s ease-in-out forwards' // Runs once smoothly for 0.8 seconds
      }
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