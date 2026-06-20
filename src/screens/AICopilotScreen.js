// src/screens/AICopilotScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS } from '../utils/theme';
import { queryAI } from '../services/AIService';
import {
  formatCurrency,
  calcAvailableBudget,
  calcSafeDailyLimit,
  getRemainingDaysInMonth,
} from '../utils/financialUtils';

const QUICK_QUESTIONS = [
  'Can I eat out today?',
  'Should I buy a new course?',
  'Can I afford a movie tonight?',
  'How should I budget this week?',
];

const decisionConfig = {
  approve: { color: COLORS.success, bg: COLORS.successSoft, icon: '✅', label: 'Approved' },
  caution: { color: COLORS.warning, bg: COLORS.warningSoft, icon: '⚠️', label: 'Caution' },
  reject: { color: COLORS.danger, bg: COLORS.dangerSoft, icon: '🚫', label: 'Not Recommended' },
};

export default function AICopilotScreen() {
  const { profile, totalSpent, appMode } = useApp();
  const [spendingAmount, setSpendingAmount] = useState('');
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const remainingDays = getRemainingDaysInMonth();
  const remainingBudget = useMemo(
    () => calcAvailableBudget(profile || {}, totalSpent),
    [profile, totalSpent],
  );
  const dailyLimit = useMemo(
    () => calcSafeDailyLimit(remainingBudget, remainingDays),
    [remainingBudget, remainingDays],
  );

  const handleAsk = async (quickQ = null) => {
    if (loading) return;

    const q = quickQ || question || `Can I spend ₹${spendingAmount || 0}?`;
    setLoading(true);
    setAiResponse(null);

    try {
      const result = await queryAI({
        userType: profile?.userType || 'other',
        monthlyIncome: profile?.monthlyIncome || 0,
        fixedExpenses: profile?.fixedExpenses || 0,
        savingsGoal: profile?.savingsGoal || 0,
        remainingDays,
        remainingBudget,
        totalSpent,
        spendingRequest: parseFloat(spendingAmount) || 0,
        question: q,
      });

      if (result?.success) {
        setAiResponse(result.data);
        setHistory(prev => [
          { question: q, response: result.data, time: new Date() },
          ...prev.slice(0, 4),
        ]);
      }
    } catch (error) {
      console.error('AI query failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (appMode === 'simple') {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: SPACING.xl }]}> 
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🤖</Text>
        <Text style={styles.lockedTitle}>AI Mode Required</Text>
        <Text style={styles.lockedSub}>Switch to AI Mode from Dashboard to access your Financial Copilot</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <Text style={styles.brand}>solores</Text>
          <Text style={styles.brandSub}>AI finance copilot</Text>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>71 LEVEL</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={90}
      >
        <ScrollView style={styles.wrapper} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={styles.heroShell}>
            <LinearGradient
              colors={['#FEDAD7', '#FADEDC']}
              style={styles.mobileCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>solores</Text>
                </View>
                <View style={[styles.cardIconWrap, { backgroundColor: COLORS.cardDark }]}>
                  <Ionicons name="sparkles" size={22} color={COLORS.accent} />
                </View>
              </View>

              <View style={styles.cardMain}>
                <Text style={styles.cardLabel}>Remaining</Text>
                <Text style={styles.cardAmount}>{formatCurrency(remainingBudget)}</Text>
                <Text style={styles.cardSub}>Safe guidance for today</Text>
              </View>

              <View style={styles.cardMetricsRow}>
                <View style={styles.metricPill}>
                  <Text style={styles.pillLabel}>Daily</Text>
                  <Text style={styles.pillValue}>{formatCurrency(dailyLimit)}</Text>
                </View>
                <View style={styles.metricPill}>
                  <Text style={styles.pillLabel}>Days</Text>
                  <Text style={styles.pillValue}>{remainingDays}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.content}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Quick Actions</Text>
              {QUICK_QUESTIONS.map((q, index) => (
                <TouchableOpacity
                  key={q}
                  style={[styles.listItem, index === 0 && styles.firstListItem]}
                  onPress={() => {
                    setQuestion(q);
                    handleAsk(q);
                  }}
                >
                  <Text style={styles.listItemText}>{q}</Text>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.accent} />
                </TouchableOpacity>
              ))}
            </View>

            <View style={[styles.card, styles.askCard]}>
              <Text style={styles.cardTitle}>💬 Ask Your Copilot</Text>
              <View style={styles.amountRow}>
                <Text style={styles.rupee}>₹</Text>
                <TextInput
                  style={styles.amountInput}
                  value={spendingAmount}
                  onChangeText={setSpendingAmount}
                  placeholder="Amount"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                />
              </View>
              <TextInput
                style={styles.questionInput}
                value={question}
                onChangeText={setQuestion}
                placeholder="Ask anything about your finances..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                maxLength={200}
              />
              <TouchableOpacity
                style={[styles.askBtn, loading && { opacity: 0.7 }]}
                onPress={() => handleAsk()}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Ionicons name="sparkles" size={18} color={COLORS.accent} />
                    <Text style={styles.askBtnText}>Get AI Advice</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {aiResponse && (
              <View style={[styles.responseCard, { borderColor: (decisionConfig[aiResponse.decision] || decisionConfig.caution).color + '44' }]}> 
                <View style={styles.responseHeader}>
                  <Text style={styles.decisionIcon}>{(decisionConfig[aiResponse.decision] || decisionConfig.caution).icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.decisionLabel, { color: (decisionConfig[aiResponse.decision] || decisionConfig.caution).color }]}> 
                      {(decisionConfig[aiResponse.decision] || decisionConfig.caution).label}
                    </Text>
                    <Text style={styles.explanation}>{aiResponse.explanation}</Text>
                  </View>
                </View>
                <View style={styles.responseBody}>
                  <ResponseSection icon="💡" title="Strategy" text={aiResponse.strategy} />
                  <ResponseSection icon="📋" title="Adjustment Plan" text={aiResponse.adjustment_plan} />
                  {aiResponse.health_tip && (
                    <ResponseSection icon="🧠" title="Behavioral Insight" text={aiResponse.health_tip} />
                  )}
                </View>
              </View>
            )}

            {history.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Recent Queries</Text>
                {history.map((item, index) => {
                  const config = decisionConfig[item.response.decision] || decisionConfig.caution;
                  return (
                    <View key={index} style={styles.histRow}>
                      <Text style={styles.histIcon}>{config.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.histQ}>{item.question}</Text>
                        <Text style={[styles.histD, { color: config.color }]}>{config.label}</Text>
                      </View>
                      <Text style={styles.histTime}>
                        {item.time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function ResponseSection({ icon, title, text }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{icon} {title}</Text>
      <Text style={styles.sectionText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  wrapper: { flex: 1 },
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
  headerCenter: {
    alignItems: 'center',
  },
  brand: { color: COLORS.text, fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
  brandSub: { color: COLORS.textSecondary, fontSize: 10, marginTop: 1 },
  levelBadge: {
    position: 'absolute',
    right: SPACING.lg,
    top: 50,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
  },
  levelText: { color: COLORS.accent, fontSize: 12, fontWeight: '700' },
  heroShell: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.xs },
  content: {
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceElevated,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    flex: 1,
    minHeight: 650,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  askCard: { paddingBottom: SPACING.lg },
  cardTitle: { color: COLORS.text, fontWeight: '700', fontSize: 15, marginBottom: SPACING.md },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    marginBottom: SPACING.sm,
  },
  rupee: { color: COLORS.text, fontSize: 22, fontWeight: '700', marginRight: 6 },
  amountInput: { flex: 1, color: COLORS.text, fontSize: 20, paddingVertical: 12, fontWeight: '700' },
  questionInput: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    color: COLORS.text,
    fontSize: 14,
    minHeight: 80,
    marginBottom: SPACING.sm,
    textAlignVertical: 'top',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  firstListItem: { marginTop: 0 },
  listItemText: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
  askBtn: {
    backgroundColor: COLORS.cardDark,
    borderRadius: RADIUS.full,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  mobileCard: {
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#1E1214',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardBadge: { backgroundColor: COLORS.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border },
  cardBadgeText: { color: COLORS.accent, fontWeight: '900', fontSize: 12, letterSpacing: 0.6 },
  cardIconWrap: { padding: 8, borderRadius: 14, shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 10 },
  cardMain: { alignItems: 'flex-start', marginTop: SPACING.md },
  cardLabel: { color: COLORS.textSecondary, fontSize: 11, textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.6 },
  cardAmount: { color: COLORS.text, fontSize: 44, fontWeight: '900' },
  cardSub: { color: COLORS.textSecondary, fontSize: 13, marginTop: 8, opacity: 0.9 },
  cardMetricsRow: { flexDirection: 'row', marginTop: SPACING.md, gap: SPACING.sm },
  metricPill: { backgroundColor: COLORS.surface, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 14, marginRight: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  pillLabel: { color: COLORS.textSecondary, fontSize: 10, textTransform: 'uppercase' },
  pillValue: { color: COLORS.text, fontSize: 14, fontWeight: '900' },
  heroShellSpacer: { height: SPACING.sm },
  askBtnText: { color: COLORS.textLight, fontWeight: '800', fontSize: 15 },
  responseCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    overflow: 'hidden',
  },
  responseHeader: {
    flexDirection: 'row',
    gap: 12,
    padding: SPACING.md,
    alignItems: 'flex-start',
    backgroundColor: COLORS.cardDark,
  },
  decisionIcon: { fontSize: 28 },
  decisionLabel: { fontWeight: '800', fontSize: 16, marginBottom: 4 },
  explanation: { color: COLORS.textSecondaryLight, fontSize: 13, lineHeight: 20 },
  responseBody: { padding: SPACING.md },
  section: { marginBottom: SPACING.md },
  sectionTitle: { color: COLORS.textSecondaryLight, fontSize: 12, fontWeight: '700', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionText: { color: COLORS.textLight, fontSize: 13, lineHeight: 20 },
  histRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  histIcon: { fontSize: 16 },
  histQ: { color: COLORS.text, fontSize: 13 },
  histD: { fontSize: 11, fontWeight: '600', marginTop: 2, color: COLORS.textSecondary },
  histTime: { color: COLORS.textMuted, fontSize: 11 },
  lockedTitle: { color: COLORS.text, fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  lockedSub: { color: COLORS.textSecondary, fontSize: 14, textAlign: 'center' },
});
