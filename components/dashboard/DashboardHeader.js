'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

/**
 * Dashboard top bar. Differs from the marketing header by carrying the signed-in
 * affordances (new-match count, user avatar) instead of auth CTAs.
 */
export default function DashboardHeader({ newMatchCount = 0 }) {
  const { user } = useAuth();

  const initials = (user?.fullName || user?.email || '?')
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  return (
    <header className="bg-surface border-b border-border-subtle fixed top-0 w-full z-50">
      <div className="flex justify-between items-center px-4 md:px-margin-mobile max-w-container-max mx-auto w-full h-16">
        <div className="flex items-center gap-stack-lg">
          <Link
            href="/"
            className="flex items-center gap-2 font-headline-md text-headline-md font-bold text-primary"
          >
            <Image src="/jobMatch-logo.png" alt="JobMatch" width={32} height={32} className="h-8 w-8 rounded-md object-contain" />
            JobMatch
          </Link>
          <nav className="hidden md:flex gap-stack-md">
            <Link
              href="/jobs/search"
              className="font-body-md text-body-md text-slate-gray hover:text-deep-navy transition-colors"
            >
              Find Jobs
            </Link>
            <Link
              href="/matches"
              className="font-body-md text-body-md text-electric-blue font-bold border-b-2 border-electric-blue pb-1 transition-all duration-200"
            >
              My Matches
            </Link>
            <Link
              href="/profile"
              className="font-body-md text-body-md text-slate-gray hover:text-deep-navy transition-colors"
            >
              Profile
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-stack-md">
          {/* Counts matches surfaced in the last 24h — real data, not a placeholder badge. */}
          <div className="relative">
            <span className="material-symbols-outlined text-slate-gray">notifications</span>
            {newMatchCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-match-success text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {newMatchCount > 9 ? '9+' : newMatchCount}
              </span>
            )}
          </div>
          <div className="h-8 w-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold text-body-sm">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
