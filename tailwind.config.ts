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
        aesir: {
          dark: "#12092a", // "hsl(256.36deg 65% 10%)",
          medium: "#180845", // "hsl(256.36deg 80% 15%)",
          DEFAULT: "#37109F",
        },
      },
    },
  },
  plugins: [],
};
export default config;
