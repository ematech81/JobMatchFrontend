'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MatchToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // TODO: replace with Socket.io 'new_match' listener once auth is wired up
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-20 right-6 z-[100] transition-transform duration-500 ease-out">
      <div className="bg-surface-container-lowest border-l-4 border-match-success shadow-2xl rounded-lg p-4 flex items-start gap-4 max-w-sm glass-card">
        <div className="w-10 h-10 rounded-full bg-match-success/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-match-success">celebration</span>
        </div>
        <div>
          <h4 className="font-bold text-on-surface text-body-md">New Match Found!</h4>
          <p className="text-slate-gray text-body-sm">
            A "Technical Product Manager" role in London just posted that matches 95% of your skills.
          </p>
          <Link
            href="/matches"
            className="mt-2 inline-block text-electric-blue font-bold text-[12px] hover:underline"
          >
            VIEW ROLE
          </Link>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-slate-gray hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
    </div>
  );
}