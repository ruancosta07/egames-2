/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.jsx"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          50: "#F1F2F3",
          100: "#E1E1E5",
          200: "#C3C4CB",
          300: "#A5A6B1",
          400: "#868897",
          500: "#6D6F7E",
          600: "#535460",
          700: "#383941",
          800: "#26262C",
          900: "#131316",
          950: "#090A0B",
        },
      },
    },
  },
  plugins: [],
};
