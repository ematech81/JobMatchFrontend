'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { generateResume, getMyResume } from './apiClient';

const ResumeBuilderContext = createContext(null);

/**
 * Single source of truth for the country <select> — PersonalInfoStep renders
 * these options, everything below maps between this UI code and the
 * backend's ISO alpha-2.
 */
export const COUNTRIES = [
  { value: 'ng', label: 'Nigeria' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'de', label: 'Germany' },
  { value: 'rem', label: 'Remote Only' },
];

/**
 * The builder's country <select> uses short UI codes; the backend expects a
 * country it can resolve to ISO alpha-2. "Remote Only" has no country
 * equivalent, so it is not submitted as one.
 */
const COUNTRY_CODE_MAP = {
  ng: 'NG',
  us: 'US',
  uk: 'GB',
  ca: 'CA',
  de: 'DE',
};

export function toBackendCountry(value) {
  if (!value || value === 'rem') return '';
  return COUNTRY_CODE_MAP[String(value).toLowerCase()] || value;
}

/**
 * Reverse of the above, for pre-filling the select from a saved resume.
 * Handles both correctly-stored ISO codes (uploaded resumes, or generated
 * ones since the <option value> bug above was fixed) and legacy full-label
 * values ("Nigeria") that manually-built resumes stored before that fix.
 */
function fromBackendCountry(value) {
  if (!value) return '';
  const byCode = Object.entries(COUNTRY_CODE_MAP).find(([, code]) => code === value.toUpperCase());
  if (byCode) return byCode[0];

  const byLabel = COUNTRIES.find((c) => c.label.toLowerCase() === value.toLowerCase());
  return byLabel ? byLabel.value : '';
}

const initialData = {
  fullName: '',
  desiredTitles: [],
  preferredCountry: '',
  city: '',
  skills: [],
  pastRoles: [],
  education: [],
};

const MAX_SKILLS = 5;

/**
 * Maps a saved ParsedResume into the builder's editable shape. Lossy in two
 * places the backend just doesn't model for a manually-built resume: role
 * start/end dates (only a computed durationMonths is stored, so the date
 * pickers come back empty rather than wrong) and education institution
 * (dropped entirely now that EducationStep only collects a degree). Both are
 * still editable from here — pre-filling wrong data would be worse than
 * leaving a field blank for the user to fill in themselves.
 */
function resumeToBuilderData(resume) {
  return {
    fullName: resume.fullName || '',
    desiredTitles: resume.desiredTitles || [],
    preferredCountry: fromBackendCountry(resume.preferredCountry),
    city: '',
    skills: (resume.skills || []).slice(0, MAX_SKILLS),
    pastRoles: (resume.experience || []).map((exp) => ({
      title: exp.title || '',
      company: exp.company || '',
      startDate: '',
      endDate: '',
      current: false,
      accomplishments: '',
    })),
    education: (resume.education || [])
      .filter((edu) => edu.degree)
      .map((edu) => ({ degree: edu.degree })),
  };
}

export function ResumeBuilderProvider({ children }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  // ResumeBuilderProvider only ever mounts client-side — page.js wraps it in
  // RequireAuth, which gates children behind a client-only auth check and
  // renders nothing else during SSR — so reading window directly here can't
  // cause a hydration mismatch, and lets "was this an edit-mode entry" be
  // known from the first render instead of flipped on via a synchronous
  // setState in the effect below (which react-hooks flags as cascading).
  const [loadingExisting, setLoadingExisting] = useState(
    () => new URLSearchParams(window.location.search).get('mode') === 'edit'
  );
  // Unlike loadingExisting (which flips false once the fetch settles), this
  // stays true for the rest of the session — ReviewStep uses it to say
  // "Update Resume" instead of "Confirm & See Matches", since the user is
  // editing an existing profile, not seeing matches for the first time.
  const [isEditMode] = useState(loadingExisting);

  // "Update Resume" links here with ?mode=edit — pre-fill from whatever
  // resume already exists and jump straight to Review so editing is a
  // find-and-fix instead of re-entering everything from scratch.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('mode') !== 'edit') return;

    let cancelled = false;

    getMyResume()
      .then(({ resume }) => {
        if (cancelled || !resume) return;
        setData(resumeToBuilderData(resume));
        setStep(5);
      })
      .catch(() => {
        // No existing resume, or a transient failure — fall back to a blank
        // builder starting at step 1 rather than blocking the page.
      })
      .finally(() => {
        if (!cancelled) setLoadingExisting(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const updateData = (fields) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  /**
   * Sends the collected answers to POST /api/resume/generate (Path B). The
   * payload is shaped to the backend's canonical ParsedResume contract —
   * fields it does not model (city, per-role description) are dropped rather
   * than sent and silently discarded.
   */
  const submitResume = async (overrides = {}) => {
    const merged = { ...data, ...overrides };
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        fullName: merged.fullName,
        preferredCountry: toBackendCountry(merged.preferredCountry),
        desiredTitles: merged.desiredTitles || [],
        skills: merged.skills || [],
        pastRoles: (merged.pastRoles || []).map((r) => ({
          title: r.title,
          company: r.company,
          durationMonths: r.durationMonths,
        })),
        // EducationStep only collects a degree now (no institution field) —
        // sending institution here would just submit `undefined` for it.
        education: (merged.education || []).map((e) => ({
          degree: e.degree,
        })),
      };

      return await generateResume(payload);
    } catch (err) {
      setSubmitError(err.message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ResumeBuilderContext.Provider
      value={{
        step,
        setStep,
        data,
        updateData,
        nextStep,
        prevStep,
        submitResume,
        submitting,
        submitError,
        loadingExisting,
        isEditMode,
      }}
    >
      {children}
    </ResumeBuilderContext.Provider>
  );
}

export function useResumeBuilder() {
  const ctx = useContext(ResumeBuilderContext);
  if (!ctx) throw new Error('useResumeBuilder must be used within ResumeBuilderProvider');
  return ctx;
}