/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jersey: ['"Jersey 10"', 'sans-serif'], // Use Jersey 10
        silkscreen: ['"Silkscreen"', 'cursive'], // Use Silkscreen
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'outcast-bg': "url('/background.jpg')"
      },
    },
  },
  plugins: [],
};
