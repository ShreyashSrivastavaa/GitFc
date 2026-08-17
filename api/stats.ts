import type { VercelRequest, VercelResponse } from '@vercel/node';

const BASELINE_DEFAULT = 142;
const COUNTERAPI_URL = 'https://api.counterapi.dev/v2/test/test';

// In-memory fallback counter for serverless container lifecycle
let inMemoryIncrementCount = 0;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS headers for cross-device requests
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
      return res.status(200).json({ count: nextCount, source: 'global_counter_inc' });
    }

    // GET Request - Read live global count
    console.log('[API /api/stats] Received GET request to read counter');
    const current = await readGlobalCount();
    return res.status(200).json({ count: current, source: 'global_counter_read' });
  } catch (err: any) {
    console.error('[API /api/stats] Error handling request:', err);
    return res.status(200).json({ count: BASELINE_DEFAULT + inMemoryIncrementCount, source: 'fallback' });
  }
}

async function incrementGlobalCount(): Promise<number> {
  inMemoryIncrementCount++;
  try {
    console.log('[API /api/stats] Calling CounterAPI v2 UP endpoint...');
    const res = await fetch(`${COUNTERAPI_URL}/up`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const data = (await res.json()) as any;
      const upCount = data?.data?.up_count ?? data?.data?.up ?? data?.count;
      console.log('[API /api/stats] CounterAPI v2 UP returned up_count:', upCount);
      if (typeof upCount === 'number' && !isNaN(upCount)) {
        const total = BASELINE_DEFAULT + upCount;
        return total;
      }
    } else {
      console.warn('[API /api/stats] CounterAPI v2 UP response status:', res.status);
    }
  } catch (err: any) {
    console.warn('[API /api/stats] CounterAPI v2 UP call error:', err?.message || err);
  }

  return BASELINE_DEFAULT + inMemoryIncrementCount;
}

async function readGlobalCount(): Promise<number> {
  try {
    const res = await fetch(COUNTERAPI_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const data = (await res.json()) as any;
      const upCount = data?.data?.up_count ?? data?.data?.up ?? data?.count;
      console.log('[API /api/stats] CounterAPI v2 GET returned up_count:', upCount);
      if (typeof upCount === 'number' && !isNaN(upCount)) {
        return BASELINE_DEFAULT + upCount;
      }
    }
  } catch (err: any) {
    console.warn('[API /api/stats] CounterAPI v2 GET call error:', err?.message || err);
  }

  return BASELINE_DEFAULT + inMemoryIncrementCount;
}
