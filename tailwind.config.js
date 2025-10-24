/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./products.html", "./collections.html", "./checkout.html", "./app.html", "./components/**/*.html", "./src/**/*.js"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0c10",
        midnight: "#0f1115",
        moon: "#a78bfa",
        gold: "#f5d483",
        amethyst: "#6b46c1"
      },
      boxShadow: {
        'mystic': '0 0 30px rgba(167,139,250,0.25)'
      }
    },
    fontFamily: {
      serif: ['"Cinzel"', 'ui-serif', 'Georgia', 'serif'],
      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
    }
  },
  plugins: []
}