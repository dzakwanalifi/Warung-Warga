import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors from UI/UX Guide
        primary: '#26A69A', // Community Teal
        accent: '#FFCA28', // Warm Amber
        
        // Background colors
        background: '#F8F9FA', // Off-white
        surface: '#FFFFFF', // Pure White
        'surface-secondary': '#F1F3F4', // Light Gray Surface
        
        // Text colors
        'text-primary': '#212529', // Dark Gray
        'text-secondary': '#6C757D', // Medium Gray
        
        // Border and divider colors
        border: '#E9ECEF', // Light Gray
        
        // Status colors
        error: '#E53935', // Red
        success: '#43A047', // Green
        warning: '#FB8C00', // Orange
        info: '#1E88E5', // Blue
        
        // Hover states
        'primary-hover': '#218e81',
        'primary-light': 'rgba(38, 166, 154, 0.1)',
        'error-hover': '#c62828',
        'success-hover': '#388e3c',
      },
      fontSize: {
        // Typography from UI/UX Guide
        'display': ['28px', { lineHeight: '36px', fontWeight: '700' }], // Display
        'heading-1': ['22px', { lineHeight: '28px', fontWeight: '700' }], // Heading 1
        'heading-2': ['18px', { lineHeight: '24px', fontWeight: '600' }], // Heading 2
        'body-large': ['16px', { lineHeight: '24px', fontWeight: '400' }], // Body Large
        'body-small': ['14px', { lineHeight: '20px', fontWeight: '400' }], // Body Small
        'label': ['14px', { lineHeight: '20px', fontWeight: '500' }], // Label
        'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }], // Caption
      },
      spacing: {
        // Grid system: 1 unit = 8px
        '1u': '8px',   // 1 unit
        '2u': '16px',  // 2 units
        '3u': '24px',  // 3 units
        '4u': '32px',  // 4 units
        '5u': '40px',  // 5 units
        '6u': '48px',  // 6 units
        '8u': '64px',  // 8 units
      },
      borderRadius: {
        // Border radius from UI/UX Guide
        'card': '12px',
        'button': '8px',
        'input': '8px',
        'avatar': '8px',
      },
      boxShadow: {
        // Shadows from UI/UX Guide
        'card': '0px 4px 16px rgba(33, 37, 41, 0.05)',
        'modal': '0px 8px 24px rgba(33, 37, 41, 0.1)',
      },
      transitionDuration: {
        // Standard transition
        'standard': '200ms',
      },
      transitionTimingFunction: {
        'standard': 'ease-in-out',
      },
    },
  },
  plugins: [],
}
export default config 