import Link from 'next/link';

export default function Pagination({ currentPage, country }) {
  const buildHref = (page) =>
    `/jobs/search?country=${encodeURIComponent(country)}&page=${page}`;

  const prevDisabled = currentPage <= 1;

  return (
    <div className="mt-stack-lg flex justify-center items-center gap-2">
      <Link
        href={prevDisabled ? '#' : buildHref(currentPage - 1)}
        aria-disabled={prevDisabled}
        className={`w-10 h-10 flex items-center justify-center rounded-lg border border-border-subtle transition-colors ${
          prevDisabled ? 'opacity-50 pointer-events-none' : 'hover:bg-surface-container'
        }`}
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </Link>

      <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-electric-blue text-white font-bold">
        {currentPage}
      </span>

      <Link
        href={buildHref(currentPage + 1)}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-subtle hover:bg-surface-container transition-colors"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </Link>
    </div>
  );
}