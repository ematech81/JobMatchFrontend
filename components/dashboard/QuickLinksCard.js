import Link from 'next/link';

/**
 * Sidebar shortcuts. "Saved Jobs" and "Match Settings" point at routes that do
 * not exist yet — they are listed in the design and left linked so the nav
 * intent is preserved, but they will 404 until those screens are built.
 */
const LINKS = [
  { href: '/profile', icon: 'account_circle', label: 'My Profile' },
  { href: '/jobs/saved', icon: 'bookmark', label: 'Saved Jobs' },
  { href: '/settings/matching', icon: 'settings', label: 'Match Settings' },
];

export default function QuickLinksCard() {
  return (
    <section className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md shadow-sm">
      <h2 className="font-headline-md text-body-md font-bold text-deep-navy mb-stack-md">
        Quick Links
      </h2>
      <ul className="space-y-stack-sm">
        {LINKS.map(({ href, icon, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex items-center gap-stack-sm p-stack-sm rounded-lg hover:bg-surface-container-low transition-colors text-slate-gray hover:text-deep-navy group"
            >
              <span className="material-symbols-outlined group-hover:text-electric-blue">
                {icon}
              </span>
              <span className="font-body-md">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
