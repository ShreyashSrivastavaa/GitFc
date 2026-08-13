export interface CounterStats {
  totalGenerations: number;
  formattedCount: string;
  lastUpdated: string;
}

const STORAGE_KEY = 'gitcards_total_generations';
const BASE_COUNT = 14523;

export function formatGenerationsCount(count: number): string {
  if (count >= 100000) {
    const k = Math.floor(count / 1000);
    return `${k}K+`;
  }
  // Round down to nearest 100
  const rounded = Math.floor(count / 100) * 100;
  return `${rounded.toLocaleString()}+`;
}

export function getCounterStats(): CounterStats {
  let current = BASE_COUNT;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= BASE_COUNT) {
        current = parsed;
      }
    } else {
      localStorage.setItem(STORAGE_KEY, current.toString());
    }
  } catch (e) {
    console.warn('localStorage not available, using fallback counter', e);
  }

  return {
    totalGenerations: current,
    formattedCount: formatGenerationsCount(current),
    lastUpdated: new Date().toISOString(),
  };
}

export function incrementCounterStats(): CounterStats {
  const stats = getCounterStats();
  const nextCount = stats.totalGenerations + 1;
  try {
    localStorage.setItem(STORAGE_KEY, nextCount.toString());
  } catch (e) {
    console.warn('Failed to update counter in localStorage', e);
  }

  return {
    totalGenerations: nextCount,
    formattedCount: formatGenerationsCount(nextCount),
    lastUpdated: new Date().toISOString(),
  };
}
