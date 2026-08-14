import type { GitHubRawStats, EAFCDevCard } from '../types';
import { buildEAFCCard } from './cardCalculator';
import { PRESET_DEVS } from './presets';

const STATS_CACHE = new Map<string, { data: EAFCDevCard; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes cache

export async function fetchGitHubUserStats(username: string): Promise<EAFCDevCard> {
  const cleanUsername = username.trim().toLowerCase();

  const cached = STATS_CACHE.get(cleanUsername);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const preset = PRESET_DEVS.find((p) => p.username.toLowerCase() === cleanUsername);
  if (preset) {
    STATS_CACHE.set(cleanUsername, { data: preset, timestamp: Date.now() });
    return preset;
  }

  let userData: any = null;
  let reposData: any[] = [];

  // Try server proxy first
  try {
    const proxyRes = await fetch(`/api/github/user?username=${encodeURIComponent(cleanUsername)}`);
    if (proxyRes.ok) {
      const payload = await proxyRes.json();
      userData = payload.userData;
      reposData = payload.reposData || [];
    } else if (proxyRes.status === 404) {
      throw new Error(`GitHub user "@${username}" not found.`);
    } else if (proxyRes.status === 403) {
      throw new Error(`GitHub API rate limit exceeded. Please try connecting your account or check back in a few minutes.`);
    }
  } catch (proxyErr: any) {
    if (proxyErr.message.includes('not found') || proxyErr.message.includes('rate limit')) {
      throw proxyErr;
    }
  }

  // Fallback to direct client API if proxy returned non-OK without fatal error
  if (!userData) {
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}`);
    if (!userRes.ok) {
      if (userRes.status === 404) {
        throw new Error(`GitHub user "@${username}" not found.`);
      }
      if (userRes.status === 403) {
        throw new Error(`GitHub API rate limit reached (60 req/hr). Please connect with GitHub to continue.`);
      }
      throw new Error(`Could not fetch GitHub profile (${userRes.status}).`);
    }
    userData = await userRes.json();

    try {
      const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?per_page=100&sort=updated`);
      if (reposRes.ok) {
        reposData = await reposRes.json();
      }
    } catch {
      // Non-fatal
    }
  }

  let totalStars = 0;
  let totalForks = 0;
  const languagesSet = new Set<string>();

  if (Array.isArray(reposData)) {
    reposData.forEach((repo: any) => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
      if (repo.language) {
        languagesSet.add(repo.language);
      }
    });
  }

  const publicRepos = userData.public_repos || reposData.length || 10;
  const followers = userData.followers || 0;
  const languages = Array.from(languagesSet);
  if (languages.length === 0) {
    languages.push('TypeScript', 'JavaScript', 'Python');
  }

  const estimatedCommits = Math.max(120, Math.round(publicRepos * 35 + totalStars * 1.5 + followers * 2));
  const estimatedPRs = Math.max(15, Math.round(publicRepos * 1.8 + totalStars * 0.4));
  const estimatedIssues = Math.max(10, Math.round(publicRepos * 1.2 + totalForks * 0.5));
  const estimatedStreak = Math.min(365, Math.max(14, Math.round(totalStars * 0.8 + publicRepos * 2)));

  const rawStats: GitHubRawStats = {
    username: userData.login,
    name: userData.name || userData.login,
    avatarUrl: userData.avatar_url || `https://avatars.githubusercontent.com/u/${userData.id}?v=4`,
    bio: userData.bio || 'Building open source projects on GitHub.',
    location: userData.location || 'Worldwide',
    company: userData.company || '',
    publicRepos,
    followers,
    following: userData.following || 0,
    createdAt: userData.created_at || '2021-01-01',
    commits: estimatedCommits,
    stars: totalStars,
    prsMerged: estimatedPRs,
    issuesClosed: estimatedIssues,
    forks: totalForks,
    streakDays: estimatedStreak,
    languages,
  };

  const card = buildEAFCCard(rawStats);
  STATS_CACHE.set(cleanUsername, { data: card, timestamp: Date.now() });
  return card;
}
