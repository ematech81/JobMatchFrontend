'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/jobs/search', label: 'Find Jobs' },
  { href: '/matches', label: 'My Matches' },
  { href: '/profile', label: 'Profile' },
];

export default function JobDetailHeader() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/jobs/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="bg-surface-container-lowest border-b border-border-subtle sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto h-16">
        <div className="flex items-center gap-gutter">
          <Link href="/" className="flex items-center gap-2 font-headline-md text-headline-md font-bold text-primary">
            <Image src="/jobMatch-logo.png" alt="JobMatch" width={32} height={32} className="h-8 w-8 rounded-md object-contain" />
            JobMatch
          </Link>
          <nav className="hidden md:flex gap-stack-lg items-center h-full">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  pathname === item.href
                    ? 'text-secondary border-b-2 border-secondary pb-1 font-bold'
                    : 'text-slate-gray font-medium hover:text-secondary transition-colors duration-200 py-5'
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-stack-md">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-gray">
              search
            </span>
            <input
              className="pl-10 pr-4 py-2 bg-surface-container border border-border-subtle rounded-lg focus:ring-2 focus:ring-electric-blue focus:outline-none text-body-sm"
              placeholder="Search matches..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      </div>
    </header>
  );
}