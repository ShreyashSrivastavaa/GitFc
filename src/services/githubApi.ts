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

  const preset = PRESET_DEVS.find(p => p.username.toLowerCase() === cleanUsername);
  if (preset) {
    STATS_CACHE.set(cleanUsername, { data: preset, timestamp: Date.now() });
    return preset;
  }

  try {
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}`);
    if (!userRes.ok) {
      if (userRes.status === 404) {
        throw new Error(`GitHub user "${username}" not found.`);
      }
      throw new Error(`GitHub API rate limit or error (${userRes.status}).`);
    }

    const userData = await userRes.json();

    let reposData: any[] = [];
    try {
      const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?per_page=100&sort=updated`);
      if (reposRes.ok) {
        reposData = await reposRes.json();
      }
    } catch {
      // Ignore
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

    const estimatedCommits = Math.max(120, Math.round((publicRepos * 35) + (totalStars * 1.5) + (followers * 2)));
    const estimatedPRs = Math.max(15, Math.round(publicRepos * 1.8 + totalStars * 0.4));
    const estimatedIssues = Math.max(10, Math.round(publicRepos * 1.2 + totalForks * 0.5));
    const estimatedStreak = Math.min(365, Math.max(14, Math.round((totalStars * 0.8) + (publicRepos * 2))));

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
  } catch (err: any) {
    console.warn(`Falling back to generated card for ${username}:`, err.message);
    return generateFallbackCard(username);
  }
}

function generateFallbackCard(username: string): EAFCDevCard {
  const hash = Array.from(username).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const publicRepos = 15 + (hash % 45);
  const followers = 45 + (hash * 3 % 450);
  const stars = 80 + (hash * 7 % 650);
  const forks = 20 + (hash * 2 % 120);

  const rawStats: GitHubRawStats = {
    username,
    name: username.charAt(0).toUpperCase() + username.slice(1),
    avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(username)}`,
    bio: 'Full Stack Engineer & Open Source Enthusiast',
    location: 'San Francisco, CA',
    company: 'OpenSource FC',
    publicRepos,
    followers,
    following: 25,
    createdAt: '2020-04-12',
    commits: 450 + (hash * 5 % 1200),
    stars,
    prsMerged: 35 + (hash % 90),
    issuesClosed: 25 + (hash % 60),
    forks,
    streakDays: 45 + (hash % 220),
    languages: ['TypeScript', 'React', 'Python', 'Go', 'Docker']
  };

  return buildEAFCCard(rawStats);
}
