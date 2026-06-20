// src/screens/CalendarScreen.js - Calendar view with color-coded daily spending
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, CATEGORIES, STATUS_BAR_HEIGHT } from '../utils/theme';
import {
  formatCurrency, groupByDate, getDayStatus,
} from '../utils/financialUtils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const STATUS_COLORS = {
  none: COLORS.border,
  safe: COLORS.calGreen,
  moderate: COLORS.calYellow,
  over: COLORS.calRed,
};

const getDaysInSelectedMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export default function CalendarScreen() {
  const { profile, expenses } = useApp();
  const now = new Date();

  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedDay, setSelectedDay] = useState(now.getDate());

  const totalDays = useMemo(() => getDaysInSelectedMonth(selectedYear, selectedMonth), [selectedYear, selectedMonth]);
  const firstDayOfMonth = useMemo(() => new Date(selectedYear, selectedMonth, 1).getDay(), [selectedYear, selectedMonth]);

  // Filter expenses for selected month
  const selectedMonthExpenses = useMemo(() => {
    return (expenses || []).filter(exp => {
      const d = new Date(exp.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });
  }, [expenses, selectedMonth, selectedYear]);

  // Group expenses by date
  const byDate = useMemo(() => groupByDate(selectedMonthExpenses), [selectedMonthExpenses]);

  // Calculate daily limit
  const disposable = profile ? profile.monthlyIncome - profile.fixedExpenses - profile.savingsGoal : 0;
  const dailyLimit = disposable / totalDays;

  // Day amount spent
  const getDaySpent = (day) => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const exps = byDate[dateStr] || [];
    return exps.reduce((s, e) => s + e.amount, 0);
  };

  // Selected day expenses
  const selectedDateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  const selectedExpenses = byDate[selectedDateStr] || [];
  const selectedSpent = selectedExpenses.reduce((s, e) => s + e.amount, 0);
  const selectedStatus = getDayStatus(selectedSpent, dailyLimit);

  // Calendar grid cells
  const cells = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(y => y - 1);
    } else {
      setSelectedMonth(m => m - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(y => y + 1);
    } else {
      setSelectedMonth(m => m + 1);
    }
    setSelectedDay(1);
  };

  const monthTotalSpent = useMemo(() => {
    return selectedMonthExpenses.reduce((s, e) => s + e.amount, 0);
  }, [selectedMonthExpenses]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="chevron-back" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.monthLabel}>
            {new Date(selectedYear, selectedMonth).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="chevron-forward" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Month Summary Card */}
          <LinearGradient
            colors={['#FEDAD7', '#FADEDC']}
            style={styles.monthSummaryCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.summaryLabel}>Month's spent</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summarySpent}>{formatCurrency(monthTotalSpent)}</Text>
              <Text style={styles.summaryBudget}>/ {formatCurrency(disposable)} budget</Text>
            </View>
          </LinearGradient>

          {/* Legend */}
          <View style={styles.legend}>
            {[
              { color: COLORS.calGreen, label: 'Within limit' },
              { color: COLORS.calYellow, label: 'Moderate' },
              { color: COLORS.calRed, label: 'Overspent' },
            ].map(l => (
              <View key={l.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: l.color }]} />
                <Text style={styles.legendText}>{l.label}</Text>
              </View>
            ))}
          </View>

          {/* Day names */}
          <View style={styles.dayNames}>
            {DAYS.map(d => (
              <Text key={d} style={styles.dayName}>{d}</Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.grid}>
            {cells.map((day, idx) => {
              if (!day) return <View key={`empty-${idx}`} style={styles.emptyCell} />;
              const spent = getDaySpent(day);
              const status = getDayStatus(spent, dailyLimit);
              const isToday = selectedYear === now.getFullYear() && selectedMonth === now.getMonth() && day === now.getDate();
              const isFuture = selectedYear > now.getFullYear() || 
                               (selectedYear === now.getFullYear() && selectedMonth > now.getMonth()) ||
                               (selectedYear === now.getFullYear() && selectedMonth === now.getMonth() && day > now.getDate());
              const isSelected = day === selectedDay;

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                  ]}
                  onPress={() => setSelectedDay(day)}
                >
                  <View style={[
                    styles.dayNum,
                    isToday && styles.dayNumToday,
                    !isFuture && spent > 0 && { backgroundColor: STATUS_COLORS[status] + '33' },
                  ]}>
                    <Text style={[
                      styles.dayText,
                      isToday && styles.dayTextToday,
                      isFuture && { color: COLORS.textMuted },
                    ]}>
                      {day}
                    </Text>
                  </View>
                  {!isFuture && spent > 0 && (
                    <Text style={[styles.dayAmt, { color: STATUS_COLORS[status] }]}>
                      {formatCurrency(spent, true)}
                    </Text>
                  )}
                  {!isFuture && spent > 0 && (
                    <View style={[styles.statusBar, { backgroundColor: STATUS_COLORS[status] }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selected Day Detail */}
          <View style={styles.dayDetail}>
            <View style={styles.dayDetailHeader}>
              <Text style={styles.dayDetailTitle}>
                {new Date(selectedYear, selectedMonth, selectedDay).toLocaleDateString('en-IN', {
                  weekday: 'long', day: 'numeric', month: 'short'
                })}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[selectedStatus] + '22' }]}>
                <Text style={[styles.statusText, { color: STATUS_COLORS[selectedStatus] }]}>
                  {selectedStatus === 'none' ? 'No Spending' :
                   selectedStatus === 'safe' ? '✅ Within Limit' :
                   selectedStatus === 'moderate' ? '⚠️ Moderate' : '🔴 Overspent'}
                </Text>
              </View>
            </View>

            <View style={styles.dayStats}>
              <View style={styles.dayStat}>
                <Text style={styles.dayStatValue}>{formatCurrency(selectedSpent)}</Text>
                <Text style={styles.dayStatLabel}>Spent</Text>
              </View>
              <View style={styles.dayStat}>
                <Text style={[styles.dayStatValue, { color: COLORS.accent }]}>
                  {formatCurrency(dailyLimit)}
                </Text>
                <Text style={styles.dayStatLabel}>Daily Limit</Text>
              </View>
              <View style={styles.dayStat}>
                <Text style={[styles.dayStatValue, {
                  color: dailyLimit - selectedSpent >= 0 ? COLORS.success : COLORS.danger
                }]}>
                  {formatCurrency(Math.abs(dailyLimit - selectedSpent))}
                </Text>
                <Text style={styles.dayStatLabel}>
                  {dailyLimit - selectedSpent >= 0 ? 'Remaining' : 'Over by'}
                </Text>
              </View>
            </View>

            {/* Transactions for selected day */}
            {selectedExpenses.length > 0 && (
              <View>
                <Text style={styles.txHeader}>Transactions</Text>
                {selectedExpenses.map(exp => {
                  const cat = CATEGORIES.find(c => c.id === exp.category) || CATEGORIES[7];
                  return (
                    <View key={exp.id} style={styles.txRow}>
                      <Text style={styles.txIcon}>{cat.icon}</Text>
                      <Text style={styles.txNote}>{exp.note || cat.label}</Text>
                      <Text style={styles.txAmt}>-{formatCurrency(exp.amount)}</Text>
                    </View>
                  );
                })}
              </View>
            )}

            {selectedExpenses.length === 0 && (
              <Text style={styles.noTx}>No transactions on this day</Text>
            )}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: STATUS_BAR_HEIGHT + 8,
    paddingBottom: SPACING.md,
    backgroundColor: '#FDF2F0', // slight pink
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: { color: COLORS.text, fontSize: 18, fontWeight: '800' },
  monthNav: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 6 },
  navBtn: { padding: 4 },
  monthLabel: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  content: {
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surfaceElevated,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    flex: 1,
    minHeight: 600,
  },
  monthSummaryCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryLabel: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4, gap: 4 },
  summarySpent: { color: COLORS.text, fontSize: 24, fontWeight: '800' },
  summaryBudget: { color: COLORS.textSecondary, fontSize: 13 },
  legend: { flexDirection: 'row', gap: SPACING.md, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: COLORS.textSecondary, fontSize: 11 },
  dayNames: { flexDirection: 'row', paddingHorizontal: SPACING.md, marginBottom: 4 },
  dayName: { flex: 1, textAlign: 'center', color: COLORS.textMuted, fontSize: 11, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.md },
  emptyCell: { width: '14.28%', height: 56 },
  dayCell: { width: '14.28%', height: 70, alignItems: 'center', paddingTop: 4 },
  dayCellSelected: { backgroundColor: COLORS.accentSoft, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.accent },
  dayNum: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  dayNumToday: { backgroundColor: COLORS.accent },
  dayText: { color: COLORS.text, fontSize: 12, fontWeight: '600' },
  dayTextToday: { color: COLORS.background, fontWeight: '800' },
  dayAmt: { fontSize: 8, fontWeight: '700', marginTop: 1 },
  statusBar: { width: 20, height: 2, borderRadius: 1, marginTop: 2 },
  dayDetail: {
    marginHorizontal: SPACING.md, marginVertical: SPACING.sm, backgroundColor: COLORS.cardDark,
    borderRadius: RADIUS.lg, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.borderDark,
  },
  dayDetailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  dayDetailTitle: { color: COLORS.textLight, fontWeight: '700', fontSize: 15 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  statusText: { fontSize: 11, fontWeight: '700' },
  dayStats: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: SPACING.md },
  dayStat: { alignItems: 'center' },
  dayStatValue: { color: COLORS.textLight, fontSize: 18, fontWeight: '800' },
  dayStatLabel: { color: COLORS.textMutedLight, fontSize: 11, marginTop: 2 },
  txHeader: { color: COLORS.textSecondaryLight, fontSize: 12, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderTopWidth: 1, borderColor: COLORS.borderDark },
  txIcon: { fontSize: 16 },
  txNote: { flex: 1, color: COLORS.textLight, fontSize: 13 },
  txAmt: { color: COLORS.warning, fontWeight: '700', fontSize: 13 },
  noTx: { color: COLORS.textMutedLight, fontSize: 13, textAlign: 'center', paddingVertical: SPACING.md },
});
