/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E01D1D', // HeySalad cherry red
          dark: '#c91919',
          light: '#ff4444',
        },
        secondary: {
          DEFAULT: '#1a1a1a', // Dark gray
          dark: '#0a0a0a',
          light: '#2a2a2a',
        },
        accent: {
          DEFAULT: '#E01D1D', // HeySalad cherry red
          dark: '#c91919',
          light: '#ff4444',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}