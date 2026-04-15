/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "var(--color-navy)",
        urban: "var(--color-urban)",
        neon: "var(--color-neon)",
        cyan: "var(--color-cyan)",
        warm: "var(--color-warm)",
      },
    },
  },
  plugins: [],
};