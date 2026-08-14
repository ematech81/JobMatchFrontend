import { Suspense } from 'react';
import ResetPasswordContent from '@/components/auth/ResetPasswordContent';

export const metadata = {
  title: 'Reset Password',
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
