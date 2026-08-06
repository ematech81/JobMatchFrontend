const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

/**
 * Next hands dynamic route segments back still percent-encoded, so JSearch ids
 * (which end in "==") arrive as "...%3D%3D". Encoding those again would send
 * "%253D%253D" upstream and 404. Decode first, then encode exactly once.
 * Falls back to the raw value if it is not valid percent-encoding.
 */
export function normalizeJobId(jobId) {
  try {
    return decodeURIComponent(jobId);
  } catch {
    return jobId;
  }
}

export async function fetchJobsByCountry({ country, page = 1, limit = 10 }) {
  try {
    const params = new URLSearchParams({ country, page, limit });
    const res = await fetch(`${API_BASE_URL}/jobs/search?${params.toString()}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { jobs: [], count: 0, source: null };
    const data = await res.json();
    return { jobs: data.jobs || [], count: data.count || 0, source: data.source };
  } catch (err) {
    console.error('[fetchJobsByCountry] failed:', err.message);
    return { jobs: [], count: 0, source: null };
  }
}

export async function fetchJobById(jobId) {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs/${encodeURIComponent(normalizeJobId(jobId))}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.job || null;
  } catch (err) {
    console.error('[fetchJobById] failed:', err.message);
    return null;
  }
}

export async function fetchSimilarJobs(jobId) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/jobs/${encodeURIComponent(normalizeJobId(jobId))}/similar`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.jobs || [];
  } catch (err) {
    console.error('[fetchSimilarJobs] failed:', err.message);
    return [];
  }
}