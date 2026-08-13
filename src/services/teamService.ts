import type { Team, TeamPlayer, TeamRoster, TeamInvite, EAFCDevCard, TeamPlayerPosition } from '../types';
import { PRESET_DEVS } from './presets';

export function calculateTeamChemistry(roster: TeamRoster, formation: string): number {
  const allPlayers = [
    ...roster.goalkeeper,
    ...roster.defenders,
    ...roster.midfielders,
    ...roster.forwards,
  ];

  if (allPlayers.length === 0) return 50;

  // Base chemistry from roster count
  const countFactor = Math.min(40, (allPlayers.length / 12) * 40);

  // Position fit factor
  const avgRating = allPlayers.reduce((acc, p) => acc + p.overall, 0) / allPlayers.length;
  const ratingFactor = (avgRating / 99) * 35;

  // Formation alignment bonus
  const formationBonus = formation === '4-4-3' || formation === '4-3-3' ? 20 : 15;

  return Math.min(100, Math.round(countFactor + ratingFactor + formationBonus));
}

export function createDefaultTeam(managerCard: EAFCDevCard): Team {
  const defaultRoster = generate15PlayerRoster(managerCard);
  const chemistry = calculateTeamChemistry(defaultRoster, '4-4-3');

  const allPlayers = [
    ...defaultRoster.goalkeeper,
    ...defaultRoster.defenders,
    ...defaultRoster.midfielders,
    ...defaultRoster.forwards,
    ...defaultRoster.substitutes,
  ];

  const squadValue = allPlayers.reduce((acc, p) => acc + p.overall * 1000 + p.stats.commits * 10, 0);
  const averageRating = Math.round(allPlayers.reduce((acc, p) => acc + p.overall, 0) / allPlayers.length);

  return {
    id: `team-${managerCard.username.toLowerCase()}`,
    name: 'Manchester Devs',
    description: 'Elite full-stack development team competing in global EA FC leagues.',
    badge: '🔴',
    manager: managerCard,
    founded: '2026-01-01',
    players: defaultRoster,
    totalPlayers: 15,
    formation: '4-4-3',
    squadValue: Math.round(squadValue * 1.2),
    squadChemistry: chemistry,
    averageRating,
    leagueId: 'premier',
    leagueName: 'Premier DevLeague',
    leaguePosition: 5,
    wins: 11,
    draws: 1,
    losses: 7,
    goalsFor: 45,
    goalsAgainst: 30,
    points: 34,
    inviteCode: `MCDEV${managerCard.username.slice(0, 3).toUpperCase()}123`,
    invites: [
      {
        id: 'inv-1',
        teamId: `team-${managerCard.username.toLowerCase()}`,
        teamName: 'Manchester Devs',
        teamBadge: '🔴',
        invitedBy: managerCard.username,
        invitedUser: 'gaearon',
        suggestedPosition: 'CAM',
        createdAt: '2026-08-12',
        expiresAt: '2026-08-26',
        status: 'pending',
        inviteCode: `MCDEV${managerCard.username.slice(0, 3).toUpperCase()}123`,
      },
      {
        id: 'inv-2',
        teamId: `team-${managerCard.username.toLowerCase()}`,
        teamName: 'Manchester Devs',
        teamBadge: '🔴',
        invitedBy: managerCard.username,
        invitedUser: 'shadcn',
        suggestedPosition: 'ST',
        createdAt: '2026-08-11',
        expiresAt: '2026-08-25',
        status: 'pending',
        inviteCode: `MCDEV${managerCard.username.slice(0, 3).toUpperCase()}123`,
      },
    ],
    isPrivate: false,
    createdAt: '2026-01-01',
  };
}

export function createTeam(
  manager: EAFCDevCard,
  name: string,
  description: string,
  badge: string,
  isPrivate: boolean = false
): Team {
  const defaultRoster = generate15PlayerRoster(manager);
  const chemistry = calculateTeamChemistry(defaultRoster, '4-4-3');

  const allPlayers = [
    ...defaultRoster.goalkeeper,
    ...defaultRoster.defenders,
    ...defaultRoster.midfielders,
    ...defaultRoster.forwards,
    ...defaultRoster.substitutes,
  ];

  const squadValue = allPlayers.reduce((acc, p) => acc + p.overall * 1000 + p.stats.commits * 10, 0);
  const averageRating = Math.round(allPlayers.reduce((acc, p) => acc + p.overall, 0) / allPlayers.length);

  return {
    id: `team-${Date.now()}`,
    name,
    description: description || 'Competitive developer squad in EA FC GitHub Edition.',
    badge: badge || '⚽',
    manager,
    founded: new Date().toISOString().split('T')[0],
    players: defaultRoster,
    totalPlayers: 15,
    formation: '4-4-3',
    squadValue: Math.round(squadValue * 1.1),
    squadChemistry: chemistry,
    averageRating,
    leagueId: null,
    leagueName: null,
    leaguePosition: 1,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    inviteCode: `GIT${name.slice(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`,
    invites: [],
    isPrivate,
    createdAt: new Date().toISOString().split('T')[0],
  };
}

function generate15PlayerRoster(managerCard: EAFCDevCard): TeamRoster {
  const pool = [...PRESET_DEVS];

  // Helper to convert card to TeamPlayer
  const toTeamPlayer = (card: EAFCDevCard, pos: TeamPlayerPosition, role: 'Starting' | 'Substitute' | 'Reserve'): TeamPlayer => ({
    userId: card.id,
    username: card.username,
    name: card.name,
    avatarUrl: card.avatarUrl,
    position: pos,
    role,
    overall: card.ratings.overall,
    joinedTeam: '2026-01-01',
    stats: card.stats,
  });

  const gkCard = pool[3] || managerCard; // Mitchell Hashimoto (Goalkeeper)
  const def1 = pool[5] || managerCard;  // Sindre Sorhus (Defender)
  const def2 = pool[1] || managerCard;  // Dan Abramov
  const def3 = generateFallbackPlayerCard('dev_defender_3');
  const def4 = generateFallbackPlayerCard('dev_defender_4');

  const mid1 = pool[1] || managerCard;  // Dan Abramov
  const mid2 = pool[4] || managerCard;  // Guillermo Rauch
  const mid3 = generateFallbackPlayerCard('dev_mid_3');
  const mid4 = generateFallbackPlayerCard('dev_mid_4');

  const fwd1 = pool[0] || managerCard;  // Linus Torvalds (Striker)
  const fwd2 = pool[2] || managerCard;  // shadcn
  const fwd3 = generateFallbackPlayerCard('dev_forward_3');

  const sub1 = generateFallbackPlayerCard('sub_1');
  const sub2 = generateFallbackPlayerCard('sub_2');
  const sub3 = generateFallbackPlayerCard('sub_3');
  const sub4 = generateFallbackPlayerCard('sub_4');

  return {
    goalkeeper: [toTeamPlayer(gkCard, 'GK', 'Starting')],
    defenders: [
      toTeamPlayer(def1, 'CB', 'Starting'),
      toTeamPlayer(def2, 'CB', 'Starting'),
      toTeamPlayer(def3, 'RB', 'Starting'),
      toTeamPlayer(def4, 'LB', 'Starting'),
    ],
    midfielders: [
      toTeamPlayer(mid1, 'CM', 'Starting'),
      toTeamPlayer(mid2, 'CAM', 'Starting'),
      toTeamPlayer(mid3, 'CM', 'Starting'),
      toTeamPlayer(mid4, 'CM', 'Starting'),
    ],
    forwards: [
      toTeamPlayer(fwd1, 'ST', 'Starting'),
      toTeamPlayer(fwd2, 'RW', 'Starting'),
      toTeamPlayer(fwd3, 'LW', 'Starting'),
    ],
    substitutes: [
      toTeamPlayer(sub1, 'CM', 'Substitute'),
      toTeamPlayer(sub2, 'CB', 'Substitute'),
      toTeamPlayer(sub3, 'ST', 'Substitute'),
      toTeamPlayer(sub4, 'GK', 'Substitute'),
    ],
  };
}

function generateFallbackPlayerCard(seed: string): EAFCDevCard {
  return {
    id: seed,
    username: seed,
    name: seed.charAt(0).toUpperCase() + seed.slice(1).replace('_', ' '),
    avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`,
    bio: 'Core Team Contributor',
    location: 'Global',
    rarity: 'gold',
    position: 'DEV',
    positionTitle: 'Core Developer',
    countryFlag: '🌐',
    clubName: 'MANCHESTER DEVS',
    footballPosition: 'MIDFIELDER',
    footballPositionTitle: 'Midfielder',
    footballPositionBadge: '🎯',
    leagues: [],
    ratings: {
      overall: 84,
      pac: 82,
      sho: 80,
      pas: 85,
      dri: 84,
      def: 82,
      phy: 81,
      sta: 86,
      skl: 85,
    },
    powerScore: 6500,
    stats: {
      username: seed,
      name: seed,
      avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`,
      bio: 'Developer',
      location: 'Global',
      company: '',
      publicRepos: 20,
      followers: 120,
      following: 10,
      createdAt: '2022-01-01',
      commits: 650,
      stars: 140,
      prsMerged: 45,
      issuesClosed: 30,
      forks: 25,
      streakDays: 60,
      languages: ['TypeScript', 'React'],
    },
    badges: [],
    createdAt: '2026-01-01',
  };
}

export function invitePlayerToTeam(team: Team, invitedUsername: string, invitedBy: string): Team {
  const newInvite: TeamInvite = {
    id: `inv-${Date.now()}`,
    teamId: team.id,
    teamName: team.name,
    teamBadge: team.badge,
    invitedBy,
    invitedUser: invitedUsername,
    suggestedPosition: 'MIDFIELDER',
    createdAt: new Date().toISOString().split('T')[0],
    expiresAt: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    status: 'pending',
    inviteCode: team.inviteCode,
  };

  return {
    ...team,
    invites: [...team.invites, newInvite],
  };
}
