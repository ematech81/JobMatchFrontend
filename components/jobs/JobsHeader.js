'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/jobs/search', label: 'Find Jobs' },
  { href: '/matches', label: 'My Matches' },
  { href: '/profile', label: 'Profile' },
];

const ACTIVE_CLASSES = 'text-electric-blue font-bold border-b-2 border-electric-blue pb-1';
const INACTIVE_CLASSES = 'text-slate-gray hover:text-deep-navy pb-1 border-b-2 border-transparent';

export default function JobsHeader({ initialCountry }) {
  const [scrolled, setScrolled] = useState(false);
  const [country, setCountry] = useState(initialCountry);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && country.trim()) {
      router.push(`/jobs/search?country=${encodeURIComponent(country.trim())}`);
    }
  };

  return (
    <header
      className={`
        top-0 border-b border-border-subtle sticky z-50 w-full
        transition-all duration-200 ease-in-out
        ${scrolled ? 'shadow-md bg-white/95 backdrop-blur-md' : 'bg-surface'}
      `}
    >
      <div className="flex justify-between items-center px-4 md:px-margin-mobile max-w-container-max mx-auto w-full h-16">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-headline-md text-headline-md font-bold text-primary">
            <Image src="/jobMatch-logo.png" alt="JobMatch" width={32} height={32} className="h-8 w-8 rounded-md object-contain" />
            JobMatch
          </Link>

          <div className="hidden md:flex items-center bg-surface-container-low rounded-lg px-3 py-2 gap-2 border border-border-subtle focus-within:ring-2 focus-within:ring-electric-blue/20 focus-within:border-electric-blue transition-all">
            <span className="material-symbols-outlined text-slate-gray">public</span>
            <input
              className="bg-transparent border-none focus:ring-0 font-body-sm text-on-surface w-48"
              placeholder="Select Country..."
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <span className="material-symbols-outlined text-slate-gray cursor-pointer">
              keyboard_arrow_down
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-body-md text-body-md transition-all ${
                pathname === item.href ? ACTIVE_CLASSES : INACTIVE_CLASSES
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}