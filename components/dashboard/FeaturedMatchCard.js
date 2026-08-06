import Image from 'next/image';
import Link from 'next/link';
import { formatLocation } from '@/lib/format';

/**
 * The highest-scoring match, rendered wide. Skill chips come from the
 * backend's `matchedSkills` — the resume skills actually found in this job —
 * so the tags state a real reason the job matched.
 */
export default function FeaturedMatchCard({ match }) {
  const job = match.jobId;
  if (!job) return null;

  const tags = [
    ...(match.matchedSkills || []).slice(0, 3),
    ...(job.job_is_remote ? ['Remote OK'] : []),
  ];

  const description = (job.job_description || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 220);

  return (
    <article className="md:col-span-2 xl:col-span-2 bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group">
      <div className="p-stack-lg flex flex-col h-full">
        <div className="flex justify-between items-start mb-stack-md gap-stack-md">
          <div className="flex gap-stack-md items-center min-w-0">
            <div className="w-14 h-14 rounded-lg bg-surface-container flex items-center justify-center border border-border-subtle shrink-0 relative overflow-hidden">
              {job.employer_logo ? (
                <Image
                  src={job.employer_logo}
                  alt={`${job.employer_name} logo`}
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <span className="text-slate-gray font-bold text-lg">
                  {job.employer_name?.[0] || '?'}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <Link href={`/jobs/${job.job_id}`}>
                <h3 className="font-headline-md text-body-lg font-bold text-deep-navy group-hover:text-electric-blue transition-colors truncate">
                  {job.job_title}
                </h3>
              </Link>
              <p className="text-slate-gray text-body-sm truncate">
                {job.employer_name} • {formatLocation(job)}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <div className="px-stack-sm py-1 bg-match-success text-on-primary rounded-full text-body-sm font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              {match.score}% Match
            </div>
            {job.job_employment_type && (
              <span className="text-[10px] text-slate-gray mt-1 font-label-md uppercase tracking-tighter">
                {job.job_employment_type}
              </span>
            )}
          </div>
        </div>

        {description && (
          <p className="text-slate-gray text-body-md grow mb-stack-lg">
            {description}
            {job.job_description?.length > 220 ? '…' : ''}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-stack-lg">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-surface-container-low text-deep-navy text-[12px] font-bold rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-stack-md mt-auto">
          <a
            href={job.apply_link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-stack-sm bg-electric-blue text-on-secondary font-button text-button rounded-lg hover:bg-secondary transition-all text-center"
          >
            Apply Now
          </a>
          <Link
            href={`/jobs/${job.job_id}`}
            className="w-12 h-10 border border-border-subtle flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors"
            aria-label="View job details"
          >
            <span className="material-symbols-outlined text-slate-gray">open_in_new</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
