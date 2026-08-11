import Link from 'next/link';
import ProgressLoop from './ProgressLoop';

export default function GuidedPathCard() {
  return (
    <div className="group relative bg-deep-navy text-white rounded-xl p-stack-lg transition-all duration-300 hover:shadow-xl flex flex-col">
      <div className="mb-6">
        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white mb-4">
          <span className="material-symbols-outlined text-3xl">edit_document</span>
        </div>
        <h2 className="font-headline-md text-headline-md mb-2">Build Manually</h2>
        <p className="text-white/70 font-body-md">
          Prefer a blank slate? Fill in your experience and skills yourself, one step at a time.
        </p>
      </div>

      <div className="flex-grow bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col justify-center items-center gap-6">
        <ProgressLoop />
        <Link
          href="/resume/builder"
          className="w-full py-4 bg-white text-deep-navy font-button text-button rounded-lg hover:bg-surface-bright transition-colors flex items-center justify-center gap-2"
        >
          Start Building
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-match-success mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <p className="text-body-sm text-white/70">Full control over every detail on your resume.</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-match-success mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <p className="text-body-sm text-white/70">No file needed — start from a blank profile.</p>
        </div>
      </div>
    </div>
  );
}