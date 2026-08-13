'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

// Personal Info, Job Preferences, and Documents are real sections further
// down this same page (no separate routes exist yet), so these anchor-scroll
// to them. Account Settings and Privacy & Security have no corresponding UI
// built at all — disabled rather than linking somewhere that 404s.
const NAV_ITEMS = [
  { href: '#personal-info', label: 'Personal Info', icon: 'person' },
  { href: '#job-preferences', label: 'Job Preferences', icon: 'work' },
  { href: '#resume', label: 'Documents', icon: 'description' },
];

const DISABLED_ITEMS = [
  { label: 'Account Settings', icon: 'settings' },
  { label: 'Privacy & Security', icon: 'lock' },
];

export default function ProfileSidebar() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 text-slate-gray hover:bg-surface-container-low rounded-lg transition-colors font-body-md"
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </a>
        ))}

        <hr className="my-2 border-border-subtle" />

        {DISABLED_ITEMS.map((item) => (
          <span
            key={item.label}
            title="Coming soon"
            className="flex items-center gap-3 px-4 py-3 text-slate-gray/50 rounded-lg font-body-md cursor-not-allowed"
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </span>
        ))}

        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/20 rounded-lg transition-colors font-body-md text-left"
        >
          <span className="material-symbols-outlined">logout</span>
          Sign Out
        </button>
      </nav>
    </div>
  );
}
