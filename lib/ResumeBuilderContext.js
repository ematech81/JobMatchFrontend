'use client';

import { createContext, useContext, useState } from 'react';
import { generateResume } from './apiClient';

const ResumeBuilderContext = createContext(null);

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
  if (!value) return '';
  return COUNTRY_CODE_MAP[String(value).toLowerCase()] || value;
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

export function ResumeBuilderProvider({ children }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const updateData = (fields) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
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
        education: (merged.education || []).map((e) => ({
          degree: e.degree,
          institution: e.institution,
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