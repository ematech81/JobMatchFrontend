import Link from 'next/link';
import ProgressLoop from './ProgressLoop';

export default function GuidedPathCard() {
  return (
    <div className="group relative bg-deep-navy text-white rounded-xl p-stack-lg transition-all duration-300 hover:shadow-xl flex flex-col">
      <div className="mb-6">
        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white mb-4">
          <span className="material-symbols-outlined text-3xl">psychology</span>
        </div>
        <h2 className="font-headline-md text-headline-md mb-2">Guided Experience</h2>
        <p className="text-white/70 font-body-md">
          Perfect for fresh starts or career changers. Our AI agent will interview you about your strengths.
        </p>
      </div>

      <div className="flex-grow bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col justify-center items-center gap-6">
        <ProgressLoop />
        <Link
          href="/resume/builder"
          className="w-full py-4 bg-white text-deep-navy font-button text-button rounded-lg hover:bg-surface-bright transition-colors flex items-center justify-center gap-2"
        >
          Start Guided Q&amp;A
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-match-success mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <p className="text-body-sm text-white/70">Uncover &quot;hidden&quot; skills through behavioral prompts.</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-match-success mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <p className="text-body-sm text-white/70">Best for maximizing your JobMatch compatibility score.</p>
        </div>
      </div>
    </div>
  );
}