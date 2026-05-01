/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bukvitsa-red': '#c41e3a',
        'bukvitsa-gold': '#d4a574',
        'bukvitsa-cream': '#f5e6d3',
        'bukvitsa-black': '#0a0a0a',
        'bukvitsa-dark-blue': '#1a2a3a',
      },
      fontFamily: {
        'heading': ['Cinzel', 'Palatino', 'GadugiBook', 'serif'],
        'body': ['Roboto', 'Inter', 'Open Sans', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(196, 30, 58, 0.5)' },
          '50%': { boxShadow: '0 0 15px rgba(196, 30, 58, 0.8)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
