import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const SEED_BASELINE = 142;
const REDIS_KEY = 'gitfc:card_generations';

// Initialize Upstash Redis client with support for env variables or default REST endpoint
function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || 'https://verified-redfish-198404.upstash.io';
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || 'gQAAAAAAAwcEAAIgcDE3ZDRhOTVjYjBhMjI0MjVhOWFiZDliMTQwYWI0M2M5MQ';

  if (url && token) {
    try {
      return new Redis({ url, token });
    } catch (err) {
      console.warn('[Redis] Failed to initialize Redis client:', err);
    }
  }
  return null;
}

// In-memory fallback if Redis credentials are not yet configured
let inMemoryCount = SEED_BASELINE;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Edge CDN caching: Cache for 30s, stale-while-revalidate for 60s
  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');

  try {
    const redis = getRedisClient();
    if (redis) {
      const rawCount = await redis.get<number>(REDIS_KEY);
      
      let count = typeof rawCount === 'number' ? rawCount : parseInt(rawCount as any, 10);
      
      // Auto-seed if not present or less than starting baseline
      if (isNaN(count) || count < SEED_BASELINE) {
        count = SEED_BASELINE;
        await redis.set(REDIS_KEY, SEED_BASELINE);
      }

      return res.status(200).json({
        count,
        value: count,
        source: 'upstash_redis'
      });
    }

    return res.status(200).json({
      count: inMemoryCount,
      value: inMemoryCount,
      source: 'memory_fallback'
    });
  } catch (err: any) {
    console.error('[API /api/stats/count] Error reading count:', err);
    return res.status(200).json({
      count: SEED_BASELINE,
      value: SEED_BASELINE,
      source: 'error_fallback'
    });
  }
}
