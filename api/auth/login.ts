import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.GITHUB_CLIENT_ID || process.env.VITE_GITHUB_CLIENT_ID || 'Ov23ligv4h9bq6Y6Gl3a';
  const host = req.headers.host || '';
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

  // Use configured GITHUB_CALLBACK_URL or fallback to registered production callback
  const redirectUri =
    process.env.GITHUB_CALLBACK_URL ||
    (isLocal
      ? 'https://gitfc.vercel.app/api/auth/callback'
      : `${req.headers['x-forwarded-proto'] || 'https'}://${host}/api/auth/callback`);

  const state = Math.random().toString(36).substring(2);

  const oauthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=read:user,public_repo&state=${state}`;

  res.redirect(302, oauthUrl);
}
