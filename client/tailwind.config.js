/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        // TrueHire Premium Charcoal, Warm White & Gold Palette
        charcoal: {
          DEFAULT: '#202124',
          dark: '#343538',
          light: '#3C4043',
        },
        'warm-white': {
          DEFAULT: '#FAF9F6',
          dark: '#F3F1EC',
        },
        gold: {
          DEFAULT: '#C6A15B',
          dark: '#A98443',
          light: '#D9B978',
        },
        'soft-beige': {
          DEFAULT: '#E9E6DF',
          dark: '#DDD8CE',
        },
        grey: {
          DEFAULT: '#666666',
          light: '#888888',
          dark: '#444444',
        },
        white: '#FFFFFF',

        // Token aliases for smooth semantic consistency
        mono: {
          900: '#202124',
          800: '#343538',
          700: '#3C4043',
          600: '#666666',
          500: '#888888',
          400: '#A98443',
          300: '#C6A15B',
          200: '#E9E6DF',
          100: '#FAF9F6',
          50: '#FFFFFF',
        },
      },

      fontFamily: {
        sans: ['Inter', 'Geist', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      boxShadow: {
        subtle: '0 1px 2px 0 rgba(32, 33, 36, 0.04)',
        card: '0 1px 3px 0 rgba(32, 33, 36, 0.06), 0 1px 2px -1px rgba(32, 33, 36, 0.04)',
        gold: '0 4px 14px 0 rgba(198, 161, 91, 0.25)',
        dropdown: '0 4px 6px -1px rgba(32, 33, 36, 0.08), 0 2px 4px -2px rgba(32, 33, 36, 0.04)',
        modal: '0 10px 25px -3px rgba(32, 33, 36, 0.15), 0 4px 6px -4px rgba(32, 33, 36, 0.05)',
      },

      borderRadius: {
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
      },
    },
  },

  plugins: [],
};
