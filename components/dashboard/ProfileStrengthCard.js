import Link from 'next/link';

/**
 * Profile strength from GET /resume/me, which returns both the score and the
 * concrete unmet criteria. The suggestion shown is the backend's own top gap —
 * the design's hardcoded "add a cover letter template" was not a real signal
 * and JobMatch has no cover-letter feature.
 */
export default function ProfileStrengthCard({ strength }) {
  const score = strength?.score ?? 0;
  const nextGap = strength?.missing?.[0];

  return (
    <article className="bg-gradient-to-br from-electric-blue to-deep-navy rounded-xl p-stack-lg text-on-secondary shadow-lg flex flex-col justify-between overflow-hidden relative group">
      <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
        <span className="material-symbols-outlined text-[180px]">auto_awesome</span>
      </div>

      <div className="relative z-10">
        <h3 className="font-headline-md text-body-lg font-bold mb-2">Profile Strength</h3>
        <div className="flex items-end gap-2 mb-stack-md">
          <span className="text-display-lg font-display-lg leading-none">{score}</span>
          <span className="text-headline-md opacity-60">/ 100</span>
        </div>
        <p className="text-body-sm opacity-80 mb-stack-lg">
          {nextGap
            ? `${nextGap} to strengthen your matches.`
            : 'Your profile is complete — matches are running on full signal.'}
        </p>
      </div>

      <Link
        href="/resume/builder"
        className="w-full py-stack-sm bg-white/20 backdrop-blur-md border border-white/30 text-on-secondary font-button text-button rounded-lg hover:bg-white/30 transition-all z-10 text-center"
      >
        {nextGap ? 'Optimize Now' : 'Review Resume'}
      </Link>
    </article>
  );
}
