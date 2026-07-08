/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#D4AF37",
        dark: "#121212",
        darker: "#0A0A0A",
        glass: "rgba(255,255,255,0.05)",
      },
    },
  },
  plugins: [],
};
