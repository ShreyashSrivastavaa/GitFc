import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PRESET_DEVS } from '../src/services/presets.ts';
import { buildEAFCCard } from '../src/services/cardCalculator.ts';
import type { GitFCDevCard, GitHubRawStats } from '../src/types/index.ts';

function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { username } = req.query;
  const cleanUsername = typeof username === 'string' ? username.trim().toLowerCase() : 'torvalds';

  let card: GitFCDevCard | null = null;

  // 1. Check presets first
  const preset = PRESET_DEVS.find((p: GitFCDevCard) => p.username.toLowerCase() === cleanUsername);
  if (preset) {
    card = preset;
  } else {
    // 2. Fetch public data
    try {
      const headers: Record<string, string> = {
        'User-Agent': 'GitFC-App',
        Accept: 'application/vnd.github.v3+json',
      };
      if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      }

      const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}`, { headers });
      if (userRes.ok) {
        const userData = (await userRes.json()) as any;
        const publicRepos = userData.public_repos || 10;
        const followers = userData.followers || 0;

        const rawStats: GitHubRawStats = {
          username: userData.login,
          name: userData.name || userData.login,
          avatarUrl: userData.avatar_url,
          bio: userData.bio || 'Open Source Contributor',
          location: userData.location || 'Global Developer',
          company: userData.company || '',
          publicRepos,
          followers,
          following: userData.following || 0,
          createdAt: userData.created_at || '2021-01-01',
          commits: Math.max(150, Math.round(publicRepos * 35 + followers * 2)),
          stars: Math.max(50, Math.round(followers * 4 + publicRepos * 5)),
          prsMerged: Math.max(15, Math.round(publicRepos * 1.8)),
          issuesClosed: Math.max(10, Math.round(publicRepos * 1.2)),
          forks: Math.max(10, Math.round(publicRepos * 0.8)),
          streakDays: Math.min(365, Math.max(14, Math.round(publicRepos * 2 + 30))),
          languages: ['TypeScript', 'JavaScript', 'Python'],
        };
        card = buildEAFCCard(rawStats);
      }
    } catch {
      // Fallback to preset
    }
  }

  const activeCard: GitFCDevCard = card || PRESET_DEVS[0];

  const attrs = activeCard.attributes;
  const name = escapeXml(activeCard.name || activeCard.username);
  const user = escapeXml(activeCard.username);
  const position = escapeXml(activeCard.position);
  const archetype = escapeXml(activeCard.archetype);
  const club = escapeXml(activeCard.clubName || 'GITFC');
  const rarity = escapeXml(activeCard.rarityTitle || 'ELITE TOTY');

  // Gradient themes per rarity
  let bgGrad1 = '#06b6d4';
  let bgGrad2 = '#1e1b4b';
  let borderCol = '#38bdf8';
  let pillBg = '#0284c7';
  if (activeCard.rarity === 'legendary') {
    bgGrad1 = '#c084fc';
    bgGrad2 = '#310c59';
    borderCol = '#e879f9';
    pillBg = '#9333ea';
  } else if (activeCard.rarity === 'epic') {
    bgGrad1 = '#facc15';
    bgGrad2 = '#452b04';
    borderCol = '#fef08a';
    pillBg = '#d97706';
  }

  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bg" cx="50%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#181e2b"/>
      <stop offset="100%" stop-color="#080a0f"/>
    </radialGradient>
    
    <!-- Card Surface Gradient -->
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgGrad1}" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="${bgGrad2}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#050b14"/>
    </linearGradient>

    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="25" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <clipPath id="avatarClip">
      <circle cx="780" cy="220" r="95" />
    </clipPath>
  </defs>

  <!-- Canvas Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Ambient Glow Behind Card -->
  <circle cx="700" cy="315" r="280" fill="${bgGrad1}" opacity="0.18" filter="url(#glow)"/>

  <!-- Left Side: Product Branding & Call to Action -->
  <g transform="translate(90, 100)">
    <!-- Brand Pill -->
    <rect width="190" height="38" rx="19" fill="#00ff87" fill-opacity="0.12" stroke="#00ff87" stroke-width="1.5"/>
    <text x="95" y="24" fill="#00ff87" font-family="'Outfit', sans-serif" font-size="14" font-weight="800" text-anchor="middle" letter-spacing="2">GITFC UT 26</text>

    <!-- Main Headline -->
    <text x="0" y="100" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="52" font-weight="900" letter-spacing="-1">
      Turn your GitHub into
    </text>
    <text x="0" y="160" fill="#00ff87" font-family="'Outfit', sans-serif" font-size="52" font-weight="900" letter-spacing="-1">
      a Football Card ⚽
    </text>

    <text x="0" y="220" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="20" font-weight="400">
      Authentic FIFA-style stats, tactical positions,
    </text>
    <text x="0" y="250" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="20" font-weight="400">
      and 3D holographic exports for every developer.
    </text>

    <!-- Player Sub-callout -->
    <g transform="translate(0, 310)">
      <rect width="420" height="85" rx="20" fill="#0e121a" stroke="#263042" stroke-width="1.5"/>
      <text x="25" y="36" fill="#64748b" font-family="'Inter', sans-serif" font-size="13" font-weight="600" text-transform="uppercase" letter-spacing="1.5">SCOUTED PLAYER CARD</text>
      <text x="25" y="64" fill="#f8fafc" font-family="'Outfit', sans-serif" font-size="22" font-weight="800">${name} (@${user})</text>
      <text x="350" y="52" fill="#f5c518" font-family="'Outfit', sans-serif" font-size="32" font-weight="900">${attrs.overall}</text>
      <text x="350" y="68" fill="#94a3b8" font-family="'Outfit', sans-serif" font-size="11" font-weight="700">OVR</text>
    </g>

    <!-- URL Tag -->
    <text x="0" y="445" fill="#64748b" font-family="'Inter', sans-serif" font-size="15" font-weight="600" letter-spacing="1">gitfc.vercel.app</text>
  </g>

  <!-- Right Side: 3D Rendered Football Card Box -->
  <g transform="translate(670, 60)">
    <!-- Card Frame -->
    <rect x="0" y="0" width="380" height="510" rx="36" fill="url(#cardGrad)" stroke="${borderCol}" stroke-width="3"/>
    
    <!-- Top Bar: OVR + Position -->
    <g transform="translate(35, 45)">
      <text x="25" y="55" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="64" font-weight="900" text-anchor="middle">${attrs.overall}</text>
      <text x="25" y="95" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="28" font-weight="800" text-anchor="middle">${position}</text>
      <line x1="10" y1="110" x2="40" y2="110" stroke="#ffffff" stroke-width="2" stroke-opacity="0.5"/>
      <text x="25" y="138" font-size="24" text-anchor="middle">🌐</text>
      <rect x="-10" y="150" width="70" height="22" rx="6" fill="#000000" fill-opacity="0.6"/>
      <text x="25" y="165" fill="#ffffff" font-family="'Inter', sans-serif" font-size="10" font-weight="800" text-anchor="middle">${club}</text>
    </g>

    <!-- Player Image Avatar Circle -->
    <circle cx="250" cy="130" r="82" fill="#0b0e14" stroke="#ffffff" stroke-width="4"/>
    <image href="${activeCard.avatarUrl}" x="168" y="48" width="164" height="164" preserveAspectRatio="xMidYMid slice" clip-path="url(#avatarClip)"/>
    
    <!-- Name & Archetype -->
    <g transform="translate(190, 275)">
      <text x="0" y="0" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="28" font-weight="900" text-anchor="middle">${name}</text>
      <text x="0" y="24" fill="#facc15" font-family="'Inter', sans-serif" font-size="14" font-weight="700" text-anchor="middle">${archetype}</text>
      
      <!-- Rarity Pill -->
      <rect x="-70" y="36" width="140" height="24" rx="12" fill="${pillBg}"/>
      <text x="0" y="52" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="11" font-weight="800" text-anchor="middle" letter-spacing="1">${rarity}</text>
    </g>

    <!-- 8 Attribute Grid -->
    <g transform="translate(30, 385)">
      <rect x="0" y="0" width="320" height="90" rx="18" fill="#000000" fill-opacity="0.5"/>
      
      <!-- Row 1 -->
      <g transform="translate(40, 30)">
        <text x="0" y="0" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="900" text-anchor="middle">${attrs.att}</text>
        <text x="0" y="14" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="10" font-weight="700" text-anchor="middle">ATT</text>
      </g>
      <g transform="translate(120, 30)">
        <text x="0" y="0" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="900" text-anchor="middle">${attrs.pas}</text>
        <text x="0" y="14" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="10" font-weight="700" text-anchor="middle">PAS</text>
      </g>
      <g transform="translate(200, 30)">
        <text x="0" y="0" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="900" text-anchor="middle">${attrs.def}</text>
        <text x="0" y="14" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="10" font-weight="700" text-anchor="middle">DEF</text>
      </g>
      <g transform="translate(280, 30)">
        <text x="0" y="0" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="900" text-anchor="middle">${attrs.pac}</text>
        <text x="0" y="14" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="10" font-weight="700" text-anchor="middle">PAC</text>
      </g>

      <!-- Row 2 -->
      <g transform="translate(40, 68)">
        <text x="0" y="0" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="900" text-anchor="middle">${attrs.dri}</text>
        <text x="0" y="14" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="10" font-weight="700" text-anchor="middle">DRI</text>
      </g>
      <g transform="translate(120, 68)">
        <text x="0" y="0" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="900" text-anchor="middle">${attrs.sho}</text>
        <text x="0" y="14" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="10" font-weight="700" text-anchor="middle">SHO</text>
      </g>
      <g transform="translate(200, 68)">
        <text x="0" y="0" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="900" text-anchor="middle">${attrs.vis}</text>
        <text x="0" y="14" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="10" font-weight="700" text-anchor="middle">VIS</text>
      </g>
      <g transform="translate(280, 68)">
        <text x="0" y="0" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="900" text-anchor="middle">${attrs.sta}</text>
        <text x="0" y="14" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="10" font-weight="700" text-anchor="middle">STA</text>
      </g>
    </g>
  </g>
</svg>
  `.trim();

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800');
  return res.status(200).send(svg);
}
