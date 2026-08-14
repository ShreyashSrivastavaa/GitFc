import type { GitHubRawStats, EAFCRatings, CardRarity, CardPosition, DevBadge, EAFCDevCard } from '../types';
import { assignPosition, getPositionInfo } from './positionService';
import { createLeagueMembership } from './leaguesService';
import { generateDressingRoomData } from './dressingRoomService';

export function calculateEAFCRatings(stats: GitHubRawStats): EAFCRatings {
  const pac = Math.min(99, Math.max(40, Math.round((stats.streakDays / 365) * 45 + 50)));
  const sho = Math.min(99, Math.max(40, Math.round((stats.prsMerged / 60) * 40 + 52)));
  const pas = Math.min(99, Math.max(40, Math.round((stats.commits / 1500) * 42 + 54)));
  const dri = Math.min(99, Math.max(40, Math.round((stats.stars / 400) * 42 + 55)));
  const def = Math.min(99, Math.max(40, Math.round((stats.issuesClosed / 100) * 42 + 50)));
  const phy = Math.min(99, Math.max(40, Math.round((stats.followers / 600) * 42 + 52)));
  const sta = Math.min(99, Math.max(40, Math.round((stats.forks / 200) * 42 + 50)));
  const skl = Math.min(99, Math.max(40, Math.round((stats.languages.length / 10) * 40 + 52)));

  const weightedSum = (pas * 0.2) + (dri * 0.2) + (sho * 0.15) + (phy * 0.15) + (pac * 0.12) + (skl * 0.1) + (def * 0.04) + (sta * 0.04);
  const overall = Math.min(99, Math.max(45, Math.round(weightedSum)));

  return { pac, sho, pas, dri, def, phy, sta, skl, overall };
}

export function calculatePowerScore(stats: GitHubRawStats, ratings: EAFCRatings): number {
  return Math.round(
    (stats.stars * 12) +
    (stats.followers * 15) +
    (stats.commits * 2) +
    (stats.prsMerged * 25) +
    (stats.forks * 10) +
    (ratings.overall * 50)
  );
}

export function determineRarity(overall: number, powerScore: number, stats?: GitHubRawStats): CardRarity {
  if (overall >= 95 || powerScore >= 50000) return 'toty';
  if (overall >= 92 || powerScore >= 25000) return 'toty_icon';
  if (overall >= 88 || (stats && stats.stars >= 10000)) return 'icon';
  if (stats && stats.streakDays >= 180) return 'scream';
  if (stats && stats.languages.length >= 6) return 'world_tour';
  if (stats && stats.commits >= 2000) return 'totw';
  if (overall >= 85 || powerScore >= 10000) return 'tots';
  if (overall >= 82 || powerScore >= 6000) return 'heroes';
  if (stats && stats.issuesClosed >= 200) return 'centurions';
  if (overall >= 78) return 'evos';
  if (overall >= 70 || powerScore >= 2500) return 'gold';
  if (overall >= 58 || powerScore >= 1000) return 'silver';
  return 'bronze';
}

export function determinePosition(stats: GitHubRawStats, ratings: EAFCRatings): { position: CardPosition; title: string } {
  if (ratings.dri >= 85 || stats.stars > 1000) {
    return { position: 'INF', title: 'Open Source Influencer' };
  }
  if (ratings.pas >= 85 && stats.languages.length >= 6) {
    return { position: 'GEN', title: 'Full Stack Generalist' };
  }
  if (ratings.sho >= 82 || stats.prsMerged > 200) {
    return { position: 'COL', title: 'Master Collaborator' };
  }
  if (ratings.pac >= 85 || stats.streakDays > 180) {
    return { position: 'HUS', title: 'Daily Code Hustler' };
  }
  if (ratings.sta >= 80 || stats.publicRepos > 50) {
    return { position: 'ARC', title: 'System Architect' };
  }
  return { position: 'DEV', title: 'Core Developer' };
}

export function generateDevBadges(stats: GitHubRawStats): DevBadge[] {
  const badges: DevBadge[] = [];

  if (stats.stars >= 500) {
    badges.push({ id: 'star-lord', name: 'Star Lord', icon: '⭐', description: 'Earned over 500 GitHub Stars' });
  }
  if (stats.commits >= 1000) {
    badges.push({ id: 'commit-machine', name: 'Commit Machine', icon: '⚡', description: 'Over 1,000 commits logged' });
  }
  if (stats.followers >= 500) {
    badges.push({ id: 'influencer', name: 'Dev Icon', icon: '👑', description: 'Over 500 dev followers' });
  }
  if (stats.languages.length >= 6) {
    badges.push({ id: 'polyglot', name: 'Polyglot', icon: '🌍', description: 'Fluent in 6+ programming languages' });
  }
  if (stats.streakDays >= 100) {
    badges.push({ id: 'streaker', name: 'Unstoppable', icon: '🔥', description: '100+ day contribution streak' });
  }
  if (stats.prsMerged >= 50) {
    badges.push({ id: 'pr-champion', name: 'PR Champion', icon: '🤝', description: '50+ pull requests merged' });
  }

  if (badges.length === 0) {
    badges.push({ id: 'rising-star', name: 'Rising Star', icon: '🚀', description: 'Building the future of open source' });
  }

  return badges;
}

export function buildEAFCCard(stats: GitHubRawStats): EAFCDevCard {
  const ratings = calculateEAFCRatings(stats);
  const powerScore = calculatePowerScore(stats, ratings);
  const rarity = determineRarity(ratings.overall, powerScore, stats);
  const { title } = determinePosition(stats, ratings);
  const badges = generateDevBadges(stats);

  const footballPos = assignPosition(stats);
  const posInfo = getPositionInfo(footballPos);

  const clubName = stats.company ? stats.company.replace(/^@/, '').toUpperCase() : 'OPEN SOURCE FC';

  const baseCard: EAFCDevCard = {
    id: stats.username.toLowerCase(),
    username: stats.username,
    name: stats.name || stats.username,
    avatarUrl: stats.avatarUrl,
    bio: stats.bio || 'Open Source Contributor & Developer',
    location: stats.location || 'Global Developer',
    rarity,
    position: posInfo.shortCode || 'CAM',
    positionTitle: title,
    countryFlag: '🌐',
    clubName,
    footballPosition: footballPos,
    footballPositionTitle: posInfo.name,
    footballPositionBadge: posInfo.badge,
    leagues: [createLeagueMembership('premier', 1), createLeagueMembership('lightning', 3)],
    ratings,
    powerScore,
    stats,
    badges,
    skinStyle: 'shiny',
    chemistryStyle: 'SNIPER',
    createdAt: new Date().toISOString().split('T')[0],
  };

  baseCard.dressingRoom = generateDressingRoomData(baseCard);

  return baseCard;
}
