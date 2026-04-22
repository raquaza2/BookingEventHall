import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f8f2",
          100: "#e5ecd8",
          200: "#c9d8af",
          300: "#a9c080",
          400: "#8ca85a",
          500: "#718a3f",
          600: "#596d31",
          700: "#465627",
          800: "#3a4622",
          900: "#313b1f"
        },
        ink: "#1d221b",
        sand: "#efe5d4",
        clay: "#b66b4a"
      },
      fontFamily: {
        sans: ["Segoe UI", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 24px 80px rgba(29, 34, 27, 0.12)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top right, rgba(255,255,255,0.22), transparent 30%), linear-gradient(135deg, rgba(113,138,63,0.96), rgba(29,34,27,0.98))"
      }
    }
  },
  plugins: []
};

export default config;
