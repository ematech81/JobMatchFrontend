'use client';

import { useState } from 'react';
import { updateMyResume } from '@/lib/apiClient';

export default function SkillsCard({ resume, onResumeChange }) {
  const [skills, setSkills] = useState(resume?.skills || []);
  const [draft, setDraft] = useState('');
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const persist = async (next) => {
    setSaving(true);
    setError(null);
    try {
      const { resume: updated } = await updateMyResume({ skills: next });
      setSkills(next);
      onResumeChange?.(updated);
    } catch (err) {
      setError(err.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const value = draft.trim();
    setDraft('');
    setAdding(false);
    if (!value || skills.includes(value)) return;
    persist([...skills, value]);
  };

  const removeSkill = (skill) => persist(skills.filter((s) => s !== skill));

  return (
    <section className="bg-surface-container-lowest border border-border-subtle rounded-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-headline-md text-headline-md text-deep-navy">Core Skills & Expertise</h2>
        <div className="flex items-center gap-3">
          {saving && <span className="text-body-sm text-slate-gray">Saving…</span>}
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="text-electric-blue hover:underline font-button"
          >
            Add Skills
          </button>
        </div>
      </div>

      {error && <p className="mb-4 text-error text-body-sm">{error}</p>}

      {skills.length === 0 && !adding && (
        <p className="text-body-md text-slate-gray mb-4">No skills listed yet.</p>
      )}

      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span
            key={skill}
            className="group inline-flex items-center gap-1 px-4 py-2 bg-secondary/10 text-secondary border border-secondary/20 rounded-lg text-body-md font-semibold"
          >
            {skill}
            <button
              type="button"
              aria-label={`Remove ${skill}`}
              onClick={() => removeSkill(skill)}
              className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-error flex items-center"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </span>
        ))}

        {adding && (
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
              }
              if (e.key === 'Escape') {
                setDraft('');
                setAdding(false);
              }
            }}
            onBlur={addSkill}
            placeholder="Type a skill and press Enter..."
            className="px-4 py-2 bg-white border border-border-subtle rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent"
          />
        )}
      </div>
    </section>
  );
}
