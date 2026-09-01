import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory cache for user responses: 15 minutes TTL
const CACHE = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes cache

// Basic in-memory rate-limiter: Max 30 requests per minute per IP for unauthenticated public profile lookups
interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}
const RATE_LIMIT_MAP = new Map<string, RateLimitBucket>();
const RATE_LIMIT_CAPACITY = 30; // 30 queries
const REFILL_INTERVAL_MS = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  let bucket = RATE_LIMIT_MAP.get(ip);
  if (!bucket) {
    bucket = { tokens: RATE_LIMIT_CAPACITY, lastRefill: now };
    RATE_LIMIT_MAP.set(ip, bucket);
  }

  // Refill tokens proportionally
  const elapsed = now - bucket.lastRefill;
  if (elapsed > REFILL_INTERVAL_MS) {
    bucket.tokens = RATE_LIMIT_CAPACITY;
    bucket.lastRefill = now;
  }

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    return false;
  }

  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const username = req.query.username;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username query parameter is required' });
  }

  const cleanUsername = username.trim().toLowerCase();

  // Basic IP Abuse Protection on public endpoint
  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'anonymous_ip';

  if (isRateLimited(clientIp)) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'You have performed too many unauthenticated queries. Please wait a minute or connect your GitHub account.',
    });
  }

  // Check cache
  const cached = CACHE.get(cleanUsername);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    res.setHeader('Cache-Control', 'public, max-age=900, s-maxage=900, stale-while-revalidate=86400');
    res.setHeader('X-GitFC-Cache', 'HIT');
    return res.status(200).json(cached.data);
  }

  const headers: Record<string, string> = {
    'User-Agent': 'GitFC-App',
    Accept: 'application/vnd.github.v3+json',
  };

  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}`, { headers });

    if (!userRes.ok) {
      if (userRes.status === 404) {
        return res.status(404).json({ error: `GitHub user "${username}" not found.` });
      }
      if (userRes.status === 403) {
        return res.status(403).json({
          error: 'GitHub API Rate Limit Reached',
          message: 'GitHub API rate limit reached. Please connect with GitHub to continue.',
        });
      }
      return res.status(userRes.status).json({ error: `GitHub API error (${userRes.status})` });
    }

    const userData = await userRes.json();

    let reposData: any[] = [];
    try {
      const reposRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?per_page=100&sort=updated`,
        { headers }
      );
      if (reposRes.ok) {
        reposData = (await reposRes.json()) as any[];
      }
    } catch {
      // Non-fatal if repos fetch fails
    }

    const payload = { userData, reposData };
    CACHE.set(cleanUsername, { data: payload, timestamp: Date.now() });

    res.setHeader('Cache-Control', 'public, max-age=900, s-maxage=900, stale-while-revalidate=86400');
    res.setHeader('X-GitFC-Cache', 'MISS');
    return res.status(200).json(payload);
  } catch (err: any) {
    console.error('Proxy fetch error:', err);
    return res.status(500).json({ error: 'Failed to communicate with GitHub API' });
  }
}
