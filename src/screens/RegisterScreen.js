// src/screens/RegisterScreen.js
// Registration screen — username + password + confirm password
// Validates input, checks duplicates, stores securely via AuthService

import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AuthService } from '../services/AuthService';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

// Password strength checker
const getPasswordStrength = (password) => {
  if (!password) return { level: 0, label: '', color: COLORS.border };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: 'Weak', color: COLORS.danger };
  if (score <= 2) return { level: 2, label: 'Fair', color: COLORS.warning };
  if (score <= 3) return { level: 3, label: 'Good', color: COLORS.accentBlue };
  return { level: 4, label: 'Strong', color: COLORS.success };
};

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const strength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword && password === confirmPassword;
  const passwordsMismatch = confirmPassword && password !== confirmPassword;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleRegister = async () => {
    setError('');

    if (!username.trim()) {
      setError('Please enter a username');
      triggerShake();
      return;
    }
    if (!password) {
      setError('Please enter a password');
      triggerShake();
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.register(username, password);
      if (result.success) {
        // Go straight to onboarding after registration
        navigation.replace('Onboarding');
      } else {
        setError(result.error);
        triggerShake();
      }
    } catch (e) {
      setError('Registration failed. Please try again.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[COLORS.background, COLORS.surfaceElevated, COLORS.background]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.textSecondary} />
            <Text style={styles.backText}>Back to Sign In</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🤖</Text>
            </View>
            <Text style={styles.appName}>Create Account</Text>
            <Text style={styles.tagline}>Join Solores — it's free</Text>
          </View>

          {/* Card */}
          <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>

            {/* Error Banner */}
            {error ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Username */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Username</Text>
              <View style={[
                styles.inputWrapper,
                focusedField === 'username' && styles.inputWrapperFocused,
              ]}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={focusedField === 'username' ? COLORS.accent : COLORS.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={(v) => { setUsername(v); setError(''); }}
                  placeholder="e.g. neel_vaidya"
                  placeholderTextColor={COLORS.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                />
                {username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username) && (
                  <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                )}
              </View>
              <Text style={styles.fieldHint}>Letters, numbers, underscores only · Min 3 chars</Text>
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={[
                styles.inputWrapper,
                focusedField === 'password' && styles.inputWrapperFocused,
              ]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={focusedField === 'password' ? COLORS.accent : COLORS.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  ref={passwordRef}
                  style={styles.input}
                  value={password}
                  onChangeText={(v) => { setPassword(v); setError(''); }}
                  placeholder="Min 6 characters"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => confirmRef.current?.focus()}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(v => !v)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>

              {/* Password strength meter */}
              {password.length > 0 && (
                <View style={styles.strengthRow}>
                  <View style={styles.strengthBars}>
                    {[1, 2, 3, 4].map(n => (
                      <View
                        key={n}
                        style={[
                          styles.strengthBar,
                          { backgroundColor: n <= strength.level ? strength.color : COLORS.border }
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.strengthLabel, { color: strength.color }]}>
                    {strength.label}
                  </Text>
                </View>
              )}
            </View>

            {/* Confirm Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Confirm Password</Text>
              <View style={[
                styles.inputWrapper,
                focusedField === 'confirm' && styles.inputWrapperFocused,
                passwordsMismatch && styles.inputWrapperError,
                passwordsMatch && styles.inputWrapperSuccess,
              ]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={
                    passwordsMismatch ? COLORS.danger :
                    passwordsMatch ? COLORS.success :
                    focusedField === 'confirm' ? COLORS.accent : COLORS.textMuted
                  }
                  style={styles.inputIcon}
                />
                <TextInput
                  ref={confirmRef}
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={(v) => { setConfirmPassword(v); setError(''); }}
                  placeholder="Re-enter your password"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                  onFocus={() => setFocusedField('confirm')}
                  onBlur={() => setFocusedField(null)}
                />
                {passwordsMatch && (
                  <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                )}
                {passwordsMismatch && (
                  <Ionicons name="close-circle" size={18} color={COLORS.danger} />
                )}
                <TouchableOpacity
                  onPress={() => setShowConfirm(v => !v)}
                  style={{ marginLeft: 6 }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>
              {passwordsMismatch && (
                <Text style={styles.mismatchText}>Passwords don't match</Text>
              )}
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              <View style={styles.registerBtnInner}>
                {loading ? (
                  <ActivityIndicator color={COLORS.textLight} size="small" />
                ) : (
                  <>
                    <Text style={styles.registerBtnText}>Create Account</Text>
                    <Ionicons name="rocket-outline" size={18} color={COLORS.textLight} />
                  </>
                )}
              </View>
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginLinkText}>Already have an account? </Text>
              <Text style={styles.loginLinkAccent}>Sign in →</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.footer}>No email required · 100% local storage 🔒</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1, padding: SPACING.lg,
    paddingTop: 56, paddingBottom: 40,
  },
  backBtn: {
    flexDirection: 'row', alignItems: 'center',
    gap: 6, marginBottom: SPACING.lg,
  },
  backText: { color: COLORS.textSecondary, fontSize: 14 },
  header: { alignItems: 'center', marginBottom: SPACING.lg },
  logoCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: COLORS.accentSoft,
    borderWidth: 1.5, borderColor: COLORS.accent,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  logoEmoji: { fontSize: 28 },
  appName: { color: COLORS.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  tagline: { color: COLORS.textSecondary, fontSize: 13, marginTop: 4 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1, borderColor: COLORS.border,
  },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.dangerSoft,
    borderRadius: RADIUS.md, padding: 10,
    marginBottom: SPACING.md,
    borderWidth: 1, borderColor: COLORS.danger + '44',
  },
  errorText: { color: COLORS.danger, fontSize: 13, flex: 1 },
  fieldGroup: { marginBottom: SPACING.md },
  fieldLabel: {
    color: COLORS.textSecondary, fontSize: 12,
    fontWeight: '600', marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  fieldHint: { color: COLORS.textMuted, fontSize: 11, marginTop: 4, marginLeft: 2 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    borderWidth: 1.5, borderColor: COLORS.border,
    paddingHorizontal: 12,
  },
  inputWrapperFocused: { borderColor: COLORS.accent },
  inputWrapperError: { borderColor: COLORS.danger },
  inputWrapperSuccess: { borderColor: COLORS.success },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1, color: COLORS.text,
    fontSize: 15, paddingVertical: 14,
    fontWeight: '500',
  },
  strengthRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, marginTop: 6,
  },
  strengthBars: { flexDirection: 'row', gap: 4, flex: 1 },
  strengthBar: { flex: 1, height: 3, borderRadius: 2 },
  strengthLabel: { fontSize: 11, fontWeight: '700', width: 42 },
  mismatchText: { color: COLORS.danger, fontSize: 11, marginTop: 4, marginLeft: 2 },
  registerBtn: {
    borderRadius: RADIUS.full, overflow: 'hidden',
    marginTop: SPACING.sm, marginBottom: SPACING.md,
  },
  registerBtnInner: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    paddingVertical: 15,
    backgroundColor: COLORS.cardDark,
  },
  registerBtnText: { color: COLORS.textLight, fontSize: 16, fontWeight: '800' },
  loginLink: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
  },
  loginLinkText: { color: COLORS.textSecondary, fontSize: 14 },
  loginLinkAccent: { color: COLORS.accent, fontSize: 14, fontWeight: '700' },
  footer: {
    color: COLORS.textMuted, fontSize: 11,
    textAlign: 'center', marginTop: SPACING.xl,
  },
});
