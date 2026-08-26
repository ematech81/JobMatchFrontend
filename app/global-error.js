'use client';

import { useEffect } from 'react';

/**
 * Only fires if the root layout itself crashes — genuinely rare, but without
 * this Next.js falls back to a blank white screen with zero branding since
 * there's no layout left to render around a normal error.js. Has to supply
 * its own <html>/<body> since it replaces the whole document. Deliberately
 * plain inline styles, no Tailwind/font dependencies — if the app is broken
 * enough to hit this, the fewer things this page depends on, the better.
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('[Global error]', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#F7F9FB' }}>
        <main
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
            JobMatch is temporarily unavailable
          </h1>
          <p style={{ color: '#64748B', marginBottom: '24px', maxWidth: '420px' }}>
            Something went wrong loading the page. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: '#2563EB',
              color: '#fff',
              padding: '12px 32px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
