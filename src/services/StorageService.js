// src/services/StorageService.js - Local persistence layer
// Designed to be swappable with a Node.js backend later

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_PROFILE: '@copilot_user_profile',
  EXPENSES: '@copilot_expenses',
  APP_MODE: '@copilot_app_mode',
  LOGIN_CREDENTIALS: '@copilot_login_creds',
  BROWSER_VISITED: '@copilot_browser_visited',
  SAVED_BROWSER_CREDS: '@copilot_saved_browser_creds',
  TUTORIAL_COMPLETED: '@copilot_tutorial_completed',
};

export const StorageService = {
  // --- User Profile ---
  async getUserProfile() {
    const raw = await AsyncStorage.getItem(KEYS.USER_PROFILE);
    return raw ? JSON.parse(raw) : null;
  },

  async saveUserProfile(profile) {
    await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  async clearUserProfile() {
    await AsyncStorage.removeItem(KEYS.USER_PROFILE);
  },

  // --- Expenses ---
  async getExpenses() {
    const raw = await AsyncStorage.getItem(KEYS.EXPENSES);
    return raw ? JSON.parse(raw) : [];
  },

  async addExpense(expense) {
    const existing = await StorageService.getExpenses();
    const updated = [
      { ...expense, id: Date.now().toString(), date: expense.date || new Date().toISOString() },
      ...existing,
    ];
    await AsyncStorage.setItem(KEYS.EXPENSES, JSON.stringify(updated));
    return updated;
  },

  async deleteExpense(id) {
    const existing = await StorageService.getExpenses();
    const updated = existing.filter(e => e.id !== id);
    await AsyncStorage.setItem(KEYS.EXPENSES, JSON.stringify(updated));
    return updated;
  },

  async clearExpenses() {
    await AsyncStorage.removeItem(KEYS.EXPENSES);
  },

  // --- App Mode ---
  async getAppMode() {
    const mode = await AsyncStorage.getItem(KEYS.APP_MODE);
    return mode || 'simple'; // 'simple' | 'ai'
  },

  async setAppMode(mode) {
    await AsyncStorage.setItem(KEYS.APP_MODE, mode);
  },

  // --- Login Credentials ---
  async saveLoginCredentials(loginId, password) {
    const credentials = { loginId, password, createdAt: new Date().toISOString() };
    await AsyncStorage.setItem(KEYS.LOGIN_CREDENTIALS, JSON.stringify(credentials));
  },

  async getLoginCredentials() {
    const raw = await AsyncStorage.getItem(KEYS.LOGIN_CREDENTIALS);
    return raw ? JSON.parse(raw) : null;
  },

  async validateLogin(loginId, password) {
    const credentials = await StorageService.getLoginCredentials();
    if (!credentials) return false;
    return credentials.loginId === loginId && credentials.password === password;
  },

  async clearLoginCredentials() {
    await AsyncStorage.removeItem(KEYS.LOGIN_CREDENTIALS);
  },

  // --- Browser First Time Detection ---
  async isFirstTimeBrowser() {
    const visited = await AsyncStorage.getItem(KEYS.BROWSER_VISITED);
    return !visited;
  },

  async markBrowserVisited() {
    await AsyncStorage.setItem(KEYS.BROWSER_VISITED, 'true');
  },

  // --- Saved Browser Credentials (Remember Me) ---
  async saveBrowserCredentials(username, password) {
    const creds = { username, password, savedAt: new Date().toISOString() };
    await AsyncStorage.setItem(KEYS.SAVED_BROWSER_CREDS, JSON.stringify(creds));
  },

  async getSavedBrowserCredentials() {
    const raw = await AsyncStorage.getItem(KEYS.SAVED_BROWSER_CREDS);
    return raw ? JSON.parse(raw) : null;
  },

  async clearSavedBrowserCredentials() {
    await AsyncStorage.removeItem(KEYS.SAVED_BROWSER_CREDS);
  },

  // --- Tutorial State ---
  async hasCompletedTutorial() {
    const done = await AsyncStorage.getItem(KEYS.TUTORIAL_COMPLETED);
    return done === 'true';
  },

  async setTutorialCompleted(completed = true) {
    if (completed) {
      await AsyncStorage.setItem(KEYS.TUTORIAL_COMPLETED, 'true');
    } else {
      await AsyncStorage.removeItem(KEYS.TUTORIAL_COMPLETED);
    }
  },
};

// NOTE: To connect to Node.js backend later, replace the AsyncStorage calls
// in each method with fetch() calls to your API endpoints, e.g.:
//   async getUserProfile() {
//     const res = await fetch(`${API_BASE}/profile`, { headers: authHeaders });
//     return res.json();
//   }
