import Link from 'next/link';

/**
 * Entry point into the real upload flow (/resume/upload -> ResumeUploadFlow:
 * Upload -> Analyzing -> Verify -> /subscribe/scan), same pattern as the
 * "Build Manually" card linking to /resume/builder.
 *
 * This used to be its own self-contained drag-and-drop-and-upload widget
 * with a raw `fetch('/resume/upload')` and a hardcoded `router.push('/jobs/
 * search')` on success — a second, divergent implementation of the same
 * upload step. It bypassed the review step (VerifyStep) and the "we found
 * your matches" scan screen entirely, landing on /jobs/search directly,
 * which — now that job data is gated behind a subscription — just bounced
 * straight to plan selection. One real implementation of "upload a resume"
 * beats two that can drift apart.
 */
export default function ResumeUploadCard() {
  return (
    <div className="group relative bg-white border border-border-subtle rounded-xl p-stack-lg transition-all duration-300 hover:shadow-xl flex flex-col">
      <div className="mb-6">
        <div className="w-12 h-12 rounded-lg bg-electric-blue/10 flex items-center justify-center text-electric-blue mb-4">
          <span className="material-symbols-outlined text-3xl">upload_file</span>
        </div>
        <h2 className="font-headline-md text-headline-md text-primary mb-2">Upload Resume</h2>
        <p className="text-slate-gray font-body-md">
          Fast and easy. We&apos;ll parse your existing document and extract your core skills and history.
        </p>
      </div>

      <div className="flex-grow bg-surface-container-low/50 border border-border-subtle rounded-xl p-6 flex flex-col justify-center items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center">
          <span className="material-symbols-outlined text-electric-blue text-4xl group-hover:scale-110 transition-transform">
            cloud_upload
          </span>
        </div>
        <p className="text-body-sm text-slate-gray text-center">Supports PDF, DOCX (Max 10MB)</p>
        <Link
          href="/resume/upload"
          className="w-full py-4 bg-electric-blue text-white font-button text-button rounded-lg hover:bg-secondary-container transition-colors flex items-center justify-center gap-2"
        >
          Upload Resume
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-match-success mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <p className="text-body-sm text-slate-gray">Instant extraction of work history and skills.</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-match-success mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <p className="text-body-sm text-slate-gray">Auto-formatting for recruiter-ready views.</p>
        </div>
      </div>
    </div>
  );
}
