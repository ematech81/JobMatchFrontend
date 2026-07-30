'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export default function JobActions({ jobId, applyLink }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push(`/login?redirect=/jobs/${jobId}`);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/jobs/${jobId}/save`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setSaved(true);
    } catch (err) {
      console.error('Save failed:', err);
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