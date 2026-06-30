/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary brand color — deep crimson/dark red (spicy kali mirch feel)
        gold: {
          50:  "#fff0f0",
          100: "#ffe0e0",
          200: "#ffc5c5",
          300: "#ff9999",
          400: "#f76060",
          500: "#e03030", // Primary red
          600: "#c41e3a", // Deep crimson — main brand
          700: "#a01530",
          800: "#851228",
          900: "#6e1226",
          950: "#3d0510",
        },
        obsidian: {
          50:  "#f8f5f0",
          100: "#ede8df",
          200: "#d6ccbc",
          300: "#b8a98f",
          400: "#998470",
          500: "#7d6a57",
          600: "#5e4e3e",
          700: "#3d3028",
          800: "#1f1710",
          900: "#120d09",
          950: "#0a0806",
        }
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      animation: {
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
