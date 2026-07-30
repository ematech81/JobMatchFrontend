import JobsHeader from '@/components/jobs/JobsHeader';
import FilterSidebar from '@/components/jobs/FilterSidebar';
import SortDropdown from '@/components/jobs/SortDropdown';
import JobCard from '@/components/jobs/JobCard';
import Pagination from '@/components/jobs/Pagination';
import MatchToast from '@/components/jobs/MatchToast';
import Footer from '@/components/landing/Footer';
import { fetchJobsByCountry } from '@/lib/api';

export async function generateMetadata({ searchParams }) {
  const { country = 'Remote' } = await searchParams;

  return {
    title: `Jobs in ${country} | JobMatch`,
    description: `Browse the latest job openings in ${country}. Find full-time, contract, and remote roles matched to your skills on JobMatch.`,
    openGraph: {
      title: `Jobs in ${country} | JobMatch`,
      description: `Browse the latest job openings in ${country} on JobMatch.`,
      url: `https://jobmatch.com/jobs/search?country=${encodeURIComponent(country)}`,
    },
  };
}

export default async function JobSearchPage({ searchParams }) {
  const params = await searchParams;
  const country = params.country || 'United Kingdom';
  const page = Number(params.page) || 1;

  const { jobs, count } = await fetchJobsByCountry({ country, page });

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
                  Jobs in <span className="text-electric-blue">{country}</span>
                </h1>
                <p className="text-slate-gray text-body-md mt-1">
                  Found {count.toLocaleString()} matching roles for your criteria
                </p>
              </div>
              <SortDropdown />
            </header>

            <div className="grid gap-stack-md">
              {jobs.length === 0 && (
                <p className="text-slate-gray text-body-md py-stack-lg text-center">
                  No jobs found for {country} yet. Check back soon.
                </p>
              )}

              {jobs.map((job) => (
                <JobCard key={job.job_id || job._id} job={job} />
              ))}

              {jobs.length > 0 && (
                <Pagination currentPage={page} country={country} />
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