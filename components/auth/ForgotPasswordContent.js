'use client';

import { useState } from 'react';
import Link from 'next/link';
import { forgotPassword, ApiError } from '@/lib/apiClient';

export default function ForgotPasswordContent() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // Backend always responds the same way whether or not the email is
      // registered — this screen can't and shouldn't reveal that either.
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full py-stack-lg">
        {sent ? (
          <div className="text-center">
            <span className="material-symbols-outlined text-match-success text-6xl mb-stack-md">mark_email_read</span>
            <h1 className="font-headline-lg text-headline-lg text-deep-navy mb-stack-sm">Check your email</h1>
            <p className="text-slate-gray font-body-md mb-stack-lg">
              If <strong>{email}</strong> is registered, a password reset link is on its way. It expires in 1 hour.
            </p>
            <Link href="/login" className="text-electric-blue font-button text-button hover:underline">
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-headline-lg text-headline-lg text-deep-navy mb-stack-sm text-center">Forgot your password?</h1>
            <p className="text-slate-gray font-body-md mb-stack-lg text-center">
              Enter your email and we&apos;ll send you a link to reset it.
            </p>

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
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 bg-surface-bright border border-border-subtle rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-electric-blue outline-none transition-all placeholder:text-slate-gray"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 bg-electric-blue text-on-primary py-4 rounded-lg font-button text-button shadow-lg shadow-electric-blue/20 hover:bg-secondary active:scale-95 transition-all disabled:opacity-60"
              >
                {submitting ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>

            <p className="text-center text-body-sm text-slate-gray mt-stack-md">
              <Link href="/login" className="text-electric-blue font-bold hover:underline">
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
