export default function CompanyInfo({ job }) {
    return (
      <div className="bg-surface-container-lowest border border-border-subtle p-stack-lg rounded-xl">
        <h3 className="font-headline-md text-headline-md text-primary mb-stack-md">
          About {job.employer_name}
        </h3>
  
        <div className="grid grid-cols-2 gap-stack-sm text-body-sm">
          <div>
            <span className="block text-slate-gray font-label-md text-label-md">Location</span>
            <span className="font-bold">{job.job_city || job.country || '—'}</span>
          </div>
          <div>
            <span className="block text-slate-gray font-label-md text-label-md">Employment</span>
            <span className="font-bold">{job.job_employment_type || '—'}</span>
          </div>
          <div className="mt-base">
            <span className="block text-slate-gray font-label-md text-label-md">Posted Via</span>
            <span className="font-bold">{job.job_publisher || '—'}</span>
          </div>
          <div className="mt-base">
            <span className="block text-slate-gray font-label-md text-label-md">Remote</span>
            <span className="font-bold">{job.job_is_remote ? 'Yes' : 'No'}</span>
          </div>
        </div>
  
        {job.employer_website && (
          <a
            href={job.employer_website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-stack-md inline-flex items-center gap-1 text-secondary font-bold text-body-sm hover:underline"
          >
            Visit website
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
        )}
      </div>
    );
  }