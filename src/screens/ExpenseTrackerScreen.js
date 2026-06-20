// src/screens/ExpenseTrackerScreen.js - Mode 1: Simple Expense Tracker
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PieChart } from 'react-native-chart-kit';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, CATEGORIES } from '../utils/theme';
import { formatCurrency, groupByCategory } from '../utils/financialUtils';

const { width } = Dimensions.get('window');

export default function ExpenseTrackerScreen({ navigation }) {
  const { monthExpenses, totalSpent, deleteExpense } = useApp();
  const [filter, setFilter] = useState('all');

  // Category breakdown for pie chart
  const byCategory = useMemo(() => groupByCategory(monthExpenses), [monthExpenses]);

  const pieData = useMemo(() => {
    return CATEGORIES
      .filter(cat => byCategory[cat.id] > 0)
      .map(cat => ({
        name: cat.label.split(' ')[0],
        amount: byCategory[cat.id],
        color: cat.color,
        legendFontColor: COLORS.textSecondary,
        legendFontSize: 12,
      }));
  }, [byCategory]);

  // Filtered expenses
  const filtered = filter === 'all' ? monthExpenses : monthExpenses.filter(e => e.category === filter);

  const handleDelete = (id) => {
    Alert.alert('Delete Expense', 'Remove this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteExpense(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expense Tracker</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddExpense')}
        >
          <Ionicons name="add" size={20} color={COLORS.textLight} />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Total Card */}
          <LinearGradient
            colors={['#FEDAD7', '#FADEDC']}
            style={styles.totalCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.totalLabel}>Total Spent This Month</Text>
            <Text style={styles.totalAmount}>{formatCurrency(totalSpent)}</Text>
            <Text style={styles.totalSub}>{monthExpenses.length} transactions</Text>
          </LinearGradient>

          {/* Pie Chart */}
          {pieData.length > 0 ? (
            <View style={styles.chartCard}>
              <Text style={styles.sectionTitle}>Spending Breakdown</Text>
              <PieChart
                data={pieData}
                width={width - 32}
                height={180}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  backgroundColor: 'transparent',
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute={false}
              />
            </View>
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyText}>Add expenses to see breakdown</Text>
            </View>
          )}

          {/* Category Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
            </TouchableOpacity>
            {CATEGORIES.filter(c => byCategory[c.id] > 0).map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.filterChip, filter === cat.id && { borderColor: cat.color, backgroundColor: cat.color + '22' }]}
                onPress={() => setFilter(cat.id)}
              >
                <Text style={{ fontSize: 12 }}>{cat.icon}</Text>
                <Text style={[styles.filterText, filter === cat.id && { color: cat.color }]}>
                  {cat.label.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Category Summary */}
          <View style={styles.catSummary}>
            {CATEGORIES.filter(c => byCategory[c.id] > 0).map(cat => (
              <View key={cat.id} style={styles.catRow}>
                <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                <Text style={styles.catName}>{cat.label}</Text>
                <View style={styles.catBar}>
                  <View style={[styles.catBarFill, {
                    width: `${(byCategory[cat.id] / totalSpent) * 100}%`,
                    backgroundColor: cat.color,
                  }]} />
                </View>
                <Text style={[styles.catAmt, { color: cat.color }]}>
                  {formatCurrency(byCategory[cat.id], true)}
                </Text>
              </View>
            ))}
          </View>

          {/* Transactions List */}
          <Text style={styles.sectionTitle}>Transactions</Text>
          {filtered.length === 0 ? (
            <View style={styles.emptyTx}>
              <Text style={styles.emptyText}>No expenses in this category</Text>
            </View>
          ) : (
            filtered.map(exp => {
              const cat = CATEGORIES.find(c => c.id === exp.category) || CATEGORIES[7];
              return (
                <View key={exp.id} style={styles.txRow}>
                  <View style={[styles.txIcon, { backgroundColor: cat.color + '22' }]}>
                    <Text style={{ fontSize: 18 }}>{cat.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.txNote}>{exp.note || cat.label}</Text>
                    <Text style={styles.txMeta}>
                      {cat.label} · {new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </Text>
                  </View>
                  <Text style={styles.txAmount}>-{formatCurrency(exp.amount)}</Text>
                  <TouchableOpacity onPress={() => handleDelete(exp.id)} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={16} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>
              );
            })
          )}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 56,
    paddingBottom: SPACING.md,
    backgroundColor: '#FDF2F0', // slight pink
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
  },
  headerTitle: { color: COLORS.text, fontSize: 18, fontWeight: '800' },
  addBtn: {
    position: 'absolute',
    right: SPACING.lg,
    top: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.cardDark,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addBtnText: { color: COLORS.textLight, fontWeight: '700', fontSize: 14 },
  content: {
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surfaceElevated,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    flex: 1,
    minHeight: 600,
  },
  totalCard: {
    margin: SPACING.md,
    borderRadius: RADIUS.lg, padding: SPACING.lg,
    borderWidth: 1, borderColor: COLORS.border, alignItems: 'center',
  },
  totalLabel: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 6 },
  totalAmount: { color: COLORS.text, fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  totalSub: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
  chartCard: {
    marginHorizontal: SPACING.md, backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginHorizontal: SPACING.md, marginTop: SPACING.md, marginBottom: SPACING.sm },
  emptyChart: { alignItems: 'center', paddingVertical: SPACING.xl },
  emptyIcon: { fontSize: 36, marginBottom: 8 },
  emptyText: { color: COLORS.textSecondary, fontSize: 14 },
  filterRow: { paddingHorizontal: SPACING.md, marginVertical: SPACING.sm },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: COLORS.border, marginRight: 8,
  },
  filterChipActive: { borderColor: COLORS.accent, backgroundColor: COLORS.accentSoft },
  filterText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: COLORS.text },
  catSummary: {
    marginHorizontal: SPACING.md, marginBottom: SPACING.md,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  catDot: { width: 8, height: 8, borderRadius: 4 },
  catName: { color: COLORS.textSecondary, fontSize: 12, width: 80 },
  catBar: { flex: 1, height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },
  catBarFill: { height: 4, borderRadius: 2 },
  catAmt: { fontSize: 12, fontWeight: '700', width: 50, textAlign: 'right' },
  txRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginHorizontal: SPACING.md, paddingVertical: 12,
    borderBottomWidth: 1, borderColor: COLORS.border,
  },
  txIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  txNote: { color: COLORS.text, fontWeight: '600', fontSize: 14 },
  txMeta: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  txAmount: { color: COLORS.danger, fontWeight: '700', fontSize: 14 },
  deleteBtn: { padding: 4 },
  emptyTx: { alignItems: 'center', padding: SPACING.xl },
});
