/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",
        safe: "#10B981",
        atrisk: "#F59E0B",
        highrisk: "#EF4444",
        card: "#111827",
        background: "#0F172A",
      },
    },
  },
  plugins: [],
};