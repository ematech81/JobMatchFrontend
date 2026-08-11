'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useResumeBuilder, COUNTRIES } from '@/lib/ResumeBuilderContext';
import { useAuth } from '@/lib/AuthContext';

export default function PersonalInfoStep() {
  const { data, updateData, nextStep } = useResumeBuilder();
  const { user } = useAuth();

  // The builder's own state (data.fullName) wins if the user already typed
  // something here and stepped back — only fall back to the signed-in
  // account's name when this step hasn't been touched yet.
  const [fullName, setFullName] = useState(data.fullName || user?.fullName || '');
  const [titlesInput, setTitlesInput] = useState(data.desiredTitles.join(', '));
  const [country, setCountry] = useState(data.preferredCountry);
  const [city, setCity] = useState(data.city);
  const [error, setError] = useState(null);

  const handleNext = () => {
    const missing = [];
    if (!fullName.trim()) missing.push('your name');
    if (!titlesInput.trim()) missing.push('at least one job title');
    if (!country) missing.push('preferred country');

    if (missing.length > 0) {
      setError(`Please fill in ${missing.join(', ')}.`);
      return;
    }

    updateData({
      fullName: fullName.trim(),
      desiredTitles: titlesInput.split(',').map((t) => t.trim()).filter(Boolean),
      preferredCountry: country,
      city: city.trim(),
    });

    nextStep();
  };

  return (
    <section className="w-full max-w-2xl bg-surface-container-lowest rounded-xl border border-border-subtle shadow-sm p-stack-lg md:p-12 transition-all duration-300 hover:shadow-md">
      <div className="mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg text-deep-navy mb-stack-sm">
          Let&apos;s start with the basics
        </h1>
        <p className="font-body-md text-body-md text-slate-gray">
          Providing accurate personal information helps our AI match you with companies looking
          for your specific profile and location.
        </p>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container text-body-sm px-4 py-3 rounded-lg mb-stack-md">
          {error}
        </div>
      )}

      <div className="space-y-stack-md">
        <div className="space-y-base">
          <label
            htmlFor="full_name"
            className="font-label-md text-label-md text-deep-navy block uppercase tracking-wider"
          >
            Full Name
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-gray group-focus-within:text-electric-blue transition-colors">
              person
            </span>
            <input
              id="full_name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Alex Johnson"
              className="w-full pl-12 pr-4 py-3 bg-white border border-border-subtle rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-all placeholder:text-slate-gray/50"
            />
          </div>
        </div>

        <div className="space-y-base">
          <label
            htmlFor="job_titles"
            className="font-label-md text-label-md text-deep-navy block uppercase tracking-wider"
          >
            Desired Job Title(s)
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-gray group-focus-within:text-electric-blue transition-colors">
              work_outline
            </span>
            <input
              id="job_titles"
              type="text"
              value={titlesInput}
              onChange={(e) => setTitlesInput(e.target.value)}
              placeholder="Senior Product Designer, Lead UX..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-border-subtle rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-all placeholder:text-slate-gray/50"
            />
          </div>
          <p className="font-body-sm text-body-sm text-slate-gray italic">
            Separate multiple titles with commas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          <div className="space-y-base">
            <label
              htmlFor="country"
              className="font-label-md text-label-md text-deep-navy block uppercase tracking-wider"
            >
              Preferred Country
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-gray group-focus-within:text-electric-blue transition-colors">
                public
              </span>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-border-subtle rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-all appearance-none cursor-pointer"
              >
                <option disabled value="">
                  Select country
                </option>
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-slate-gray">
                expand_more
              </span>
            </div>
          </div>

          <div className="space-y-base">
            <label
              htmlFor="location"
              className="font-label-md text-label-md text-deep-navy block uppercase tracking-wider"
            >
              City / Region
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-gray group-focus-within:text-electric-blue transition-colors">
                location_on
              </span>
              <input
                id="location"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full pl-12 pr-4 py-3 bg-white border border-border-subtle rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-all placeholder:text-slate-gray/50"
              />
            </div>
          </div>
        </div>

        <div className="pt-stack-lg border-t border-border-subtle mt-stack-lg">
          <div className="flex items-center gap-stack-md p-stack-md bg-surface-container-low rounded-lg">
            <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border border-border-subtle relative">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9V1_6Mh7MwIy5bLwMN9wB29AGisuT3e3__1amkcGoyLMpz-1yS1IGGhRFRVGo7tG_2pnsTkO1We1pJm4lAQrNXI9_E48gfGyQrC1FlGrN749H9l0BHTHYDUHR3-d2Hz1cgTnLlOXm00AZro6sTSGswxSacqjR9TyhiOehudvdcqtmgge_QO9hRgm1NQPlLNobfubnN5UniY-vEWMyipsvdmcSe_zcc-_iZsFOG6kDizyFRiQ6cg6U-i0ZOL08xh6PL72tBX_bR7c"
                alt="Productive workspace"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-body-sm text-body-sm font-semibold text-deep-navy">
                Why this matters?
              </p>
              <p className="font-body-sm text-body-sm text-slate-gray">
                Recruiters prioritize localized searches and role-specific titles to ensure
                culture and skill alignment.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-stack-lg mt-stack-lg border-t border-border-subtle">
          <button
            type="button"
            onClick={handleNext}
            className="group flex items-center gap-stack-sm bg-electric-blue text-white px-8 py-3 rounded-lg font-button text-button hover:bg-secondary transition-all active:scale-[0.97] shadow-lg shadow-electric-blue/10"
          >
            Next Step
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}