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
          green: '#B8FF1A',
          dark: '#0B1220',
          light: '#F8FAFC',
          card: {
            dark: '#161F33', // Slightly lighter than background for cards
            light: '#ffffff'
          }
        }
      }
    },
  },
  plugins: [],
}
