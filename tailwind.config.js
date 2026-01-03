// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue"
  ],
  // ✅ SAFELIST : Classes dynamiques beauté utilisées dans agent-ia/[id].vue
  safelist: [
    // Rose (skincare)
    'bg-rose-50', 'bg-rose-100', 'bg-rose-200', 'bg-rose-500', 'bg-rose-600', 'bg-rose-700',
    'text-rose-600', 'text-rose-700', 'text-rose-800',
    'border-rose-200', 'border-rose-500', 'border-rose-600',
    'hover:bg-rose-50', 'hover:bg-rose-700',
    'focus:ring-rose-500', 'focus:border-rose-500',
    // Pink (multi/default)
    'bg-pink-50', 'bg-pink-100', 'bg-pink-200', 'bg-pink-500', 'bg-pink-600', 'bg-pink-700',
    'text-pink-600', 'text-pink-700', 'text-pink-800',
    'border-pink-200', 'border-pink-500', 'border-pink-600',
    'hover:bg-pink-50', 'hover:bg-pink-700',
    'focus:ring-pink-500', 'focus:border-pink-500',
    // Purple (makeup)
    'bg-purple-50', 'bg-purple-100', 'bg-purple-200', 'bg-purple-500', 'bg-purple-600', 'bg-purple-700',
    'text-purple-600', 'text-purple-700', 'text-purple-800',
    'border-purple-200', 'border-purple-500', 'border-purple-600',
    'hover:bg-purple-50', 'hover:bg-purple-700',
    'focus:ring-purple-500', 'focus:border-purple-500',
    // Violet (fragrance)
    'bg-violet-50', 'bg-violet-100', 'bg-violet-200', 'bg-violet-500', 'bg-violet-600', 'bg-violet-700',
    'text-violet-600', 'text-violet-700', 'text-violet-800',
    'border-violet-200', 'border-violet-500', 'border-violet-600',
    'hover:bg-violet-50', 'hover:bg-violet-700',
    'focus:ring-violet-500', 'focus:border-violet-500',
    // Amber (haircare)
    'bg-amber-50', 'bg-amber-100', 'bg-amber-200', 'bg-amber-500', 'bg-amber-600', 'bg-amber-700',
    'text-amber-600', 'text-amber-700', 'text-amber-800',
    'border-amber-200', 'border-amber-500', 'border-amber-600',
    'hover:bg-amber-50', 'hover:bg-amber-700',
    'focus:ring-amber-500', 'focus:border-amber-500',
    // Teal (bodycare)
    'bg-teal-50', 'bg-teal-100', 'bg-teal-200', 'bg-teal-500', 'bg-teal-600', 'bg-teal-700',
    'text-teal-600', 'text-teal-700', 'text-teal-800',
    'border-teal-200', 'border-teal-500', 'border-teal-600',
    'hover:bg-teal-50', 'hover:bg-teal-700',
    'focus:ring-teal-500', 'focus:border-teal-500',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-in-up': 'slideInUp 0.3s ease-out',
        'slide-in-down': 'slideInDown 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
          '70%': { transform: 'scale(0.9)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'hard': '0 10px 40px -10px rgba(0, 0, 0, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}