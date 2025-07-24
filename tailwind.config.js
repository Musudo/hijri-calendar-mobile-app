/** @type {import('tailwindcss').Config} */
const { platformSelect } = require('nativewind/theme');

module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        app: {
          DEFAULT: '#2A2F4E',
          100: '#FAFAFD',
          200: '#EFF4F8',
          300: '#D8F3F5',
          400: '#BDD1E3',
          500: '#525981',
          600: '#2A2F4E',
          700: '#25283D',
          800: '#1A1A24',
        },
      },
      fontFamily: {
        'ios-primary': ['Montserrat'],
        'ios-secondary': ['Merriweather_Sans'],
        android: 'sans-serif',
        'arabic-primary': 'Rubik',
        'arabic-secondary': 'Amiri',
        default: 'sans-serif',
      },
    },
  },
  plugins: [],
};
