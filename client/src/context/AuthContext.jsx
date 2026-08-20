import { createContext, useContext, useState, useCallback } from 'react';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

/**
 * Wraps the app and holds the authenticated user's state. Session
 * persistence is deliberately simple (localStorage) since there's no
 * backend in scope here — swap this for httpOnly cookies once the real
 * API is wired up, without touching any component that calls useAuth().
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const persistSession = (userData, session) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (session?.access_token) {
      localStorage.setItem('accessToken', session.access_token);
    }
  };

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    persistSession(data.user, data.session);
    return data;
  }, []);

  const registerUser = useCallback(async (payload) => {
    const data = await authApi.register(payload);
    // Session may be null here if email confirmation is required first.
    if (data.session) {
      persistSession(data.user, data.session);
    }
    return data;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, registerUser, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}