'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`
        top-0 border-b border-border-subtle z-50 sticky w-full h-16
        transition-all duration-200 ease-in-out
        ${scrolled ? 'shadow-md bg-white/95 backdrop-blur-md' : 'bg-surface'}
      `}
    >
      <nav className="flex justify-between items-center px-4 md:px-margin-mobile max-w-container-max mx-auto w-full h-full">
        <div className="flex items-center gap-gutter">
          <span className="font-headline-md text-headline-md font-bold text-primary">
            JobMatch
          </span>
          <div className="hidden md:flex gap-stack-lg items-center">
            <Link
              href="/jobs"
              className="font-body-md text-body-md text-electric-blue font-bold border-b-2 border-electric-blue pb-1 transition-all duration-200"
            >
              Find Jobs
            </Link>
            <Link
              href="/matches"
              className="font-body-md text-body-md text-slate-gray hover:text-deep-navy transition-colors transition-all duration-200"
            >
              My Matches
            </Link>
            <Link
              href="/profile"
              className="font-body-md text-body-md text-slate-gray hover:text-deep-navy transition-colors transition-all duration-200"
            >
              Profile
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-stack-md">
          <Link
            href="/login"
            className="hidden sm:block text-slate-gray hover:text-deep-navy font-button text-button px-4 py-2 transition-all"
          >
            Log In
          </Link>
          <Link
            href="/post-job"
            className="bg-electric-blue text-on-primary font-button text-button px-6 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            Post a Job
          </Link>
        </div>
      </nav>
    </header>
  );
}