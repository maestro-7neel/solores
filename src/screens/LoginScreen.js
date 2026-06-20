// src/screens/LoginScreen.js
// Full-featured login screen matching the AI Financial Copilot dark fintech theme

import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AuthService } from '../services/AuthService';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, STATUS_BAR_HEIGHT } from '../utils/theme';

export default function LoginScreen({ navigation }) {
  const { reload } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  // Shake animation for error
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = async () => {
    setError('');

    if (!username.trim()) {
      setError('Please enter your username');
      triggerShake();
      return;
    }
    if (!password) {
      setError('Please enter your password');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.login(username, password);
      if (result.success) {
        await reload();
        // Navigate to onboarding or main app
        // Check if profile exists — if yes go to MainTabs, else Onboarding
        const { StorageService } = require('../services/StorageService');
        const profile = await StorageService.getUserProfile();
        navigation.replace(profile ? 'MainTabs' : 'Onboarding');
      } else {
        setError(result.error);
        triggerShake();
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const passwordRef = useRef(null);

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
          {/* Logo */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🤖</Text>
            </View>
            <Text style={styles.appName}>Solores</Text>
            <Text style={styles.tagline}>Your AI Financial Copilot</Text>
          </View>

          {/* Card */}
          <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>
            <Text style={styles.cardTitle}>Welcome back</Text>
            <Text style={styles.cardSub}>Sign in to continue</Text>

            {/* Error Banner */}
            {error ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Username Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Username</Text>
              <View style={[
                styles.inputWrapper,
                focusedField === 'username' && styles.inputWrapperFocused,
                error && !username && styles.inputWrapperError,
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
                  placeholder="Enter your username"
                  placeholderTextColor={COLORS.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={[
                styles.inputWrapper,
                focusedField === 'password' && styles.inputWrapperFocused,
                error && !password && styles.inputWrapperError,
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
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(v => !v)}
                  style={styles.eyeBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              <View style={styles.loginBtnInner}>
                {loading ? (
                  <ActivityIndicator color={COLORS.textLight} size="small" />
                ) : (
                  <>
                    <Text style={styles.loginBtnText}>Sign In</Text>
                    <Ionicons name="arrow-forward" size={18} color={COLORS.textLight} />
                  </>
                )}
              </View>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register Link */}
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerText}>Don't have an account? </Text>
              <Text style={styles.registerLink}>Create one →</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer */}
          <Text style={styles.footer}>Your data stays on your device 🔒</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1, justifyContent: 'center',
    padding: SPACING.lg, paddingTop: STATUS_BAR_HEIGHT + 16, paddingBottom: 40,
  },
  logoSection: { alignItems: 'center', marginBottom: SPACING.xl },
  logoCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.accentSoft,
    borderWidth: 1.5, borderColor: COLORS.accent,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  logoEmoji: { fontSize: 32 },
  appName: {
    color: COLORS.text, fontSize: 28, fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: { color: COLORS.textSecondary, fontSize: 13, marginTop: 4 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardTitle: { color: COLORS.text, fontSize: 22, fontWeight: '800', marginBottom: 4 },
  cardSub: { color: COLORS.textSecondary, fontSize: 14, marginBottom: SPACING.lg },
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
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    borderWidth: 1.5, borderColor: COLORS.border,
    paddingHorizontal: 12,
  },
  inputWrapperFocused: { borderColor: COLORS.accent },
  inputWrapperError: { borderColor: COLORS.danger },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1, color: COLORS.text,
    fontSize: 15, paddingVertical: 14,
    fontWeight: '500',
  },
  eyeBtn: { padding: 4 },
  loginBtn: {
    borderRadius: RADIUS.full, overflow: 'hidden',
    marginTop: SPACING.sm, marginBottom: SPACING.md,
  },
  loginBtnInner: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    paddingVertical: 15,
    backgroundColor: COLORS.cardDark,
  },
  loginBtnText: { color: COLORS.textLight, fontSize: 16, fontWeight: '800' },
  dividerRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: SPACING.md,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { color: COLORS.textMuted, fontSize: 12 },
  registerBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerText: { color: COLORS.textSecondary, fontSize: 14 },
  registerLink: { color: COLORS.accent, fontSize: 14, fontWeight: '700' },
  footer: {
    color: COLORS.textMuted, fontSize: 11,
    textAlign: 'center', marginTop: SPACING.xl,
  },
});
