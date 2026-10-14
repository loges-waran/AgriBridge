import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: "#f0f7f2",
          100: "#dcf0e2",
          200: "#bbe0c7",
          300: "#8ec9a3",
          400: "#5caa7c",
          500: "#3d8c5f",
          600: "#2d704a",
          700: "#24593c",
          800: "#1e4731",
          900: "#183b29",
          950: "#0c2016",
        },
        earth: {
          50: "#faf7f4",
          100: "#f3ede5",
          200: "#e6d7c7",
          300: "#d5bda4",
          400: "#c19d80",
          500: "#a97d5d",
          600: "#8d6447",
          700: "#714f39",
          800: "#5b4030",
          900: "#493529",
        },
        harvest: {
          50: "#fef9ee",
          100: "#fdf0d5",
          200: "#fbdfaa",
          300: "#f7c774",
          400: "#f2a83b",
          500: "#e88b14",
          600: "#cc6c0d",
          700: "#a24e0e",
          800: "#833e13",
          900: "#6d3413",
        },
        cream: "#faf9f5",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
