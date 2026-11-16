/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-5px)' },
          '40%, 80%': { transform: 'translateX(5px)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(.6)', opacity: '0' },
          '70%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        shake: 'shake .4s ease-in-out',
        'fade-up': 'fade-up .25s ease-out',
        pop: 'pop .5s ease-out',
      },
    },
  },
  plugins: [],
}
