const STEPS = [
  {
    icon: 'upload_file',
    title: 'Upload or build your resume',
    description: 'Upload an existing PDF/DOCX and we parse it automatically, or answer a few questions in the guided builder — either way takes minutes.',
  },
  {
    icon: 'bolt',
    title: 'We match you to real jobs',
    description: 'Your skills and desired titles are scored against every job we track, weighted by real overlap — not keyword stuffing.',
  },
  {
    icon: 'workspace_premium',
    title: 'Subscribe to unlock your matches',
    description: 'We show you how many matches we found first. Subscribing is what unlocks the full list and every listing’s details.',
  },
  {
    icon: 'send',
    title: 'Apply with confidence',
    description: 'Every match shows exactly which skills matched and why. Apply straight through to the original listing when you’re ready.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-stack-lg">
      <div className="max-w-container-max mx-auto px-margin-mobile">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-headline-lg text-headline-lg text-deep-navy">How JobMatch Works</h2>
          <p className="text-slate-gray max-w-2xl mx-auto">
            From resume to real matches in four steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-stack-lg">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="bg-white border border-border-subtle rounded-2xl p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-deep-navy text-white text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div className="bg-surface-container w-12 h-12 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-electric-blue text-2xl">{step.icon}</span>
                  </div>
                </div>
                <h3 className="font-headline-md text-deep-navy mb-2">{step.title}</h3>
                <p className="text-slate-gray text-body-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
