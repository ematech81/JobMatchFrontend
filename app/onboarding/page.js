import RequireAuth from '@/components/auth/RequireAuth';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import ResumeUploadCard from '@/components/onboarding/ResumeUploadCard';
import GuidedPathCard from '@/components/onboarding/GuidedPathCard';
import TrustSection from '@/components/onboarding/TrustSection';
import Footer from '@/components/landing/Footer';

export const metadata = {
  title: 'Set Up Your Resume',
  description: 'Upload your resume or build one manually to start getting matched with jobs.',
  robots: { index: false, follow: false },
};

export default function OnboardingPage() {
  return (
    <RequireAuth>
      <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
        <OnboardingHeader />

        <main className="flex-grow pt-24 pb-16 px-4 md:px-margin-mobile">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-stack-lg">
              <h1 className="font-display-lg text-display-lg text-primary mb-4">
                Let&apos;s build your professional profile
              </h1>
              <p className="font-body-lg text-body-lg text-slate-gray max-w-2xl mx-auto">
                Choose how you want to share your experience. Our AI will analyze your details to find
                high-precision job matches instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg max-w-5xl mx-auto">
              <ResumeUploadCard />
              <GuidedPathCard />
            </div>

            <TrustSection />
          </div>
        </main>

        <Footer />
      </div>
    </RequireAuth>
  );
}