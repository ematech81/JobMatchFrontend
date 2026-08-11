'use client';

import { useState } from 'react';
import { useResumeBuilder } from '@/lib/ResumeBuilderContext';

const emptyEducation = () => ({ degree: '' });

// A curated list rather than a free-text field or every possible
// credential — the ones that actually matter for matching against job
// postings' education requirements.
const DEGREE_OPTIONS = [
  'Secondary School Certificate',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's Degree",
  'MBA',
  'Doctorate (PhD)',
  'Professional Certificate',
];

export default function EducationStep() {
  const { data, updateData, nextStep, prevStep } = useResumeBuilder();

  const [entries, setEntries] = useState(
    data.education.length > 0 ? data.education : [emptyEducation()]
  );

  const handleChange = (index, field, value) => {
    setEntries((prev) => prev.map((entry, i) => (i === index ? { ...entry, [field]: value } : entry)));
  };

  const handleAdd = () => setEntries((prev) => [...prev, emptyEducation()]);
  const handleRemove = (index) => setEntries((prev) => prev.filter((_, i) => i !== index));

  const buildEducation = () =>
    entries.filter((e) => e.degree).map((e) => ({ degree: e.degree }));

  const handleNext = (e) => {
    e.preventDefault();
    updateData({ education: buildEducation() });
    nextStep();
  };

  const handleSkip = () => {
    updateData({ education: [] });
    nextStep();
  };

  const handleBack = () => {
    updateData({ education: buildEducation() });
    prevStep();
  };

  return (
    <div className="glass-card rounded-xl p-6 md:p-stack-lg shadow-sm w-full max-w-4xl">
      <header className="mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg text-deep-navy mb-2">Education</h1>
        <p className="text-slate-gray font-body-md text-body-md">
          Add your degrees or certifications. This step is optional — skip it if you&apos;d rather
          add education later.
        </p>
      </header>

      <form onSubmit={handleNext} className="space-y-stack-lg">
        <div className="space-y-stack-md">
          {entries.map((entry, index) => (
            <div
              key={index}
              className="relative group p-6 rounded-lg border border-border-subtle bg-white hover:border-electric-blue/30 transition-all duration-200"
            >
              {entries.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-4 right-4 text-slate-gray hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}

              <div className="space-y-1">
                <label className="font-label-md text-label-md text-deep-navy block">
                  Degree / Certificate
                </label>
                <div className="relative">
                  <select
                    value={entry.degree}
                    onChange={(e) => handleChange(index, 'degree', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-electric-blue focus:border-electric-blue outline-none transition-all font-body-md appearance-none cursor-pointer"
                  >
                    <option value="">Select the one you have</option>
                    {DEGREE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-slate-gray">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="w-full py-4 border-2 border-dashed border-outline-variant rounded-xl text-slate-gray hover:text-electric-blue hover:border-electric-blue hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 group font-button text-button"
        >
          <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
            add_circle
          </span>
          Add Another
        </button>

        <div className="flex items-center justify-between pt-stack-lg border-t border-border-subtle mt-stack-lg">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-gray hover:text-deep-navy transition-colors px-6 py-3 font-button text-button"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back
          </button>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSkip}
              className="hidden md:block text-slate-gray hover:text-deep-navy px-6 py-3 font-button text-button"
            >
              Skip for now
            </button>
            <button
              type="submit"
              className="bg-electric-blue text-white px-10 py-3 rounded-lg shadow-lg shadow-electric-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all font-button text-button flex items-center gap-2"
            >
              Next Step
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
