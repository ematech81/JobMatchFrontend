
'use client';

import { useEffect, useState } from 'react';

export default function ProgressLoop() {
  const [width, setWidth] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setWidth((prev) => (prev < 90 ? prev + 15 : 15));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="font-label-md text-label-md text-white/60">Profile Completeness</span>
        <span className="font-label-md text-label-md text-match-success">Boost +40%</span>
      </div>
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-electric-blue to-match-success transition-all duration-1000"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}