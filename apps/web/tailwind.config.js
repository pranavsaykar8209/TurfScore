/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          green: '#97d700',
          dark: '#0f172a',
          light: '#f8fafc',
          card: '#ffffff'
        }
      }
    },
  },
  plugins: [],
}
