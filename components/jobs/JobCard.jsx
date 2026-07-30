import Image from 'next/image';
import Link from 'next/link';

function timeAgo(dateString) {
  if (!dateString) return '';
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export default function JobCard({ job }) {
  const {
    job_id,
    job_title,
    employer_name,
    job_city,
    country,
    apply_link,
    job_employment_type,
    fetched_at,
    employer_logo,
    matchScore,
  } = job;

  return (
    <article className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md hover:shadow-lg hover:border-electric-blue/30 transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row gap-stack-md">
        <div className="w-16 h-16 bg-surface-container rounded-lg shrink-0 overflow-hidden border border-border-subtle relative">
          {employer_logo ? (
            <Image src={employer_logo} alt={`${employer_name} logo`} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-gray font-bold text-lg">
              {employer_name?.[0] || '?'}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col sm:flex-row justify-between gap-stack-md">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
            <Link href={`/jobs/${job_id}`}>
  <h3 className="font-headline-md text-[20px] text-on-surface group-hover:text-electric-blue transition-colors">
    {job_title}
  </h3>
</Link>
              {matchScore != null && (
                <span className="px-2 py-0.5 bg-match-success/10 text-match-success text-[12px] font-bold rounded uppercase tracking-wider">
                  {matchScore}% Match
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-gray text-body-sm mb-4">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">corporate_fare</span>
                {employer_name}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                {job_city ? `${job_city}, ${country}` : country}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {job_employment_type && (
                <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant text-[12px] font-medium rounded-full">
                  {job_employment_type}
                </span>
              )}
            </div>
          </div>

          <div className="flex sm:flex-col justify-between items-end gap-2">
            <span className="text-body-sm text-slate-gray">{timeAgo(fetched_at)}</span>
            <Link
              href={apply_link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-electric-blue text-white px-5 py-2 rounded-lg font-button text-button hover:bg-secondary transition-all"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}