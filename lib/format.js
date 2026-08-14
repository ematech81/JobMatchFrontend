
/** "₦7,000" style formatting, currency-aware (not hardcoded to $) — plans
 * are priced in whatever currency their KoraPay account actually charges
 * in, currently NGN. */
export function formatPlanPrice(amount, currency) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

export function timeAgo(dateString) {
    if (!dateString) return '';
    const diff = Date.now() - new Date(dateString).getTime();
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  }

  /** "6+ Years" style summary from total months of listed experience. */
  export function formatExperience(totalMonths) {
    if (!totalMonths) return 'Not specified';
    const years = Math.floor(totalMonths / 12);
    if (years < 1) return `${totalMonths} months`;
    return `${years}+ Year${years > 1 ? 's' : ''}`;
  }

  export function formatSalary(job) {
    const { job_min_salary, job_max_salary, job_salary_currency, job_salary_period } = job;
    if (!job_min_salary && !job_max_salary) return null;
  
    const symbol =
      { USD: '$', GBP: '£', EUR: '€', NGN: '₦', CAD: 'C$' }[job_salary_currency] ||
      `${job_salary_currency || ''} `;
  
    const short = (n) => (n >= 1000 ? `${Math.round(n / 1000)}k` : n);
    const range =
      job_min_salary && job_max_salary
        ? `${symbol}${short(job_min_salary)} - ${symbol}${short(job_max_salary)}`
        : `${symbol}${short(job_min_salary || job_max_salary)}`;
  
    const period = job_salary_period === 'HOUR' ? '/hr' : job_salary_period === 'MONTH' ? '/mo' : '';
    return `${range}${period}`;
  }
  
  /**
   * ISO 3166-1 alpha-2 ("NG") -> full English name ("Nigeria") for display.
   * Intl.DisplayNames covers every real country code without us maintaining
   * a lookup table — falls back to the raw code for anything it can't
   * resolve (already-a-name input, unsupported browser, bad code).
   */
  export function countryCodeToName(code) {
    if (!code) return '';
    if (code.length !== 2) return code; // already a name, or not a code at all
    try {
      return new Intl.DisplayNames(['en'], { type: 'region' }).of(code.toUpperCase()) || code;
    } catch {
      return code;
    }
  }

  export function formatLocation(job) {
    const parts = [job.job_city, job.job_state, job.country].filter(Boolean);
    const base = parts.join(', ');
    return job.job_is_remote ? `${base} (Remote)` : base;
  }
  
  export function extractSkills(job) {
    const known = [
      'React', 'TypeScript', 'JavaScript', 'Next.js', 'Tailwind CSS', 'Node.js',
      'Python', 'Java', 'GraphQL', 'AWS', 'Docker', 'Kubernetes', 'SQL',
      'MongoDB', 'Figma', 'Vue', 'Angular', 'Go', 'Rust', 'PHP',
    ];
    const text = `${job.job_title || ''} ${job.job_description || ''}`.toLowerCase();
    return known.filter((s) => text.includes(s.toLowerCase())).slice(0, 6);
  }