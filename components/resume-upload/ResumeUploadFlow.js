'use client';

import { useState } from 'react';
import { uploadResume } from '@/lib/apiClient';
import UploadFlowHeader from './UploadFlowHeader';
import UploadStep from './UploadStep';
import AnalyzingStep from './AnalyzingStep';
import VerifyStep from './VerifyStep';

/**
 * Shell for the 3-step resume upload flow (Upload -> Analyzing -> Verify).
 * Owns the one real async operation shared by Steps 1 and 2 — POST
 * /resume/upload — so Analyzing can be shown purely as a function of "that
 * request is in flight," regardless of which step triggered it.
 *
 * Step 3 owns its own header/layout (it needs "Step 3 of 3" + Save & Exit,
 * a wide two-column grid, and no footer) rather than sharing the frame
 * Steps 1-2 use, so it renders standalone once a resume is parsed.
 */
export default function ResumeUploadFlow() {
  const [step, setStep] = useState('upload'); // 'upload' | 'analyzing' | 'verify'
  const [resume, setResume] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const handleFileSelected = async (file) => {
    setUploadError(null);
    setStep('analyzing');

    try {
      const { resume: parsed } = await uploadResume(file);
      setResume(parsed);
      setStep('verify');
    } catch (err) {
      setUploadError(err.message || 'Failed to analyze resume. Please try again.');
      setStep('upload');
    }
  };

  if (step === 'verify' && resume) {
    return <VerifyStep resume={resume} />;
  }

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col">
      <UploadFlowHeader />

      <main className="flex-grow flex items-center justify-center p-6 md:p-gutter">
        <div className="w-full max-w-2xl mx-auto">
          {step === 'upload' && (
            <UploadStep
              onFileSelected={handleFileSelected}
              uploadError={uploadError}
              onDismissUploadError={() => setUploadError(null)}
            />
          )}
          {step === 'analyzing' && <AnalyzingStep />}
        </div>
      </main>

      <footer className="w-full bg-surface-container-low border-t border-border-subtle py-6 text-center">
        <p className="font-body-sm text-body-sm text-slate-gray">
          © {new Date().getFullYear()} JobMatch AI. Precision matching for professionals.
        </p>
      </footer>
    </div>
  );
}
