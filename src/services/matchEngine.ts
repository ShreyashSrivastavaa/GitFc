import type { Team } from '../types';

export interface MatchResult {
  id: string;
  homeTeamName: string;
  homeTeamBadge: string;
  awayTeamName: string;
  awayTeamBadge: string;
  homeGoals: number;
  awayGoals: number;
  homePoints: number;
  awayPoints: number;
  timestamp: string;
}

export function calculateTeamPower(team: Team): number {
  const formationBonus = team.formation === '4-4-3' || team.formation === '4-3-3' ? 1.1 : 1.0;
  const chemistryFactor = (team.squadChemistry || 90) / 100;
  const avgRating = team.averageRating || 85;

  return avgRating * 100 * formationBonus * chemistryFactor;
}

export function simulateMatch(homeTeam: Team, awayTeam: Team): MatchResult {
  const homePower = calculateTeamPower(homeTeam);
  const awayPower = calculateTeamPower(awayTeam);

  const totalPower = homePower + awayPower;
  const homeGoals = Math.max(0, Math.round((homePower / totalPower) * 4.5 + (Math.random() * 2 - 0.5)));
  const awayGoals = Math.max(0, Math.round((awayPower / totalPower) * 4.5 + (Math.random() * 2 - 0.5)));

  let homePoints = 1;
  let awayPoints = 1;

  if (homeGoals > awayGoals) {
    homePoints = 3;
    awayPoints = 0;
  } else if (homeGoals < awayGoals) {
    homePoints = 0;
    awayPoints = 3;
  }

  return {
    id: `match-${Date.now()}`,
    homeTeamName: homeTeam.name,
    homeTeamBadge: homeTeam.badge,
    awayTeamName: awayTeam.name,
    awayTeamBadge: awayTeam.badge,
    homeGoals,
    awayGoals,
    homePoints,
    awayPoints,
    timestamp: new Date().toISOString(),
  };
}
