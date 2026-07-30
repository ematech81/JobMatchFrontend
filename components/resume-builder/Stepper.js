'use client';

const STEPS = [
  { id: 1, label: 'Personal Info', icon: 'person' },
  { id: 2, label: 'Experience', icon: 'work' },
  { id: 3, label: 'Education', icon: 'school' },
  { id: 4, label: 'Skills', icon: 'star' },
];

export default function Stepper({ currentStep }) {
  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;
  const overallPercent = (currentStep / STEPS.length) * 100;

  return (
    <div className="w-full max-w-2xl mb-stack-lg">
      <div className="flex justify-between items-center relative mb-stack-sm">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-outline-variant -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-electric-blue -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />

        {STEPS.map((s) => {
          const isActive = s.id === currentStep;
          const isComplete = s.id < currentStep;

          return (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-stack-sm">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all
                  ${isActive
                    ? 'bg-electric-blue text-white shadow-lg shadow-electric-blue/20'
                    : isComplete
                      ? 'bg-match-success text-white'
                      : 'bg-surface-container-high border border-outline-variant text-slate-gray'
                  }
                `}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isComplete ? 'check' : s.icon}
                </span>
              </div>
              <span
                className={`font-label-md text-label-md ${
                  isActive || isComplete ? 'text-deep-navy' : 'text-slate-gray'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden mt-stack-md">
        <div
          className="h-full bg-gradient-to-r from-electric-blue to-secondary-container transition-all duration-700 ease-out"
          style={{ width: `${overallPercent}%` }}
        />
      </div>
    </div>
  );
}