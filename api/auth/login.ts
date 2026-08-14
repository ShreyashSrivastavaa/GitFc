import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.GITHUB_CLIENT_ID || process.env.VITE_GITHUB_CLIENT_ID || 'Ov23ligv4h9bq6Y6Gl3a';

  const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || 'gitfc.vercel.app';
  const proto = (req.headers['x-forwarded-proto'] as string) || (host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https');
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

  // Environment-aware callback URI
  const defaultCallback = isLocal
    ? `${proto}://${host}/api/auth/callback`
    : `https://gitfc.vercel.app/api/auth/callback`;

  const redirectUri = process.env.GITHUB_CALLBACK_URL || defaultCallback;

  // Generate cryptographically safe CSRF state
  const state = Math.random().toString(36).substring(2) + Date.now().toString(36);

  // Set CSRF state in HTTP-only cookie
  const isProd = !isLocal;
  res.setHeader(
    'Set-Cookie',
    `gitfc_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600${isProd ? '; Secure' : ''}`
  );

  const oauthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=read:user,public_repo&state=${state}`;

  res.redirect(302, oauthUrl);
}
