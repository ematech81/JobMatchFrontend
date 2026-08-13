'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/auth/RequireAuth';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import JobCard from '@/components/jobs/JobCard.jsx';
import Footer from '@/components/landing/Footer';
import { getSavedJobs, unsaveJob, ApiError } from '@/lib/apiClient';
import { redirectForAccessError } from '@/lib/accessGate';

function SavedJobsContent() {
  const router = useRouter();
  const [jobs, setJobs] = useState(null);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const load = useCallback(() => {
    return getSavedJobs()
      .then(({ jobs }) => setJobs(jobs || []))
      .catch((err) => {
        if (redirectForAccessError(err, router)) return;
        setError(err instanceof ApiError ? err.message : 'Failed to load saved jobs.');
      });
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRemove = async (jobId) => {
    setRemovingId(jobId);
    setError(null);
    try {
      await unsaveJob(jobId);
      setJobs((prev) => prev.filter((j) => j.job_id !== jobId));
    } catch (err) {
      setError(err.message || 'Failed to remove job. Please try again.');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <>
      <DashboardHeader />

      <main className="max-w-container-max mx-auto px-4 md:px-margin-mobile py-stack-lg pt-24 min-h-screen">
        <header className="mb-stack-lg">
          <h1 className="font-headline-lg text-headline-lg text-deep-navy">Saved Jobs</h1>
          <p className="text-slate-gray font-body-md mt-1">
            {jobs?.length
              ? `${jobs.length} job${jobs.length === 1 ? '' : 's'} saved for later.`
              : 'Jobs you save for later show up here.'}
          </p>
        </header>

        {error && <p className="text-error text-body-md py-stack-lg text-center">{error}</p>}

        {!error && jobs === null && (
          <p className="text-slate-gray text-body-md py-stack-lg text-center">Loading saved jobs…</p>
        )}

        {jobs?.length === 0 && (
          <div className="flex flex-col items-center text-center py-stack-lg gap-stack-md">
            <span className="material-symbols-outlined text-slate-gray text-5xl">bookmark_border</span>
            <p className="text-slate-gray text-body-md">
              You haven&apos;t saved any jobs yet. Save one from a listing to find it here.
            </p>
            <Link
              href="/jobs/search"
              className="bg-electric-blue text-white px-8 py-3 rounded-lg font-button text-button hover:shadow-lg transition-all"
            >
              Browse jobs
            </Link>
          </div>
        )}

        {jobs?.length > 0 && (
          <div className="grid gap-stack-md">
            {jobs.map((job) => (
              <JobCard
                key={job.job_id || job._id}
                job={job}
                onRemove={handleRemove}
                removing={removingId === job.job_id}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default function SavedJobsPage() {
  return (
    <RequireAuth>
      <SavedJobsContent />
    </RequireAuth>
  );
}
