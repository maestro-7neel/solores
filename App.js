// App.js - Root entry point for Solores
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Context
import { AppProvider, useApp } from './src/context/AppContext';

// Screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ExpenseTrackerScreen from './src/screens/ExpenseTrackerScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import AICopilotScreen from './src/screens/AICopilotScreen';
import HealthScoreScreen from './src/screens/HealthScoreScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';

// Utils
import { COLORS } from './src/utils/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom tab navigator for main app
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: '#09101A',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Dashboard: focused ? 'home' : 'home-outline',
            Tracker: focused ? 'wallet' : 'wallet-outline',
            Calendar: focused ? 'calendar' : 'calendar-outline',
            solores: focused ? 'sparkles' : 'sparkles-outline',
            Health: focused ? 'heart' : 'heart-outline',
          };
          return <Ionicons name={icons[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Tracker" component={ExpenseTrackerScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="solores" component={AICopilotScreen} />
      <Tab.Screen name="Health" component={HealthScoreScreen} />
    </Tab.Navigator>
  );
}

// Root navigator that responds to profile changes
function RootNavigator() {
  const { profile, isLoading, isLoggedIn, reload } = useApp();

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen
            name="Login"
            component={(props) => (
              <LoginScreen
                {...props}
                onLoginSuccess={reload}
              />
            )}
          />
        ) : null}
        {!profile ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : null}
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="AddExpense"
          component={AddExpenseScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
