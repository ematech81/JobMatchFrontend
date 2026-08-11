'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const JOB_TYPES = ['Full-time', 'Contract', 'Remote'];
const INDUSTRIES = ['Technology', 'Finance', 'Design'];

export default function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggleParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    const existing = params.getAll(key);

    if (existing.includes(value)) {
      params.delete(key);
      existing.filter((v) => v !== value).forEach((v) => params.append(key, v));
    } else {
      params.append(key, value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const setDatePosted = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('datePosted', value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    const country = searchParams.get('country');
    router.push(`${pathname}?${country ? `country=${country}` : ''}`);
  };

  const isChecked = (key, value) => searchParams.getAll(key).includes(value);

  return (
    <aside className="w-full md:w-72 shrink-0">
      <div className="sticky top-24 flex flex-col gap-stack-lg">
        <h2 className="font-headline-md text-headline-md text-on-surface">Filters</h2>

        <div className="space-y-stack-md">
          <div>
            <h3 className="font-label-md text-label-md text-slate-gray uppercase mb-3">
              Job Type
            </h3>
            <div className="space-y-2">
              {JOB_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isChecked('jobType', type)}
                    onChange={() => toggleParam('jobType', type)}
                    className="w-5 h-5 rounded border-outline text-electric-blue focus:ring-electric-blue"
                  />
                  <span className="text-body-md text-on-surface group-hover:text-electric-blue transition-colors">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-stack-md border-t border-border-subtle">
            <h3 className="font-label-md text-label-md text-slate-gray uppercase mb-3">
              Industry
            </h3>
            {/* Cached jobs have no industry field to filter on at all (not
                just unwired — the data doesn't exist), unlike Job Type and
                Date Posted, which are real fields. Disabled rather than left
                silently non-functional; inferring industry from job
                title/description would be exactly the kind of unreliable
                keyword-matching heuristic already known to misfire (see the
                resume skill-extraction noise). */}
            <div className="space-y-2">
              {INDUSTRIES.map((industry) => (
                <label
                  key={industry}
                  title="Coming soon"
                  className="flex items-center gap-3 opacity-50 cursor-not-allowed"
                >
                  <input
                    type="checkbox"
                    disabled
                    className="w-5 h-5 rounded border-outline text-electric-blue"
                  />
                  <span className="text-body-md text-on-surface">{industry}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-stack-md border-t border-border-subtle">
            <h3 className="font-label-md text-label-md text-slate-gray uppercase mb-3">
              Date Posted
            </h3>
            <select
              className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-3 py-2 text-body-md focus:ring-2 focus:ring-electric-blue/20"
              value={searchParams.get('datePosted') || 'Last 7 days'}
              onChange={(e) => setDatePosted(e.target.value)}
            >
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>All time</option>
            </select>
          </div>
        </div>

        <button
          onClick={resetFilters}
          className="text-slate-gray hover:text-error text-body-sm font-medium flex items-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">filter_list_off</span>
          Reset all filters
        </button>
      </div>
    </aside>
  );
}