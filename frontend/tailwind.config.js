/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cravelle: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF6B35', // Cravelle Primary Orange
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        coral: {
          50: '#FFF5F2',
          100: '#FFE6DF',
          200: '#FFCCBE',
          300: '#FFA893',
          400: '#FF7F50', // Warm Coral
          500: '#F25C3B',
          600: '#D94324',
        },
        cream: {
          50: '#FFFDF9',
          100: '#FFFBF5', // Warm Cream Background
          200: '#FDF6EC',
          300: '#F7EDE0',
          400: '#EBDCCE',
          500: '#DBC5B2',
        },
        charcoal: {
          50: '#F6F6F7',
          100: '#E7E8EA',
          200: '#C4C6CC',
          300: '#8E929E',
          400: '#5A5F6E',
          500: '#3A3F4D',
          600: '#2A2E39',
          700: '#1F222B',
          800: '#1A1D24', // Dark Charcoal
          900: '#111318',
        },
        veg: {
          50: '#ECFDF5',
          500: '#10B981',
          600: '#059669',
        },
        nonveg: {
          50: '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(26, 29, 36, 0.06)',
        'card': '0 10px 30px -4px rgba(26, 29, 36, 0.08)',
        'float': '0 20px 40px -10px rgba(255, 107, 53, 0.25)',
        'modal': '0 25px 50px -12px rgba(17, 19, 24, 0.35)',
      }
    },
  },
  plugins: [],
}
