/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          900: '#0e0e0e',
          800: '#1a1a1a',
          700: '#2b2b2b',
          600: '#4a4a4a',
          500: '#737373',
          400: '#a3a3a3',
          300: '#d4d4d4',
          200: '#e8e8e5',
          100: '#f4f4f2',
          50: '#faf9f6',
        },
        brand: {
          dark: '#111111',
          gold: '#9e8a78',
          sand: '#e9e4df',
          cream: '#fcfbf9',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      letterSpacing: {
        luxury: '0.2em',
        editorial: '0.25em',
        subtle: '0.05em',
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '3px',
      },
      boxShadow: {
        subtle: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        dropdown: '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
        modal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
}
