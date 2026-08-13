import { Suspense } from 'react';
import VerifyEmailContent from '@/components/auth/VerifyEmailContent';

export const metadata = {
  title: 'Verify Your Email',
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
