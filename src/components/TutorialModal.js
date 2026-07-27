// src/components/TutorialModal.js - Interactive tutorial for first-time users
import React, { useState } from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity,
  Dimensions, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    icon: 'rocket-outline',
    badge: 'Welcome to Solores 🤖',
    title: 'Your AI Financial Copilot',
    subtitle: 'Take control of your money with smart budgeting, transaction tracking, and instant AI insights.',
    highlights: [
      '⚡ Real-time spending & budget tracking',
      '🤖 Personal AI financial advice powered by Solores',
      '🔒 Secure local browser storage & saved login options',
    ],
  },
  {
    id: 'dashboard',
    icon: 'pie-chart-outline',
    badge: 'Step 1 of 4',
    title: 'Smart Dashboard',
    subtitle: 'Track your daily budget allowance and financial health score in one sleek view.',
    highlights: [
      '📈 See spend vs monthly income ratio',
      '💡 Daily recommended spending limits',
      '🎯 Progress toward your monthly savings goal',
    ],
  },
  {
    id: 'tracker',
    icon: 'wallet-outline',
    badge: 'Step 2 of 4',
    title: 'Expense Tracker',
    subtitle: 'Log expenses effortlessly and keep tabs on every single penny spent.',
    highlights: [
      '➕ Quick transaction entry with categories',
      '🏷️ Custom labels: Food, Rent, Entertainment, Bills',
      '📊 Detailed category-wise breakdown charts',
    ],
  },
  {
    id: 'copilot',
    icon: 'sparkles-outline',
    badge: 'Step 3 of 4',
    title: 'Solores AI Copilot',
    subtitle: 'Chat directly with your AI Copilot to get tailored money-saving advice.',
    highlights: [
      '💬 Ask "How much can I spend today on dinner?"',
      '🧠 Instant financial risk alerts & tip suggestions',
      '⚡ Automated monthly budget optimizer',
    ],
  },
  {
    id: 'security',
    icon: 'lock-closed-outline',
    badge: 'Step 4 of 4',
    title: 'Browser Credentials & Security',
    subtitle: 'Save your login on this browser for fast, friction-free access anytime.',
    highlights: [
      '🔑 Toggle "Save credentials on this browser" at login',
      '🔒 Auto-fills credentials safely via local browser storage',
      '⚙️ Manage or clear browser credentials anytime in Account',
    ],
  },
];

export default function TutorialModal({ visible, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!visible) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={[styles.badge, { backgroundColor: COLORS.accentSoft }]}>
              <Text style={styles.badgeText}>{step.badge}</Text>
            </View>
            <TouchableOpacity style={styles.skipBtn} onPress={onClose}>
              <Text style={styles.skipText}>Skip Tour</Text>
              <Ionicons name="close" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Icon Header */}
          <View style={styles.iconCircle}>
            <Ionicons name={step.icon} size={36} color={COLORS.accent} />
          </View>

          {/* Title & Subtitle */}
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.subtitle}>{step.subtitle}</Text>

          {/* Highlights Box */}
          <View style={styles.highlightsContainer}>
            {step.highlights.map((item, idx) => (
              <View key={idx} style={styles.highlightRow}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.accent} />
                <Text style={styles.highlightText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Pagination Indicators */}
          <View style={styles.dotsRow}>
            {TUTORIAL_STEPS.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  idx === currentStep && styles.dotActive,
                ]}
              />
            ))}
          </View>

          {/* Footer Controls */}
          <View style={styles.footerRow}>
            {currentStep > 0 ? (
              <TouchableOpacity style={styles.prevBtn} onPress={handlePrev}>
                <Ionicons name="arrow-back" size={18} color={COLORS.textSecondary} />
                <Text style={styles.prevBtnText}>Back</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flex: 1 }} />
            )}

            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>
                {isLastStep ? 'Get Started 🚀' : 'Next Step →'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 17, 18, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  skipText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  highlightsContainer: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: 10,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  highlightText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
    flex: 1,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.accent,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  prevBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  nextBtn: {
    flex: 1,
    backgroundColor: COLORS.cardDark,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    color: COLORS.textLight,
    fontSize: 15,
    fontWeight: '800',
  },
});
