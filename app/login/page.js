import Image from 'next/image';
import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Log In',
  description: 'Sign in to your JobMatch account to view your matches and manage your resume.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
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
          src="https://lh3.googleusercontent.com/aida/AP1WRLs1zjOOjJfZ7yftrw8HMQMOrQKdLivYJcjd0fn7pKLVZoB0PgUJolCR2JvFrb65gUdzZ_OobAZcZvK3M8CZTThU_TZLb5R7m9p-ECrrA9SgeGDyZDfWkAGcjea1t_og3fhVuBceuu6tG7Iz2g8eassbFs3lSmOhj3fegYILM-B66dEdamGO7AjgE-nrsDs3zJezMH1ulDGBdxqGqRfzWrGbbsyGENEN40Ai0vSkPbeSHJGhe4w1DnaYdg"
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

      <LoginForm />

      <p className="text-center text-body-sm text-slate-gray">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-electric-blue font-bold hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}