'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPlans } from '@/lib/apiClient';
import { formatPlanPrice } from '@/lib/format';

// Fetches the real, live plan config (same source subscribe/plans reads
// from) rather than hardcoding numbers here that could drift out of sync
// with what's actually sold.
export default function PricingPreview() {
  const [plans, setPlans] = useState(null);

  useEffect(() => {
    getPlans()
      .then(({ plans }) => setPlans(plans))
      .catch(() => {});
  }, []);

  if (!plans) return null;

  return (
    <section className="py-stack-lg bg-surface-container-low">
      <div className="max-w-container-max mx-auto px-margin-mobile">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-headline-lg text-headline-lg text-deep-navy">Simple, Honest Pricing</h2>
          <p className="text-slate-gray max-w-2xl mx-auto">
            No free tier, no hidden fees — just what it costs to unlock your matches.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-stack-lg max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl p-8 border ${
                plan.id === 'monthly' ? 'border-electric-blue border-2 shadow-xl' : 'border-border-subtle'
              }`}
            >
              <h3 className="font-headline-md text-headline-md text-deep-navy mb-1">{plan.label}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="font-display-lg text-4xl font-bold text-deep-navy">
                  {formatPlanPrice(plan.amount, plan.currency)}
                </span>
                <span className="text-slate-gray text-body-sm">
                  {plan.interval === 'trial' ? `for ${plan.trialDays} days` : `/ ${plan.interval}`}
                </span>
              </div>
              <p className="text-slate-gray text-body-sm leading-relaxed">{plan.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-electric-blue text-white px-8 py-4 rounded-xl font-button shadow-lg hover:shadow-electric-blue/20 transition-all"
          >
            Get Started
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
