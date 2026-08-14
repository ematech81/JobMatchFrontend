'use client';

/**
 * Browser-side API client for authenticated endpoints. Token handling exists
 * in exactly one place here — every real data read in the app (jobs,
 * matches, resume, subscription) requires it, so there's no unauthenticated
 * counterpart to reach for anymore.
 */
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    // Machine-readable reason for 403s from requireResume/requireActiveSubscription
    // (ONBOARDING_REQUIRED / SUBSCRIPTION_REQUIRED) — lets callers redirect to the
    // right next step instead of just showing a generic error. Absent on most
    // other errors.
    this.code = code;
  }
}

async function request(path, { method = 'GET', body, auth = true, raw = false } = {}) {
  const headers = {};
  if (auth) {
    const token = getToken();
    if (!token) throw new ApiError('Not authenticated', 401);
    headers.Authorization = `Bearer ${token}`;
  }

  // FormData sets its own multipart boundary — never override it.
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body && !isFormData) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (raw) {
    if (!res.ok) throw new ApiError('Request failed', res.status);
    return res.blob();
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.message || `Request failed (${res.status})`, res.status, data.code);
  return data;
}

/* ---------- auth ---------- */
export const getMe = () => request('/auth/me');
export const updateMe = (fields) => request('/auth/me', { method: 'PATCH', body: fields });
export const changePassword = (currentPassword, newPassword) =>
  request('/auth/me/password', { method: 'PATCH', body: { currentPassword, newPassword } });
export const deleteAccount = (password) =>
  request('/auth/me', { method: 'DELETE', body: { password } });
export const exportMyData = () => request('/auth/me/export', { raw: true });
// No auth — the token itself is the proof, and the browser that clicks the
// link may not be signed in at all (different device than the one that
// registered).
export const verifyEmail = (token) => request('/auth/verify-email', { method: 'POST', body: { token }, auth: false });
export const resendVerification = () => request('/auth/resend-verification', { method: 'POST' });
// Same reasoning as verifyEmail — you're signed out precisely because you
// forgot your password, so neither of these can require a token.
export const forgotPassword = (email) => request('/auth/forgot-password', { method: 'POST', body: { email }, auth: false });
export const resetPassword = (token, newPassword) =>
  request('/auth/reset-password', { method: 'POST', body: { token, newPassword }, auth: false });

/* ---------- resume ---------- */
export const getMyResume = () => request('/resume/me');
export const updateMyResume = (fields) => request('/resume/me', { method: 'PUT', body: fields });
export const generateResume = (answers) =>
  request('/resume/generate', { method: 'POST', body: answers });
export const uploadResume = (file) => {
  const form = new FormData();
  form.append('resume', file);
  return request('/resume/upload', { method: 'POST', body: form });
};
export const downloadResumePdf = () => request('/resume/me/pdf', { raw: true });

/* ---------- matches ---------- */
/**
 * `sort: 'score'` (default) powers the match grid; `sort: 'recent'` powers the
 * live activity feed. Same collection, two orderings.
 */
export const getMyMatches = ({ sort, limit } = {}) => {
  const params = new URLSearchParams();
  if (sort) params.set('sort', sort);
  if (limit) params.set('limit', limit);
  const qs = params.toString();
  return request(`/matches${qs ? `?${qs}` : ''}`);
};
export const rerunMatches = () => request('/matches/rerun', { method: 'POST' });
export const getScanSummary = () => request('/matches/scan-summary');
export const getMatchForJob = (jobId) => request(`/matches/job/${encodeURIComponent(jobId)}`);

/* ---------- jobs ----------
 * All real job data — search, a single job, similar jobs, saved jobs — now
 * requires auth + a completed resume + an active subscription (see
 * requireResume/requireActiveSubscription on the API). These used to be
 * fetched unauthenticated from lib/api.js as Server Component reads; that
 * was the actual hole behind "Find Jobs shows real data to anyone."
 */
// The one deliberate exception: an aggregate count, not a listing — safe to
// expose publicly, and what the homepage's live-stats section uses instead
// of a made-up number.
export const getPublicJobStats = () => request('/jobs/stats', { auth: false });
export const searchJobs = ({ country, page = 1, limit = 10, jobType = [], datePosted } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (country) params.set('country', country);
  jobType.forEach((type) => params.append('jobType', type));
  if (datePosted) params.set('datePosted', datePosted);
  return request(`/jobs/search?${params.toString()}`);
};
export const getJobDetail = (jobId) => request(`/jobs/${encodeURIComponent(jobId)}`);
export const getSimilarJobsForJob = (jobId) => request(`/jobs/${encodeURIComponent(jobId)}/similar`);
export const getSavedJobs = () => request('/jobs/saved');
export const saveJob = (jobId) =>
  request(`/jobs/${encodeURIComponent(jobId)}/save`, { method: 'POST' });
export const unsaveJob = (jobId) =>
  request(`/jobs/${encodeURIComponent(jobId)}/save`, { method: 'DELETE' });

/* ---------- subscription ---------- */
export const getPlans = () => request('/subscription/plans', { auth: false });
export const getMySubscription = () => request('/subscription/me');
export const startCheckout = (planId) =>
  request('/subscription/checkout', { method: 'POST', body: { planId } });

export { ApiError };
