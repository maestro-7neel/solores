// src/screens/AccountScreen.js - User profile and account section
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../context/AppContext';
import { AuthService } from '../services/AuthService';
import { StorageService } from '../services/StorageService';
import TutorialModal from '../components/TutorialModal';
import { COLORS, SPACING, RADIUS, STATUS_BAR_HEIGHT } from '../utils/theme';
import { formatCurrency } from '../utils/financialUtils';

export default function AccountScreen({ navigation }) {
  const { profile, monthExpenses, totalSpent, logout } = useApp();
  const [sessionUser, setSessionUser] = useState('');
  const [createdDate, setCreatedDate] = useState(null);
  const [hasSavedCreds, setHasSavedCreds] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    loadAccountInfo();
  }, []);

  const loadAccountInfo = async () => {
    try {
      const session = await AuthService.getCurrentUser();
      if (session) {
        setSessionUser(session.username);
        const rawUsers = await AsyncStorage.getItem('@copilot_users');
        const users = rawUsers ? JSON.parse(rawUsers) : {};
        const userData = users[session.username.toLowerCase()];
        if (userData && userData.createdAt) {
          setCreatedDate(new Date(userData.createdAt));
        }
      }

      const creds = await StorageService.getSavedBrowserCredentials();
      setHasSavedCreds(!!creds);
    } catch (e) {
      console.error('Failed to load account info:', e);
    }
  };

  const handleClearSavedCreds = async () => {
    await StorageService.clearSavedBrowserCredentials();
    setHasSavedCreds(false);
    Alert.alert('Browser Credentials Cleared', 'Saved login details have been removed from this browser.');
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.replace('Login');
        },
      },
    ]);
  };

  // Basic stats
  const disposable = profile ? profile.monthlyIncome - profile.fixedExpenses - profile.savingsGoal : 0;
  const netSavings = profile ? profile.monthlyIncome - profile.fixedExpenses - totalSpent : 0;

  return (
    <View style={styles.container}>
      <TutorialModal
        visible={showTutorial}
        onClose={() => setShowTutorial(false)}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account & Security</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* User Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {sessionUser ? sessionUser.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <Text style={styles.username}>@{sessionUser}</Text>
            <Text style={styles.createdDate}>
              Member since:{' '}
              {createdDate
                ? createdDate.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Loading...'}
            </Text>
          </View>

          {/* Browser Credentials & Security Section */}
          <Text style={styles.sectionTitle}>Browser Security & Credentials</Text>
          <View style={styles.statsCard}>
            <View style={styles.actionRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionTitle}>Browser Credential Storage</Text>
                <Text style={styles.actionDesc}>
                  {hasSavedCreds
                    ? 'Login credentials are currently saved on this browser'
                    : 'No saved login credentials found on this browser'}
                </Text>
              </View>
              {hasSavedCreds ? (
                <TouchableOpacity style={styles.outlineDangerBtn} onPress={handleClearSavedCreds}>
                  <Text style={styles.outlineDangerText}>Clear</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.badgeSuccess}>
                  <Text style={styles.badgeSuccessText}>Clean</Text>
                </View>
              )}
            </View>
          </View>

          {/* App Tutorial & Help Section */}
          <Text style={styles.sectionTitle}>Interactive App Tour</Text>
          <View style={styles.statsCard}>
            <View style={styles.actionRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionTitle}>App Walkthrough Tutorial</Text>
                <Text style={styles.actionDesc}>Revisit feature tour and budgeting tips</Text>
              </View>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setShowTutorial(true)}>
                <Ionicons name="play-circle-outline" size={18} color={COLORS.textLight} />
                <Text style={styles.actionBtnText}>Launch Tour</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Statistics Section */}
          <Text style={styles.sectionTitle}>Monthly Stats</Text>
          <View style={styles.statsCard}>
            <StatRow label="Monthly Income" value={formatCurrency(profile?.monthlyIncome || 0)} color={COLORS.text} />
            <StatRow label="Fixed Expenses" value={formatCurrency(profile?.fixedExpenses || 0)} color={COLORS.textSecondary} />
            <StatRow label="Savings Goal" value={formatCurrency(profile?.savingsGoal || 0)} color={COLORS.accent} />
            <View style={styles.divider} />
            <StatRow label="Total Spent" value={formatCurrency(totalSpent)} color={COLORS.danger} />
            <StatRow
              label="Remaining Spendable"
              value={formatCurrency(Math.max(0, disposable - totalSpent))}
              color={disposable - totalSpent >= 0 ? COLORS.success : COLORS.danger}
            />
            <StatRow
              label="Projected Savings"
              value={formatCurrency(Math.max(0, netSavings))}
              color={COLORS.success}
            />
          </View>

          {/* Account Settings / General Stats Card */}
          <Text style={styles.sectionTitle}>Usage Stats</Text>
          <View style={styles.statsCard}>
            <StatRow label="Total Transactions" value={`${monthExpenses.length} bills`} color={COLORS.text} />
            <StatRow label="Profile Type" value={profile?.userType ? profile.userType.toUpperCase() : 'Standard'} color={COLORS.textSecondary} />
            <StatRow label="App Mode" value="Interactive AI & Simple" color={COLORS.textSecondary} />
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.textLight} />
            <Text style={styles.logoutBtnText}>Log Out</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

function StatRow({ label, value, color }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: STATUS_BAR_HEIGHT + 8,
    paddingBottom: SPACING.md,
    backgroundColor: '#FDF2F0', // slight pink
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: { color: COLORS.text, fontSize: 18, fontWeight: '800' },
  content: {
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceElevated,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    flex: 1,
    minHeight: 650,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: COLORS.accent },
  username: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  createdDate: { fontSize: 13, color: COLORS.textSecondary },
  sectionTitle: { color: COLORS.text, fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginLeft: SPACING.sm, marginBottom: SPACING.sm, marginTop: SPACING.sm },
  statsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  actionDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.cardDark,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
  },
  actionBtnText: {
    color: COLORS.textLight,
    fontSize: 13,
    fontWeight: '700',
  },
  outlineDangerBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.danger,
    backgroundColor: COLORS.dangerSoft,
  },
  outlineDangerText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '700',
  },
  badgeSuccess: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentSoft,
  },
  badgeSuccessText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  statLabel: { fontSize: 14, color: COLORS.textSecondary },
  statValue: { fontSize: 14, fontWeight: '700' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 4 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.cardDark,
    borderRadius: RADIUS.full,
    padding: 16,
    marginTop: SPACING.md,
  },
  logoutBtnText: { color: COLORS.textLight, fontSize: 16, fontWeight: '800' },
});
