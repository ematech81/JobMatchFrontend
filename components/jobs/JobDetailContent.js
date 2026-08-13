'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import JobDetailHeader from './JobDetailHeader';
import Breadcrumbs from './Breadcrumbs';
import JobHeaderCard from './JobHeaderCard';
import JobDescription from './JobDescription';
import MatchAnalysis from './MatchAnalysis';
import CompanyInfo from './CompanyInfo';
import SimilarJobs from './SimilarJobs';
import SlimFooter from '@/components/layout/SlimFooter';
import { getJobDetail, getSimilarJobsForJob, ApiError } from '@/lib/apiClient';
import { redirectForAccessError } from '@/lib/accessGate';

/**
 * Client component — same reasoning as JobSearchContent. A single job's
 * data now requires auth + resume + an active subscription, which a Server
 * Component can't attach (the JWT lives in localStorage, browser-only).
 * This also means the JobPosting JSON-LD / dynamic generateMetadata the old
 * Server Component version had are gone: they only mattered for public
 * crawling, and this page is no longer reachable by anyone who isn't
 * logged in, onboarded, and subscribed.
 */
export default function JobDetailContent() {
  const { jobId } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Resets are this new fetch's starting state, not a response to some
    // later event — jobId changing (e.g. clicking a Similar Roles link) must
    // clear the previous job immediately or its content would flash stale
    // while the new one loads.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJob(null);
    setError(null);
    setNotFound(false);

    getJobDetail(jobId)
      .then(({ job }) => {
        if (cancelled) return;
        setJob(job);
        return getSimilarJobsForJob(jobId)
          .then(({ jobs }) => {
            if (!cancelled) setSimilarJobs(jobs || []);
          })
          .catch(() => {
            // Similar jobs are a bonus panel, not the page itself — a
            // failure here shouldn't block the job the user actually opened.
          });
      })
      .catch((err) => {
        if (cancelled) return;
        if (redirectForAccessError(err, router)) return;
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
          return;
        }
        setError(err.message || 'Failed to load this job.');
      });

    return () => {
      cancelled = true;
    };
  }, [jobId, router]);

  if (notFound) {
    return (
      <>
        <JobDetailHeader />
        <main className="max-w-container-max mx-auto px-margin-mobile py-stack-lg min-h-[60vh] flex flex-col items-center justify-center text-center">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-stack-md">Job not found</h1>
          <p className="text-slate-gray text-body-md mb-stack-lg">
            This role may have been filled or removed.
          </p>
          <Link
            href="/jobs/search"
            className="bg-electric-blue text-white px-8 py-3 rounded-lg font-button text-button hover:shadow-lg transition-all"
          >
            Browse all jobs
          </Link>
        </main>
        <SlimFooter />
      </>
    );
  }

  if (error) {
    return (
      <>
        <JobDetailHeader />
        <main className="max-w-container-max mx-auto px-margin-mobile py-stack-lg min-h-[60vh] flex items-center justify-center text-center">
          <p className="text-error text-body-md">{error}</p>
        </main>
        <SlimFooter />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <JobDetailHeader />
        <main className="max-w-container-max mx-auto px-margin-mobile py-stack-lg min-h-[60vh] flex items-center justify-center">
          <span className="material-symbols-outlined animate-spin text-electric-blue text-4xl">
            progress_activity
          </span>
        </main>
        <SlimFooter />
      </>
    );
  }

  return (
    <>
      <JobDetailHeader />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-stack-lg">
        <Breadcrumbs jobTitle={job.job_title} country={job.country} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg items-start">
          <div className="lg:col-span-8 space-y-stack-lg">
            <JobHeaderCard job={job} />
            <JobDescription job={job} />
          </div>

          <aside className="lg:col-span-4 space-y-stack-lg">
            <MatchAnalysis jobId={job.job_id} employerName={job.employer_name} />
            <CompanyInfo job={job} />
            <SimilarJobs jobs={similarJobs} />
          </aside>
        </div>
      </main>

      <SlimFooter />
    </>
  );
}
