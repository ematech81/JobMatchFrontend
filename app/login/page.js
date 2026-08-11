import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import LoginForm from '@/components/auth/LoginForm';
import RedirectIfAuthed from '@/components/auth/RedirectIfAuthed';

export const metadata = {
  title: 'Log In',
  description: 'Sign in to your JobMatch account to view your matches and manage your resume.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <RedirectIfAuthed>
      <AuthShell
        badge="Kinetic Talent System"
        headline="Precision Matching for the Modern Workforce."
        description="JobMatch uses deep learning to understand your career trajectory, not just your resume. Join 2.5M+ professionals advancing their careers today."
        stats={[
          ['98%', 'Match Accuracy'],
          ['14 Days', 'Avg. Time to Hire'],
        ]}
      >
        <div className="flex flex-col items-center md:items-start gap-stack-sm">
          <Image
            src="/jobMatch-logo.png"
            alt="JobMatch Logo"
            width={48}
            height={48}
            className="h-12 w-12 object-contain rounded-lg"
          />
          <div className="mt-4">
            <h1 className="font-headline-lg text-headline-lg text-primary">Welcome back</h1>
            <p className="text-slate-gray font-body-md mt-2">
              Sign in to your professional matching dashboard.
            </p>
          </div>
        </div>

        <SocialLoginButtons />

        <div className="relative flex items-center">
          <div className="flex-grow border-t border-border-subtle" />
          <span className="flex-shrink mx-4 text-slate-gray font-label-md text-label-md uppercase">
            Or continue with
          </span>
          <div className="flex-grow border-t border-border-subtle" />
        </div>

        {/* LoginForm reads the ?redirect= param, so it must not block prerender. */}
        <Suspense fallback={<div className="h-64" />}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-body-sm text-slate-gray">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-electric-blue font-bold hover:underline">
            Create an account
          </Link>
        </p>
      </AuthShell>
    </RedirectIfAuthed>
  );
}
