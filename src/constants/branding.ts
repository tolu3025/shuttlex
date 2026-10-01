/**
 * ShuttleX Brand & Design System Tokens
 * Single source of truth for ShuttleX identity.
 */

export const BRANDING = {
  appName: 'ShuttleX',
  companyName: 'ShuttleX Inc.',
  tagline: 'Delivers Fast, Safe Rides With Real-Time Tracking And Flexible Booking',
  heroHeadline: {
    prefix: 'Go When',
    main: 'You Want',
    highlight: 'Anywhere.'
  },
  campusName: 'Green Park (UK)',
  currencySymbol: '₦',
  currencyCode: 'NGN',
  supportEmail: 'support@shuttlex.io',
  
  // Design Tokens (Lufga & Monochrome Design System)
  colors: {
    primary: '#010101',         // Deep Pitch Black
    secondary: '#1A1A1A',       // Rich Charcoal
    background: '#FAFAFA',      // Ultra Clean Off-White
    surface: '#FFFFFF',         // Pure White
    textPrimary: '#010101',     // Main Text
    textSecondary: '#666666',   // Black Gray Muted
    textLight: '#999999',       // Light Gray
    border: '#EEEEEE',          // Subtle Border
    borderDark: '#222222',
    accent: '#010101',          // Primary Action
    warning: '#F59E0B',
    danger: '#EF4444',
    success: '#10B981',
    gray100: '#F5F5F7',
    gray200: '#E5E7EB',
    gray400: '#9CA3AF',
    gray800: '#1F2937',
  }
};

export const ROLE_LABELS = {
  STUDENT: 'Passenger',
  RIDER: 'ShuttleX Driver',
  ADMIN: 'System Admin'
};
