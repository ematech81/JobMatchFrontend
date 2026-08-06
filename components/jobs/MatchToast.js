'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSocket } from '@/lib/socket';

export default function MatchToast() {
  const [match, setMatch] = useState(null);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return; // signed out — nothing to subscribe to

    const handleNewMatch = (payload) => setMatch(payload);
    socket.on('new_match', handleNewMatch);

    return () => {
      socket.off('new_match', handleNewMatch);
    };
  }, []);

  // Auto-dismiss so a burst of matches doesn't leave a toast pinned on screen.
  useEffect(() => {
    if (!match) return;
    const timer = setTimeout(() => setMatch(null), 8000);
    return () => clearTimeout(timer);
  }, [match]);

  if (!match) return null;

  return (
    <div className="fixed top-20 right-6 z-[100] transition-transform duration-500 ease-out">
      <div className="bg-surface-container-lowest border-l-4 border-match-success shadow-2xl rounded-lg p-4 flex items-start gap-4 max-w-sm glass-card">
        <div className="w-10 h-10 rounded-full bg-match-success/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-match-success">celebration</span>
        </div>
        <div>
          <h4 className="font-bold text-on-surface text-body-md">New Match Found!</h4>
          <p className="text-slate-gray text-body-sm">
            {match.jobTitle}
            {match.employer ? ` at ${match.employer}` : ''} matches {match.score}% of your profile.
          </p>
          <Link
            href="/matches"
            className="mt-2 inline-block text-electric-blue font-bold text-[12px] hover:underline"
          >
            VIEW ROLE
          </Link>
        </div>
        <button
          onClick={() => setMatch(null)}
          className="text-slate-gray hover:text-on-surface"
          aria-label="Dismiss notification"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
    </div>
  );
}
