import type { Team, TeamPlayer, TeamRoster, TeamInvite, EAFCDevCard, TeamPlayerPosition } from '../types';

export function calculateTeamChemistry(roster: TeamRoster, formation: string): number {
  const allPlayers = [
    ...roster.goalkeeper,
    ...roster.defenders,
    ...roster.midfielders,
    ...roster.forwards,
  ];

  if (allPlayers.length === 0) return 50;

  const countFactor = Math.min(40, (allPlayers.length / 12) * 40);
  const avgRating = allPlayers.reduce((acc, p) => acc + p.overall, 0) / allPlayers.length;
  const ratingFactor = (avgRating / 99) * 35;
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

export function getAllPlayersInTeam(team: Team): TeamPlayer[] {
  return [
    ...team.players.goalkeeper,
    ...team.players.defenders,
    ...team.players.midfielders,
    ...team.players.forwards,
    ...team.players.substitutes,
  ];
}

export function validateInviteUsername(
  username: string,
  team: Team
): { valid: boolean; reason?: string } {
  const cleanUsername = username.replace(/^@/, '').trim().toLowerCase();
  if (!cleanUsername) {
    return { valid: false, reason: 'Please enter a GitHub username' };
  }

  const existingPlayers = getAllPlayersInTeam(team);
  const isAlreadyInTeam = existingPlayers.some(
    (p) => p.username.toLowerCase() === cleanUsername
  );
  if (isAlreadyInTeam) {
    return { valid: false, reason: 'User already in a team' };
  }

  const hasPendingInvite = team.invites.some(
    (i) => i.invitedUser.toLowerCase() === cleanUsername && i.status === 'pending'
  );
  if (hasPendingInvite) {
    return { valid: false, reason: 'User already has a pending invite' };
  }

  return { valid: true };
}

export function sendTeamInvite(
  team: Team,
  invitedUsername: string,
  position: string,
  message: string,
  managerUsername: string
): { updatedTeam: Team; invite: TeamInvite } {
  const cleanUsername = invitedUsername.replace(/^@/, '').trim();
  const inviteId = `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  
  const newInvite: TeamInvite = {
    id: inviteId,
    teamId: team.id,
    teamName: team.name,
    teamBadge: team.badge,
    invitedBy: managerUsername,
    invitedUser: cleanUsername,
    suggestedPosition: position,
    message,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    status: 'pending',
    inviteCode: team.inviteCode,
  };

  const updatedTeam: Team = {
    ...team,
    invites: [...team.invites, newInvite],
  };

  return { updatedTeam, invite: newInvite };
}

export function addPlayerToRoster(
  team: Team,
  playerCard: EAFCDevCard,
  positionName: string
): Team {
  const posUpper = positionName.toUpperCase();
  let posCode: TeamPlayerPosition = 'CM';

  if (posUpper.includes('GOALKEEPER') || posUpper === 'GK') posCode = 'GK';
  else if (posUpper.includes('DEFENDER') || posUpper === 'DEF' || posUpper === 'CB') posCode = 'CB';
  else if (posUpper.includes('FORWARD') || posUpper.includes('STRIKER') || posUpper === 'FWD' || posUpper === 'ST') posCode = 'ST';
  else if (posUpper.includes('SUB') || posUpper === 'BENCH') posCode = 'CM';

  const newPlayer: TeamPlayer = {
    userId: playerCard.id,
    username: playerCard.username,
    name: playerCard.name,
    avatarUrl: playerCard.avatarUrl,
    position: posCode,
    role: posUpper.includes('SUB') ? 'Substitute' : 'Starting',
    overall: playerCard.ratings.overall,
    joinedTeam: new Date().toISOString().split('T')[0],
    stats: playerCard.stats,
  };

  // Remove existing instances of this player to prevent duplicates
  const isMatch = (p: TeamPlayer) => p.userId === playerCard.id || p.username.toLowerCase() === playerCard.username.toLowerCase();

  const newRoster = {
    goalkeeper: team.players.goalkeeper.filter(p => !isMatch(p)),
    defenders: team.players.defenders.filter(p => !isMatch(p)),
    midfielders: team.players.midfielders.filter(p => !isMatch(p)),
    forwards: team.players.forwards.filter(p => !isMatch(p)),
    substitutes: team.players.substitutes.filter(p => !isMatch(p)),
  };

  if (posCode === 'GK') {
    newRoster.goalkeeper = [...newRoster.goalkeeper, newPlayer];
  } else if (posCode === 'CB') {
    newRoster.defenders = [...newRoster.defenders, newPlayer];
  } else if (posCode === 'ST') {
    newRoster.forwards = [...newRoster.forwards, newPlayer];
  } else if (posUpper.includes('SUB')) {
    newRoster.substitutes = [...newRoster.substitutes, newPlayer];
  } else {
    newRoster.midfielders = [...newRoster.midfielders, newPlayer];
  }

  const allPlayers = [
    ...newRoster.goalkeeper,
    ...newRoster.defenders,
    ...newRoster.midfielders,
    ...newRoster.forwards,
    ...newRoster.substitutes,
  ];

  const chemistry = calculateTeamChemistry(newRoster, team.formation);
  const averageRating = Math.round(allPlayers.reduce((acc, p) => acc + p.overall, 0) / allPlayers.length);

  return {
    ...team,
    players: newRoster,
    totalPlayers: allPlayers.length,
    squadChemistry: chemistry,
    averageRating,
  };
}

export function removePlayerFromTeam(team: Team, userId: string): Team {
  const newRoster: TeamRoster = {
    goalkeeper: team.players.goalkeeper.filter((p) => p.userId !== userId),
    defenders: team.players.defenders.filter((p) => p.userId !== userId),
    midfielders: team.players.midfielders.filter((p) => p.userId !== userId),
    forwards: team.players.forwards.filter((p) => p.userId !== userId),
    substitutes: team.players.substitutes.filter((p) => p.userId !== userId),
  };

  const allPlayers = [
    ...newRoster.goalkeeper,
    ...newRoster.defenders,
    ...newRoster.midfielders,
    ...newRoster.forwards,
    ...newRoster.substitutes,
  ];

  const chemistry = calculateTeamChemistry(newRoster, team.formation);
  const averageRating =
    allPlayers.length > 0
      ? Math.round(allPlayers.reduce((acc, p) => acc + p.overall, 0) / allPlayers.length)
      : team.manager ? team.manager.ratings.overall : 80;

  return {
    ...team,
    players: newRoster,
    totalPlayers: allPlayers.length,
    squadChemistry: chemistry,
    averageRating,
  };
}

const STORAGE_KEY_TEAM = 'gitfc_user_team';

export function getStoredTeam(): Team | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEAM);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredTeam(team: Team): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(team));
  } catch (e) {
    console.warn('[teamService] Failed to save team to localStorage', e);
  }
}

export function createShareableInviteLink(
  team: Team,
  targetUsername?: string,
  position: string = 'MIDFIELDER',
  message?: string
): string {
  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://gitfc.vercel.app';

  const cleanTarget = targetUsername ? targetUsername.trim().replace(/^@/, '') : '';
  const payload = {
    tId: team.id,
    tNm: team.name,
    bdg: team.badge || '⚽',
    mgr: team.manager ? team.manager.username : 'manager',
    pos: position,
    msg: message || `Hey! Join my squad "${team.name}" for Season 2026 on GitFC.`,
    usr: cleanTarget || undefined,
    ts: Date.now()
  };

  try {
    const jsonStr = JSON.stringify(payload);
    // URL-safe base64
    const token = btoa(unescape(encodeURIComponent(jsonStr)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return `${origin}/?invite=${token}`;
  } catch {
    return `${origin}/?join=${encodeURIComponent(team.inviteCode || 'GITFC')}`;
  }
}

export function parseInviteToken(token: string): TeamInvite | null {
  if (!token) return null;
  try {
    // Revert URL-safe base64
    let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonStr = decodeURIComponent(escape(atob(base64)));
    const p = JSON.parse(jsonStr);
    if (!p || !p.tNm) return null;

    return {
      id: `inv-${p.ts || Date.now()}`,
      teamId: p.tId || `team-${Date.now()}`,
      teamName: p.tNm,
      teamBadge: p.bdg || '⚽',
      invitedBy: p.mgr || 'manager',
      invitedUser: p.usr || 'teammate',
      suggestedPosition: p.pos || 'MIDFIELDER',
      message: p.msg || `Hey! Join my squad "${p.tNm}" on GitFC!`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      status: 'pending',
      inviteCode: p.code || 'GITFC',
    };
  } catch (e) {
    console.warn('[teamService] Could not parse invite token:', e);
    return null;
  }
}
