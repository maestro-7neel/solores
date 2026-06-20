// src/screens/AccountScreen.js - User profile and account section
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../context/AppContext';
import { AuthService } from '../services/AuthService';
import { COLORS, SPACING, RADIUS, STATUS_BAR_HEIGHT } from '../utils/theme';
import { formatCurrency } from '../utils/financialUtils';

export default function AccountScreen({ navigation }) {
  const { profile, monthExpenses, totalSpent, logout } = useApp();
  const [sessionUser, setSessionUser] = useState('');
  const [createdDate, setCreatedDate] = useState(null);

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
    } catch (e) {
      console.error('Failed to load account info:', e);
    }
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
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
