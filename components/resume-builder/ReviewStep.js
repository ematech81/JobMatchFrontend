'use client';

import { useRouter } from 'next/navigation';
import { useResumeBuilder } from '@/lib/ResumeBuilderContext';
import { formatExperience } from '@/lib/format';

function SectionCard({ title, stepToEdit, children }) {
  const { setStep } = useResumeBuilder();

  return (
    <div className="p-6 rounded-lg border border-border-subtle bg-white">
      <div className="flex items-center justify-between mb-stack-sm">
        <h3 className="font-headline-md text-headline-md text-deep-navy text-lg">{title}</h3>
        <button
          type="button"
          onClick={() => setStep(stepToEdit)}
          className="flex items-center gap-1 text-electric-blue font-label-md text-label-md hover:underline"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

export default function ReviewStep() {
  const { data, submitResume, submitting, submitError, prevStep, isEditMode } = useResumeBuilder();
  const router = useRouter();

  const handleBack = () => prevStep();

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      await submitResume();
      router.push('/matches');
    } catch {
      // submitError is already surfaced below; stay on the step so the user
      // can retry rather than losing everything they've entered.
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 md:p-stack-lg shadow-sm w-full max-w-4xl">
      <header className="mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg text-deep-navy mb-2">Review Your Resume</h1>
        <p className="text-slate-gray font-body-md text-body-md">
          {isEditMode
            ? 'Double check everything below before we re-run your matches. Use Edit on any section to change it.'
            : 'Double check everything below before we start matching you with jobs. Use Edit on any section to go back and change it.'}
        </p>
      </header>

      {submitError && (
        <div className="bg-error-container text-on-error-container text-body-sm px-4 py-3 rounded-lg mb-stack-md">
          {submitError}
        </div>
      )}

      <form onSubmit={handleConfirm} className="space-y-stack-md">
        <SectionCard title="Personal Info" stepToEdit={1}>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-stack-md gap-y-2 text-body-sm">
            <div>
              <dt className="text-slate-gray">Full Name</dt>
              <dd className="text-deep-navy font-semibold">{data.fullName || '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-gray">Desired Title(s)</dt>
              <dd className="text-deep-navy font-semibold">
                {data.desiredTitles.length > 0 ? data.desiredTitles.join(', ') : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-slate-gray">Preferred Country</dt>
              <dd className="text-deep-navy font-semibold">{data.preferredCountry || '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-gray">City / Region</dt>
              <dd className="text-deep-navy font-semibold">{data.city || '—'}</dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard title="Experience" stepToEdit={2}>
          {data.pastRoles.length === 0 ? (
            <p className="text-body-sm text-slate-gray">No experience added.</p>
          ) : (
            <ul className="space-y-3">
              {data.pastRoles.map((role, i) => (
                <li key={i} className="text-body-sm">
                  <span className="text-deep-navy font-semibold">{role.title}</span>
                  {role.company && <span className="text-slate-gray"> — {role.company}</span>}
                  <span className="text-slate-gray"> · {formatExperience(role.durationMonths)}</span>
                  {role.description && (
                    <p className="text-slate-gray mt-1 whitespace-pre-line">{role.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Education" stepToEdit={3}>
          {data.education.length === 0 ? (
            <p className="text-body-sm text-slate-gray">No education added.</p>
          ) : (
            <ul className="space-y-2">
              {data.education.map((edu, i) => (
                <li key={i} className="text-body-sm text-deep-navy font-semibold">
                  {edu.degree}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Skills" stepToEdit={4}>
          {data.skills.length === 0 ? (
            <p className="text-body-sm text-slate-gray">No skills added.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-surface-container-low border border-border-subtle px-3 py-1.5 rounded-full font-body-md text-body-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </SectionCard>

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
            disabled={submitting}
            className="bg-electric-blue text-white px-10 py-3 rounded-lg shadow-lg shadow-electric-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all font-button text-button flex items-center gap-2 disabled:opacity-60 disabled:hover:scale-100"
          >
            {submitting ? 'Saving…' : isEditMode ? 'Update Resume' : 'Confirm & See Matches'}
            {!submitting && <span className="material-symbols-outlined">arrow_forward</span>}
          </button>
        </div>
      </form>
    </div>
  );
}
