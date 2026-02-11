import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Roadside Support Brand Colors - Road Safety Theme
        // High-visibility orange with deep navy for professionalism
        primary: {
          DEFAULT: "#FF6D00",
          50: "#FFF3E0",
          100: "#FFE0B2",
          200: "#FFCC80",
          300: "#FFB74D",
          400: "#FFA726",
          500: "#FF9800",
          600: "#FB8C00",
          700: "#FF6D00",
          800: "#E65100",
          900: "#BF360C",
        },
        secondary: {
          DEFAULT: "#010513",
          50: "#E3E4E8",
          100: "#B9BBC5",
          200: "#8B8E9F",
          300: "#5D6179",
          400: "#3A3F5D",
          500: "#171E41",
          600: "#141A3B",
          700: "#101532",
          800: "#0C1029",
          900: "#010513",
        },
        accent: {
          DEFAULT: "#CFD8DC",
          50: "#FFFFFF",
          100: "#FAFBFC",
          200: "#F5F7F9",
          300: "#ECEFF1",
          400: "#E0E5E9",
          500: "#CFD8DC",
          600: "#B0BEC5",
          700: "#90A4AE",
          800: "#78909C",
          900: "#607D8B",
        },
        background: "#FFFFFF",
        dark: "#010513",
        success: "#0D7D4D",
        warning: "#FF6D00",
        error: "#D50000",
        alert: "#D50000",
        white: "#FFFFFF",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        playfair: ["var(--font-playfair)", "serif"],
      },
      screens: {
        mobile: { max: "640px" },
        tablet: { min: "641px", max: "1023px" },
        laptop: { min: "1024px" },
        xlaptop: { min: "1440px" },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "pulse-soft": "pulseSoft 2s infinite",
        "bounce-soft": "bounceSoft 1s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(1, 5, 19, 0.18)",
        "glass-lg": "0 25px 50px -12px rgba(1, 5, 19, 0.3)",
        card: "0 4px 6px -1px rgba(1, 5, 19, 0.08), 0 2px 4px -2px rgba(1, 5, 19, 0.06)",
        "card-hover":
          "0 20px 25px -5px rgba(1, 5, 19, 0.12), 0 8px 10px -6px rgba(1, 5, 19, 0.08)",
        primary: "0 10px 40px -10px rgba(255, 109, 0, 0.5)",
        accent: "0 10px 40px -10px rgba(207, 216, 220, 0.4)",
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    styled: true,
    themes: [
      {
        roadsidesupport: {
          primary: "#FF6D00",
          secondary: "#010513",
          accent: "#CFD8DC",
          neutral: "#010513",
          "base-100": "#FFFFFF",
          info: "#101532",
          success: "#0D7D4D",
          warning: "#FF6D00",
          error: "#D50000",
        },
      },
    ],
    base: true,
    utils: true,
    logs: false,
  },
};
