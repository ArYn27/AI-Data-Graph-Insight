/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#0BDD75',
          hover: '#09b861',
        },
        bg: '#0A0A0A',
        panel: '#111111',
        border: '#27272A',
      },
    },
  },
  plugins: [],
}
