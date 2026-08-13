'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import JobsHeader from './JobsHeader';
import FilterSidebar from './FilterSidebar';
import SortDropdown from './SortDropdown';
import JobCard from './JobCard.jsx';
import Pagination from './Pagination';
import MatchToast from './MatchToast';
import Footer from '@/components/landing/Footer';
import { searchJobs, ApiError } from '@/lib/apiClient';
import { redirectForAccessError } from '@/lib/accessGate';

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Client component, not a Server Component reading `searchParams` — job
 * search now requires auth + resume + an active subscription (see
 * requireResume/requireActiveSubscription on the API), and a Server
 * Component page has no access to the browser-only JWT to send with its
 * fetch. This used to fetch unauthenticated via lib/api.js; that was the
 * actual hole behind "Find Jobs shows real data to anyone."
 */
export default function JobSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();

  const country = searchParams.get('country') || '';
  const page = Number(searchParams.get('page')) || 1;
  const jobType = toArray(searchParams.getAll('jobType'));
  const datePosted = searchParams.get('datePosted') || undefined;

  const [jobs, setJobs] = useState(null);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    // Same reasoning as JobDetailContent: this is the new fetch's starting
    // state, not a response to a later event — searchKey changing (filters,
    // pagination) must clear the previous results immediately.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJobs(null);
    setError(null);

    searchJobs({ country, page, jobType, datePosted })
      .then((data) => {
        if (cancelled) return;
        setJobs(data.jobs || []);
        setCount(data.count || 0);
      })
      .catch((err) => {
        if (cancelled) return;
        if (redirectForAccessError(err, router)) return;
        setError(err instanceof ApiError ? err.message : 'Failed to load jobs.');
        setJobs([]);
      });

    return () => {
      cancelled = true;
    };
    // Re-derives country/page/jobType/datePosted fresh from searchParams
    // every render; searchKey alone is what should trigger a refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey, router]);

  return (
    <>
      <JobsHeader initialCountry={country} />

      <main className="max-w-container-max mx-auto px-4 md:px-margin-mobile py-stack-lg min-h-screen">
        <div className="flex flex-col md:flex-row gap-gutter">
          <FilterSidebar />

          <div className="flex-1">
            <header className="mb-stack-lg flex justify-between items-end">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface">
                  {country ? (
                    <>
                      Jobs in <span className="text-electric-blue">{country}</span>
                    </>
                  ) : (
                    'Jobs Worldwide'
                  )}
                </h1>
                <p className="text-slate-gray text-body-md mt-1">
                  {jobs === null
                    ? 'Loading…'
                    : `Found ${count.toLocaleString()} matching roles${
                        country ? ' for your criteria' : ' across every market — select a country above to narrow it down'
                      }`}
                </p>
              </div>
              <SortDropdown />
            </header>

            {error && <p className="text-error text-body-md py-stack-lg text-center">{error}</p>}

            <div className="grid gap-stack-md">
              {jobs?.length === 0 && !error && (
                <p className="text-slate-gray text-body-md py-stack-lg text-center">
                  {country
                    ? `No jobs found for ${country} yet. Check back soon.`
                    : 'No jobs cached yet. Check back soon, or search a specific country above.'}
                </p>
              )}

              {jobs?.map((job) => <JobCard key={job.job_id || job._id} job={job} />)}

              {jobs?.length > 0 && (
                <Pagination currentPage={page} country={country} jobType={jobType} datePosted={datePosted} />
              )}
            </div>
          </div>
        </div>
      </main>

      <MatchToast />
      <Footer />
    </>
  );
}
