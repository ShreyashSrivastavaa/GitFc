/**
 * Global Counter Service for GitFC
 * Communicates with /api/stats/count and /api/stats/increment.
 * Provides atomic serverless persistent counting with local storage caching,
 * instant optimistic UI updates, and non-blocking background error handling.
 */

export interface CounterStats {
  totalGenerations: number;
  formattedCount: string;
  lastUpdated: string;
}

export const FALLBACK_BASELINE = 142;
export const LOCAL_CACHE_KEY = 'gitfc_counter_cache';

export function formatGenerationsCount(count: number): string {
  return count.toLocaleString();
}

/**
 * Reads local cached count from localStorage synchronously for instant mount without layout shift
 */
export function getCounterStatsSync(): CounterStats {
  if (typeof localStorage !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (typeof parsed.count === 'number' && parsed.count >= FALLBACK_BASELINE) {
          return {
            totalGenerations: parsed.count,
            formattedCount: formatGenerationsCount(parsed.count),
            lastUpdated: parsed.lastUpdated || new Date().toISOString(),
          };
        }
      }
    } catch {}
  }

  return {
    totalGenerations: FALLBACK_BASELINE,
    formattedCount: formatGenerationsCount(FALLBACK_BASELINE),
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Fetches the live globally-shared generation count from /api/stats/count
 */
export async function fetchLiveCounterStats(): Promise<CounterStats> {
  try {
    const res = await fetch('/api/stats/count', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      const count = typeof data.count === 'number' ? data.count : parseInt(data.count, 10);
      if (!isNaN(count) && count >= FALLBACK_BASELINE) {
        // Update local cache
        if (typeof localStorage !== 'undefined') {
          try {
            localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify({ count, lastUpdated: new Date().toISOString() }));
          } catch {}
        }

        return {
          totalGenerations: count,
          formattedCount: formatGenerationsCount(count),
          lastUpdated: new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.warn('[CounterService] Failed to fetch live counter stats:', err);
  }

  return getCounterStatsSync();
}

/**
 * Atomically increments the persistent global counter via /api/stats/increment.
 * Fails silently in background so user flow is never blocked.
 */
export async function incrementCounterStats(): Promise<CounterStats> {
  let optimisticCount = getCounterStatsSync().totalGenerations + 1;

  // Immediate optimistic event broadcast to UI
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gitfc_counter_updated', { detail: optimisticCount }));
  }

  try {
    const res = await fetch('/api/stats/increment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      if (typeof data.count === 'number' && data.count >= FALLBACK_BASELINE) {
        optimisticCount = data.count;
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify({ count: optimisticCount, lastUpdated: new Date().toISOString() }));
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('gitfc_counter_updated', { detail: optimisticCount }));
        }
      }
    }
  } catch (err) {
    // Non-blocking: fails silently in background
    console.warn('[CounterService] Background increment failed:', err);
  }

  return {
    totalGenerations: optimisticCount,
    formattedCount: formatGenerationsCount(optimisticCount),
    lastUpdated: new Date().toISOString(),
  };
}
