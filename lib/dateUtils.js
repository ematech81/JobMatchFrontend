export function computeDurationMonths(startDate, endDate, isCurrent) {
    if (!startDate) return 0;
  
    const [startYear, startMonth] = startDate.split('-').map(Number);
    const now = new Date();
    const [endYear, endMonth] = isCurrent
      ? [now.getFullYear(), now.getMonth() + 1]
      : (endDate ? endDate.split('-').map(Number) : [startYear, startMonth]);
  
    const months = (endYear - startYear) * 12 + (endMonth - startMonth);
    return Math.max(months, 0);
  }