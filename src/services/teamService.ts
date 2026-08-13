import type { Team, TeamPlayer, TeamRoster, TeamInvite, EAFCDevCard, TeamPlayerPosition } from '../types';

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

export function createEmptyTeam(): Team {
  const emptyRoster: TeamRoster = {
    goalkeeper: [],
    defenders: [],
    midfielders: [],
    forwards: [],
    substitutes: [],
  };

  return {
    id: 'empty-team',
    name: 'Unassigned Dev Squad',
    description: 'Connect your GitHub account to manage your squad and invite 14 teammates.',
    badge: '⚽',
    manager: null as any,
    founded: new Date().toISOString().split('T')[0],
    players: emptyRoster,
    totalPlayers: 0,
    formation: '4-4-3',
    squadValue: 0,
    squadChemistry: 0,
    averageRating: 0,
    leagueId: null,
    leagueName: null,
    leaguePosition: 1,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    inviteCode: 'CONNECT-GH',
    invites: [],
    isPrivate: false,
    createdAt: new Date().toISOString().split('T')[0],
  };
}

export function createDefaultTeam(managerCard: EAFCDevCard): Team {
  const managerRoster = createManagerOnlyRoster(managerCard);
  const chemistry = calculateTeamChemistry(managerRoster, '4-4-3');

  const allPlayers = [
    ...managerRoster.goalkeeper,
    ...managerRoster.defenders,
    ...managerRoster.midfielders,
    ...managerRoster.forwards,
    ...managerRoster.substitutes,
  ];

  const squadValue = allPlayers.reduce((acc, p) => acc + p.overall * 1000 + p.stats.commits * 10, 0);
  const averageRating = allPlayers.length > 0 ? Math.round(allPlayers.reduce((acc, p) => acc + p.overall, 0) / allPlayers.length) : managerCard.ratings.overall;

  return {
    id: `team-${managerCard.username.toLowerCase()}`,
    name: `${managerCard.name.split(' ')[0]}'s Dev XI`,
    description: 'Competitive developer squad in EA FC GitHub Edition.',
    badge: '🔴',
    manager: managerCard,
    founded: new Date().toISOString().split('T')[0],
    players: managerRoster,
    totalPlayers: allPlayers.length,
    formation: '4-4-3',
    squadValue: Math.round(squadValue * 1.2),
    squadChemistry: chemistry,
    averageRating,
    leagueId: 'premier',
    leagueName: 'Premier DevLeague',
    leaguePosition: 1,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    inviteCode: `DEV${managerCard.username.slice(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`,
    invites: [],
    isPrivate: false,
    createdAt: new Date().toISOString().split('T')[0],
  };
}

export function createTeam(
  manager: EAFCDevCard,
  name: string,
  description: string,
  badge: string,
  isPrivate: boolean = false
): Team {
  const managerRoster = createManagerOnlyRoster(manager);
  const chemistry = calculateTeamChemistry(managerRoster, '4-4-3');

  const allPlayers = [
    ...managerRoster.goalkeeper,
    ...managerRoster.defenders,
    ...managerRoster.midfielders,
    ...managerRoster.forwards,
    ...managerRoster.substitutes,
  ];

  const squadValue = allPlayers.reduce((acc, p) => acc + p.overall * 1000 + p.stats.commits * 10, 0);
  const averageRating = allPlayers.length > 0 ? Math.round(allPlayers.reduce((acc, p) => acc + p.overall, 0) / allPlayers.length) : manager.ratings.overall;

  return {
    id: `team-${Date.now()}`,
    name,
    description: description || 'Competitive developer squad in EA FC GitHub Edition.',
    badge: badge || '⚽',
    manager,
    founded: new Date().toISOString().split('T')[0],
    players: managerRoster,
    totalPlayers: allPlayers.length,
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

export function createManagerOnlyRoster(managerCard: EAFCDevCard): TeamRoster {
  const pos: TeamPlayerPosition =
    managerCard.footballPosition === 'GOALKEEPER'
      ? 'GK'
      : managerCard.footballPosition === 'DEFENDER'
      ? 'CB'
      : managerCard.footballPosition === 'STRIKER'
      ? 'ST'
      : 'CM';

  const managerPlayer: TeamPlayer = {
    userId: managerCard.id,
    username: managerCard.username,
    name: managerCard.name,
    avatarUrl: managerCard.avatarUrl,
    position: pos,
    role: 'Starting',
    overall: managerCard.ratings.overall,
    joinedTeam: new Date().toISOString().split('T')[0],
    stats: managerCard.stats,
  };

  return {
    goalkeeper: pos === 'GK' ? [managerPlayer] : [],
    defenders: pos === 'CB' ? [managerPlayer] : [],
    midfielders: pos === 'CM' ? [managerPlayer] : [],
    forwards: pos === 'ST' ? [managerPlayer] : [],
    substitutes: [],
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
