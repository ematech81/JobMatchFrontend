'use client';

import { useEffect, useState } from 'react';
import { extractSkills } from '@/lib/format';
import {
  updateMyResume,
  generateApplication,
  getGeneratedApplication,
  updateGeneratedApplication,
  downloadApplicationResumePdf,
  downloadApplicationCoverLetterPdf,
  ApiError,
} from '@/lib/apiClient';

const GENERATING_MESSAGES = [
  'Reviewing your resume against this listing…',
  'Matching your experience to the job description…',
  'Writing your tailored summary…',
  'Drafting your cover letter…',
];

function Modal({ onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className={`bg-white rounded-xl p-stack-lg w-full shadow-xl relative ${wide ? 'max-w-2xl' : 'max-w-lg'}`}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-slate-gray hover:text-deep-navy"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        {children}
      </div>
    </div>
  );
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * The two choices a job listing actually offers: apply with your resume
 * as-is (JobActions' Apply Now), or tailor it to this specific role first.
 * Skill-gap detection and adding skills to the real resume both work today.
 * The actual document generation is a real OpenAI call (see
 * aiApplicationService on the backend) — not a stub — but it does depend on
 * that account having API credit; a clear error surfaces here rather than a
 * silent failure if it doesn't.
 */
export default function ApplicationGenerator({ job, resume, onResumeChange }) {
  const [step, setStep] = useState('closed'); // closed | confirm | skill-gap | generating | preview
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [genError, setGenError] = useState(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [application, setApplication] = useState(null);
  const [activeTab, setActiveTab] = useState('resume'); // resume | cover-letter
  const [editing, setEditing] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const resumeSkills = resume?.skills || [];
  const resumeSkillsLower = resumeSkills.map((s) => s.toLowerCase());
  const missingSkills = extractSkills(job).filter((s) => !resumeSkillsLower.includes(s.toLowerCase()));

  // A previously generated application for this job — if it exists, jumping
  // straight to it (instead of always starting over from the skill-gap
  // step) is what makes "Edit"/"Download" meaningful across visits.
  useEffect(() => {
    getGeneratedApplication(job.job_id)
      .then(({ application }) => setApplication(application))
      .catch(() => {});
  }, [job.job_id]);

  useEffect(() => {
    if (step !== 'generating') return;
    const id = setInterval(() => {
      setMessageIndex((i) => (i + 1) % GENERATING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(id);
  }, [step]);

  const openConfirm = () => {
    setError(null);
    setSaved(false);
    setStep('confirm');
  };

  const proceedToSkillGap = () => {
    setSelected(missingSkills);
    setStep('skill-gap');
  };

  const toggleSkill = (skill) => {
    setSelected((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  };

  const addSelectedSkills = async () => {
    if (selected.length === 0) return;
    setSaving(true);
    setError(null);
    try {
      const { resume: updated } = await updateMyResume({ skills: [...resumeSkills, ...selected] });
      onResumeChange?.(updated);
      setSaved(true);
    } catch (err) {
      setError(err.message || 'Failed to update your resume. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const runGeneration = async () => {
    setStep('generating');
    setGenError(null);
    setMessageIndex(0);
    try {
      const { application: result } = await generateApplication(job.job_id, selected);
      setApplication(result);
      setActiveTab('resume');
      setStep('preview');
    } catch (err) {
      setGenError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
      setStep('skill-gap');
    }
  };

  const startEdit = () => {
    setDraftText(activeTab === 'resume' ? application.summary : application.coverLetter);
    setEditing(true);
  };

  const saveEdit = async () => {
    setSavingEdit(true);
    try {
      const field = activeTab === 'resume' ? { summary: draftText } : { coverLetter: draftText };
      const { application: updated } = await updateGeneratedApplication(job.job_id, field);
      setApplication(updated);
      setEditing(false);
    } catch (err) {
      setGenError(err.message || 'Failed to save your edit.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob =
        activeTab === 'resume' ? await downloadApplicationResumePdf(job.job_id) : await downloadApplicationCoverLetterPdf(job.job_id);
      downloadBlob(blob, activeTab === 'resume' ? `${resume?.fullName || 'resume'}_tailored.pdf` : 'cover_letter.pdf');
    } catch (err) {
      setGenError(err.message || 'Failed to download.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <section className="bg-primary-fixed border border-electric-blue/30 rounded-xl p-stack-lg flex flex-col sm:flex-row sm:items-center justify-between gap-stack-md">
        <div>
          <h3 className="font-headline-md text-headline-md text-deep-navy mb-1">Application Generator</h3>
          <p className="text-slate-gray text-body-sm">
            Don&apos;t send a generic resume — check it against this specific role before you apply.
          </p>
        </div>
        <button
          type="button"
          onClick={application ? () => { setActiveTab('resume'); setStep('preview'); } : openConfirm}
          className="shrink-0 bg-electric-blue text-white px-6 py-3 rounded-lg font-button text-button hover:shadow-lg transition-all"
        >
          {application ? 'View Tailored Application' : 'Generate Application'}
        </button>
      </section>

      {step === 'confirm' && (
        <Modal onClose={() => setStep('closed')}>
          <h2 className="font-headline-lg text-headline-lg text-deep-navy mb-stack-sm">Tailor your application?</h2>
          <p className="text-slate-gray text-body-md mb-stack-lg">
            This checks your resume against what this listing actually asks for, helps you fill any gaps,
            then writes a tailored summary and cover letter for this exact role. If you&apos;re already
            confident your resume fits, there&apos;s no need — just use Apply Now instead.
          </p>
          <div className="flex gap-stack-md">
            <button
              type="button"
              onClick={() => setStep('closed')}
              className="flex-1 border-2 border-border-subtle text-deep-navy px-6 py-3 rounded-lg font-button text-button hover:bg-surface-container-low transition-all"
            >
              Not now
            </button>
            <button
              type="button"
              onClick={proceedToSkillGap}
              className="flex-1 bg-electric-blue text-white px-6 py-3 rounded-lg font-button text-button hover:shadow-lg transition-all"
            >
              Continue
            </button>
          </div>
        </Modal>
      )}

      {step === 'skill-gap' && (
        <Modal onClose={() => setStep('closed')}>
          <h2 className="font-headline-lg text-headline-lg text-deep-navy mb-stack-sm">Add must-have skills</h2>

          {genError && <p className="text-error text-body-sm mb-stack-md">{genError}</p>}

          {missingSkills.length === 0 ? (
            <p className="text-slate-gray text-body-md mb-stack-lg">
              Good news — every skill we detected in this listing is already on your resume.
            </p>
          ) : (
            <>
              <p className="text-slate-gray text-body-md mb-stack-md">
                These skills are mentioned in the job description but aren&apos;t on your resume yet. Select
                the ones that genuinely apply to you — don&apos;t add anything you can&apos;t actually speak to.
              </p>
              <div className="flex flex-wrap gap-2 mb-stack-lg">
                {missingSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-full text-body-sm font-medium border transition-colors ${
                      selected.includes(skill)
                        ? 'bg-electric-blue text-white border-electric-blue'
                        : 'bg-white text-deep-navy border-border-subtle hover:border-electric-blue'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              {error && <p className="text-error text-body-sm mb-stack-md">{error}</p>}

              {saved ? (
                <p className="text-match-success text-body-md font-medium mb-stack-lg">Added to your resume.</p>
              ) : (
                <button
                  type="button"
                  onClick={addSelectedSkills}
                  disabled={saving || selected.length === 0}
                  className="w-full border-2 border-electric-blue text-electric-blue px-6 py-3 rounded-lg font-button text-button hover:bg-surface-container-low transition-all disabled:opacity-50 mb-stack-md"
                >
                  {saving ? 'Adding…' : `Add ${selected.length || ''} Skill${selected.length === 1 ? '' : 's'} to My Resume Only`}
                </button>
              )}
            </>
          )}

          <button
            type="button"
            onClick={runGeneration}
            className="w-full bg-electric-blue text-white px-6 py-3 rounded-lg font-button text-button hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
            Generate Tailored Resume &amp; Cover Letter
          </button>
        </Modal>
      )}

      {step === 'generating' && (
        <Modal onClose={() => {}}>
          <div className="flex flex-col items-center text-center py-stack-md">
            <span className="material-symbols-outlined animate-spin text-electric-blue text-5xl mb-stack-md">
              progress_activity
            </span>
            <h2 className="font-headline-lg text-headline-lg text-deep-navy mb-stack-sm">Creating your application</h2>
            <p className="text-slate-gray text-body-md">{GENERATING_MESSAGES[messageIndex]}</p>
          </div>
        </Modal>
      )}

      {step === 'preview' && application && (
        <Modal onClose={() => setStep('closed')} wide>
          <h2 className="font-headline-lg text-headline-lg text-deep-navy mb-stack-md">Your tailored application</h2>

          <div className="flex gap-stack-sm mb-stack-md border-b border-border-subtle">
            {[
              ['resume', 'Resume'],
              ['cover-letter', 'Cover Letter'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveTab(key);
                  setEditing(false);
                }}
                className={`px-4 py-2 font-button text-button border-b-2 transition-colors ${
                  activeTab === key ? 'border-electric-blue text-electric-blue' : 'border-transparent text-slate-gray'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {genError && <p className="text-error text-body-sm mb-stack-md">{genError}</p>}

          {editing ? (
            <>
              <textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                rows={activeTab === 'resume' ? 4 : 12}
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-stack-md text-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue mb-stack-md"
              />
              <div className="flex gap-stack-md">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 border-2 border-border-subtle text-deep-navy px-6 py-3 rounded-lg font-button text-button hover:bg-surface-container-low transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={savingEdit}
                  className="flex-1 bg-electric-blue text-white px-6 py-3 rounded-lg font-button text-button hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {savingEdit ? 'Saving…' : 'Save'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-surface-container-low rounded-lg p-stack-md mb-stack-lg max-h-[400px] overflow-y-auto whitespace-pre-line text-body-md text-deep-navy">
                {activeTab === 'resume' ? (
                  <>
                    <p className="font-label-md text-label-md text-slate-gray uppercase mb-2">Tailored Summary</p>
                    <p className="mb-stack-md">{application.summary}</p>
                    {application.addedSkills?.length > 0 && (
                      <>
                        <p className="font-label-md text-label-md text-slate-gray uppercase mb-2">Skills Added For This Role</p>
                        <p>{application.addedSkills.join(', ')}</p>
                      </>
                    )}
                    <p className="text-body-sm text-slate-gray mt-stack-md">
                      Your experience and education carry over unchanged — download for the complete document.
                    </p>
                  </>
                ) : (
                  application.coverLetter
                )}
              </div>

              <div className="flex gap-stack-md">
                <button
                  type="button"
                  onClick={startEdit}
                  className="flex-1 border-2 border-border-subtle text-deep-navy px-6 py-3 rounded-lg font-button text-button hover:bg-surface-container-low transition-all"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex-1 bg-electric-blue text-white px-6 py-3 rounded-lg font-button text-button hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {downloading ? 'Downloading…' : 'Download PDF'}
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
