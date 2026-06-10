/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101010",
        coal: "#171717",
        graphite: "#242424",
        bone: "#f2f0ea",
        fog: "#c9c9c4",
        signal: "#e1433f",
        mint: "#49e77e",
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,.08), 0 24px 80px rgba(0,0,0,.35)",
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at 20% 10%, rgba(225,67,63,.16), transparent 28%), radial-gradient(circle at 80% 0%, rgba(73,231,126,.1), transparent 26%)",
      },
    },
  },
  plugins: [],
};
