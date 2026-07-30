
import Link from 'next/link';
import { formatSalary } from '@/lib/format';

export default function SimilarJobs({ jobs }) {
  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="bg-surface-container-lowest border border-border-subtle p-stack-lg rounded-xl">
      <h3 className="font-headline-md text-headline-md text-primary mb-stack-md">
        Similar Roles
      </h3>

      <div className="space-y-stack-md">
        {jobs.map((job, i) => {
          const salary = formatSalary(job);
          return (
            <Link
              key={job.job_id}
              href={`/jobs/${job.job_id}`}
              className={`block group ${i > 0 ? 'border-t border-border-subtle pt-stack-md' : ''}`}
            >
              <div className="flex items-center gap-stack-sm">
                <div className="w-10 h-10 rounded bg-surface-container shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-gray">work</span>
                </div>
                <div>
                  <h4 className="font-bold text-body-md group-hover:text-secondary transition-colors">
                    {job.job_title}
                  </h4>
                  <span className="text-slate-gray text-body-sm">
                    {job.employer_name}
                    {salary ? ` • ${salary}` : ''}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}