/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mes: {
          50: '#F0F5FA',
          100: '#E1EDF6',
          200: '#C2DBED',
          300: '#94C0DF',
          400: '#5F9ECB',
          500: '#387EB4',
          600: '#266497',
          700: '#1D4F79',
          800: '#0B3C73', // Azul institucional MES
          900: '#082C55', // Azul profundo
          950: '#04172E',
        },
      },
    },
  },
  plugins: [],
};