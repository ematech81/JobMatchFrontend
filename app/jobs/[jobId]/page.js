import { notFound } from 'next/navigation';
import JobDetailHeader from '@/components/jobs/JobDetailHeader';
import Breadcrumbs from '@/components/jobs/Breadcrumbs';
import JobHeaderCard from '@/components/jobs/JobHeaderCard';
import JobDescription from '@/components/jobs/JobDescription';
import MatchAnalysis from '@/components/jobs/MatchAnalysis';
import CompanyInfo from '@/components/jobs/CompanyInfo';
import SimilarJobs from '@/components/jobs/SimilarJobs';
import SlimFooter from '@/components/layout/SlimFooter';
import { fetchJobById, fetchSimilarJobs } from '@/lib/api';
import { formatLocation, formatSalary } from '@/lib/format';

export async function generateMetadata({ params }) {
  const { jobId } = await params;
  const job = await fetchJobById(jobId);

  if (!job) {
    return { title: 'Job Not Found | JobMatch' };
  }

  const location = formatLocation(job);
  const title = `${job.job_title} at ${job.employer_name}`;
  const description =
    job.job_description?.slice(0, 155).replace(/\s+/g, ' ').trim() ||
    `Apply for ${job.job_title} at ${job.employer_name} in ${location}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/jobs/${job.job_id}`,
    },
    openGraph: {
      title: `${title} | JobMatch`,
      description,
      url: `https://jobmatch.com/jobs/${job.job_id}`,
      type: 'article',
      images: job.employer_logo ? [{ url: job.employer_logo }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | JobMatch`,
      description,
    },
  };
}

export default async function JobDetailPage({ params }) {
  const { jobId } = await params;

  const [job, similarJobs] = await Promise.all([
    fetchJobById(jobId),
    fetchSimilarJobs(jobId),
  ]);

  if (!job) notFound();

  // Google Jobs structured data — enables rich results in Google Search
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.job_title,
    description: job.job_description,
    datePosted: job.job_posted_at || job.fetched_at,
    employmentType: job.job_employment_type,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.employer_name,
      logo: job.employer_logo || undefined,
      sameAs: job.employer_website || undefined,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.job_city || undefined,
        addressRegion: job.job_state || undefined,
        addressCountry: job.country || undefined,
      },
    },
    ...(job.job_is_remote && { jobLocationType: 'TELECOMMUTE' }),
    ...(job.job_min_salary && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: job.job_salary_currency || 'USD',
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.job_min_salary,
          maxValue: job.job_max_salary,
          unitText: job.job_salary_period || 'YEAR',
        },
      },
    }),
    directApply: false,
    url: `https://jobmatch.com/jobs/${job.job_id}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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