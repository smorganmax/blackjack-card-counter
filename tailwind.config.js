/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        felt: {
          DEFAULT: '#1a6b3c',
          dark: '#145a31',
          light: '#1e7d46',
        },
        gold: {
          DEFAULT: '#D4AF37',
          dark: '#B8960C',
          light: '#E8C84A',
        },
        casino: {
          black: '#0a0a0f',
          slate: '#141420',
          card: '#1c1c2e',
          surface: '#1e1e30',
          border: 'rgba(255,255,255,0.08)',
        },
        chip: {
          red: '#C41E3A',
          blue: '#1E5AA8',
          green: '#1B8C4F',
          black: '#1a1a2e',
          purple: '#7B2D8E',
          orange: '#D4712A',
          gold: '#D4AF37',
        },
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
        'card-lg': '0 4px 16px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)',
        'glow-gold': '0 0 15px rgba(212,175,55,0.3)',
        'glow-green': '0 0 15px rgba(16,185,129,0.3)',
        'glow-blue': '0 0 15px rgba(59,130,246,0.3)',
        'chip': '0 3px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
        'inner-light': 'inset 0 1px 0 rgba(255,255,255,0.1)',
      },
      backgroundImage: {
        'felt-texture': 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 2px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'flip-card': 'flipCard 0.4s ease-in-out',
        'chip-bounce': 'chipBounce 0.4s ease-out',
        'count-pulse': 'countPulse 0.3s ease-out',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'screen-enter': 'screenEnter 0.25s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'deal-card': 'dealCard 0.3s ease-out',
        'pop-in': 'popIn 0.2s ease-out',
        'bar-fill': 'barFill 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        flipCard: {
          '0%': { transform: 'rotateY(180deg)', opacity: '0' },
          '50%': { opacity: '0.5' },
          '100%': { transform: 'rotateY(0)', opacity: '1' },
        },
        chipBounce: {
          '0%': { transform: 'scale(0.8) translateY(10px)', opacity: '0' },
          '60%': { transform: 'scale(1.05) translateY(-2px)' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        countPulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        screenEnter: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(212,175,55,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(212,175,55,0.6)' },
        },
        dealCard: {
          from: { opacity: '0', transform: 'translateY(-40px) scale(0.8)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        popIn: {
          from: { transform: 'scale(0.85)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        barFill: {
          from: { width: '0%' },
        },
      },
    }
  },
  plugins: []
};
