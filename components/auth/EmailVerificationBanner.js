'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { resendVerification } from '@/lib/apiClient';

/**
 * Soft nudge, not a gate — the user can already be doing everything else on
 * the page this renders on. Renders nothing once verified, while loading, or
 * signed out (matches AuthContext's own `loading`/`user` semantics).
 */
export default function EmailVerificationBanner() {
  const { user, loading } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  if (loading || !user || user.emailVerified) return null;

  const handleResend = async () => {
    setSending(true);
    setError(null);
    try {
      await resendVerification();
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to resend. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mb-stack-md bg-primary-fixed border border-electric-blue/30 rounded-lg px-4 py-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-body-sm text-deep-navy">
          <span className="material-symbols-outlined text-[18px] align-text-bottom mr-1">mail</span>
          {sent
            ? 'Verification email sent — check your inbox.'
            : `Please verify your email address (${user.email}) to secure your account.`}
        </p>
        {!sent && (
          <button
            type="button"
            onClick={handleResend}
            disabled={sending}
            className="shrink-0 text-electric-blue font-button text-body-sm hover:underline disabled:opacity-50 text-left sm:text-right"
          >
            {sending ? 'Sending…' : 'Resend verification email'}
          </button>
        )}
      </div>
      {error && <p className="text-error text-body-sm mt-2">{error}</p>}
    </div>
  );
}
