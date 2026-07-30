'use client';

import RequireAuth from '@/components/auth/RequireAuth';
import { ResumeBuilderProvider, useResumeBuilder } from '@/lib/ResumeBuilderContext';
import BuilderHeader from '@/components/resume-builder/BuilderHeader';
import Stepper from '@/components/resume-builder/Stepper';
import DecorativeBackground from '@/components/resume-builder/DecorativeBackground';
import PersonalInfoStep from '@/components/resume-builder/PersonalInfoStep';
import ExperienceStep from '@/components/resume-builder/ExperienceStep';
import MatchTips from '@/components/resume-builder/MatchTips';
import Footer from '@/components/landing/Footer';

function BuilderContent() {
  const { step } = useResumeBuilder();

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
      {/* Step 3: EducationStep — added when converted */}
      {/* Step 4: SkillsStep — added when converted */}

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