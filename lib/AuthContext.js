'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { disconnectSocket } from './socket';

const AuthContext = createContext(null);
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

/**
 * The JWT is mirrored into a cookie purely so `proxy.js` can gate routes on the
 * server — localStorage is invisible to it. This cookie is a routing hint, NOT
 * an authorization boundary: every API call still carries the Bearer token and
 * the backend verifies it independently.
 */
export const AUTH_COOKIE = 'jm_auth';

function setAuthCookie(token) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${AUTH_COOKIE}=${token}; Path=/; Max-Age=604800; SameSite=Lax${secure}`;
}

function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
        // Re-sync the cookie: a session restored from localStorage must still
        // be visible to the proxy, or protected routes would bounce a
        // legitimately signed-in user back to /login.
        setAuthCookie(token);
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        clearAuthCookie();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setAuthCookie(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async ({ email, password, fullName, preferredCountry }) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName, preferredCountry }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
  
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setAuthCookie(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    clearAuthCookie();
    disconnectSocket();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}