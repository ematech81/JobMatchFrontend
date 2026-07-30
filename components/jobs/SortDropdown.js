'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const OPTIONS = ['Relevance', 'Newest', 'Salary: High to Low'];

export default function SortDropdown() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get('sort') || 'Relevance';

  const handleSelect = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div className="hidden sm:block relative">
      <span className="text-body-sm text-slate-gray">Sort by: </span>
      <button
        onClick={() => setOpen(!open)}
        className="text-on-surface font-semibold text-body-sm inline-flex items-center gap-1"
      >
        {current}
        <span className="material-symbols-outlined text-[18px]">expand_more</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white border border-border-subtle rounded-lg shadow-lg py-2 w-48 z-10">
          {OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className="w-full text-left px-4 py-2 text-body-sm text-on-surface hover:bg-surface-container-low"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}