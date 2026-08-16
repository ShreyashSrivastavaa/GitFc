export interface CounterStats {
  totalGenerations: number;
  formattedCount: string;
  lastUpdated: string;
}

const STORAGE_KEY = 'gitcards_global_generations_cache_v4';
const FALLBACK_BASELINE = 42; // Real live baseline count

export function formatGenerationsCount(count: number): string {
  return count.toLocaleString();
}

export function getCounterStatsSync(): CounterStats {
  let current = FALLBACK_BASELINE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= 1) {
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
    // Try primary endpoint (/api/stats) or direct CounterAPI fallback
    const res = await fetch('/api/stats').catch(() => null);
    if (res && res.ok) {
      const data = await res.json();
      if (data && typeof data.count === 'number') {
        saveLocalCache(data.count);
        return {
          totalGenerations: data.count,
          formattedCount: formatGenerationsCount(data.count),
          lastUpdated: new Date().toISOString(),
        };
      }
    }

    // Direct CounterAPI fallback if Vercel serverless is cold
    const counterRes = await fetch('https://api.counterapi.dev/v1/gitfc_official_v1/total_card_generations');
    if (counterRes.ok) {
      const data = await counterRes.json();
      if (data && typeof data.count === 'number') {
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
  const current = getCounterStatsSync();
  const nextCount = current.totalGenerations + 1;
  saveLocalCache(nextCount);

  try {
    // Fire increment request to backend
    fetch('/api/stats', { method: 'POST' }).catch(() => {
      fetch('https://api.counterapi.dev/v1/gitfc_official_v1/total_card_generations/up').catch(() => {});
    });
  } catch (err) {
    console.warn('Failed to fire global counter increment', err);
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

// Backward compatibility helper
export function getCounterStats(): CounterStats {
  return getCounterStatsSync();
}
