'use client';

import Link from 'next/link';
import { formatExperience } from '@/lib/format';

/**
 * Sidebar summary of the resume currently driving matching.
 * Renders whichever path produced it — an uploaded file shows its filename,
 * a manually-built resume says so instead of inventing one.
 */
export default function ActiveResumeCard({ resume, totalExperienceMonths, loading }) {
  if (loading) {
    return (
      <section className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md shadow-sm">
        <div className="h-4 w-32 bg-surface-container rounded mb-stack-md animate-pulse" />
        <div className="h-16 bg-surface-container-low rounded-lg animate-pulse" />
      </section>
    );
  }

  if (!resume) {
    return (
      <section className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md shadow-sm">
        <h2 className="font-headline-md text-body-md font-bold text-deep-navy uppercase tracking-wider mb-stack-md">
          Active Resume
        </h2>
        <p className="text-slate-gray text-body-sm mb-stack-md">
          No resume yet. Add one to start getting matched.
        </p>
        <Link
          href="/onboarding"
          className="block text-center w-full py-stack-sm bg-electric-blue text-on-primary font-button text-button rounded-lg hover:bg-secondary transition-all"
        >
          Add Resume
        </Link>
      </section>
    );
  }

  const skills = resume.skills || [];
  const sourceLabel =
    resume.originalFilename ||
    (resume.source === 'generated' ? 'Built manually' : 'Parsed resume');

  return (
    <section className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md shadow-sm">
      <div className="flex items-center justify-between mb-stack-md">
        <h2 className="font-headline-md text-body-md font-bold text-deep-navy uppercase tracking-wider">
          Active Resume
        </h2>
        <span
          className="material-symbols-outlined text-electric-blue"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          description
        </span>
      </div>

      <div className="p-stack-sm bg-surface-container-low rounded-lg mb-stack-md">
        <p className="font-label-md text-label-md text-slate-gray mb-1">
          {resume.originalFilename ? 'Current File' : 'Source'}
        </p>
        <p className="font-body-md text-body-md font-bold text-deep-navy truncate" title={sourceLabel}>
          {sourceLabel}
        </p>
      </div>

      <div className="space-y-stack-sm">
        <div className="flex justify-between items-start gap-2 text-body-sm">
          <span className="text-slate-gray shrink-0">Parsed Skills:</span>
          <span className="font-bold text-deep-navy text-right">
            {skills.length ? skills.slice(0, 3).join(', ') : 'None listed'}
            {skills.length > 3 && (
              <span className="text-slate-gray font-normal"> +{skills.length - 3}</span>
            )}
          </span>
        </div>

        <div className="flex justify-between items-center text-body-sm">
          <span className="text-slate-gray">Experience:</span>
          <span className="font-bold text-deep-navy">
            {formatExperience(totalExperienceMonths)}
          </span>
        </div>

        <div className="flex justify-between items-center text-body-sm">
          <span className="text-slate-gray">Preferred Loc:</span>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">public</span>
            <span className="font-bold text-deep-navy">
              {resume.preferredCountry || 'Not set'}
            </span>
          </div>
        </div>
      </div>

      <Link
        href="/resume/builder?mode=edit"
        className="block text-center w-full mt-stack-md py-stack-sm border border-electric-blue text-electric-blue font-button text-button rounded-lg hover:bg-surface-container-high transition-all"
      >
        Update Resume
      </Link>
      <Link
        href="/resume/upload"
        className="block text-center w-full mt-stack-sm py-stack-sm bg-electric-blue/10 text-electric-blue font-label-md text-label-md rounded-lg hover:bg-electric-blue/20 transition-colors"
      >
        Upload a different resume instead
      </Link>
    </section>
  );
}
