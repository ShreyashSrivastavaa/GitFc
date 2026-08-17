/**
 * Counter Service for GitCards
 * Manages developer card generation counters with request deduplication,
 * 500ms debouncing, 60s Set throttling per user, 3-attempt exponential backoff retries,
 * localStorage state tracking, offline fallback, and structured console logging.
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

export const COUNTER_DEBOUNCE_MS = 500;
export const SESSION_COUNTER_KEY = 'gitcards_counter_session';
export const USER_ID_KEY = 'gitcards_user_id';
export const FALLBACK_BASELINE = 142;

// In-memory set for 60-second request deduplication per user
const lastCounterUpdate = new Set<string>();

// Expose set on window for quick browser debugging
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
  const delays = [0, 2000, 4000, 8000];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      const delay = delays[attempt] || 8000;
      console.log(`[CounterService] Retrying API call (Attempt ${attempt}/${maxRetries}) after ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

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
 * Clean up old keys from lastCounterUpdate Set (keep entries from current minute)
 */
function cleanupExpiredThrottleKeys() {
  const currentBucket = Math.floor(Date.now() / 60000);
  for (const key of lastCounterUpdate) {
    const parts = key.split('_');
    const bucket = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(bucket) && currentBucket - bucket > 1) {
      lastCounterUpdate.delete(key);
    }
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Increment counter safely with deduplication, throttling, retries, and offline fallback.
 */
export async function incrementCounterSafely(): Promise<number> {
  cleanupExpiredThrottleKeys();

  const userId = getUserId();
  const minuteBucket = Math.floor(Date.now() / 60000);
  const key = `${userId}_${minuteBucket}`;

  if (lastCounterUpdate.has(key)) {
    console.group('GitCards Counter Service');
    console.log('Counter already incremented this minute for user key:', key);
    console.groupEnd();
    return getStoredSessionData().count;
  }

  lastCounterUpdate.add(key);

  console.group('GitCards Counter Service');
  console.log('generation_success');
  console.log('counter_increment_attempt', {
    userId,
    key,
    timestamp: new Date().toISOString(),
  });

  try {
    // Try primary serverless proxy first, fall back to direct CounterAPI endpoint
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

    if (!response || !response.ok) {
      throw new Error(`Counter API returned status ${response?.status || 'network_error'}`);
    }

    const data = await response.json();
    const newCount = data.value ?? data.count ?? data?.data?.up_count;

    if (typeof newCount !== 'number' || isNaN(newCount)) {
      throw new Error('Invalid count received from Counter API');
    }

    const stored = getStoredSessionData();
    const updatedData: CounterSessionData = {
      count: Math.max(newCount, stored.count + 1),
      lastCounterUpdate: Date.now(),
      totalGenerated: stored.totalGenerated + 1,
      lastUserId: userId,
      timestamp: Date.now(),
      fallback: false,
    };

    saveSessionData(updatedData);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('gitfc_counter_updated', { detail: updatedData.count })
      );
    }

    console.log('counter_success', {
      count: updatedData.count,
      timestamp: new Date().toISOString(),
    });
    console.groupEnd();

    return updatedData.count;
  } catch (err: any) {
    console.warn('counter_failure', err?.message || err);

    // Fallback: local tracking
    const stored = getStoredSessionData();
    const fallbackCount = stored.count + 1;

    const fallbackData: CounterSessionData = {
      count: fallbackCount,
      lastCounterUpdate: Date.now(),
      totalGenerated: stored.totalGenerated + 1,
      lastUserId: userId,
      timestamp: Date.now(),
      fallback: true,
    };

    saveSessionData(fallbackData);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('gitfc_counter_updated', { detail: fallbackCount })
      );
    }

    console.log('counter_fallback_applied', {
      fallbackCount,
      timestamp: new Date().toISOString(),
    });
    console.groupEnd();

    return fallbackCount;
  }
}

/**
 * Trigger counter increment debounced by 500ms
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

// Background sync every 5 minutes and on unload
if (typeof window !== 'undefined') {
  setInterval(() => {
    fetchLiveCounterStats().catch(() => {});
  }, 5 * 60 * 1000);
}
