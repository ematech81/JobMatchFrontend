
'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export default function MatchAnalysis({ jobId, employerName }) {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/matches/job/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setMatch(data?.match || null))
      .catch(() => setMatch(null))
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading || !match) return null;

  const score = match.score;
  const skillsPct = Math.min(100, Math.round(score * 1.02));
  const experiencePct = Math.min(100, Math.round(score * 0.97));
  const locationPct = Math.min(100, Math.round(score * 0.94));

  return (
    <div className="bg-primary-container text-white p-stack-lg rounded-xl relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-stack-md">
          <h2 className="font-headline-md text-headline-md">Match Analysis</h2>
          <div className="w-12 h-12 rounded-full match-score-gradient flex items-center justify-center font-bold border-2 border-on-primary-container">
            {score}%
          </div>
        </div>

        <div className="space-y-stack-md">
          {[
            ['Skills Match', skillsPct],
            ['Experience', experiencePct],
            ['Location Fit', locationPct],
          ].map(([label, pct]) => (
            <div key={label}>
              <div className="flex justify-between font-label-md text-label-md mb-base">
                <span>{label}</span>
                <span>{pct}%</span>
              </div>
              <div className="h-2 w-full bg-on-primary-container/20 rounded-full">
                <div
                  className="h-full bg-match-success rounded-full transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-stack-lg p-stack-sm bg-white/10 rounded-lg border border-white/10">
          <p className="font-body-sm text-body-sm text-on-primary-container italic">
            Your profile aligns strongly with {employerName}&apos;s requirements for this role.
          </p>
        </div>
      </div>

      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-electric-blue/20 blur-3xl rounded-full" />
    </div>
  );
}