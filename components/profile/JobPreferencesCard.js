'use client';

import { useState } from 'react';
import { updateMyResume } from '@/lib/apiClient';

/**
 * Desired Roles saves for real (ParsedResume.desiredTitles, same field the
 * matching engine reads). Work Type and Salary Expectation have no backing
 * field anywhere in the schema, so they stay editable but unsaved — same
 * treatment as Phone/Bio on the Personal Info card above.
 */
export default function JobPreferencesCard({ resume, onResumeChange }) {
  const [titles, setTitles] = useState(resume?.desiredTitles || []);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [workType, setWorkType] = useState('');
  const [salary, setSalary] = useState('');

  const persistTitles = async (next) => {
    setSaving(true);
    setError(null);
    try {
      const { resume: updated } = await updateMyResume({ desiredTitles: next });
      setTitles(next);
      onResumeChange?.(updated);
    } catch (err) {
      setError(err.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addTitle = () => {
    const value = draft.trim();
    if (!value || titles.includes(value)) {
      setDraft('');
      return;
    }
    setDraft('');
    persistTitles([...titles, value]);
  };

  const removeTitle = (title) => persistTitles(titles.filter((t) => t !== title));

  return (
    <section id="job-preferences" className="bg-surface-container-lowest border border-border-subtle rounded-xl p-8 flex flex-col h-full scroll-mt-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-headline-md text-headline-md text-deep-navy">Job Preferences</h2>
        {saving && <span className="text-body-sm text-slate-gray">Saving…</span>}
      </div>

      {error && <p className="mb-4 text-error text-body-sm">{error}</p>}

      <div className="space-y-6 flex-1">
        <div>
          <label className="font-label-md text-label-md text-slate-gray block mb-2">Desired Roles</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {titles.length === 0 && <p className="text-body-sm text-slate-gray">No desired roles set yet.</p>}
            {titles.map((title) => (
              <span
                key={title}
                className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container rounded-full text-body-sm font-medium text-deep-navy"
              >
                {title}
                <button
                  type="button"
                  aria-label={`Remove ${title}`}
                  onClick={() => removeTitle(title)}
                  className="text-slate-gray hover:text-error transition-colors flex items-center"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTitle();
              }
            }}
            onBlur={addTitle}
            placeholder="Add a desired role..."
            className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-label-md text-label-md text-slate-gray block mb-1">Work Type</label>
            <input
              type="text"
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              placeholder="e.g. Remote, Hybrid"
              className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 text-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="font-label-md text-label-md text-slate-gray block mb-1">Salary Expectation</label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. $80k - $100k / yr"
              className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 text-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent"
            />
          </div>
        </div>
        <p className="font-body-sm text-body-sm text-slate-gray">
          Work Type and Salary Expectation aren&apos;t saved yet — Desired Roles are.
        </p>
      </div>
    </section>
  );
}
