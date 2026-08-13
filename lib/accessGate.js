import { ApiError } from './apiClient';

/**
 * Single place that turns a 403 from requireResume/requireActiveSubscription
 * into the right next screen. Every gated page's data-fetch catch block
 * calls this instead of inventing its own redirect logic, so "where does an
 * incomplete user go" stays consistent everywhere it comes up.
 *
 * Returns true if it redirected (caller should stop rendering its own error
 * state), false if this wasn't an access-gate error (caller handles it as a
 * normal error).
 */
export function redirectForAccessError(err, router) {
  if (!(err instanceof ApiError) || err.status !== 403) return false;

  if (err.code === 'ONBOARDING_REQUIRED') {
    router.replace('/onboarding');
    return true;
  }
  if (err.code === 'SUBSCRIPTION_REQUIRED') {
    router.replace('/subscribe/plans');
    return true;
  }
  return false;
}
