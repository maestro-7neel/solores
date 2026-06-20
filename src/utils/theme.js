// src/utils/theme.js - Design system for Solores
// Modern minimal aesthetic: Dark teal background with white card-based UI and purple accents

export const COLORS = {
  // Base - Warm cream/beige background, white card-based sheets, rich dark rose-charcoal contrast panels
  background: '#FAF6F2',
  surface: '#FFFFFF',
  surfaceElevated: '#F5ECE4',
  card: '#FFFFFF',
  cardDark: '#1E1214',      // Deep rich dark rose-charcoal

  // Accent palette - Coral-pink theme
  accent: '#F39E94',        // Warm coral-pink
  accentSoft: '#F39E9422',  // Transparent coral-pink
  accentBlue: '#8C9A86',    // Warm sage green (matches coral-pink perfectly)
  accentPurple: '#E5C0BE',  // Soft rose
  accentAmber: '#E6A15C',   // Muted gold

  // Status colors
  success: '#75A88F',       // Soft green
  successSoft: '#75A88F22',
  warning: '#E6A15C',
  warningSoft: '#E6A15C22',
  danger: '#D9716C',        // Soft red/pinkish-red
  dangerSoft: '#D9716C22',

  // Typography - Dark rose-charcoal text on light sheets, light text on dark backgrounds
  text: '#1E1214',           // Dark rose-charcoal
  textSecondary: '#6E5C5E',  // Muted rose-gray
  textMuted: '#9B8789',      // Lighter rose-gray
  surfaceText: '#1E1214',
  
  // Light text for dark backgrounds
  textLight: '#FFFFFF',
  textSecondaryLight: '#EBDAD8',
  textMutedLight: '#BC9F9F',

  // Borders
  border: '#E8E1DA',
  borderLight: '#F3ECE6',
  borderDark: '#352125',

  // Calendar colors
  calGreen: '#75A88F',
  calYellow: '#E6A15C',
  calRed: '#D9716C',
  calEmpty: '#F3ECE6',

  // Gradient stops for backgrounds
  gradientStart: '#1E1214',
  gradientEnd: '#301C20',
};

export const FONTS = {
  regular: { fontWeight: '400' },
  medium: { fontWeight: '500' },
  semibold: { fontWeight: '600' },
  bold: { fontWeight: '700' },
  display: { fontWeight: '800', letterSpacing: -0.5 },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 14,
  lg: 24,
  xl: 32,
  full: 999,
};

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  glow: {
    shadowColor: '#C3C1FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
};

// Expense categories with icons and colors
export const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: '🍔', color: '#F59E0B' },
  { id: 'transport', label: 'Transport', icon: '🚌', color: '#3B82F6' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#8B5CF6' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#EC4899' },
  { id: 'health', label: 'Health', icon: '💊', color: '#10B981' },
  { id: 'education', label: 'Education', icon: '📚', color: '#06B6D4' },
  { id: 'utilities', label: 'Utilities', icon: '⚡', color: '#F97316' },
  { id: 'other', label: 'Other', icon: '📦', color: '#94A3B8' },
];

export const USER_TYPES = [
  { id: 'student', label: 'Student', icon: '🎓', desc: 'Managing on limited budget' },
  { id: 'professional', label: 'Working Professional', icon: '💼', desc: 'Growing income & savings' },
  { id: 'other', label: 'Other', icon: '✨', desc: 'Custom financial journey' },
];
