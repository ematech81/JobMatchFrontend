import Image from 'next/image';
import Link from 'next/link';
import RegisterHero from '@/components/auth/RegisterHero';
import SocialSignupButtons from '@/components/auth/SocialSignupButtons';
import RegisterForm from '@/components/auth/RegisterForm';
import CorporateFooter from '@/components/auth/CorporateFooter';
import RedirectIfAuthed from '@/components/auth/RedirectIfAuthed';

export const metadata = {
  title: 'Create an Account',
  description: 'Join JobMatch to get AI-matched with jobs based on your resume or skills.',
  robots: { index: false, follow: false },
};

const LOGO_URL = '/jobMatch-logo.png';

export default function RegisterPage() {
  return (
    <RedirectIfAuthed>
      <div className="bg-surface min-h-screen flex flex-col font-body-md text-on-surface">
        <main className="flex-grow flex items-center justify-center py-stack-lg px-margin-mobile md:px-gutter">
          <div className="w-full max-w-[1200px] grid md:grid-cols-2 gap-stack-lg items-center">
            <RegisterHero />

            <div className="w-full max-w-md mx-auto md:ml-auto">
              <div className="bg-white border border-border-subtle rounded-xl shadow-lg p-8 md:p-10 transition-all duration-300 hover:shadow-xl">
                <div className="md:hidden flex flex-col items-center mb-stack-lg">
                  <Image src={LOGO_URL} alt="JobMatch Logo" width={40} height={40} className="h-10 w-10 mb-2" />
                  <h2 className="font-headline-md text-headline-md text-primary">Join JobMatch</h2>
                  <p className="font-body-sm text-slate-gray text-center mt-1">
                    Join 2 million+ professionals matching with their dream roles.
                  </p>
                </div>

                <div className="hidden md:block mb-8">
                  <h2 className="font-headline-md text-headline-md text-primary">Create an account</h2>
                  <p className="font-body-sm text-slate-gray mt-1">
                    Get started with your professional journey.
                  </p>
                </div>

                <SocialSignupButtons />

                <div className="relative mb-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-subtle" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-gray font-label-md text-label-md">
                      OR CONTINUE WITH EMAIL
                    </span>
                  </div>
                </div>

                <RegisterForm />

                <div className="mt-8 text-center">
                  <p className="font-body-sm text-slate-gray">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="text-electric-blue font-semibold hover:underline decoration-2 underline-offset-4 transition-all"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>

                <p className="mt-6 text-[10px] text-center text-slate-gray/70 leading-relaxed">
                  By creating an account, you agree to our{' '}
                  <Link href="/terms" className="underline">Terms of Service</Link> and{' '}
                  <Link href="/privacy" className="underline">Privacy Policy</Link>.
                </p>
              </div>
            </div>
          </div>
        </main>

        <CorporateFooter />
      </div>
    </RedirectIfAuthed>
  );
}
