'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-stack-md">
      {error && (
        <div className="bg-error-container text-on-error-container text-body-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-base">
        <label htmlFor="email" className="font-label-md text-label-md text-primary">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
          className="w-full px-4 py-3 bg-surface-bright border border-border-subtle rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-electric-blue outline-none transition-all placeholder:text-slate-gray"
        />
      </div>

      <div className="flex flex-col gap-base">
        <div className="flex justify-between items-center">
          <label htmlFor="password" className="font-label-md text-label-md text-primary">
            Password
          </label>
          <Link href="/forgot-password" className="text-electric-blue font-label-md text-label-md hover:underline">
            Forgot Password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-3 bg-surface-bright border border-border-subtle rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-electric-blue outline-none transition-all placeholder:text-slate-gray"
        />
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input
          id="remember"
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="w-4 h-4 rounded text-electric-blue focus:ring-electric-blue border-border-subtle"
        />
        <label htmlFor="remember" className="text-body-sm text-slate-gray">
          Keep me signed in for 30 days
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 bg-electric-blue text-on-primary py-4 rounded-lg font-button text-button shadow-lg shadow-electric-blue/20 hover:bg-secondary active:scale-95 transition-all disabled:opacity-60"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}