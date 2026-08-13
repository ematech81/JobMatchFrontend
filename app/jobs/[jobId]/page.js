import RequireAuth from '@/components/auth/RequireAuth';
import JobDetailContent from '@/components/jobs/JobDetailContent';

// Gated content — not indexable. See the comment on app/jobs/search/page.js.
export const metadata = {
  title: 'Job Details',
  robots: { index: false, follow: false },
};

export default function JobDetailPage() {
  return (
    <RequireAuth>
      <JobDetailContent />
    </RequireAuth>
  );
}
