// App.js - Updated with Auth flow
// Navigation order: Login/Register → Onboarding (first time) → MainTabs

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Context
import { AppProvider } from './src/context/AppContext';

// Auth Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

// App Screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ExpenseTrackerScreen from './src/screens/ExpenseTrackerScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import AICopilotScreen from './src/screens/AICopilotScreen';
import HealthScoreScreen from './src/screens/HealthScoreScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';

// Services
import { AuthService } from './src/services/AuthService';
import { COLORS } from './src/utils/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface, // Clean white tab bar background
          borderTopWidth: 0,
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          borderRadius: 32,
          height: 68,
          paddingBottom: Platform.OS === 'ios' ? 14 : 10,
          paddingTop: 10,
          shadowColor: '#1E1214',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 6,
        },
        tabBarActiveTintColor: COLORS.text, // Rich dark text
        tabBarInactiveTintColor: COLORS.textMuted, // Muted gray text
        tabBarActiveBackgroundColor: COLORS.accentSoft, // Soft coral-pink pill background
        tabBarItemStyle: {
          borderRadius: 24,
          marginHorizontal: 4,
          marginVertical: 4,
          paddingVertical: 2,
        },
        tabBarLabelStyle: { fontSize: 9, fontWeight: '800', marginTop: 2 },
        tabBarIcon: ({ focused, color }) => {
          const icons = {
            Dashboard: focused ? 'home' : 'home-outline',
            Tracker: focused ? 'wallet' : 'wallet-outline',
            Calendar: focused ? 'calendar' : 'calendar-outline',
            'solores': focused ? 'sparkles' : 'sparkles-outline',
            Health: focused ? 'heart' : 'heart-outline',
          };
          return <Ionicons name={icons[route.name]} size={20} color={color} />;
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

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        // Logged in — check if profile exists
        const { StorageService } = require('./src/services/StorageService');
        const profile = await StorageService.getUserProfile();
        setInitialRoute(profile ? 'MainTabs' : 'Onboarding');
      } else {
        setInitialRoute('Login');
      }
    } catch {
      setInitialRoute('Login');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false, animation: 'fade' }}
        >
          {/* Auth Stack */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />

          {/* App Stack */}
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen
            name="AddExpense"
            component={AddExpenseScreen}
            options={{ presentation: 'modal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
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
