import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const SEED_BASELINE = 142;
const REDIS_KEY = 'gitfc:card_generations';

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

let inMemoryCount = SEED_BASELINE;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const redis = getRedisClient();
    if (redis) {
      // Atomic increment
      const newCount = await redis.incr(REDIS_KEY);

      // If key was fresh and incremented from 0 -> set to seed baseline
      if (newCount <= 1) {
        await redis.set(REDIS_KEY, SEED_BASELINE + 1);
        return res.status(200).json({
          count: SEED_BASELINE + 1,
          value: SEED_BASELINE + 1,
          success: true,
          source: 'upstash_redis'
        });
      }

      return res.status(200).json({
        count: newCount,
        value: newCount,
        success: true,
        source: 'upstash_redis'
      });
    }

    inMemoryCount += 1;
    return res.status(200).json({
      count: inMemoryCount,
      value: inMemoryCount,
      success: true,
      source: 'memory_fallback'
    });
  } catch (err: any) {
    console.error('[API /api/stats/increment] Error incrementing count:', err);
    return res.status(200).json({
      count: SEED_BASELINE + 1,
      value: SEED_BASELINE + 1,
      success: false,
      source: 'error_fallback'
    });
  }
}
