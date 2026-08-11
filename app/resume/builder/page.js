'use client';

import RequireAuth from '@/components/auth/RequireAuth';
import { ResumeBuilderProvider, useResumeBuilder } from '@/lib/ResumeBuilderContext';
import BuilderHeader from '@/components/resume-builder/BuilderHeader';
import Stepper from '@/components/resume-builder/Stepper';
import DecorativeBackground from '@/components/resume-builder/DecorativeBackground';
import PersonalInfoStep from '@/components/resume-builder/PersonalInfoStep';
import ExperienceStep from '@/components/resume-builder/ExperienceStep';
import EducationStep from '@/components/resume-builder/EducationStep';
import SkillsStep from '@/components/resume-builder/SkillsStep';
import ReviewStep from '@/components/resume-builder/ReviewStep';
import MatchTips from '@/components/resume-builder/MatchTips';
import Footer from '@/components/landing/Footer';

function BuilderContent() {
  const { step, loadingExisting } = useResumeBuilder();

  if (loadingExisting) {
    return (
      <main className="flex-grow w-full flex items-center justify-center min-h-[400px]">
        <span className="material-symbols-outlined animate-spin text-electric-blue text-4xl">
          progress_activity
        </span>
      </main>
    );
  }

  return (
    <main className="flex-grow w-full max-w-4xl mx-auto px-4 md:px-margin-mobile py-stack-lg flex flex-col items-center">
      <Stepper currentStep={step} />

      {step === 1 && <PersonalInfoStep />}
      {step === 2 && (
        <>
          <ExperienceStep />
          <MatchTips />
        </>
      )}
      {step === 3 && <EducationStep />}
      {step === 4 && <SkillsStep />}
      {step === 5 && <ReviewStep />}

      <DecorativeBackground />
    </main>
  );
}

export default function ResumeBuilderPage() {
  return (
    <RequireAuth>
      <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md">
        <BuilderHeader />
        <ResumeBuilderProvider>
          <BuilderContent />
        </ResumeBuilderProvider>
        <Footer />
      </div>
    </RequireAuth>
  );
}