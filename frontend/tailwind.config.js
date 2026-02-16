/** @type {import('tailwindcss').Config} */
module.exports = {
  // This tells Tailwind to look inside all HTML and TypeScript files in your src folder
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      // Adding the Google Font from your index.html
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      // You can define custom colors here if you want to use them throughout the app
      colors: {
        themeDark: '#0f172a', // The main background color we used
      }
    },
  },
  plugins: [],
}