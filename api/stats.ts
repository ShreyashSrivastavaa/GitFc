import type { VercelRequest, VercelResponse } from '@vercel/node';

const BASELINE_DEFAULT = 144;

// Primary & Secondary global counter endpoints
const COUNTER_KEY = 'gitfc_global_card_generations_2026';
const CODETABS_URL = `https://api.codetabs.com/v1/counter?key=${COUNTER_KEY}`;
const COUNTERAPI_URL = `https://api.counterapi.dev/v2/gitfc_app_2026/card_generations`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS headers for cross-device requests (phones, laptops, tablets)
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
      const nextCount = await incrementGlobalCount();
      return res.status(200).json({ count: nextCount, source: 'global_counter_inc' });
    }

    // GET Request - Read live global count
    const current = await readGlobalCount();
    return res.status(200).json({ count: current, source: 'global_counter_read' });
  } catch (err: any) {
    console.error('Serverless stats handler error:', err);
    return res.status(200).json({ count: BASELINE_DEFAULT, source: 'fallback' });
  }
}

async function incrementGlobalCount(): Promise<number> {
  // 1. Try CodeTabs counter (returns JSON count or integer)
  try {
    const res = await fetch(`${CODETABS_URL}&action=inc`, { method: 'GET', headers: { Accept: 'application/json' } });
    if (res.ok) {
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        const count = json.count || json.value || parseInt(text, 10);
        if (typeof count === 'number' && !isNaN(count) && count >= BASELINE_DEFAULT) {
          return count;
        }
      } catch {
        const parsed = parseInt(text.trim(), 10);
        if (!isNaN(parsed) && parsed >= BASELINE_DEFAULT) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn('CodeTabs inc failed, trying secondary counter:', err);
  }

  // 2. Try CounterAPI v2 endpoint
  try {
    const res = await fetch(`${COUNTERAPI_URL}/up`, { method: 'GET', headers: { Accept: 'application/json' } });
    if (res.ok) {
      const data = (await res.json()) as any;
      const count = data?.data?.up || data?.count || data?.value;
      if (typeof count === 'number' && !isNaN(count) && count >= BASELINE_DEFAULT) {
        return count;
      }
    }
  } catch (err) {
    console.warn('CounterAPI v2 inc failed:', err);
  }

  // Fallback if APIs fail temporarily
  return BASELINE_DEFAULT + 1;
}

async function readGlobalCount(): Promise<number> {
  // 1. Try CodeTabs counter GET
  try {
    const res = await fetch(CODETABS_URL, { method: 'GET', headers: { Accept: 'application/json' } });
    if (res.ok) {
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        const count = json.count || json.value || parseInt(text, 10);
        if (typeof count === 'number' && !isNaN(count) && count >= BASELINE_DEFAULT) {
          return count;
        }
      } catch {
        const parsed = parseInt(text.trim(), 10);
        if (!isNaN(parsed) && parsed >= BASELINE_DEFAULT) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn('CodeTabs GET failed:', err);
  }

  // 2. Try CounterAPI v2 GET
  try {
    const res = await fetch(COUNTERAPI_URL, { method: 'GET', headers: { Accept: 'application/json' } });
    if (res.ok) {
      const data = (await res.json()) as any;
      const count = data?.data?.up || data?.count || data?.value;
      if (typeof count === 'number' && !isNaN(count) && count >= BASELINE_DEFAULT) {
        return count;
      }
    }
  } catch (err) {
    console.warn('CounterAPI v2 GET failed:', err);
  }

  return BASELINE_DEFAULT;
}

