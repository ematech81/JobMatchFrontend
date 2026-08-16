// Testing-period switch, matches api/src/config/env.js's SUBSCRIPTION_GATE_ENABLED
// on the backend — this one only affects where the frontend *navigates*
// (scan screen's button, and RedirectIfAuthed's destination resolution).
// The backend's own copy of this flag is what actually enforces or bypasses
// the paywall on real API requests; this can't do that by itself. Both must
// be flipped together, or a bypassed-navigation user would just hit a 403
// from the still-enforcing backend.
// Defaults to true (gate enforced) if unset, same reasoning as the backend
// — an absent env var must never silently disable the paywall.
export const SUBSCRIPTION_GATE_ENABLED = process.env.NEXT_PUBLIC_SUBSCRIPTION_GATE_ENABLED !== 'false';
