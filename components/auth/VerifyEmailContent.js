'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { verifyEmail, ApiError } from '@/lib/apiClient';

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { user, updateUser } = useAuth();

  // A missing token is knowable synchronously from the URL — no need for an
  // effect to discover it, so it's a lazy initializer instead of a
  // setState-in-effect call for that branch.
  const [status, setStatus] = useState(() => (token ? 'verifying' : 'error')); // verifying | success | error
  const [error, setError] = useState(() => (token ? null : 'This verification link is missing its token.'));

  useEffect(() => {
    if (!token) return;

    verifyEmail(token)
      .then(() => {
        setStatus('success');
        // If this device happens to already be signed in as this user, drop
        // the nudge banner immediately instead of waiting for a refetch.
        if (user) updateUser({ emailVerified: true });
      })
      .catch((err) => {
        setStatus('error');
        setError(err instanceof ApiError ? err.message : 'Something went wrong verifying your email.');
      });
    // Intentionally runs once per token — re-running on `user`/`updateUser`
    // identity changes would re-submit an already-consumed token.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const continueHref = user ? '/matches' : '/login';
  const continueLabel = user ? 'Continue to your matches' : 'Sign in';

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center py-stack-lg">
        {status === 'verifying' && (
          <>
            <span className="material-symbols-outlined animate-spin text-electric-blue text-5xl mb-stack-md">
              progress_activity
            </span>
            <h1 className="font-headline-lg text-headline-lg text-deep-navy mb-stack-sm">Verifying your email…</h1>
          </>
        )}

        {status === 'success' && (
          <>
            <span className="material-symbols-outlined text-match-success text-6xl mb-stack-md">task_alt</span>
            <h1 className="font-headline-lg text-headline-lg text-deep-navy mb-stack-sm">Email verified</h1>
            <p className="text-slate-gray font-body-md mb-stack-lg">Your email address is confirmed.</p>
            <Link
              href={continueHref}
              className="inline-block bg-electric-blue text-white px-8 py-3 rounded-lg font-button text-button hover:shadow-lg transition-all"
            >
              {continueLabel}
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <span className="material-symbols-outlined text-error text-5xl mb-stack-md">error</span>
            <h1 className="font-headline-lg text-headline-lg text-deep-navy mb-stack-sm">Verification failed</h1>
            <p className="text-error font-body-md mb-stack-lg">{error}</p>
            <p className="text-slate-gray text-body-sm mb-stack-lg">
              Verification links expire after 24 hours. You can request a new one from your profile once signed in.
            </p>
            <Link
              href={user ? '/profile#account-settings' : '/login'}
              className="inline-block border-2 border-border-subtle text-deep-navy px-8 py-3 rounded-lg font-button text-button hover:bg-surface-container-low transition-all"
            >
              {user ? 'Go to Account Settings' : 'Sign in'}
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
