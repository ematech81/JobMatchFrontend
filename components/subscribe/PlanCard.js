import { formatPlanPrice } from '@/lib/format';

const TAGLINES = {
  trial: 'Try it before you commit.',
  monthly: 'Best value for an ongoing search.',
};

export default function PlanCard({ plan, highlighted, selecting, onSelect }) {
  return (
    <div
      className={`bg-white rounded-xl p-stack-lg flex flex-col relative overflow-hidden h-full ${
        highlighted
          ? 'border-2 border-electric-blue shadow-[0px_4px_20px_rgba(15,23,42,0.08)]'
          : 'border border-border-subtle'
      }`}
    >
      <div className={`absolute top-0 left-0 w-full ${highlighted ? 'h-1.5 bg-electric-blue' : 'h-1 bg-surface-variant'}`} />

      {highlighted && (
        <div className="absolute top-4 right-4 bg-primary-fixed text-on-secondary-fixed-variant px-3 py-1 rounded-full font-label-md text-label-md">
          Best Value
        </div>
      )}

      <div className="mb-stack-lg flex-grow mt-2">
        <h3 className="font-headline-md text-headline-md text-deep-navy mb-stack-sm">{plan.label}</h3>
        <p className="font-body-md text-body-md text-slate-gray mb-stack-md">{TAGLINES[plan.id] || plan.description}</p>

        <div className="flex items-baseline gap-1 mb-stack-lg">
          <span className="font-display-lg text-display-lg text-deep-navy">
            {formatPlanPrice(plan.amount, plan.currency)}
          </span>
          <span className="font-body-md text-body-md text-slate-gray">
            {plan.interval === 'trial' ? ` / ${plan.trialDays} days` : '/month'}
          </span>
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant">{plan.description}</p>
      </div>

      <button
        type="button"
        onClick={onSelect}
        disabled={selecting}
        className={`w-full font-button text-button py-3 rounded-lg transition-colors mt-auto disabled:opacity-60 ${
          highlighted
            ? 'bg-electric-blue text-on-primary hover:bg-secondary-container shadow-sm'
            : 'border-2 border-electric-blue text-electric-blue hover:bg-surface-container-low'
        }`}
      >
        {selecting ? 'Selecting…' : `Choose ${plan.label}`}
      </button>
    </div>
  );
}
