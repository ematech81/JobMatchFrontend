'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { updateMyResume } from '@/lib/apiClient';
import { countryCodeToName } from '@/lib/format';

let nextRoleId = 0;
const newRoleId = () => `role-${Date.now()}-${nextRoleId++}`;

function toRoleFormState(exp = {}) {
  return {
    id: newRoleId(),
    title: exp.title || '',
    company: exp.company || '',
    durationMonths: exp.durationMonths || 0,
    // Not modeled server-side yet (see ResumeUploadFlow) — editable for
    // review, but dropped rather than sent on save.
    dates: '',
    description: '',
  };
}

/**
 * Step 3 of 3 — Verify Your Details.
 *
 * What actually saves on "Confirm"/"Save & Exit": fullName, skills, and
 * experience{title, company} (durationMonths carried through unchanged,
 * since nothing on this screen edits it). Phone, Location, per-role Dates,
 * and Description highlights are fully editable here to match the design,
 * but the backend has nowhere to put them yet — same as `city` and
 * `accomplishments` already being dropped by ResumeBuilderContext.js. See
 * ParsedResume / User models before wiring persistence for those.
 */
export default function VerifyStep({ resume, file }) {
  const { user } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState(resume.fullName || user?.fullName || '');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState(countryCodeToName(resume.preferredCountry) || '');

  // PDF gets a real browser-native preview — a live in-memory reference to
  // the file the user just picked, not anything fetched or stored.
  const isPreviewablePdf = file?.type === 'application/pdf';
  const previewUrl = useMemo(
    () => (isPreviewablePdf ? URL.createObjectURL(file) : null),
    [file, isPreviewablePdf]
  );
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // DOCX has no built-in browser renderer, but mammoth can convert it to
  // plain HTML entirely client-side — still just reading the same in-memory
  // File object, nothing sent anywhere. Legacy .doc (binary, pre-2007) isn't
  // something mammoth reads at all, so that format still falls back to the
  // "can't preview" message below.
  const isDocx = file?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  const [docxHtml, setDocxHtml] = useState(null);
  // Derived from isDocx (a prop check, not a browser API) so the "loading"
  // state is known from the first render — no synchronous setState needed
  // at the top of the effect below, only inside its async callbacks.
  const [docxStatus, setDocxStatus] = useState(() => (isDocx ? 'loading' : 'idle')); // idle | loading | done | error
  useEffect(() => {
    if (!isDocx) return;

    let cancelled = false;

    file
      .arrayBuffer()
      .then((buffer) => import('mammoth').then((mammoth) => mammoth.convertToHtml({ arrayBuffer: buffer })))
      .then(({ value }) => {
        if (cancelled) return;
        setDocxHtml(value);
        setDocxStatus('done');
      })
      .catch(() => {
        if (!cancelled) setDocxStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [file, isDocx]);
  const [experience, setExperience] = useState(() =>
    (resume.experience?.length ? resume.experience : [{}]).map(toRoleFormState)
  );
  const [skills, setSkills] = useState(resume.skills || []);
  const [skillDraft, setSkillDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const updateRole = (id, field, value) => {
    setExperience((prev) => prev.map((role) => (role.id === id ? { ...role, [field]: value } : role)));
  };

  const addRole = () => setExperience((prev) => [...prev, toRoleFormState()]);
  const removeRole = (id) => setExperience((prev) => prev.filter((role) => role.id !== id));

  const addSkill = () => {
    const value = skillDraft.trim();
    if (!value || skills.includes(value)) {
      setSkillDraft('');
      return;
    }
    setSkills((prev) => [...prev, value]);
    setSkillDraft('');
  };

  const removeSkill = (skill) => setSkills((prev) => prev.filter((s) => s !== skill));

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateMyResume({
        fullName,
        skills,
        experience: experience.map(({ title, company, durationMonths }) => ({
          title,
          company,
          durationMonths,
        })),
      });
      // First-time onboarding completion — gated behind the scan/subscribe
      // flow, not straight to the dashboard. VerifyStep only ever runs as
      // part of that first-time flow (see ResumeUploadFlow), so this is
      // unconditional here.
      router.push('/subscribe/scan');
    } catch (err) {
      setError(err.message || 'Failed to save your changes. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
      <header className="bg-surface-container-lowest border-b border-border-subtle sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-container-max mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/jobMatch-logo.png"
              alt="JobMatch Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-md object-contain"
            />
            <span className="text-headline-md font-headline-md font-bold text-primary">JobMatch</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-body-sm font-body-sm text-slate-gray hidden md:inline-block">
              Step 3 of 3
            </span>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="text-secondary font-button text-button hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              Save &amp; Exit
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-container-max mx-auto w-full px-4 md:px-gutter py-stack-lg">
        <div className="mb-stack-lg flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-2">
              Verify Your Details
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Our AI has parsed your uploaded document. Please review and edit the extracted
              information below to ensure maximum accuracy before we match you with opportunities.
            </p>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="w-full md:w-auto bg-electric-blue text-on-primary font-button text-button px-6 py-3 rounded-lg hover:bg-secondary-container transition-colors shadow-[0px_4px_20px_rgba(15,23,42,0.08)] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Confirm & See Matches'}
              {!saving && <span className="material-symbols-outlined">arrow_forward</span>}
            </button>
          </div>
        </div>

        {error && (
          <p className="mb-stack-md text-error text-body-sm bg-error-container/40 border border-error/20 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {/* Progress Bar */}
        <div className="mb-stack-lg">
          <div className="flex justify-between mb-2">
            <span className="font-label-md text-label-md text-slate-gray">Upload</span>
            <span className="font-label-md text-label-md text-slate-gray">Parsing</span>
            <span className="font-label-md text-label-md text-electric-blue font-bold">Verification</span>
          </div>
          <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
            <div className="bg-electric-blue h-full rounded-full w-[95%] transition-all duration-500 ease-in-out" />
          </div>
        </div>

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg">
          {/* Left: Document Preview */}
          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md flex flex-col h-[800px] shadow-sm">
            <div className="flex justify-between items-center mb-stack-md pb-4 border-b border-border-subtle">
              <h2 className="font-headline-md text-headline-md">Original Document</h2>
              <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1 rounded-full font-label-md text-label-md text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">description</span>
                {resume.originalFilename || 'Uploaded resume'}
              </span>
            </div>

            {previewUrl ? (
              // Renders straight from the in-memory object URL above — the
              // file itself never leaves this tab for this preview.
              <iframe
                src={previewUrl}
                title="Original resume preview"
                className="flex-grow rounded-lg border border-border-subtle bg-surface-container-low"
              />
            ) : docxStatus === 'done' ? (
              // mammoth's output, converted entirely client-side from the
              // same in-memory File — never uploaded anywhere for this.
              // Rendered as-is (not sanitized): this is the user's own file,
              // shown only to themselves in their own tab, not shared with
              // other users, so the usual stored-HTML XSS risk doesn't apply.
              <div
                className="docx-preview flex-grow rounded-lg border border-border-subtle bg-surface-container-low overflow-y-auto p-6"
                dangerouslySetInnerHTML={{ __html: docxHtml }}
              />
            ) : docxStatus === 'loading' ? (
              <div className="flex-grow bg-surface-container-low rounded-lg border border-border-subtle flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined animate-spin text-electric-blue text-3xl">
                  progress_activity
                </span>
                <p className="font-body-sm text-body-sm text-slate-gray">Rendering preview…</p>
              </div>
            ) : (
              <div className="flex-grow bg-surface-container-low rounded-lg border border-border-subtle flex flex-col items-center justify-center gap-3 text-center px-8">
                <span className="material-symbols-outlined text-[48px] text-outline">description</span>
                <p className="font-label-md text-label-md text-slate-gray">Preview unavailable</p>
                <p className="font-body-sm text-body-sm text-slate-gray max-w-xs">
                  {docxStatus === 'error'
                    ? "This file couldn't be rendered for preview — double check the extracted details on the right instead."
                    : file
                      ? "Legacy .doc files can't be previewed in-browser — double check the extracted details on the right instead."
                      : "The original file isn't stored after parsing, so it can't be previewed here — double check the extracted details on the right instead."}
                </p>
              </div>
            )}
          </div>

          {/* Right: Editable Fields */}
          <div className="flex flex-col gap-stack-lg h-[800px] overflow-y-auto pr-2 custom-scrollbar pb-stack-lg">
            <p className="flex items-center gap-2 text-body-sm text-slate-gray bg-surface-container-low border border-border-subtle rounded-lg px-4 py-3">
              <span className="material-symbols-outlined text-electric-blue text-lg">edit_note</span>
              Every field below is editable — make any corrections before clicking Confirm &amp; See Matches.
            </p>

            {/* Contact Info */}
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline-md text-headline-md text-lg">Contact Info</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md text-slate-gray mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-border-subtle rounded-md px-3 py-2 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-slate-gray mb-1">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-surface-container-low border border-border-subtle rounded-md px-3 py-2 font-body-md text-body-md text-slate-gray cursor-not-allowed"
                  />
                  <p className="font-body-sm text-body-sm text-slate-gray mt-1">Synced from your account</p>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-slate-gray mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-surface-container-lowest border border-border-subtle rounded-md px-3 py-2 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-slate-gray mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    className="w-full bg-surface-container-lowest border border-border-subtle rounded-md px-3 py-2 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Experience */}
            <div>
              <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="font-headline-md text-headline-md text-lg">Experience</h3>
                <button
                  type="button"
                  onClick={addRole}
                  className="text-electric-blue font-label-md text-label-md hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add Role
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {experience.map((role) => (
                  <div
                    key={role.id}
                    className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md shadow-sm hover:shadow-[0px_4px_20px_rgba(15,23,42,0.08)] transition-shadow group relative"
                  >
                    {experience.length > 1 && (
                      <button
                        type="button"
                        aria-label="Remove Role"
                        onClick={() => removeRole(role.id)}
                        className="absolute top-4 right-4 text-slate-gray opacity-0 group-hover:opacity-100 transition-opacity hover:text-error"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    )}
                    <div className="grid gap-4">
                      <div>
                        <label className="block font-label-md text-label-md text-slate-gray mb-1">Job Title</label>
                        <input
                          type="text"
                          value={role.title}
                          onChange={(e) => updateRole(role.id, 'title', e.target.value)}
                          className="w-full bg-surface-container-lowest border border-border-subtle rounded-md px-3 py-2 font-body-md text-body-md font-semibold focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-label-md text-label-md text-slate-gray mb-1">Company</label>
                          <input
                            type="text"
                            value={role.company}
                            onChange={(e) => updateRole(role.id, 'company', e.target.value)}
                            className="w-full bg-surface-container-lowest border border-border-subtle rounded-md px-3 py-2 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block font-label-md text-label-md text-slate-gray mb-1">Dates</label>
                          <input
                            type="text"
                            value={role.dates}
                            onChange={(e) => updateRole(role.id, 'dates', e.target.value)}
                            placeholder="e.g. Jan 2021 - Present"
                            className="w-full bg-surface-container-lowest border border-border-subtle rounded-md px-3 py-2 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-slate-gray mb-1">
                          Description highlights
                        </label>
                        <textarea
                          rows={3}
                          value={role.description}
                          onChange={(e) => updateRole(role.id, 'description', e.target.value)}
                          placeholder="- Describe your key achievements in this role."
                          className="w-full bg-surface-container-lowest border border-border-subtle rounded-md px-3 py-2 font-body-md text-body-sm focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md shadow-sm mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline-md text-headline-md text-lg">Skills</h3>
                {skills.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSkills([])}
                    className="text-slate-gray font-label-md text-label-md hover:text-error hover:underline transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {/* AI-extracted skills can include false positives from brand
                  names it doesn't recognize (e.g. "Railway" the hosting
                  platform misread as "Rail Transport") — worth a skim before
                  confirming. */}
              {skills.length > 15 && (
                <p className="font-body-sm text-body-sm text-slate-gray mb-3">
                  {skills.length} skills were detected — some may be mismatched from company/product
                  names in your resume. Remove any that don&apos;t belong, or clear all and re-add manually.
                </p>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="inline-flex items-center gap-1 bg-surface-container-low border border-border-subtle px-3 py-1.5 rounded-full"
                  >
                    <span className="font-body-md text-body-sm">{skill}</span>
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
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-gray text-[20px]">
                  add
                </span>
                <input
                  type="text"
                  value={skillDraft}
                  onChange={(e) => setSkillDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  onBlur={addSkill}
                  placeholder="Add another skill..."
                  className="w-full bg-surface-container-lowest border border-border-subtle rounded-md pl-10 pr-3 py-2 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
