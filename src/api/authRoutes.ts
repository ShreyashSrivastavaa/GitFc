/**
 * Server-side API Route Specifications & Route Handlers
 * Target Framework: Next.js App Router (app/api/auth/...) or Express
 */

const env = typeof process !== 'undefined' ? process.env : {};

export const GITHUB_OAUTH_CONFIG = {
  clientId: env.GITHUB_CLIENT_ID || 'Ov23liXXXXXXXXXXXXXX',
  clientSecret: env.GITHUB_CLIENT_SECRET || 'your_40_char_secret_here',
  callbackUrl: env.GITHUB_CALLBACK_URL || 'https://gitcards.me/api/auth/callback',
};

// GET /api/auth/login
export async function handleAuthLogin() {
  const state = Math.random().toString(36).substring(2);
  const authorizeUrl =
    `https://github.com/login/oauth/authorize?` +
    `client_id=${GITHUB_OAUTH_CONFIG.clientId}&` +
    `redirect_uri=${encodeURIComponent(GITHUB_OAUTH_CONFIG.callbackUrl)}&` +
    `scope=read:user,user:follow,public_repo&` +
    `state=${state}`;

  return { redirectUrl: authorizeUrl, state };
}

// GET /api/auth/callback
export async function handleAuthCallback(code: string, state: string, storedState: string) {
  if (state !== storedState) {
    throw new Error('CSRF State mismatch');
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_OAUTH_CONFIG.clientId,
      client_secret: GITHUB_OAUTH_CONFIG.clientSecret,
      code,
    }),
  });

  const { access_token, error } = await tokenRes.json();
  if (error || !access_token) {
    throw new Error(`OAuth failed: ${error || 'No token returned'}`);
  }

  // Fetch user profile from GitHub
  const userRes = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const githubUser = await userRes.json();

  // Fetch following & followers
  const [following, followers] = await Promise.all([
    fetch('https://api.github.com/user/following?per_page=100', {
      headers: { Authorization: `Bearer ${access_token}` },
    }).then((r) => r.json()),
    fetch('https://api.github.com/user/followers?per_page=100', {
      headers: { Authorization: `Bearer ${access_token}` },
    }).then((r) => r.json()),
  ]);

  return {
    user: {
      githubId: githubUser.id,
      username: githubUser.login,
      name: githubUser.name,
      avatar: githubUser.avatar_url,
      email: githubUser.email,
      following: following.map((f: any) => f.login),
      followers: followers.map((f: any) => f.login),
    },
    accessToken: access_token,
  };
}

// GET /api/stats/counter
export async function handleGetCounterStats(currentStats: { totalGenerations: number }) {
  const rounded = Math.floor(currentStats.totalGenerations / 100) * 100;
  return {
    totalGenerations: currentStats.totalGenerations,
    formattedCount: `${rounded.toLocaleString()}+`,
    lastUpdated: new Date().toISOString(),
  };
}

// POST /api/invites/send
export interface SendInviteBody {
  teamId: string;
  githubUsername: string;
  position: string;
  message?: string;
}

export async function handleSendInvite(body: SendInviteBody) {
  return {
    inviteId: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    teamId: body.teamId,
    target: body.githubUsername,
    position: body.position,
    message: body.message,
    status: 'sent' as const,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
  };
}
