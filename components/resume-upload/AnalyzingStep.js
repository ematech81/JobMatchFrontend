'use client';

import { useEffect, useState } from 'react';

const STATUS_AT = {
  base: 'Extracting professional experience...',
  skills: 'Analyzing key skills...',
  finalizing: 'Finalizing Kinetic Profile...',
};

/**
 * Step 2 of 3 — Analyzing Profile.
 *
 * There's no real progress stream to bind to: POST /resume/upload is one
 * request that awaits the full Affinda parse server-side and returns the
 * finished result in a single response. This bar is a cosmetic "keep the
 * user engaged while we wait" simulation, same as the design — it ticks up
 * and holds at 95%, and this screen unmounts (on success or failure) once
 * ResumeUploadFlow's real request actually resolves.
 */
export default function AnalyzingStep() {
  const [progress, setProgress] = useState(65);
  const [statusText, setStatusText] = useState(STATUS_AT.base);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((current) => {
        if (current >= 95) return current;
        const next = Math.min(current + Math.floor(Math.random() * 3) + 1, 95);

        if (next >= 85) setStatusText(STATUS_AT.finalizing);
        else if (next > 75) setStatusText(STATUS_AT.skills);

        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center relative">
      {/* Subtle background decoration, scoped to this step */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-secondary-fixed/30 blur-[100px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary-fixed-dim/20 blur-[80px]" />
      </div>

      {/* Icon/Animation Focus */}
      <div className="mb-stack-lg relative w-32 h-32 flex items-center justify-center fade-in-up">
        <div className="absolute inset-0 rounded-full border border-electric-blue/20 loading-pulse" />
        <div
          className="absolute inset-2 rounded-full border border-electric-blue/30 loading-pulse"
          style={{ animationDelay: '-0.5s' }}
        />
        <div className="w-20 h-20 bg-surface-container-lowest rounded-2xl shadow-lg border border-border-subtle flex items-center justify-center relative overflow-hidden z-10">
          <span className="material-symbols-outlined text-[40px] text-electric-blue animate-pulse">
            description
          </span>
          <div className="scanner-line" />
        </div>
      </div>

      {/* Header Text */}
      <div className="text-center mb-stack-lg fade-in-up delay-100">
        <h1 className="text-headline-lg font-headline-lg text-deep-navy mb-2">Analyzing Profile</h1>
        <p className="text-body-lg font-body-lg text-slate-gray">
          Matching your experience against the Kinetic Talent System.
        </p>
      </div>

      {/* Progress Container */}
      <div className="w-full bg-surface-container-lowest p-8 rounded-xl border border-border-subtle shadow-[0px_4px_20px_rgba(15,23,42,0.08)] fade-in-up delay-200">
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <span className="text-label-md font-label-md text-deep-navy font-semibold uppercase tracking-wider">
              Overall Progress
            </span>
            <span className="text-headline-md font-headline-md text-electric-blue font-bold">
              {progress}%
            </span>
          </div>
          <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
            <div
              className="h-full bg-electric-blue rounded-full relative transition-[width] duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[progress-shimmer_2s_infinite]" />
              </div>
            </div>
          </div>
        </div>

        {/* Status Checklist */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-match-success/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[14px] text-match-success font-bold">check</span>
            </div>
            <p className="text-label-md font-label-md text-deep-navy flex-1">Document parsed successfully</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-match-success/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[14px] text-match-success font-bold">check</span>
            </div>
            <p className="text-label-md font-label-md text-deep-navy flex-1">Formatting contact details</p>
          </div>

          <div className="flex items-center gap-3 bg-surface p-3 rounded-lg border border-electric-blue/20">
            <div className="w-6 h-6 rounded-full border-2 border-electric-blue border-t-transparent animate-spin flex-shrink-0" />
            <p className="text-label-md font-label-md text-electric-blue font-semibold flex-1">{statusText}</p>
          </div>

          <div className="flex items-center gap-3 opacity-50">
            <div className="w-6 h-6 rounded-full border border-outline flex items-center justify-center flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-outline" />
            </div>
            <p className="text-label-md font-label-md text-slate-gray flex-1">Analyzing key skills for matching</p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-body-sm font-body-sm text-slate-gray text-center fade-in-up delay-300">
        This usually takes a few seconds. Please don&apos;t close this window.
      </p>
    </div>
  );
}
