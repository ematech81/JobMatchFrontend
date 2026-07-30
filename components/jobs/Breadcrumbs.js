import Link from 'next/link';

export default function Breadcrumbs({ jobTitle, country }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-base text-slate-gray font-label-md text-label-md mb-stack-md flex-wrap"
    >
      <Link href="/jobs/search" className="hover:text-primary">
        Jobs
      </Link>
      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
      {country && (
        <>
          <Link
            href={`/jobs/search?country=${encodeURIComponent(country)}`}
            className="hover:text-primary"
          >
            {country}
          </Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </>
      )}
      <span className="text-primary font-bold">{jobTitle}</span>
    </nav>
  );
}