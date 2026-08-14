import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.GITHUB_CLIENT_ID || process.env.VITE_GITHUB_CLIENT_ID || 'Ov23ligv4h9bq6Y6Gl3a';

  const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || '';
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
  const returnOrigin = isLocal ? `http://${host}` : 'https://gitfc.vercel.app';

  // ALWAYS send the exact registered production URI so GitHub never throws "Invalid Redirect URI"
  const redirectUri = process.env.GITHUB_CALLBACK_URL || 'https://gitfc.vercel.app/api/auth/callback';

  // Encode return origin into CSRF state token
  const randomState = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const statePayload = `${encodeURIComponent(returnOrigin)}__${randomState}`;

  const isProd = !isLocal;
  res.setHeader(
    'Set-Cookie',
    `gitfc_oauth_state=${randomState}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600${isProd ? '; Secure' : ''}`
  );

  const oauthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=read:user,public_repo&state=${encodeURIComponent(statePayload)}`;

  res.redirect(302, oauthUrl);
}
