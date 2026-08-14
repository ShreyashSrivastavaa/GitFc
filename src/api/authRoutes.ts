/**
 * Server-side API Route Specifications & Route Handlers
 * Target Framework: Next.js App Router (app/api/auth/...) or Express
 */

export const GITHUB_OAUTH_CONFIG = {
  clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || 'Ov23ligv4h9bq6Y6Gl3a',
  callbackUrl: import.meta.env.VITE_GITHUB_CALLBACK_URL || '/api/auth/callback',
};

// GET /api/auth/login
export async function handleAuthLogin() {
  const state = Math.random().toString(36).substring(2);
  const authorizeUrl =
    `https://github.com/login/oauth/authorize?` +
    `client_id=${GITHUB_OAUTH_CONFIG.clientId}&` +
    `redirect_uri=${encodeURIComponent(GITHUB_OAUTH_CONFIG.callbackUrl)}&` +
    `scope=read:user,public_repo&` +
    `state=${state}`;

  return { redirectUrl: authorizeUrl, state };
}

// Serverless OAuth endpoints are handled securely by /api/auth/login.ts and /api/auth/callback.ts

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
