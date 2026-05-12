/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0B1120',
          light: '#111827',
          dark: '#0F172A',
        },
        accent: {
          DEFAULT: '#DC2626',
          hover: '#B91C1C',
          dark: '#991B1B',
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
