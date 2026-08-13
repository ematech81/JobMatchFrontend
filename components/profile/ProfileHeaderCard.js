'use client';

import { countryCodeToName } from '@/lib/format';

/**
 * No "Identity Verified" badge here — the design mock has one, but there's
 * no verification system anywhere in this app. Showing it would be a false
 * trust claim, not just a missing feature.
 */
export default function ProfileHeaderCard({ user, resume }) {
  const initials = (user?.fullName || user?.email || '?')
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  const location = countryCodeToName(user?.preferredCountry);

  return (
    <section className="bg-surface-container-lowest border border-border-subtle rounded-xl p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/5 rounded-full -mr-32 -mt-32" />

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-primary-fixed flex items-center justify-center">
            <span className="text-on-primary-fixed font-bold text-display-lg">{initials}</span>
          </div>
          <button
            type="button"
            disabled
            title="Coming soon"
            className="absolute bottom-0 right-0 p-2 bg-electric-blue/50 text-white rounded-full shadow-lg cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]">photo_camera</span>
          </button>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="font-display-lg text-headline-lg text-deep-navy mb-1">
            {user?.fullName || 'Add your name'}
          </h1>
          {resume?.desiredTitles?.[0] && (
            <p className="text-body-lg text-slate-gray mb-4 font-medium">{resume.desiredTitles[0]}</p>
          )}

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            {location && (
              <div className="flex items-center gap-1 text-body-sm text-slate-gray">
                <span className="material-symbols-outlined text-base">location_on</span>
                {location}
              </div>
            )}
            <div className="flex items-center gap-1 text-body-sm text-slate-gray">
              <span className="material-symbols-outlined text-base">mail</span>
              {user?.email}
            </div>
          </div>
        </div>

        <a
          href="#personal-info"
          className="px-6 py-2 border-2 border-electric-blue text-electric-blue hover:bg-electric-blue/5 rounded-lg font-button transition-all active:scale-95"
        >
          Edit Profile
        </a>
      </div>
    </section>
  );
}
