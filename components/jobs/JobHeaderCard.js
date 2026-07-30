import Image from 'next/image';
import { formatLocation, formatSalary, extractSkills } from '@/lib/format';

export default function JobHeaderCard({ job }) {
  const salary = formatSalary(job);
  const location = formatLocation(job);
  const skills = extractSkills(job);

  return (
    <section className="bg-surface-container-lowest border border-border-subtle p-stack-lg rounded-xl">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-stack-md">
        <div className="flex gap-stack-md items-start">
          <div className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center overflow-hidden border border-border-subtle relative shrink-0">
            {job.employer_logo ? (
              <Image
                src={job.employer_logo}
                alt={`${job.employer_name} logo`}
                width={48}
                height={48}
                className="object-contain"
              />
            ) : (
              <span className="text-slate-gray font-bold text-xl">
                {job.employer_name?.[0] || '?'}
              </span>
            )}
          </div>

          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              {job.job_title}
            </h1>
            <div className="flex items-center gap-stack-sm mt-base flex-wrap">
              <span className="text-secondary font-bold font-headline-md text-headline-md">
                {job.employer_name}
              </span>
              {location && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-gray" />
                  <span className="text-slate-gray">{location}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-stack-sm shrink-0">
          {job.job_employment_type && (
            <span className="font-label-md text-label-md px-3 py-1 bg-surface-container-high text-primary rounded-full border border-border-subtle w-fit">
              {job.job_employment_type}
            </span>
          )}
          {salary && (
            <span className="text-match-success font-bold font-headline-md text-headline-md">
              {salary}
            </span>
          )}
        </div>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-stack-sm mt-stack-md">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed rounded-lg text-body-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}