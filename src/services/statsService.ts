/**
 * Global Counter Service for GitFC
 * Communicates with /api/stats/count and /api/stats/increment.
 * Includes direct Upstash REST fallback for local development (npm run dev / vite preview),
 * instant optimistic UI updates, and non-blocking background error handling.
 */

export interface CounterStats {
  totalGenerations: number;
  formattedCount: string;
  lastUpdated: string;
}

export const FALLBACK_BASELINE = 142;
export const LOCAL_CACHE_KEY = 'gitfc_counter_cache';

const UPSTASH_REST_URL = 'https://verified-redfish-198404.upstash.io';
const UPSTASH_REST_TOKEN = 'gQAAAAAAAwcEAAIgcDE3ZDRhOTVjYjBhMjI0MjVhOWFiZDliMTQwYWI0M2M5MQ';

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
 * Fetches the live globally-shared generation count.
 * First tries the Vercel serverless route /api/stats/count, and if in local Vite mode falls back to direct Upstash REST.
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
        saveLocalCache(count);
        return {
          totalGenerations: count,
          formattedCount: formatGenerationsCount(count),
          lastUpdated: new Date().toISOString(),
        };
      }
    }
  } catch {
    // /api/stats/count is not running locally (e.g. standard vite dev server)
  }

  // Direct Upstash fallback (for local dev / preview where Vercel serverless is not hosted)
  try {
    const upstashRes = await fetch(`${UPSTASH_REST_URL}/get/gitfc:card_generations`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${UPSTASH_REST_TOKEN}`,
      },
    });

    if (upstashRes.ok) {
      const data = await upstashRes.json();
      const count = typeof data.result === 'number' ? data.result : parseInt(data.result, 10);
      if (!isNaN(count) && count >= FALLBACK_BASELINE) {
        saveLocalCache(count);
        return {
          totalGenerations: count,
          formattedCount: formatGenerationsCount(count),
          lastUpdated: new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.warn('[CounterService] Failed to fetch live count from Upstash REST:', err);
  }

  return getCounterStatsSync();
}

/**
 * Atomically increments the persistent global counter.
 * Tries serverless /api/stats/increment first, then direct Upstash REST /incr.
 * Broadcasts optimistic updates immediately to the UI.
 */
export async function incrementCounterStats(): Promise<CounterStats> {
  let optimisticCount = getCounterStatsSync().totalGenerations + 1;

  // Immediate optimistic event broadcast to UI
  broadcastCount(optimisticCount);

  let incrementSuccess = false;

  // 1. Try Vercel Serverless Route
  try {
    const res = await fetch('/api/stats/increment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      if (typeof data.count === 'number' && data.count >= FALLBACK_BASELINE) {
        optimisticCount = data.count;
        saveLocalCache(optimisticCount);
        broadcastCount(optimisticCount);
        incrementSuccess = true;
      }
    }
  } catch {
    // Serverless route unavailable (e.g. running on Vite localhost)
  }

  // 2. Direct Upstash REST /incr fallback if serverless route was not reachable
  if (!incrementSuccess) {
    try {
      const upstashRes = await fetch(`${UPSTASH_REST_URL}/incr/gitfc:card_generations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${UPSTASH_REST_TOKEN}`,
        },
      });

      if (upstashRes.ok) {
        const data = await upstashRes.json();
        const count = typeof data.result === 'number' ? data.result : parseInt(data.result, 10);
        if (!isNaN(count) && count >= FALLBACK_BASELINE) {
          optimisticCount = count;
          saveLocalCache(optimisticCount);
          broadcastCount(optimisticCount);
        }
      }
    } catch (err) {
      console.warn('[CounterService] Background Upstash REST increment error:', err);
    }
  }

  return {
    totalGenerations: optimisticCount,
    formattedCount: formatGenerationsCount(optimisticCount),
    lastUpdated: new Date().toISOString(),
  };
}

function saveLocalCache(count: number) {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify({ count, lastUpdated: new Date().toISOString() }));
    } catch {}
  }
}

function broadcastCount(count: number) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gitfc_counter_updated', { detail: count }));
  }
}
