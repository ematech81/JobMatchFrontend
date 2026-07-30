'use client';

import { createContext, useContext, useState } from 'react';

const ResumeBuilderContext = createContext(null);

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

  const updateData = (fields) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <ResumeBuilderContext.Provider
      value={{ step, setStep, data, updateData, nextStep, prevStep }}
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