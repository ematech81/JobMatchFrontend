import RequireAuth from '@/components/auth/RequireAuth';
import JobSearchContent from '@/components/jobs/JobSearchContent';

// Gated content — not indexable. See app/layout.js for the public-facing
// SEO surface (title/description/OG tags aimed at generic "job site"/"job
// search" queries); that's the page that can actually rank, since this one
// requires login + resume + an active subscription to ever load.
export const metadata = {
  title: 'Find Jobs',
  description: 'Browse open roles matched to your resume.',
  robots: { index: false, follow: false },
};

export default function JobSearchPage() {
  return (
    <RequireAuth>
      <JobSearchContent />
    </RequireAuth>
  );
}
