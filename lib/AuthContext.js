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

// Pure read used as useState's lazy initializer — runs the localStorage
// parse once, at mount, without a setState-in-effect cascade. SSR has no
// window, so it falls back to null there and the effect below reconciles
// the cookie/corrupted-storage side effects on the client.
function readStoredUser() {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    if (stored && token) return JSON.parse(stored);
  } catch {
    // Corrupted localStorage — treat as logged out; the effect below clears it.
  }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');

    if (!stored || !token) {
      // No cached session at all — nothing to validate.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    try {
      JSON.parse(stored);
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      clearAuthCookie();
      setLoading(false);
      return;
    }

    // Re-sync the cookie: a session restored from localStorage must still be
    // visible to the proxy, or protected routes would bounce a legitimately
    // signed-in user back to /login.
    setAuthCookie(token);

    // The cache above (already reflected via the lazy useState initializer)
    // can go stale in ways a locally-stored token can't self-detect: the
    // account gets deleted, or the token gets invalidated server-side. A
    // valid-looking JWT plus a cached user object isn't proof the account
    // still exists — confirm against the backend instead of trusting
    // localStorage until the token's own 7-day expiry. These setUser calls
    // run inside the fetch's own callbacks, reacting to that external
    // result, not synchronously in the effect body.
    fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(({ user: fresh }) => {
        localStorage.setItem('user', JSON.stringify(fresh));
        setUser(fresh);
      })
      .catch(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        clearAuthCookie();
        disconnectSocket();
        setUser(null);
      })
      .finally(() => setLoading(false));
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

  // Merges fresh fields (e.g. after PATCH /auth/me) into the cached user —
  // without this, the header's initials/name would still show the stale
  // value from login until the next full sign-in.
  const updateUser = (fields) => {
    setUser((prev) => {
      const next = { ...prev, ...fields };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}