/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#dbebff',
          300: '#bcd3ff',
          400: '#91b1ff',
          500: '#6384ff',
          600: '#475fff',
          700: '#3447eb',
          800: '#2a39c4',
          900: '#27349c',
          950: '#171c5c',
        },
        dark: {
          50: '#f6f6f7',
          100: '#e1e3e5',
          200: '#c2c6ca',
          300: '#9aa0a6',
          400: '#70777e',
          500: '#545b63',
          600: '#43484f',
          700: '#32373c',
          800: '#1f2225',
          900: '#121416',
          950: '#0a0b0c',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'neon': '0 0 15px rgba(99, 132, 255, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
