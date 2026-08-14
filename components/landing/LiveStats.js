'use client';

import { useEffect, useState } from 'react';
import { getPublicJobStats } from '@/lib/apiClient';

// Real numbers only — fetched from a deliberately public, aggregate-only
// endpoint (see api/src/controllers/jobController.js getPublicStats). No
// fallback to a made-up figure if the fetch fails; the stat just doesn't
// render rather than show something untrue.
const STATS = [
  { key: 'totalJobs', label: 'Jobs tracked', icon: 'work' },
  { key: 'countryCount', label: 'Countries covered', icon: 'public' },
];

export default function LiveStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getPublicJobStats()
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) return null;

  return (
    <section className="py-stack-lg bg-deep-navy">
      <div className="max-w-container-max mx-auto px-margin-mobile">
        <div className="grid grid-cols-2 gap-stack-lg max-w-xl mx-auto text-center">
          {STATS.map((stat) => (
            <div key={stat.key}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="material-symbols-outlined text-electric-blue">{stat.icon}</span>
                <span className="font-display-lg text-4xl md:text-5xl font-bold text-white">
                  {stats[stat.key]?.toLocaleString() ?? '—'}
                </span>
              </div>
              <p className="text-white/60 font-body-sm text-body-sm uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
