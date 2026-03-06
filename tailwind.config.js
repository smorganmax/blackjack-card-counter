/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        felt: '#1a6b3c',
        'felt-dark': '#145a31',
      }
    }
  },
  plugins: []
};
