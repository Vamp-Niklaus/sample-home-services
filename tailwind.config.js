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
          DEFAULT: '#9E7FFF',
          hover: '#8b66fa',
          light: '#b499ff',
          dim: 'rgba(158, 127, 255, 0.15)',
        },
        secondary: {
          DEFAULT: '#38bdf8',
          hover: '#0ea5e9',
        },
        accent: {
          DEFAULT: '#f472b6',
          hover: '#ec4899',
        },
        background: '#171717',
        surface: {
          DEFAULT: '#262626',
          soft: '#202020',
          hover: '#303030',
          elevated: '#2d2d2d',
        },
        textMain: '#FFFFFF',
        textSecondary: '#A3A3A3',
        border: '#2F2F2F',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
