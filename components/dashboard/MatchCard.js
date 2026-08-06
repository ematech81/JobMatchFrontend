import Image from 'next/image';
import Link from 'next/link';
import { formatLocation, formatSalary } from '@/lib/format';

/** Compact match tile used for every match after the featured one. */
export default function MatchCard({ match }) {
  const job = match.jobId;
  if (!job) return null;

  const salary = formatSalary(job);
  const summary = (job.job_description || '').replace(/\s+/g, ' ').trim();

  return (
    <article className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col">
      <div className="p-stack-md">
        <div className="flex justify-between mb-stack-sm">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-border-subtle relative overflow-hidden shrink-0">
            {job.employer_logo ? (
              <Image
                src={job.employer_logo}
                alt={`${job.employer_name} logo`}
                fill
                className="object-contain p-1.5"
              />
            ) : (
              <span className="text-slate-gray font-bold text-body-sm">
                {job.employer_name?.[0] || '?'}
              </span>
            )}
          </div>
          <div className="px-2 py-0.5 bg-match-success/10 text-match-success rounded-full text-[12px] font-bold h-fit">
            {match.score}%
          </div>
        </div>

        <Link href={`/jobs/${job.job_id}`}>
          <h3 className="font-headline-md text-body-md font-bold text-deep-navy group-hover:text-electric-blue transition-colors line-clamp-1">
            {job.job_title}
          </h3>
        </Link>
        <p className="text-slate-gray text-body-sm mb-stack-md line-clamp-1">
          {job.employer_name} • {formatLocation(job)}
        </p>

        <div className="h-1 bg-surface-container-low rounded-full overflow-hidden mb-stack-md">
          <div
            className="h-full bg-electric-blue transition-all duration-700"
            style={{ width: `${match.score}%` }}
          />
        </div>

        {summary && <p className="text-slate-gray text-body-sm line-clamp-2">{summary}</p>}
      </div>

      <div className="mt-auto p-stack-md border-t border-border-subtle bg-surface-bright flex justify-between items-center gap-2">
        <span className="text-body-sm font-bold text-deep-navy truncate">
          {salary || 'Salary not listed'}
        </span>
        <Link
          href={`/jobs/${job.job_id}`}
          className="text-electric-blue font-button text-body-sm hover:underline shrink-0"
        >
          Details
        </Link>
      </div>
    </article>
  );
}
