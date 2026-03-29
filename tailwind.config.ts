/**
 * M1NDMAP11 Tailwind Configuration
 * Design System per Section 29 of Master Prompt
 */

import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // M1NDMAP11 Design System Colors - SPEC EXACT
        canvas: '#F3EFE6',    // Default background everywhere
        ink: '#0F1416',       // All body text and iconography
        ecru: '#F3EFE9',      // Wordmark background
        charcoal: '#111111',  // Wordmark text on ecru
        graphite: '#0E0E0E',  // Inverted dark surfaces
        surface: '#FFFFFF',   // Cards and panels
        border: '#E8E4DC',    // All dividers and outlines
        muted: '#9B9590',     // Secondary text, captions, placeholders
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        wordmark: ['GT America', 'sans-serif'],
      },
      fontSize: {
        // Typography Scale - SPEC EXACT
        h1: ['44px', { lineHeight: '52px', fontWeight: '600' }],
        h2: ['32px', { lineHeight: '40px', fontWeight: '600' }],
        h3: ['24px', { lineHeight: '32px', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '26px', fontWeight: '400' }],
        caption: ['13px', { lineHeight: '20px', fontWeight: '400' }],
      },
      letterSpacing: {
        wordmark: '0.03em',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};

export default config;
