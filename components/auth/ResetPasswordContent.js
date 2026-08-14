'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { resetPassword, ApiError } from '@/lib/apiClient';

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(() => (token ? null : 'This reset link is missing its token.'));
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full py-stack-lg">
        {done ? (
          <div className="text-center">
            <span className="material-symbols-outlined text-match-success text-6xl mb-stack-md">task_alt</span>
            <h1 className="font-headline-lg text-headline-lg text-deep-navy mb-stack-sm">Password reset</h1>
            <p className="text-slate-gray font-body-md mb-stack-lg">
              Your password has been changed. Sign in with your new password.
            </p>
            <Link
              href="/login"
              className="inline-block bg-electric-blue text-white px-8 py-3 rounded-lg font-button text-button hover:shadow-lg transition-all"
            >
              Sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-headline-lg text-headline-lg text-deep-navy mb-stack-sm text-center">Choose a new password</h1>
            <p className="text-slate-gray font-body-md mb-stack-lg text-center">
              At least {MIN_PASSWORD_LENGTH} characters.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-stack-md">
              {error && (
                <div className="bg-error-container text-on-error-container text-body-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-base">
                <label htmlFor="password" className="font-label-md text-label-md text-primary">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  disabled={!token}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-surface-bright border border-border-subtle rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-electric-blue outline-none transition-all placeholder:text-slate-gray disabled:opacity-60"
                />
              </div>

              <div className="flex flex-col gap-base">
                <label htmlFor="confirm" className="font-label-md text-label-md text-primary">
                  Confirm New Password
                </label>
                <input
                  id="confirm"
                  type="password"
                  required
                  disabled={!token}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-surface-bright border border-border-subtle rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-electric-blue outline-none transition-all placeholder:text-slate-gray disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !token}
                className="w-full mt-2 bg-electric-blue text-on-primary py-4 rounded-lg font-button text-button shadow-lg shadow-electric-blue/20 hover:bg-secondary active:scale-95 transition-all disabled:opacity-60"
              >
                {submitting ? 'Resetting…' : 'Reset Password'}
              </button>
            </form>

            {!token && (
              <p className="text-center text-body-sm text-slate-gray mt-stack-md">
                <Link href="/forgot-password" className="text-electric-blue font-bold hover:underline">
                  Request a new reset link
                </Link>
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
