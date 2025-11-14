/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./index.html",
    "./app.html",
    "./collections.html",
    "./products.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        reader: "url('/src/assets/images/reader-background.jpg')"
      }
    }
  },
  plugins: [],
};
