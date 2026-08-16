import type { VercelRequest, VercelResponse } from '@vercel/node';

// Fallback in-memory counter for local dev / serverless instance warming
let inMemoryCount = 142;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const COUNTER_NAMESPACE = 'gitfc_official_v1';
  const COUNTER_KEY = 'total_card_generations';

  try {
    if (req.method === 'POST') {
      // Increment counter globally
      try {
        const response = await fetch(
          `https://api.counterapi.dev/v1/${COUNTER_NAMESPACE}/${COUNTER_KEY}/up`,
          { method: 'GET' }
        );
        if (response.ok) {
          const data = (await response.json()) as any;
          if (data && typeof data.count === 'number') {
            inMemoryCount = data.count;
            return res.status(200).json({ count: data.count, source: 'global_api' });
          }
        }
      } catch (err) {
        console.warn('CounterAPI unreachable, using fallback increment', err);
      }

      inMemoryCount += 1;
      return res.status(200).json({ count: inMemoryCount, source: 'memory' });
    }

    // GET Request - Read exact count
    try {
      const response = await fetch(
        `https://api.counterapi.dev/v1/${COUNTER_NAMESPACE}/${COUNTER_KEY}`,
        { method: 'GET' }
      );
      if (response.ok) {
        const data = (await response.json()) as any;
        if (data && typeof data.count === 'number') {
          inMemoryCount = data.count;
          return res.status(200).json({ count: data.count, source: 'global_api' });
        }
      }
    } catch (err) {
      console.warn('CounterAPI read unreachable, using fallback', err);
    }

    return res.status(200).json({ count: inMemoryCount, source: 'memory' });
  } catch (err: any) {
    return res.status(200).json({ count: inMemoryCount, source: 'fallback' });
  }
}
