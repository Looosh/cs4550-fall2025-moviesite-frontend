/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#1a1a1a",
        darkCard: "#2a2a2a",
        purpleAccent: "#8b5cf6",
      },
    },
  },
  plugins: [],
};
