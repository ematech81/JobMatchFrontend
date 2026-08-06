'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function OnboardingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-surface border-b border-border-subtle fixed top-0 left-0 right-0 z-50">
      <nav className="flex justify-between items-center px-4 md:px-margin-mobile max-w-container-max mx-auto w-full h-16">
        <div className="flex items-center gap-gutter">
          <Link href="/" className="flex items-center gap-2 font-headline-md text-headline-md font-bold text-primary tracking-tight">
            <Image src="/jobMatch-logo.png" alt="JobMatch" width={32} height={32} className="h-8 w-8 rounded-md object-contain" />
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