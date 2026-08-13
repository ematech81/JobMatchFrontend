'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { getMyResume, getMySubscription, ApiError } from '@/lib/apiClient';

/**
 * Split out purely so `useSearchParams()` has its own Suspense boundary,
 * without pushing that requirement onto every page that uses
 * RedirectIfAuthed (login and register aren't otherwise Suspense-wrapped
 * around this component).
 */
function RedirectLogic() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Only meaningful for a fully set-up user (e.g. a session-expired bounce
  // back to /login?redirect=/jobs/saved) — an incomplete user still goes to
  // onboarding/subscribe regardless of what this points at, since nothing
  // past that gate would load for them anyway.
  const redirectParam = searchParams.get('redirect');

  useEffect(() => {
    if (loading || !user) return;

    Promise.all([
      getMyResume().catch((err) => {
        if (err instanceof ApiError && err.status === 404) return null;
        throw err;
      }),
      getMySubscription().catch(() => ({ subscription: null })),
    ])
      .then(([resumeData, subData]) => {
        if (!resumeData) {
          router.replace('/onboarding');
        } else if (subData?.subscription?.status !== 'active') {
          router.replace('/subscribe/plans');
        } else {
          router.replace(redirectParam?.startsWith('/') ? redirectParam : '/matches');
        }
      })
      .catch(() => {
        // Couldn't resolve either check (network hiccup, etc.) — fall back
        // to onboarding rather than stranding the user on a spinner. Worst
        // case they see a completed step again, not a broken page.
        router.replace('/onboarding');
      });
  }, [loading, user, router, redirectParam]);

  return null;
}

/**
 * Inverse of RequireAuth — keeps an already-signed-in visitor from landing
 * on /login or /register, where "Sign In"/"Create Account" no longer make
 * sense for them (and re-registering would just 409 anyway).
 *
 * This used to hardcode the destination as `/matches`, which raced against
 * RegisterForm's own `router.push('/onboarding')`: `register()` sets `user`
 * synchronously as its last step, so the instant that happens this effect
 * would fire and send a brand-new signup straight to `/matches`, skipping
 * onboarding entirely — a bug that was invisible before, because completing
 * onboarding *also* used to land on `/matches`. Now that the two outcomes
 * differ, this has to resolve the real destination instead of assuming one.
 */
export default function RedirectIfAuthed({ children }) {
  const { user, loading } = useAuth();

  if (loading || user) {
    return (
      <>
        <Suspense fallback={null}>
          <RedirectLogic />
        </Suspense>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <span className="material-symbols-outlined animate-spin text-electric-blue text-4xl">
            progress_activity
          </span>
        </div>
      </>
    );
  }

  return children;
}
