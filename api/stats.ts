import type { VercelRequest, VercelResponse } from '@vercel/node';

// Persistent UUID bucket on KVDB
const KV_BUCKET = 'c4b14d48-64bf-4b95-a13f-9a1b660505b3';
const KV_KEY = 'gitfc_total_card_generations';
const BASELINE_DEFAULT = 142;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS headers for cross-device requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const kvUrl = `https://kvdb.io/${KV_BUCKET}/${KV_KEY}`;

  try {
    if (req.method === 'POST') {
      // 1. Atomic global increment via KVDB (?inc=1)
      try {
        const incRes = await fetch(`${kvUrl}?inc=1`, { method: 'POST' });
        if (incRes.ok) {
          const text = await incRes.text();
          const parsed = parseInt(text.trim(), 10);
          if (!isNaN(parsed) && parsed > 0) {
            return res.status(200).json({ count: parsed, source: 'kv_store_inc' });
          }
        }
      } catch (err) {
        console.warn('KVDB inc failed, trying fallback write', err);
      }

      // 2. Fallback: Read current and add 1
      const current = await getGlobalCount(kvUrl);
      const nextCount = current + 1;
      await setGlobalCount(kvUrl, nextCount);

      return res.status(200).json({ count: nextCount, source: 'kv_store_write' });
    }

    // GET Request - Read exact live global count
    const current = await getGlobalCount(kvUrl);
    return res.status(200).json({ count: current, source: 'kv_store_read' });
  } catch (err: any) {
    console.error('Serverless stats handler error:', err);
    return res.status(200).json({ count: BASELINE_DEFAULT, source: 'fallback' });
  }
}

async function getGlobalCount(url: string): Promise<number> {
  try {
    const response = await fetch(url, { method: 'GET' });
    if (response.ok) {
      const text = await response.text();
      const parsed = parseInt(text.trim(), 10);
      if (!isNaN(parsed) && parsed >= BASELINE_DEFAULT) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to read from KV storage', err);
  }
  return BASELINE_DEFAULT;
}

async function setGlobalCount(url: string, count: number): Promise<void> {
  try {
    await fetch(url, {
      method: 'POST',
      body: count.toString(),
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (err) {
    console.warn('Failed to write to KV storage', err);
  }
}
