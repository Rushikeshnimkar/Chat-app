/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#1a1a1a',
          secondary: '#2d2d2d',
          accent: '#3d3d3d',
          text: '#ffffff',
          muted: '#9ca3af',
        },
      },
    },
  },
  plugins: [],
}

