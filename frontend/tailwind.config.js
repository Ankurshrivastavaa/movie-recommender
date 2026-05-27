/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f0',
          100: '#ffe0de',
          200: '#ffc5c2',
          300: '#ff9d98',
          400: '#ff6560',
          500: '#ff3932',
          600: '#ed1a12',
          700: '#c8120b',
          800: '#a5130d',
          900: '#891612',
          950: '#4b0604',
        },
        dark: {
          900: '#050810',
          800: '#090d1a',
          700: '#0d1224',
          600: '#131929',
          500: '#1a2235',
          400: '#1f2a40',
          300: '#253250',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #050810 0%, #0d1224 50%, #1a0a2e 100%)',
        'card-gradient': 'linear-gradient(180deg, transparent 0%, rgba(5,8,16,0.9) 70%, #050810 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 1.5s infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255,57,50,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(255,57,50,0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-red': '0 0 30px rgba(255,57,50,0.4)',
        'glow-gold': '0 0 30px rgba(251,191,36,0.4)',
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
        'card': '0 20px 60px rgba(0,0,0,0.5)',
      }
    },
  },
  plugins: [],
}
