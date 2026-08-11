'use client';

import { useState } from 'react';
import { useResumeBuilder } from '@/lib/ResumeBuilderContext';

const MAX_SKILLS = 5;

// A cross-section of common titles this platform actually matches against
// (see COMMON_TITLES in the job-pull config: software engineer, data
// analyst, product manager, customer service, accountant, nurse, sales rep),
// not a tech-only list — "the ones that matter" for real matching, but
// typing anything else is still fully supported.
const SUGGESTED_SKILLS = [
  'JavaScript',
  'React',
  'Node.js',
  'Python',
  'SQL',
  'Project Management',
  'Data Analysis',
  'Customer Service',
  'Sales',
  'Accounting',
  'Nursing',
  'Communication',
  'Leadership',
  'Microsoft Excel',
  'Marketing',
];

export default function SkillsStep() {
  const { data, updateData, nextStep, prevStep } = useResumeBuilder();

  const [skills, setSkills] = useState(data.skills);
  const [draft, setDraft] = useState('');

  const atMax = skills.length >= MAX_SKILLS;

  const addSkill = (value) => {
    const trimmed = (value ?? draft).trim();
    if (!trimmed || atMax || skills.includes(trimmed)) {
      setDraft('');
      return;
    }
    setSkills((prev) => [...prev, trimmed]);
    setDraft('');
  };

  const removeSkill = (skill) => setSkills((prev) => prev.filter((s) => s !== skill));

  const handleBack = () => {
    updateData({ skills });
    prevStep();
  };

  const handleNext = (e) => {
    e.preventDefault();
    updateData({ skills });
    nextStep();
  };

  const availableSuggestions = SUGGESTED_SKILLS.filter((s) => !skills.includes(s));

  return (
    <div className="glass-card rounded-xl p-6 md:p-stack-lg shadow-sm w-full max-w-4xl">
      <header className="mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg text-deep-navy mb-2">Skills</h1>
        <p className="text-slate-gray font-body-md text-body-md">
          Pick from the suggestions or type your own — up to {MAX_SKILLS}. This is what we match
          against job postings, so be specific.
        </p>
      </header>

      <form onSubmit={handleNext} className="space-y-stack-lg">
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill}
                className="inline-flex items-center gap-1 bg-electric-blue/10 border border-electric-blue/30 px-3 py-1.5 rounded-full"
              >
                <span className="font-body-md text-body-sm text-deep-navy">{skill}</span>
                <button
                  type="button"
                  aria-label={`Remove ${skill}`}
                  onClick={() => removeSkill(skill)}
                  className="text-slate-gray hover:text-error transition-colors flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            ))}
          </div>
        )}

        <div>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-gray group-focus-within:text-electric-blue transition-colors">
              add
            </span>
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
              onBlur={() => addSkill()}
              disabled={atMax}
              placeholder={atMax ? 'Maximum of 5 skills reached' : 'e.g. React, Node.js, Figma'}
              className="w-full pl-12 pr-4 py-3 bg-white border border-border-subtle rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-all placeholder:text-slate-gray/50 disabled:bg-surface-container-low disabled:cursor-not-allowed"
            />
          </div>
          <p className="font-body-sm text-body-sm text-slate-gray mt-1">
            {skills.length} / {MAX_SKILLS} added
            {atMax && ' — remove one to add a different skill.'}
          </p>
        </div>

        {availableSuggestions.length > 0 && (
          <div>
            <p className="font-label-md text-label-md text-deep-navy mb-2 uppercase tracking-wider">
              Suggested
            </p>
            <div className="flex flex-wrap gap-2">
              {availableSuggestions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  disabled={atMax}
                  onClick={() => addSkill(skill)}
                  className="px-3 py-1.5 rounded-full border border-border-subtle text-body-sm text-slate-gray hover:border-electric-blue hover:text-electric-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border-subtle disabled:hover:text-slate-gray"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-stack-lg border-t border-border-subtle mt-stack-lg">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-gray hover:text-deep-navy transition-colors px-6 py-3 font-button text-button"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back
          </button>

          <button
            type="submit"
            className="bg-electric-blue text-white px-10 py-3 rounded-lg shadow-lg shadow-electric-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all font-button text-button flex items-center gap-2"
          >
            Review
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </form>
    </div>
  );
}
