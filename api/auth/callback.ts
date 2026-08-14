import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.redirect(302, '/?auth=error&message=Missing+code');
  }

  const clientId = process.env.GITHUB_CLIENT_ID || process.env.VITE_GITHUB_CLIENT_ID || 'Ov23ligv4h9bq6Y6Gl3a';
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientSecret) {
    console.warn('GITHUB_CLIENT_SECRET is missing from server environment');
  }

  try {
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
      return res.redirect(302, `/?auth=error&message=${encodeURIComponent(tokenData.error_description || 'OAuth token exchange failed')}`);
    }

    const accessToken = tokenData.access_token;

    // Fetch user details securely on server
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'GitFC-App',
      },
    });

    if (!userRes.ok) {
      return res.redirect(302, '/?auth=error&message=Failed+to+fetch+user+profile');
    }

    const userData = await userRes.json();
    const username = userData.login;

    // Redirect to home page with connected user signal
    return res.redirect(302, `/?auth=success&username=${encodeURIComponent(username)}`);
  } catch (err: any) {
    console.error('OAuth callback error:', err);
    return res.redirect(302, `/?auth=error&message=${encodeURIComponent(err.message || 'Server error')}`);
  }
}
