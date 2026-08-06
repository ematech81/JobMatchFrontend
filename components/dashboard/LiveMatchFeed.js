'use client';

import Link from 'next/link';
import { timeAgo } from '@/lib/format';

/**
 * Real-time match activity.
 *
 * Seeded from GET /matches?sort=recent and then kept live by the backend's
 * authenticated `new_match` socket event — the page owns the socket
 * subscription so the same events also refresh the match grid.
 *
 * The Stitch design also showed "Recruiter viewed profile" entries. JobMatch
 * has no employer-facing side, so there is no such event to render and it is
 * deliberately omitted rather than faked.
 */
export default function LiveMatchFeed({ items = [], loading, connected }) {
  return (
    <section className="xl:col-span-1 bg-deep-navy rounded-xl overflow-hidden text-on-secondary shadow-xl h-full flex flex-col min-h-[400px]">
      <div className="p-stack-md border-b border-on-secondary/10 flex justify-between items-center">
        <h3 className="font-headline-md text-body-md font-bold">New Matches</h3>
        <span
          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
            connected ? 'bg-match-success text-white animate-pulse' : 'bg-white/20 text-white/70'
          }`}
        >
          {connected ? 'LIVE' : 'OFFLINE'}
        </span>
      </div>

      <div className="grow overflow-y-auto custom-scrollbar p-stack-md space-y-stack-md">
        {loading && <p className="text-[12px] text-on-secondary/50">Loading activity…</p>}

        {!loading && items.length === 0 && (
          <p className="text-[12px] text-on-secondary/50">
            No matches yet. New matches appear here the moment they are found.
          </p>
        )}

        {items.map((item) => (
          <Link
            key={item.id}
            href={item.jobPublicId ? `/jobs/${item.jobPublicId}` : '/matches'}
            className={`flex gap-stack-sm p-stack-sm bg-white/5 rounded-lg border-l-4 hover:bg-white/10 transition-colors cursor-pointer ${
              item.isNew ? 'border-match-success' : 'border-electric-blue/50'
            }`}
          >
            <div className="shrink-0 mt-1">
              <span
                className="material-symbols-outlined text-match-success"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-bold text-body-sm truncate">
                New {item.score}% Match: {item.employer || 'Unknown employer'}
              </p>
              <p className="text-[12px] text-on-secondary/60 truncate">{item.jobTitle}</p>
              <p className="text-[10px] text-on-secondary/40 mt-1">{timeAgo(item.matchedAt)}</p>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/matches"
        className="p-stack-md text-center text-body-sm font-bold text-on-secondary/60 hover:text-on-secondary transition-colors border-t border-on-secondary/10"
      >
        View All Activity
      </Link>
    </section>
  );
}
