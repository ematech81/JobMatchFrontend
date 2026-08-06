'use client';

/**
 * Browser-side API client for authenticated endpoints.
 *
 * lib/api.js stays server-only (it uses `next: { revalidate }`, which is not
 * valid in the browser) and covers public job reads. Anything needing the
 * user's JWT lives here so token handling exists in exactly one place.
 */
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
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
  if (!res.ok) throw new ApiError(data.message || `Request failed (${res.status})`, res.status);
  return data;
}

/* ---------- auth ---------- */
export const getMe = () => request('/auth/me');

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
export const getMatchForJob = (jobId) => request(`/matches/job/${encodeURIComponent(jobId)}`);

/* ---------- jobs ---------- */
export const getSavedJobs = () => request('/jobs/saved');
export const saveJob = (jobId) =>
  request(`/jobs/${encodeURIComponent(jobId)}/save`, { method: 'POST' });

export { ApiError };
