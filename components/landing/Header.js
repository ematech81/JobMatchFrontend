'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

/**
 * Marketing header.
 *
 * Every destination behind it is gated: signed-out visitors get the landing
 * page only, so nav links route to /login carrying a redirect rather than to
 * a screen that would immediately bounce them.
 */
const NAV_LINKS = [
  { href: '/jobs/search', label: 'Find Jobs' },
  { href: '/matches', label: 'My Matches' },
  { href: '/profile', label: 'Profile', authOnly: true },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

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
          <Link href="/" className="flex items-center gap-2 font-headline-md text-headline-md font-bold text-primary">
            <Image src="/jobMatch-logo.png" alt="JobMatch" width={32} height={32} className="h-8 w-8 rounded-md object-contain" />
            JobMatch
          </Link>
          <div className="hidden md:flex gap-stack-lg items-center">
            {NAV_LINKS.filter((link) => !link.authOnly || user).map(({ href, label }) => {
              // Active state follows the real route — the landing page must not
              // render a nav item as selected.
              const isActive = pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={href}
                  href={user ? href : `/login?redirect=${encodeURIComponent(href)}`}
                  className={
                    isActive
                      ? 'font-body-md text-body-md text-electric-blue font-bold border-b-2 border-electric-blue pb-1 transition-all duration-200'
                      : 'font-body-md text-body-md text-slate-gray hover:text-deep-navy transition-colors duration-200'
                  }
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-stack-md">
          {user ? (
            <>
              <Link
                href="/matches"
                className="hidden sm:block text-slate-gray hover:text-deep-navy font-button text-button px-4 py-2 transition-all"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="bg-electric-blue text-on-primary font-button text-button px-6 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:block text-slate-gray hover:text-deep-navy font-button text-button px-4 py-2 transition-all"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="bg-electric-blue text-on-primary font-button text-button px-6 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
