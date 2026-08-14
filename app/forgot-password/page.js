import ForgotPasswordContent from '@/components/auth/ForgotPasswordContent';

export const metadata = {
  title: 'Forgot Password',
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordContent />;
}
