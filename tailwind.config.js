/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B0F17',
          surface: '#111622',
          card: '#141A26',
          'card-hover': '#1A2232',
          border: '#1F293D',
          'border-light': '#2A364F',
          sidebar: '#0D121B',
          input: '#161D2B',
        },
        brand: {
          red: '#EF4444',
          'red-hover': '#DC2626',
          'red-glow': 'rgba(239, 68, 68, 0.25)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
