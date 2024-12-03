/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#ffffff',
          dark: '#000000'
        },
        surface: {
          light: '#f4f4f5',
          dark: '#000000'
        }
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        merriweather: ['Merriweather', 'serif'],
        inter: ['Inter', 'sans-serif'],
        bebas: ['Bebas Neue', 'sans-serif'],
        baskerville: ['Libre Baskerville', 'serif']
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('tailwind-scrollbar-hide'),
  ],
};