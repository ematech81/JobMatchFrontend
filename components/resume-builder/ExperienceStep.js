
'use client';

import { useState } from 'react';
import { useResumeBuilder } from '@/lib/ResumeBuilderContext';
import { computeDurationMonths } from '@/lib/dateUtils';
import RoleEntryCard from './RoleEntryCard';

const emptyRole = () => ({
  title: '',
  company: '',
  startDate: '',
  endDate: '',
  current: false,
  accomplishments: '',
});

export default function ExperienceStep() {
  const { data, updateData, nextStep, prevStep } = useResumeBuilder();

  const [roles, setRoles] = useState(
    data.pastRoles.length > 0 ? data.pastRoles : [emptyRole()]
  );

  const handleRoleChange = (index, updatedRole) => {
    setRoles((prev) => prev.map((r, i) => (i === index ? updatedRole : r)));
  };

  const handleAddRole = () => {
    setRoles((prev) => [...prev, emptyRole()]);
  };

  const handleRemoveRole = (index) => {
    setRoles((prev) => prev.filter((_, i) => i !== index));
  };

  const buildPastRoles = () => {
    return roles
      .filter((r) => r.title.trim() || r.company.trim())
      .map((r) => ({
        title: r.title.trim(),
        company: r.company.trim(),
        durationMonths: computeDurationMonths(r.startDate, r.endDate, r.current),
        description: r.accomplishments.trim(),
      }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    updateData({ pastRoles: buildPastRoles() });
    nextStep();
  };

  const handleSkip = () => {
    updateData({ pastRoles: [] });
    nextStep();
  };

  const handleBack = () => {
    updateData({ pastRoles: buildPastRoles() });
    prevStep();
  };

  return (
    <div className="glass-card rounded-xl p-6 md:p-stack-lg shadow-sm w-full max-w-4xl">
      <header className="mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg text-deep-navy mb-2">
          Work Experience
        </h1>
        <p className="text-slate-gray font-body-md text-body-md">
          Highlight your professional journey and career milestones. Quality experience
          increases match scores by up to 40%. This step is optional — skip it if you&apos;d
          rather add experience later.
        </p>
      </header>

      <form onSubmit={handleNext} className="space-y-stack-lg">
        <div className="space-y-stack-lg">
          {roles.map((role, index) => (
            <RoleEntryCard
              key={index}
              role={role}
              index={index}
              onChange={handleRoleChange}
              onRemove={handleRemoveRole}
              canRemove={roles.length > 1}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddRole}
          className="w-full py-4 border-2 border-dashed border-outline-variant rounded-xl text-slate-gray hover:text-electric-blue hover:border-electric-blue hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 group font-button text-button"
        >
          <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
            add_circle
          </span>
          Add Another Role
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