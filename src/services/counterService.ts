/**
 * Counter Service for GitCards
 * Manages developer card generation counters.
 * Increments the global/local counter on EVERY card generation with instantaneous UI updates,
 * deduplication against same-frame double-triggers, 3-attempt exponential backoff retries,
 * and localStorage fallback.
 */

export interface CounterSessionData {
  count: number;
  lastCounterUpdate: number;
  totalGenerated: number;
  lastUserId: string;
  timestamp: number;
  fallback?: boolean;
}

export interface CounterStats {
  totalGenerations: number;
  formattedCount: string;
  lastUpdated: string;
}

export const COUNTER_DEBOUNCE_MS = 200;
export const SESSION_COUNTER_KEY = 'gitcards_counter_session';
export const USER_ID_KEY = 'gitcards_user_id';
export const FALLBACK_BASELINE = 142;

// In-memory set for microsecond deduplication of exact same event
const lastCounterUpdate = new Set<string>();

if (typeof window !== 'undefined') {
  (window as any).lastCounterUpdateSet = lastCounterUpdate;
}

/**
 * Get or initialize a unique persistent User ID for session tracking
 */
export function getUserId(): string {
  if (typeof localStorage === 'undefined') return 'anon_user';
  try {
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
      userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
  } catch {
    return 'anon_user';
  }
}

export function formatGenerationsCount(count: number): string {
  return count.toLocaleString();
}

/**
 * Reads local counter session data from localStorage
 */
export function getStoredSessionData(): CounterSessionData {
  const userId = getUserId();
  const defaultData: CounterSessionData = {
    count: FALLBACK_BASELINE,
    lastCounterUpdate: 0,
    totalGenerated: 0,
    lastUserId: userId,
    timestamp: Date.now(),
  };

  if (typeof localStorage === 'undefined') return defaultData;

  try {
    const raw = localStorage.getItem(SESSION_COUNTER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.count === 'number' && parsed.count >= FALLBACK_BASELINE) {
        return {
          count: parsed.count,
          lastCounterUpdate: parsed.lastCounterUpdate || parsed.timestamp || Date.now(),
          totalGenerated: parsed.totalGenerated || 0,
          lastUserId: parsed.lastUserId || userId,
          timestamp: parsed.timestamp || Date.now(),
          fallback: parsed.fallback || false,
        };
      }
    }
  } catch (e) {
    console.warn('[CounterService] Failed to read SESSION_COUNTER_KEY from localStorage', e);
  }

  return defaultData;
}

/**
 * Writes counter session data to localStorage
 */
export function saveSessionData(data: CounterSessionData): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(SESSION_COUNTER_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('[CounterService] Failed to write SESSION_COUNTER_KEY to localStorage', e);
  }
}

/**
 * Fetch helper with 3-attempt exponential backoff retry logic (2s, 4s, 8s)
 */
async function fetchWithRetry(url: string, init?: RequestInit, maxRetries = 3): Promise<Response> {
  const delays = [0, 1500, 3000, 5000];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      const delay = delays[attempt] || 5000;
      console.log(`[CounterService] Retrying API call (Attempt ${attempt}/${maxRetries}) after ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(url, {
        ...init,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return response;
      }
      console.warn(`[CounterService] API returned non-OK status: ${response.status} (Attempt ${attempt + 1})`);
    } catch (err: any) {
      console.warn(`[CounterService] Fetch error (Attempt ${attempt + 1}):`, err?.message || err);
    }
  }

  throw new Error(`Failed after ${maxRetries} retries`);
}

/**
 * Clean up old entries from lastCounterUpdate Set
 */
function cleanupExpiredThrottleKeys() {
  const currentBucket = Math.floor(Date.now() / 1000);
  for (const key of lastCounterUpdate) {
    const parts = key.split('_');
    const bucket = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(bucket) && currentBucket - bucket > 2) {
      lastCounterUpdate.delete(key);
    }
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Increment counter on EVERY card generation.
 * Performs instantaneous optimistic local update (+1) and sends background API update.
 */
export async function incrementCounterSafely(customGenId?: string): Promise<number> {
  cleanupExpiredThrottleKeys();

  const userId = getUserId();
  // 300ms window key to deduplicate exact same microtask event double-trigger
  const timeBucket = customGenId || `${userId}_${Math.floor(Date.now() / 300)}`;

  if (lastCounterUpdate.has(timeBucket)) {
    console.log('[CounterService] Suppressed duplicate micro-trigger for same generation');
    return getStoredSessionData().count;
  }
  lastCounterUpdate.add(timeBucket);

  console.group('GitCards Counter Service');
  console.log('generation_success');

  // Optimistically increment local count immediately for instantaneous UI update
  const stored = getStoredSessionData();
  const optimisticCount = stored.count + 1;

  const optimisticData: CounterSessionData = {
    count: optimisticCount,
    lastCounterUpdate: Date.now(),
    totalGenerated: stored.totalGenerated + 1,
    lastUserId: userId,
    timestamp: Date.now(),
    fallback: false,
  };

  saveSessionData(optimisticData);

  // Dispatch custom event to immediately update UsageCounter UI component
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('gitfc_counter_updated', { detail: optimisticCount })
    );
  }

  console.log('counter_increment_attempt', {
    userId,
    optimisticCount,
    timestamp: new Date().toISOString(),
  });

  try {
    let response: Response | null = null;

    try {
      response = await fetchWithRetry('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (proxyErr) {
      console.log('[CounterService] Proxy /api/stats failed, trying direct CounterAPI v1 endpoint...');
      response = await fetchWithRetry(
        'https://api.counterapi.dev/v1/gitfc_app_2026/card_generations/up',
        { method: 'GET' }
      );
    }

    if (response && response.ok) {
      const data = await response.json();
      const serverCount = data.value ?? data.count ?? data?.data?.up_count;

      if (typeof serverCount === 'number' && !isNaN(serverCount)) {
        const finalCount = Math.max(serverCount, optimisticCount);
        const finalData: CounterSessionData = {
          ...optimisticData,
          count: finalCount,
        };

        saveSessionData(finalData);

        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('gitfc_counter_updated', { detail: finalCount })
          );
        }

        console.log('counter_success', {
          count: finalCount,
          timestamp: new Date().toISOString(),
        });
        console.groupEnd();

        return finalCount;
      }
    }
  } catch (err: any) {
    console.warn('counter_api_fallback_used', err?.message || err);
  }

  console.log('counter_local_increment_success', {
    count: optimisticCount,
    timestamp: new Date().toISOString(),
  });
  console.groupEnd();

  return optimisticCount;
}

/**
 * Trigger counter increment debounced by 200ms
 */
export function triggerDebouncedCounterIncrement(): Promise<number> {
  return new Promise((resolve) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(async () => {
      debounceTimer = null;
      const count = await incrementCounterSafely();
      resolve(count);
    }, COUNTER_DEBOUNCE_MS);
  });
}

/**
 * Fetch live stats from API or localStorage cache
 */
export async function fetchLiveCounterStats(): Promise<CounterStats> {
  const stored = getStoredSessionData();

  try {
    let response: Response | null = null;
    try {
      response = await fetchWithRetry('/api/stats', { method: 'GET' }, 1);
    } catch {
      response = await fetchWithRetry(
        'https://api.counterapi.dev/v1/gitfc_app_2026/card_generations',
        { method: 'GET' },
        1
      );
    }

    if (response && response.ok) {
      const data = await response.json();
      const liveCount = data.value ?? data.count ?? data?.data?.up_count;

      if (typeof liveCount === 'number' && !isNaN(liveCount) && liveCount >= FALLBACK_BASELINE) {
        const syncedCount = Math.max(liveCount, stored.count);
        saveSessionData({
          ...stored,
          count: syncedCount,
          timestamp: Date.now(),
        });

        return {
          totalGenerations: syncedCount,
          formattedCount: formatGenerationsCount(syncedCount),
          lastUpdated: new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    // Return stored fallback cleanly
  }

  return {
    totalGenerations: stored.count,
    formattedCount: formatGenerationsCount(stored.count),
    lastUpdated: new Date(stored.timestamp).toISOString(),
  };
}

export function getCounterStatsSync(): CounterStats {
  const stored = getStoredSessionData();
  return {
    totalGenerations: stored.count,
    formattedCount: formatGenerationsCount(stored.count),
    lastUpdated: new Date(stored.timestamp).toISOString(),
  };
}

// Background sync every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    fetchLiveCounterStats().catch(() => {});
  }, 5 * 60 * 1000);
}
