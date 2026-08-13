'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

/**
 * Deliberately has no "Find Jobs" / "My Matches" / "Profile" nav — those
 * lead to the very screens this flow gates. Logo + Sign Out only.
 */
export default function SubscribeHeader() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-surface border-b border-border-subtle fixed top-0 w-full z-50">
      <div className="flex justify-between items-center px-4 md:px-margin-mobile max-w-container-max mx-auto w-full h-16">
        <Link href="/" className="flex items-center gap-2 font-headline-md text-headline-md font-bold text-primary">
          <Image src="/jobMatch-logo.png" alt="JobMatch" width={32} height={32} className="h-8 w-8 rounded-md object-contain" />
          JobMatch
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="text-slate-gray hover:text-error font-body-md text-body-md transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
