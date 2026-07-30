'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BuilderHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-surface border-b border-border-subtle sticky top-0 z-50">
      <div className="flex justify-between items-center px-4 md:px-margin-mobile max-w-container-max mx-auto w-full h-16">
        <Link href="/" className="font-headline-md text-headline-md font-bold text-primary">
          JobMatch
        </Link>

        <div className="hidden md:flex items-center gap-gutter">
          <Link href="/jobs/search" className="font-body-md text-body-md text-slate-gray hover:text-deep-navy transition-colors">
            Find Jobs
          </Link>
          <Link href="/matches" className="font-body-md text-body-md text-slate-gray hover:text-deep-navy transition-colors">
            My Matches
          </Link>
          <Link href="/profile" className="font-body-md text-body-md text-slate-gray hover:text-deep-navy transition-colors">
            Profile
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 text-slate-gray"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-4 pb-4 bg-surface border-b border-border-subtle">
          <Link href="/jobs/search" className="text-slate-gray text-body-md">Find Jobs</Link>
          <Link href="/matches" className="text-slate-gray text-body-md">My Matches</Link>
          <Link href="/profile" className="text-slate-gray text-body-md">Profile</Link>
        </div>
      )}
    </nav>
  );
}