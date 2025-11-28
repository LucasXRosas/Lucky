/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        primaryDark: '#6d28d9',
      },
      borderRadius: {
        xl: '1.25rem',
      },
      fontSize: {
        title: 'clamp(1.8rem, 1rem + 2vw, 2.4rem)',
        basefluid: 'clamp(1rem, 0.5rem + 0.7vw, 1.2rem)',
      },
    },
  },
  plugins: [],
};
