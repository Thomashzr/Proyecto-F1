/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        asfalto: {
          DEFAULT: '#0a0b0d',
          card: '#13151a',
          border: '#222630',
          hover: '#1c1f26',
        },
        f1red: {
          DEFAULT: '#e10600',
          dark: '#b30500',
          light: '#ff2a24',
        },
        telemetria: {
          DEFAULT: '#9ca3af',
          light: '#f3f4f6',
          muted: '#4b5563',
          gold: '#eab308',
        },
      },
      fontFamily: {
        display: ['"Chakra Petch"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Outfit"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
