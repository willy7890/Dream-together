/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#1B1533",
        surface: "#241C3D",
        surface2: "#2E2450",
        sidebar: "#181129",
        gold: "#E8A33D",
        coral: "#F2667A",
        mint: "#6FCF9E",
        violet: "#8B7FD6",
        ink: "#F5F1E8",
        muted: "#9C93B8",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
