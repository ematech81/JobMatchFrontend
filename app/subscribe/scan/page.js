'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/auth/RequireAuth';
import SubscribeHeader from '@/components/subscribe/SubscribeHeader';
import { getScanSummary, ApiError } from '@/lib/apiClient';

const SCAN_MESSAGES = [
  'Reading your resume…',
  'Matching your skills against open roles…',
  'Scoring roles by title and skill overlap…',
  'Ranking your best-fit matches…',
];

// The scanning state itself is simulated — cycling status copy over a fixed
// minimum duration — but everything shown once it resolves (scannedCount,
// matchCount) is a real number from a real matching run. This just keeps the
// animation from flashing past instantly on a fast connection.
const MIN_DURATION_MS = 3200;

function ScanContent() {
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      setMessageIndex((i) => (i + 1) % SCAN_MESSAGES.length);
    }, 900);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    getScanSummary()
      .then((data) => {
        if (cancelled) return;
        const remaining = Math.max(MIN_DURATION_MS - (Date.now() - startedAt), 0);
        setTimeout(() => {
          if (!cancelled) setSummary(data);
        }, remaining);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          // No resume on file — shouldn't happen from the normal onboarding
          // flow, but if it does, send them back to build one instead of
          // getting stuck on a screen with nothing to scan.
          router.replace('/onboarding');
          return;
        }
        setError(err.message || 'Something went wrong while scanning.');
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const scanning = !summary && !error;

  return (
    <>
      <SubscribeHeader />

      <main className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-xl w-full text-center py-stack-lg">
          {scanning && (
            <>
              <div
                className="w-20 h-20 mx-auto mb-stack-lg rounded-full border-4 border-electric-blue/20 border-t-electric-blue animate-spin"
                role="status"
                aria-label="Scanning"
              />
              <h1 className="font-headline-lg text-headline-lg text-deep-navy mb-stack-sm">
                Scanning for your matches
              </h1>
              <p className="text-slate-gray font-body-md">{SCAN_MESSAGES[messageIndex]}</p>
            </>
          )}

          {error && (
            <>
              <span className="material-symbols-outlined text-error text-5xl mb-stack-md">error</span>
              <p className="text-error text-body-md mb-stack-lg">{error}</p>
              <button
                type="button"
                onClick={() => router.push('/subscribe/plans')}
                className="bg-electric-blue text-white px-8 py-3 rounded-lg font-button text-button hover:shadow-lg transition-all"
              >
                Continue
              </button>
            </>
          )}

          {summary && (
            <>
              <span className="material-symbols-outlined text-match-success text-6xl mb-stack-md">
                task_alt
              </span>
              <h1 className="font-display-lg text-display-lg text-deep-navy mb-stack-sm">
                {summary.matchCount > 0
                  ? `We found ${summary.matchCount} job${summary.matchCount === 1 ? '' : 's'} that match your resume`
                  : "We've scanned our database against your resume"}
              </h1>
              <p className="text-slate-gray font-body-lg mb-stack-lg">
                {summary.matchCount > 0
                  ? `Scanned ${summary.scannedCount.toLocaleString()} open roles to find your best-fit matches.`
                  : `We scanned ${summary.scannedCount.toLocaleString()} open roles — new matches roll in as fresh roles are added and your profile fills out.`}
              </p>
              <button
                type="button"
                onClick={() => router.push('/subscribe/plans')}
                className="bg-electric-blue text-white px-8 py-3 rounded-lg font-button text-button hover:shadow-lg transition-all"
              >
                Unlock My Matches
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default function ScanPage() {
  return (
    <RequireAuth>
      <ScanContent />
    </RequireAuth>
  );
}
