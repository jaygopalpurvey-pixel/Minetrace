/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-main)',
        sidebar: 'var(--bg-sidebar)',
        card: {
          DEFAULT: 'var(--bg-card)',
          hover: 'var(--bg-card-hover)',
        },
        surface: {
          DEFAULT: 'var(--bg-surface)',
          hover: 'var(--bg-surface-hover)',
        },
        accent: {
          primary: 'var(--accent-primary)',
          'primary-glow': 'var(--accent-primary-glow)',
          secondary: 'var(--accent-secondary)',
          'secondary-glow': 'var(--accent-secondary-glow)',
        },
        risk: {
          high: 'var(--risk-high)',
          'high-bg': 'var(--risk-high-bg)',
          medium: 'var(--risk-medium)',
          'medium-bg': 'var(--risk-medium-bg)',
          low: 'var(--risk-low)',
          'low-bg': 'var(--risk-low-bg)',
          insufficient: 'var(--risk-insufficient)',
          'insufficient-bg': 'var(--risk-insufficient-bg)',
        },
        content: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          highlight: 'var(--border-highlight)',
          cyan: 'var(--border-cyan)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(67, 217, 255, 0.25)',
        'glow-subtle': '0 0 15px -3px rgba(114, 135, 255, 0.15)',
        'card-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ambient-glow': 'ambientGlow 12s ease infinite alternate',
      },
      keyframes: {
        ambientGlow: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(40px, -20px) scale(1.08)' },
        },
      },
    },
  },
  plugins: [],
};
