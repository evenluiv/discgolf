/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "base": "#F8EDE3",
        "green-1": "#BDD2B6",
        "green-2": "#A2B29F",
        "green-3": "#798777",
      },
    },
  },
  plugins: [],
}

