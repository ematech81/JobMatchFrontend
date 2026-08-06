'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, getSavedJobs, saveJob } from '@/lib/apiClient';

export default function JobActions({ jobId, applyLink }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Reflect jobs the user already saved, so a revisit doesn't offer to
  // re-save something that is already in their list.
  useEffect(() => {
    if (!getToken()) return;

    let cancelled = false;
    getSavedJobs()
      .then(({ jobs }) => {
        if (!cancelled && jobs?.some((j) => j.job_id === jobId)) setSaved(true);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [jobId]);

  const handleSave = async () => {
    if (!getToken()) {
      router.push(`/login?redirect=${encodeURIComponent(`/jobs/${jobId}`)}`);
      return;
    }

    setSaving(true);
    try {
      await saveJob(jobId);
      setSaved(true);
    } catch (err) {
      console.error('Save failed:', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-stack-lg flex flex-col sm:flex-row items-stretch sm:items-center gap-stack-md">
      <a
        href={applyLink || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="shimmer-btn bg-electric-blue text-white px-8 py-3 rounded-lg font-button text-button hover:shadow-lg transition-all text-center"
      >
        Apply Now
      </a>
      <button
        onClick={handleSave}
        disabled={saving || saved}
        className="border-2 border-electric-blue text-electric-blue px-8 py-3 rounded-lg font-button text-button hover:bg-surface-container-low transition-all disabled:opacity-60"
      >
        {saved ? 'Saved ✓' : saving ? 'Saving...' : 'Save for Later'}
      </button>
    </div>
  );
}