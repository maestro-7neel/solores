// src/utils/theme.js - Design system for Solores
// Modern minimal aesthetic: Dark teal background with white card-based UI and purple accents

export const COLORS = {
  // Base - Dark teal background with white cards
  background: '#0D2D3D',
  surface: '#FFFFFF',
  surfaceElevated: '#F5F5F5',
  card: '#FFFFFF',

  // Accent palette - Purple/Lavender theme
  accent: '#A78BFA',        // Lavender purple
  accentSoft: '#A78BFA22',
  accentBlue: '#818CF8',    // Indigo
  accentPurple: '#C4B5FD',  // Light purple
  accentAmber: '#FBBF24',

  // Status colors
  success: '#10B981',
  successSoft: '#10B98122',
  warning: '#F59E0B',
  warningSoft: '#F59E0B22',
  danger: '#EF4444',
  dangerSoft: '#EF444422',

  // Typography - Dark text on light cards, light text on dark background
  text: '#1F2937',           // Dark gray for card text
  textSecondary: '#4B5563',  // Medium gray for secondary text
  textMuted: '#6B7280',      // Light gray for muted text
  surfaceText: '#1F2937',    // Dark text on cards
  
  // Light text for dark backgrounds
  textLight: '#FFFFFF',
  textSecondaryLight: '#E5E7EB',
  textMutedLight: '#D1D5DB',

  // Borders
  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  // Calendar colors
  calGreen: '#10B981',
  calYellow: '#F59E0B',
  calRed: '#EF4444',
  calEmpty: '#F0F0F0',

  // Gradient stops
  gradientStart: '#0D2D3D',
  gradientEnd: '#0D2D3D',
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
  md: 12,
  lg: 16,
  xl: 24,
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
    shadowColor: '#A78BFA',
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
