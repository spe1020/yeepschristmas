/**
 * Yeeps Theme Configuration
 * Centralized color palette and design tokens for the Yeeps Advent Calendar
 */

export const yeepsTheme = {
  colors: {
    primary: '#A9B0E9',      // Soft blue primary
    secondary: '#AA653B',    // Warm plush/brown secondary
    rare: '#D8DEC7',          // Mint/pastel accent for rare/special items
    bgDark: '#242328',       // Dark background / night mode
    bgLight: '#F5F5F5',      // Light card background
    text: '#FFFFFF',         // Primary text (white)
    textDark: '#1a1a1a',     // Dark text for light backgrounds
  },
  
  // Design tokens
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  
  // Shadows for plush/toy-like feel
  shadows: {
    soft: '0 2px 8px rgba(169, 176, 233, 0.15)',
    medium: '0 4px 16px rgba(169, 176, 233, 0.25)',
    large: '0 8px 24px rgba(169, 176, 233, 0.35)',
  },
} as const;

/**
 * Convert hex colors to HSL for Tailwind CSS variables
 * These will be used in index.css
 */
export const yeepsColorsHSL = {
  primary: '230 45% 78%',      // #A9B0E9
  secondary: '24 45% 45%',     // #AA653B
  rare: '75 25% 85%',          // #D8DEC7
  bgDark: '260 8% 15%',        // #242328
  bgLight: '0 0% 96%',         // #F5F5F5
} as const;

