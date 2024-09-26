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
        // https://tints.dev/yellow/FFC829
        yellow: {
          50: "#FFFAEB",
          100: "#FFF5D6",
          200: "#FFE9A8",
          300: "#FFDF80",
          400: "#FFD452",
          500: "#FFC829",
          600: "#EBB000",
          700: "#B38600",
          800: "#755800",
          900: "#3D2E00",
          950: "#1F1700",
          DEFAULT: "#FFC829",
        },
        // https://tints.dev/aesir/37109F
        aesir: {
          50: "#E6DFFC",
          100: "#D1C3F9",
          200: "#A387F3",
          300: "#764AED",
          400: "#4A16DA",
          500: "#37109F",
          600: "#2E0E86",
          700: "#270C74",
          800: "#20095D",
          900: "#180746",
          950: "#130638",
          DEFAULT: "#37109F",
          dark: "#180746", // 900
          medium: "#270C74", // 700
        },
      },
    },
  },
  plugins: [],
};
export default config;
