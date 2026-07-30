'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function OnboardingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-surface border-b border-border-subtle fixed top-0 left-0 right-0 z-50">
      <nav className="flex justify-between items-center px-4 md:px-margin-mobile max-w-container-max mx-auto w-full h-16">
        <div className="flex items-center gap-gutter">
          <Link href="/" className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
            JobMatch
          </Link>
          <div className="hidden md:flex items-center gap-stack-lg">
            <Link href="/jobs/search" className="text-slate-gray hover:text-deep-navy transition-colors font-body-md text-body-md">
              Find Jobs
            </Link>
            <Link href="/matches" className="text-slate-gray hover:text-deep-navy transition-colors font-body-md text-body-md">
              My Matches
            </Link>
            <Link href="/profile" className="text-slate-gray hover:text-deep-navy transition-colors font-body-md text-body-md">
              Profile
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/post-job"
            className="hidden md:block px-6 py-2 bg-electric-blue text-white font-button text-button rounded-lg hover:shadow-lg transition-all"
          >
            Post a Job
          </Link>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 text-slate-gray"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-4 pb-4 bg-surface border-b border-border-subtle">
          <Link href="/jobs/search" className="text-slate-gray text-body-md">Find Jobs</Link>
          <Link href="/matches" className="text-slate-gray text-body-md">My Matches</Link>
          <Link href="/profile" className="text-slate-gray text-body-md">Profile</Link>
        </div>
      )}
    </header>
  );
}