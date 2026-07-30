'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [keywords, setKeywords] = useState('');
  const [country, setCountry] = useState('');
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keywords) params.set('q', keywords);
    if (country) params.set('country', country);
    router.push(`/jobs/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`
        bg-white p-2 rounded-xl shadow-xl border flex flex-col md:flex-row gap-2 max-w-2xl
        transition-all
        ${focused ? 'ring-2 ring-electric-blue/20 border-electric-blue' : 'border-border-subtle'}
      `}
    >
      <div className="flex-1 flex items-center px-4 gap-2">
        <span className="material-symbols-outlined text-slate-gray">search</span>
        <input
          className="w-full border-none focus:ring-0 text-body-md bg-transparent"
          placeholder="Job title or keywords"
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
      <div className="w-px bg-border-subtle hidden md:block h-8 self-center" />
      <div className="flex-1 flex items-center px-4 gap-2">
        <span className="material-symbols-outlined text-slate-gray">public</span>
        <input
          className="w-full border-none focus:ring-0 text-body-md bg-transparent"
          placeholder="Search by Country"
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
      <button
        type="submit"
        className="bg-deep-navy text-white px-8 py-3 rounded-lg font-button hover:bg-black transition-colors"
      >
        Search
      </button>
    </form>
  );
}