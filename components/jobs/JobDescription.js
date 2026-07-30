import JobActions from './JobActions';

export default function JobDescription({ job }) {
  const highlights = job.job_highlights || {};
  const hasHighlights =
    highlights.Responsibilities?.length ||
    highlights.Qualifications?.length ||
    highlights.Benefits?.length;

  return (
    <section className="bg-surface-container-lowest border border-border-subtle p-stack-lg rounded-xl">
      <h2 className="font-headline-md text-headline-md text-primary mb-stack-md">
        Job Description
      </h2>

      <div className="space-y-stack-md text-slate-gray font-body-md text-body-md leading-relaxed">
        {job.job_description && (
          <div className="whitespace-pre-line">
            {hasHighlights ? job.job_description.slice(0, 800) : job.job_description}
          </div>
        )}

        {highlights.Responsibilities?.length > 0 && (
          <>
            <h3 className="text-primary font-bold mt-stack-md">Responsibilities</h3>
            <ul className="list-disc pl-5 space-y-base">
              {highlights.Responsibilities.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </>
        )}

        {highlights.Qualifications?.length > 0 && (
          <>
            <h3 className="text-primary font-bold mt-stack-md">Requirements</h3>
            <ul className="list-disc pl-5 space-y-base">
              {highlights.Qualifications.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </>
        )}

        {highlights.Benefits?.length > 0 && (
          <>
            <h3 className="text-primary font-bold mt-stack-md">Benefits</h3>
            <ul className="list-disc pl-5 space-y-base">
              {highlights.Benefits.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      <JobActions jobId={job.job_id} applyLink={job.apply_link} />
    </section>
  );
}
