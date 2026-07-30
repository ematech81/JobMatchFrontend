
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