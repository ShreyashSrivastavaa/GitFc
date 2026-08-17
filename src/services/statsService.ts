export interface CounterStats {
  totalGenerations: number;
  formattedCount: string;
  lastUpdated: string;
}

const STORAGE_KEY = 'gitcards_global_generations_cache_v5';
const FALLBACK_BASELINE = 142; // Current global baseline

export function formatGenerationsCount(count: number): string {
  return count.toLocaleString();
}

export function getCounterStatsSync(): CounterStats {
  let current = FALLBACK_BASELINE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= FALLBACK_BASELINE) {
        current = parsed;
      }
    }
  } catch (e) {
    // fallback
  }

  return {
    totalGenerations: current,
    formattedCount: formatGenerationsCount(current),
    lastUpdated: new Date().toISOString(),
  };
}

export async function fetchLiveCounterStats(): Promise<CounterStats> {
  try {
    const res = await fetch('/api/stats', { cache: 'no-store' }).catch(() => null);
    if (res && res.ok) {
      const data = await res.json();
      if (data && typeof data.count === 'number' && data.count >= FALLBACK_BASELINE) {
        saveLocalCache(data.count);
        return {
          totalGenerations: data.count,
          formattedCount: formatGenerationsCount(data.count),
          lastUpdated: new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.warn('Unable to fetch live global counter, using cached value', err);
  }

  return getCounterStatsSync();
}

export async function incrementCounterStats(): Promise<CounterStats> {
  let nextCount = getCounterStatsSync().totalGenerations + 1;
  saveLocalCache(nextCount);

  try {
    const res = await fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => null);

    if (res && res.ok) {
      const data = await res.json();
      if (data && typeof data.count === 'number') {
        nextCount = data.count;
        saveLocalCache(nextCount);
      }
    }
  } catch (err) {
    console.warn('Failed to post global counter increment', err);
  }

  // Dispatch custom event to notify UI
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gitfc_counter_updated', { detail: nextCount }));
  }

  return {
    totalGenerations: nextCount,
    formattedCount: formatGenerationsCount(nextCount),
    lastUpdated: new Date().toISOString(),
  };
}

function saveLocalCache(count: number) {
  try {
    localStorage.setItem(STORAGE_KEY, count.toString());
  } catch (e) {}
}

export function getCounterStats(): CounterStats {
  return getCounterStatsSync();
}
