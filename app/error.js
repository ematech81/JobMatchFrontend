'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Route-segment error boundary — catches a client-side exception anywhere
 * under the root layout and shows this instead of Next.js's generic
 * unstyled fallback. Doesn't cover a crash in the root layout itself (that
 * needs global-error.js, which replaces the whole document including
 * <html>/<body>) — this is the one that matters for everything else.
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('[Client error]', error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-background">
      <Image
        src="/jobMatch-logo.png"
        alt="JobMatch"
        width={64}
        height={64}
        className="h-16 w-16 rounded-lg object-contain mb-stack-lg"
      />
      <h1 className="font-headline-lg text-headline-lg text-deep-navy mb-stack-sm">Something went wrong</h1>
      <p className="text-slate-gray font-body-md mb-stack-lg max-w-md">
        An unexpected error occurred. You can try again, or head back to the homepage.
      </p>
      <div className="flex gap-stack-md">
        <button
          type="button"
          onClick={reset}
          className="bg-electric-blue text-white px-8 py-3 rounded-lg font-button text-button hover:shadow-lg transition-all"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border-2 border-border-subtle text-deep-navy px-8 py-3 rounded-lg font-button text-button hover:bg-surface-container-low transition-all"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
