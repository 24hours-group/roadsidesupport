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
        // Roadside Support Brand Colors - Professional Dark Theme
        primary: {
          DEFAULT: "#0F2557",
          50: "#E8EDF5",
          100: "#C5D1E8",
          200: "#9FB4D9",
          300: "#7897CA",
          400: "#5179BB",
          500: "#2A5BAC",
          600: "#1E4A8C",
          700: "#163A6E",
          800: "#0F2557",
          900: "#081540",
        },
        secondary: {
          DEFAULT: "#3D4F5F",
          50: "#F4F6F7",
          100: "#E3E7EA",
          200: "#C8D0D6",
          300: "#A9B5BE",
          400: "#8A99A5",
          500: "#6B7E8C",
          600: "#566573",
          700: "#3D4F5F",
          800: "#2D3A45",
          900: "#1A2530",
        },
        accent: {
          DEFAULT: "#D4A017",
          50: "#FDF8E8",
          100: "#FAF0C8",
          200: "#F5E08A",
          300: "#F0D04C",
          400: "#E8C020",
          500: "#D4A017",
          600: "#B38614",
          700: "#926C10",
          800: "#71530C",
          900: "#503A08",
        },
        background: "#F5F7FA",
        dark: "#0A1628",
        success: "#0D7D4D",
        warning: "#C67F17",
        error: "#B91C1C",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
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
        glass: "0 8px 32px 0 rgba(10, 22, 40, 0.18)",
        "glass-lg": "0 25px 50px -12px rgba(10, 22, 40, 0.3)",
        card: "0 4px 6px -1px rgba(10, 22, 40, 0.08), 0 2px 4px -2px rgba(10, 22, 40, 0.06)",
        "card-hover":
          "0 20px 25px -5px rgba(10, 22, 40, 0.12), 0 8px 10px -6px rgba(10, 22, 40, 0.08)",
        primary: "0 10px 40px -10px rgba(15, 37, 87, 0.5)",
        accent: "0 10px 40px -10px rgba(212, 160, 23, 0.4)",
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: [
      {
        roadsidesupport: {
          primary: "#0F2557",
          secondary: "#3D4F5F",
          accent: "#D4A017",
          neutral: "#0A1628",
          "base-100": "#F5F7FA",
          info: "#1E4A8C",
          success: "#0D7D4D",
          warning: "#C67F17",
          error: "#B91C1C",
        },
      },
    ],
    base: true,
    utils: true,
    logs: false,
  },
};
