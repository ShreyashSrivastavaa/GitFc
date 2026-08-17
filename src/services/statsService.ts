import {
  incrementCounterSafely,
  triggerDebouncedCounterIncrement,
  fetchLiveCounterStats as fetchLiveCounterStatsFromService,
  getCounterStatsSync as getCounterStatsSyncFromService,
  formatGenerationsCount as formatGenerationsCountFromService,
  type CounterStats,
} from './counterService';

export type { CounterStats };

export function formatGenerationsCount(count: number): string {
  return formatGenerationsCountFromService(count);
}

export function getCounterStatsSync(): CounterStats {
  return getCounterStatsSyncFromService();
}

export function getCounterStats(): CounterStats {
  return getCounterStatsSync();
}

export async function fetchLiveCounterStats(): Promise<CounterStats> {
  return fetchLiveCounterStatsFromService();
}

export async function incrementCounterStats(): Promise<CounterStats> {
  const count = await triggerDebouncedCounterIncrement();
  return {
    totalGenerations: count,
    formattedCount: formatGenerationsCountFromService(count),
    lastUpdated: new Date().toISOString(),
  };
}

export { incrementCounterSafely, triggerDebouncedCounterIncrement };
