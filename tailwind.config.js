/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        premium: '0 30px 80px rgba(0,0,0,0.35)',
      },
      colors: {
        ink: '#0a0a0b',
        panel: '#121214',
        mist: '#f4f2ee',
      },
    },
  },
  plugins: [],
};
