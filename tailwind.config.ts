import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        "primary": "#379585",
        "primary-hover": "#2a776b"
      }
    }
  },

  plugins: []
} satisfies Config;
