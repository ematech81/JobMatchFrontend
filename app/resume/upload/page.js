import RequireAuth from '@/components/auth/RequireAuth';
import ResumeUploadFlow from '@/components/resume-upload/ResumeUploadFlow';

export const metadata = {
  title: 'Upload Your Resume',
  description: 'Upload your resume and let JobMatch AI extract your experience to find precision job matches.',
  robots: { index: false, follow: false },
};

export default function ResumeUploadPage() {
  return (
    <RequireAuth>
      <ResumeUploadFlow />
    </RequireAuth>
  );
}
