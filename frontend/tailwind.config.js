/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#FDF7F8',
          100: '#FBF0F2',
          200: '#F6DFE4',
          300: '#ECC4CD',
          400: '#DEA2AF',
          500: '#C97A8C',
          600: '#B0596D',
          700: '#924153',
        },
        cream: {
          50: '#FDFCFA',
          100: '#FAF7F0',
          200: '#F4EFE4',
          300: '#ECE4D4',
          400: '#DFD3BE',
        },
        taupe: {
          50: '#F9F8F6',
          100: '#F2EFEB',
          200: '#E4DFD7',
          300: '#D2C9BD',
          400: '#B5A898',
          500: '#978875',
          600: '#7B6C5A',
        },
        charcoal: {
          100: '#8A8580',
          200: '#645F5B',
          300: '#484440',
          400: '#34302D',
          500: '#23201D',
          600: '#1A1816',
          700: '#121110',
        },
        gold: {
          100: '#F9F4E8',
          200: '#F1E3C4',
          300: '#E4C992',
          400: '#D4AF60',
          500: '#C5A059',
          600: '#AA853D',
          700: '#856428',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(26, 24, 22, 0.05)',
        'card': '0 10px 30px -4px rgba(26, 24, 22, 0.08)',
        'modal': '0 25px 50px -12px rgba(26, 24, 22, 0.25)',
      }
    },
  },
  plugins: [],
}
