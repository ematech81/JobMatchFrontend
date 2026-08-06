'use client';

import { useState } from 'react';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];
const MAX_SIZE = 10 * 1024 * 1024;

function validateFile(candidate) {
  if (!ACCEPTED_TYPES.includes(candidate.type)) {
    return 'Please upload a PDF or DOCX file.';
  }
  if (candidate.size > MAX_SIZE) {
    return 'File must be under 10MB.';
  }
  return null;
}

/**
 * Step 1 of 3 — Upload your Resume.
 *
 * Purely the picker: validates the file client-side and hands it to
 * `onFileSelected`. The actual upload + parse call now lives in
 * ResumeUploadFlow, since that request's wait time is what Step 2
 * (Analyzing) is shown against.
 *
 * `uploadError` carries a failure message back from that request (e.g. the
 * parser rejected the file) — shown the same way as a local validation
 * error. `onDismissUploadError` clears it when the user retries.
 */
export default function UploadStep({ onFileSelected, uploadError, onDismissUploadError }) {
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState(null);

  const error = localError || uploadError;
  const phase = error ? 'error' : 'idle';

  const handleFile = (candidate) => {
    if (!candidate) return;

    const validationError = validateFile(candidate);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setLocalError(null);
    onFileSelected(candidate);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (phase !== 'idle') return;
    handleFile(e.dataTransfer.files?.[0]);
  };

  const reset = () => {
    setLocalError(null);
    onDismissUploadError?.();
  };

  return (
    <div className="flex flex-col gap-stack-lg">
      {/* Progress Indicator */}
      <div className="flex flex-col gap-stack-sm w-full">
        <div className="flex justify-between items-end mb-2">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-deep-navy">
            Upload your Resume
          </h1>
          <span className="font-label-md text-label-md text-slate-gray">Step 1 of 3</span>
        </div>
        <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-electric-blue to-secondary rounded-full w-1/3 transition-all duration-500 ease-out" />
        </div>
      </div>

      {/* Upload Area Container */}
      <div className="bg-white border border-border-subtle rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div
          onDragEnter={(e) => { e.preventDefault(); if (phase === 'idle') setDragging(true); }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center
            relative transition-colors duration-200 group
            ${dragging ? 'border-electric-blue bg-blue-50' : 'border-outline-variant'}
            ${phase === 'idle' ? 'cursor-pointer hover:border-electric-blue hover:bg-slate-50' : ''}
          `}
        >
          {phase === 'idle' && (
            <input
              accept=".pdf,.doc,.docx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              type="file"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          )}

          {phase === 'idle' && (
            <>
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span
                  className="material-symbols-outlined text-electric-blue text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  cloud_upload
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-deep-navy mb-2">
                Drag and drop your resume
              </h3>
              <p className="font-body-sm text-body-sm text-slate-gray mb-6">
                Supported formats: PDF, DOCX (Max 10MB)
              </p>
              <button
                type="button"
                className="bg-electric-blue hover:bg-secondary-container text-white font-button text-button py-2 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 pointer-events-none"
              >
                <span className="material-symbols-outlined text-[20px]">upload_file</span>
                Browse Files
              </button>
            </>
          )}

          {phase === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-error text-3xl">error</span>
              </div>
              <p className="font-body-sm text-body-sm text-error max-w-sm">{error}</p>
              <button
                type="button"
                onClick={reset}
                className="border border-border-subtle text-deep-navy font-button text-button py-2 px-6 rounded-lg hover:bg-surface-container-low transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="h-px bg-border-subtle flex-1" />
          <span className="font-label-md text-label-md text-slate-gray uppercase">or</span>
          <div className="h-px bg-border-subtle flex-1" />
        </div>

        {/* Alternative Action — not wired to a real LinkedIn OAuth flow yet;
            the app has no LinkedIn integration anywhere else either (see
            SocialLoginButtons), so this stays a visual placeholder for now. */}
        <button
          type="button"
          disabled
          title="Coming soon"
          className="w-full border border-electric-blue text-electric-blue font-button text-button py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 opacity-60 cursor-not-allowed"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            work
          </span>
          Import from LinkedIn
        </button>
      </div>

      {/* Contextual Help / Trust Indicator */}
      <div className="flex items-start gap-3 bg-surface-container-low p-4 rounded-lg">
        <span className="material-symbols-outlined text-match-success mt-0.5">verified_user</span>
        <div>
          <p className="font-label-md text-label-md text-deep-navy mb-1">Your data is secure</p>
          <p className="font-body-sm text-body-sm text-slate-gray">
            We use industry-standard encryption to protect your personal information. We never share
            your resume without your explicit consent.
          </p>
        </div>
      </div>
    </div>
  );
}
