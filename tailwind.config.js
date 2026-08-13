/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eafc: {
          dark: "#0a0c10",
          panel: "#121620",
          cardBg: "#181e2a",
          gold: "#f3c64c",
          goldLight: "#fff0a3",
          goldDark: "#b8860b",
          bronze: "#c87d46",
          silver: "#d1d5db",
          toty: "#0f2b5c",
          hero: "#581c87",
          accent: "#22c55e"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Impact', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 3s infinite linear',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'card-float': 'cardFloat 4s infinite ease-in-out',
        'ray-spin': 'raySpin 20s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-150%) skewX(-25deg)' },
          '100%': { transform: 'translateX(250%) skewX(-25deg)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(243, 198, 76, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 30px rgba(243, 198, 76, 0.9))' }
        },
        cardFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        raySpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }
    },
  },
  plugins: [],
}
