'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

/**
 * Inverse of RequireAuth — keeps an already-signed-in visitor from landing
 * on /login or /register, where "Sign In"/"Create Account" no longer make
 * sense for them (and re-registering would just 409 anyway).
 */
export default function RedirectIfAuthed({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/matches');
    }
  }, [loading, user, router]);

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-electric-blue text-4xl">
          progress_activity
        </span>
      </div>
    );
  }

  return children;
}
