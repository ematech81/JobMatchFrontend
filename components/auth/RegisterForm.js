'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await register({ email, password, fullName });
      router.push('/onboarding');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-stack-md">
      {error && (
        <div className="bg-error-container text-on-error-container text-body-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="full-name" className="block font-label-md text-label-md text-primary mb-2">
          Full Name
        </label>
        <input
          id="full-name"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe"
          className="w-full px-4 py-3 border border-border-subtle rounded-lg font-body-md focus:ring-2 focus:ring-electric-blue focus:border-transparent outline-none transition-all placeholder:text-slate-gray/50"
        />
      </div>

      <div>
        <label htmlFor="email" className="block font-label-md text-label-md text-primary mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
          className="w-full px-4 py-3 border border-border-subtle rounded-lg font-body-md focus:ring-2 focus:ring-electric-blue focus:border-transparent outline-none transition-all placeholder:text-slate-gray/50"
        />
      </div>

      <div>
        <label htmlFor="password" className="block font-label-md text-label-md text-primary mb-2">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-border-subtle rounded-lg font-body-md focus:ring-2 focus:ring-electric-blue focus:border-transparent outline-none transition-all placeholder:text-slate-gray/50"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-gray hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-electric-blue text-on-primary py-4 rounded-lg font-button text-button shadow-md hover:bg-secondary transition-all transform active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </div>
    </form>
  );
}