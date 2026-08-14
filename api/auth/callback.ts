import type { VercelRequest, VercelResponse } from '@vercel/node';

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      list[parts[0].trim()] = decodeURIComponent(parts.slice(1).join('=').trim());
    }
  });
  return list;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code, state, error } = req.query;
  const cookies = parseCookies(req.headers.cookie);
  const storedState = cookies['gitfc_oauth_state'];

  // Extract origin to return user to (e.g. http://localhost:5173 or https://gitfc.vercel.app)
  let returnOrigin = 'https://gitfc.vercel.app';
  let rawState = '';

  if (typeof state === 'string' && state.includes('__')) {
    const [encodedOrigin, randomPart] = state.split('__');
    try {
      returnOrigin = decodeURIComponent(encodedOrigin);
      rawState = randomPart;
    } catch {
      returnOrigin = 'https://gitfc.vercel.app';
    }
  } else if (typeof state === 'string') {
    rawState = state;
  }

  const clearStateCookie = `gitfc_oauth_state=; Path=/; HttpOnly; Max-Age=0`;

  // 1. Check if user cancelled authorization on GitHub
  if (error === 'access_denied' || (error && typeof error === 'string')) {
    res.setHeader('Set-Cookie', clearStateCookie);
    return res.redirect(302, `${returnOrigin}/?auth=error&message=GitHub+sign-in+was+cancelled.`);
  }

  // 2. Check for missing code
  if (!code || typeof code !== 'string') {
    res.setHeader('Set-Cookie', clearStateCookie);
    return res.redirect(302, `${returnOrigin}/?auth=error&message=GitHub+sign-in+could+not+be+completed.+Missing+authorization+code.`);
  }

  // 3. CSRF State Validation
  if (storedState && rawState && rawState !== storedState) {
    res.setHeader('Set-Cookie', clearStateCookie);
    return res.redirect(302, `${returnOrigin}/?auth=error&message=CSRF+state+mismatch.+Sign-in+rejected+for+security.`);
  }

  const clientId = process.env.GITHUB_CLIENT_ID || process.env.VITE_GITHUB_CLIENT_ID || 'Ov23ligv4h9bq6Y6Gl3a';
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  try {
    // 4. Server-Side Token Exchange (Always uses exact registered redirect_uri)
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error || !tokenData.access_token) {
      console.error('OAuth token exchange error:', tokenData);
      res.setHeader('Set-Cookie', clearStateCookie);
      return res.redirect(302, `${returnOrigin}/?auth=error&message=GitHub+is+temporarily+unavailable.+Please+try+again.`);
    }

    const accessToken = tokenData.access_token;

    // 5. Fetch user profile from GitHub API using server token
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'GitFC-App',
      },
    });

    if (!userRes.ok) {
      res.setHeader('Set-Cookie', clearStateCookie);
      return res.redirect(302, `${returnOrigin}/?auth=error&message=GitHub+is+temporarily+unavailable.+Please+try+again.`);
    }

    const userData = await userRes.json();
    const username = userData.login;

    // 6. Create secure HTTP-only session cookie
    const sessionPayload = JSON.stringify({
      username: userData.login,
      name: userData.name || userData.login,
      avatarUrl: userData.avatar_url,
      timestamp: Date.now(),
    });

    const isProd = !returnOrigin.includes('localhost');
    const sessionCookie = `gitfc_session=${encodeURIComponent(sessionPayload)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=864000${isProd ? '; Secure' : ''}`;

    res.setHeader('Set-Cookie', [clearStateCookie, sessionCookie]);

    // 7. Return to origin app authenticated
    return res.redirect(302, `${returnOrigin}/?auth=success&username=${encodeURIComponent(username)}`);
  } catch (err: any) {
    console.error('OAuth callback server exception:', err);
    res.setHeader('Set-Cookie', clearStateCookie);
    return res.redirect(302, `${returnOrigin}/?auth=error&message=GitHub+is+temporarily+unavailable.+Please+try+again.`);
  }
}
