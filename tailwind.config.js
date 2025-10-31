/** @type {import('tailwindcss').Config} */
module.exports = {
  // Optimized content paths - no duplicates
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Optimized Netflix color palette
        netflix: {
          red: "#E50914",
          "red-dark": "#B20710",
          "red-light": "#F40612",
          black: "#000000",
          "gray-dark": "#141414",
          "gray-medium": "#2F2F2F",
          "gray-light": "#808080",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        // Optimized - removed redundant entries, keep only extended sizes
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        // Optimized - only custom values
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        // Optimized animations
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'slide-in-up': 'slide-in-up 0.5s ease-out',
        'slide-in-down': 'slide-in-down 0.5s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        // GPU-accelerated transforms
        'fade-in': {
          '0%': { opacity: '0', transform: 'translate3d(0, 10px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translate3d(20px, 0, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translate3d(-20px, 0, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'slide-in-up': {
          '0%': { opacity: '0', transform: 'translate3d(0, 20px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'slide-in-down': {
          '0%': { opacity: '0', transform: 'translate3d(0, -20px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(229, 9, 20, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(229, 9, 20, 0.6)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -10px, 0)' },
        },
      },
      boxShadow: {
        // Optimized shadows
        'premium': '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(229, 9, 20, 0.2)',
        'premium-lg': '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(229, 9, 20, 0.3)',
        'glow-red': '0 0 20px rgba(229, 9, 20, 0.5)',
        'glow-red-lg': '0 0 40px rgba(229, 9, 20, 0.6)',
        'inner-premium': 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        // Only custom values
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      transitionDuration: {
        // Optimized durations
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      zIndex: {
        // Custom z-index values
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  // Performance optimizations
  corePlugins: {
    // Disable unused features for smaller bundle
    preflight: true,
  },
  plugins: [],
};