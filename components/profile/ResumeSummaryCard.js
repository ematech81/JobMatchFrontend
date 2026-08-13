'use client';

import { useState } from 'react';
import Link from 'next/link';
import { downloadResumePdf } from '@/lib/apiClient';
import { timeAgo } from '@/lib/format';

export default function ResumeSummaryCard({ resume }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      const blob = await downloadResumePdf();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resume?.fullName || 'resume'}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Failed to download resume.');
    } finally {
      setDownloading(false);
    }
  };

  if (!resume) {
    return (
      <section id="resume" className="bg-surface-container-lowest border border-border-subtle rounded-xl p-8 flex flex-col h-full scroll-mt-24">
        <h2 className="font-headline-md text-headline-md text-deep-navy mb-6">Resume</h2>
        <p className="text-body-md text-slate-gray mb-6">No resume on file yet.</p>
        <Link
          href="/onboarding"
          className="mt-auto py-2.5 bg-electric-blue text-white rounded-lg font-button text-body-sm flex items-center justify-center gap-2 hover:bg-secondary transition-all active:scale-95"
        >
          Add Resume
        </Link>
      </section>
    );
  }

  return (
    <section id="resume" className="bg-surface-container-lowest border border-border-subtle rounded-xl p-8 flex flex-col h-full scroll-mt-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-headline-md text-headline-md text-deep-navy">Resume</h2>
      </div>

      <div className="bg-surface-container-low rounded-lg p-4 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-error border border-border-subtle">
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            description
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-body-md font-semibold text-deep-navy truncate">
            {resume.originalFilename || `${resume.fullName || 'Resume'} (built manually)`}
          </p>
          <p className="text-body-sm text-slate-gray">Last updated {timeAgo(resume.updatedAt) || 'recently'}</p>
        </div>
      </div>

      {error && <p className="mb-4 text-error text-body-sm">{error}</p>}

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <Link
          href="/resume/builder?mode=edit"
          className="py-2.5 bg-electric-blue text-white rounded-lg font-button text-body-sm flex items-center justify-center gap-2 hover:bg-secondary transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">upload</span>
          Update
        </Link>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="py-2.5 border-2 border-border-subtle text-deep-navy rounded-lg font-button text-body-sm flex items-center justify-center gap-2 hover:bg-surface-container transition-all active:scale-95 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          {downloading ? 'Downloading…' : 'Download'}
        </button>
      </div>
    </section>
  );
}
