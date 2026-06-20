// src/services/AuthService.js
// Handles user auth: register, login, session management
// Passwords stored as hashed strings (SHA-256 equivalent via simple hash)
// Designed to be replaced with JWT + Node.js backend later

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USERS: '@copilot_users',           // { username: { passwordHash, createdAt } }
  CURRENT_USER: '@copilot_current_user', // { username, loggedInAt }
};

/**
 * Simple deterministic hash for password storage.
 * NOT cryptographic — replace with bcrypt on Node.js backend.
 */
const hashPassword = (password) => {
  let hash = 0;
  const str = password + 'finova_salt_2024'; // salted
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36) + str.length.toString(36);
};

export const AuthService = {

  /**
   * Register a new user
   * Returns { success, error }
   */
  async register(username, password) {
    try {
      const trimmedUsername = username.trim().toLowerCase();

      // Validation
      if (trimmedUsername.length < 3) {
        return { success: false, error: 'Username must be at least 3 characters' };
      }
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }
      if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
        return { success: false, error: 'Username can only contain letters, numbers, and underscores' };
      }

      // Check if username already exists
      const raw = await AsyncStorage.getItem(KEYS.USERS);
      const users = raw ? JSON.parse(raw) : {};

      if (users[trimmedUsername]) {
        return { success: false, error: 'Username already taken. Please choose another.' };
      }

      // Store new user
      users[trimmedUsername] = {
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));

      // Auto-login after register
      await AuthService.setSession(trimmedUsername);

      return { success: true, username: trimmedUsername };
    } catch (e) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  },

  /**
   * Login existing user
   * Returns { success, error }
   */
  async login(username, password) {
    try {
      const trimmedUsername = username.trim().toLowerCase();

      const raw = await AsyncStorage.getItem(KEYS.USERS);
      const users = raw ? JSON.parse(raw) : {};

      if (!users[trimmedUsername]) {
        return { success: false, error: 'No account found with this username.' };
      }

      const storedHash = users[trimmedUsername].passwordHash;
      const inputHash = hashPassword(password);

      if (storedHash !== inputHash) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      await AuthService.setSession(trimmedUsername);
      return { success: true, username: trimmedUsername };
    } catch (e) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  },

  /**
   * Set active session
   */
  async setSession(username) {
    await AsyncStorage.setItem(
      KEYS.CURRENT_USER,
      JSON.stringify({ username, loggedInAt: new Date().toISOString() })
    );
  },

  /**
   * Get current logged-in user
   */
  async getCurrentUser() {
    const raw = await AsyncStorage.getItem(KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  },

  /**
   * Logout - clear session only (keep user data)
   */
  async logout() {
    await AsyncStorage.removeItem(KEYS.CURRENT_USER);
  },

  /**
   * Check if any users are registered
   */
  async hasUsers() {
    const raw = await AsyncStorage.getItem(KEYS.USERS);
    const users = raw ? JSON.parse(raw) : {};
    return Object.keys(users).length > 0;
  },
};

// ─── Backend upgrade path ─────────────────────────────────────────────────────
// When ready to connect to Node.js + JWT backend, replace each method with:
//
// async login(username, password) {
//   const res = await fetch(`${API_BASE}/auth/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ username, password })
//   });
//   const data = await res.json();
//   if (data.token) {
//     await AsyncStorage.setItem('@copilot_token', data.token);
//     return { success: true, username: data.username };
//   }
//   return { success: false, error: data.error };
// }
