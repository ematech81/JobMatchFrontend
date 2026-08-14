'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/auth/RequireAuth';
import SubscribeHeader from '@/components/subscribe/SubscribeHeader';
import PlanCard from '@/components/subscribe/PlanCard';
import { getPlans, getMyResume, getMySubscription, startCheckout, ApiError } from '@/lib/apiClient';

function PlansContent() {
  const router = useRouter();
  const [plans, setPlans] = useState(null);
  const [error, setError] = useState(null);
  const [selectingId, setSelectingId] = useState(null);
  const [checkoutResult, setCheckoutResult] = useState(null);

  useEffect(() => {
    // Onboarding is a prerequisite for subscribing, not a parallel step —
    // without this, a user could type this URL directly and pay before ever
    // building/uploading a resume.
    getMyResume().catch((err) => {
      if (err instanceof ApiError && err.status === 404) router.replace('/onboarding');
    });

    // Nothing can actually mark a subscription active yet (that needs the
    // real KoraPay webhook), but this check is here so the page does the
    // right thing — skip straight past plan selection — the moment one can.
    getMySubscription()
      .then(({ subscription }) => {
        if (subscription?.status === 'active') router.replace('/matches');
      })
      .catch(() => {});
  }, [router]);

  useEffect(() => {
    getPlans()
      .then(({ plans }) => setPlans(plans))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load plans.'));
  }, []);

  const handleSelect = async (planId) => {
    setSelectingId(planId);
    setError(null);
    setCheckoutResult(null);
    try {
      const { checkout } = await startCheckout(planId);
      if (checkout.configured && checkout.checkoutUrl) {
        // Real KoraPay checkout — leave the app entirely for their hosted
        // payment page. It redirects back to this same URL (with
        // ?reference=) once the customer finishes, per KoraPay's flow. This
        // is a deliberate full navigation, not app state — an SPA route
        // change can't leave the app for an external host.
        // eslint-disable-next-line react-hooks/immutability
        window.location.href = checkout.checkoutUrl;
        return;
      }
      setCheckoutResult({ planId, ...checkout });
    } catch (err) {
      setError(err.message || 'Failed to start checkout. Please try again.');
    } finally {
      setSelectingId(null);
    }
  };

  const selectedPlan = plans?.find((p) => p.id === checkoutResult?.planId);

  return (
    <>
      <SubscribeHeader />

      <main className="min-h-screen px-4 md:px-margin-mobile pt-24 pb-stack-lg">
        <div className="max-w-3xl mx-auto text-center mb-stack-lg">
          <h1 className="font-display-lg text-display-lg text-deep-navy mb-stack-sm">
            Choose your plan
          </h1>
          <p className="font-body-lg text-body-lg text-slate-gray">
            Subscribe to unlock your matches and start applying.
          </p>
        </div>

        {error && <p className="text-error text-body-md text-center mb-stack-lg">{error}</p>}

        {checkoutResult && (
          <div className="max-w-xl mx-auto mb-stack-lg bg-primary-fixed border border-electric-blue/30 rounded-lg p-stack-md text-center">
            <p className="text-deep-navy font-body-md">
              {checkoutResult.configured
                ? // configured but no checkoutUrl means the real KoraPay call
                  // itself failed (see korapayService) — nothing was charged.
                  `Couldn't start checkout for ${selectedPlan?.label || 'that plan'} right now. Please try again in a moment.`
                : `Got it — you selected ${selectedPlan?.label || 'that plan'}. Payment checkout isn't connected yet, so we haven't charged you anything — this is being wired up next.`}
            </p>
          </div>
        )}

        {!plans && !error && (
          <p className="text-center text-slate-gray font-body-md">Loading plans…</p>
        )}

        {plans && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg max-w-3xl mx-auto">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                highlighted={plan.id === 'monthly'}
                selecting={selectingId === plan.id}
                onSelect={() => handleSelect(plan.id)}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default function PlansPage() {
  return (
    <RequireAuth>
      <PlansContent />
    </RequireAuth>
  );
}
