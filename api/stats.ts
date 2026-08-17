import type { VercelRequest, VercelResponse } from '@vercel/node';

const BASELINE_DEFAULT = 142;
const COUNTERAPI_V1_URL = 'https://api.counterapi.dev/v1/gitfc_app_2026/card_generations';

// In-memory fallback counter for serverless container lifecycle
let inMemoryIncrementCount = 0;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      console.log('[API /api/stats] Received POST request to increment counter');
      const nextCount = await incrementGlobalCount();
      console.log('[API /api/stats] Increment output next count:', nextCount);
      return res.status(200).json({ count: nextCount, value: nextCount, source: 'global_counter_inc' });
    }

    // GET Request - Read live global count
    console.log('[API /api/stats] Received GET request to read counter');
    const current = await readGlobalCount();
    return res.status(200).json({ count: current, value: current, source: 'global_counter_read' });
  } catch (err: any) {
    console.error('[API /api/stats] Error handling request:', err);
    const fallback = BASELINE_DEFAULT + inMemoryIncrementCount;
    return res.status(200).json({ count: fallback, value: fallback, source: 'fallback' });
  }
}

async function incrementGlobalCount(): Promise<number> {
  inMemoryIncrementCount++;
  try {
    console.log('[API /api/stats] Calling CounterAPI v1 UP endpoint...');
    const res = await fetch(`${COUNTERAPI_V1_URL}/up`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const data = (await res.json()) as any;
      const countVal = data?.value ?? data?.count ?? data?.data?.up_count;
      console.log('[API /api/stats] CounterAPI v1 UP returned count:', countVal);
      if (typeof countVal === 'number' && !isNaN(countVal)) {
        return Math.max(countVal, BASELINE_DEFAULT + inMemoryIncrementCount);
      }
    } else {
      console.warn('[API /api/stats] CounterAPI v1 UP response status:', res.status);
    }
  } catch (err: any) {
    console.warn('[API /api/stats] CounterAPI v1 UP call error:', err?.message || err);
  }

  return BASELINE_DEFAULT + inMemoryIncrementCount;
}

async function readGlobalCount(): Promise<number> {
  try {
    const res = await fetch(COUNTERAPI_V1_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const data = (await res.json()) as any;
      const countVal = data?.value ?? data?.count ?? data?.data?.up_count;
      console.log('[API /api/stats] CounterAPI v1 GET returned count:', countVal);
      if (typeof countVal === 'number' && !isNaN(countVal)) {
        return Math.max(countVal, BASELINE_DEFAULT + inMemoryIncrementCount);
      }
    }
  } catch (err: any) {
    console.warn('[API /api/stats] CounterAPI v1 GET call error:', err?.message || err);
  }

  return BASELINE_DEFAULT + inMemoryIncrementCount;
}
