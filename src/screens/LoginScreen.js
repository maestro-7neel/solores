// src/screens/LoginScreen.js - Login/Register screen
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../services/StorageService';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../utils/theme';

export default function LoginScreen({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true); // true = login, false = register
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleMode = () => {
    setLoginId('');
    setPassword('');
    setConfirmPassword('');
    setIsLogin(!isLogin);
  };

  const validateInputs = () => {
    if (!loginId.trim()) {
      Alert.alert('Error', 'Please enter a login ID');
      return false;
    }
    if (loginId.length < 3) {
      Alert.alert('Error', 'Login ID must be at least 3 characters');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      // Check if login ID already exists
      const existing = await StorageService.getLoginCredentials();
      if (existing && existing.loginId === loginId) {
        Alert.alert('Error', 'This login ID is already registered. Please login or use a different ID.');
        setIsLoading(false);
        return;
      }

      // Save new credentials
      await StorageService.saveLoginCredentials(loginId, password);
      Alert.alert('Success', 'Account created and logged in!', [
        { text: 'OK', onPress: onLoginSuccess },
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
      console.error('Register error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginId.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter login ID and password');
      return;
    }

    setIsLoading(true);
    try {
      const isValid = await StorageService.validateLogin(loginId, password);
      if (isValid) {
        Alert.alert('Success', 'Login successful!');
        onLoginSuccess();
      } else {
        Alert.alert('Error', 'Invalid login ID or password');
      }
    } catch (e) {
      Alert.alert('Error', 'Login failed. Please try again.');
      console.error('Login error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient colors={['#081822', '#06121A']} style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Ionicons name="wallet" size={48} color={COLORS.accent} />
          </View>
          <Text style={styles.appName}>solores</Text>
          <Text style={styles.tagline}>Smart Financial Management</Text>
        </LinearGradient>

        {/* Form Card */}
        <View style={[styles.formCard, SHADOWS.card]}>
          {/* Tab Toggle */}
          <View style={styles.tabToggle}>
            <TouchableOpacity
              style={[styles.tab, isLogin && styles.tabActive]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, !isLogin && styles.tabActive]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Register</Text>
            </TouchableOpacity>
          </View>

          {/* Form Title */}
          <Text style={styles.formTitle}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text style={styles.formSubtitle}>
            {isLogin
              ? 'Sign in with your login ID and password'
              : 'Set up a new account to get started'}
          </Text>

          {/* Login ID Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Login ID</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your unique login ID"
                placeholderTextColor={COLORS.textMuted}
                value={loginId}
                onChangeText={setLoginId}
                editable={!isLoading}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter password (min 6 characters)"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={18}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input (Register Only) */}
          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Confirm your password"
                  placeholderTextColor={COLORS.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                  autoCapitalize="none"
                />
              </View>
            </View>
          )}

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
            onPress={isLogin ? handleLogin : handleRegister}
            disabled={isLoading}
          >
            <LinearGradient
              colors={isLoading ? [COLORS.textMuted, COLORS.textMuted] : [COLORS.accent, '#00B894']}
              style={styles.submitBtnGradient}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Toggle Text */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <TouchableOpacity onPress={handleToggleMode} disabled={isLoading}>
              <Text style={styles.toggleLink}>
                {isLogin ? 'Register' : 'Login'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.accentBlue} />
          <Text style={styles.footerText}>Your credentials are stored securely on your device</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingVertical: SPACING.lg,
  },
  heroSection: {
    paddingVertical: SPACING.xl * 1.5,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  heroIcon: {
    marginBottom: SPACING.md,
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.accent,
    letterSpacing: -1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  formCard: {
    marginHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: '#0A111C',
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: RADIUS.sm,
  },
  tabActive: {
    backgroundColor: COLORS.accent,
  },
  tabText: {
    color: COLORS.textMuted,
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#000',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  formSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A111C',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#14213A',
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  submitBtn: {
    marginTop: SPACING.lg,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  toggleText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  toggleLink: {
    color: COLORS.accent,
    fontWeight: '700',
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xl,
    marginHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    maxWidth: 250,
    textAlign: 'center',
  },
});
