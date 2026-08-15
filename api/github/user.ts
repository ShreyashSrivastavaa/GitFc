import type { VercelRequest, VercelResponse } from '@vercel/node';

const CACHE = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes cache

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const username = req.query.username;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' });
  }

  const cleanUsername = username.trim().toLowerCase();

  // Check cache
  const cached = CACHE.get(cleanUsername);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    res.setHeader('Cache-Control', 'public, max-age=300');
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
          message: 'GitHub API rate limit exceeded. Please try connecting your account or try again later.',
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

    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(200).json(payload);
  } catch (err: any) {
    console.error('Proxy fetch error:', err);
    return res.status(500).json({ error: 'Failed to communicate with GitHub API' });
  }
}
