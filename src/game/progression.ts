export interface EloDeltaResult {
  playerNewElo: number;
  opponentNewElo: number;
  playerDelta: number;
  opponentDelta: number;
}

/**
 * Calculates ELO update with provisional K-factors and anti-farming dampening
 */
export function calculateEloUpdate(params: {
  playerElo: number;
  opponentElo: number;
  playerWon: boolean;
  isDraw?: boolean;
  playerProvisionalRemaining?: number;
  opponentProvisionalRemaining?: number;
  matchupsInPast24h?: number;
}): EloDeltaResult {
  const {
    playerElo,
    opponentElo,
    playerWon,
    isDraw = false,
    playerProvisionalRemaining = 0,
    opponentProvisionalRemaining = 0,
    matchupsInPast24h = 0,
  } = params;

  // Expected score calculation
  const expectedPlayer = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  const expectedOpponent = 1 - expectedPlayer;

  const actualPlayer = isDraw ? 0.5 : playerWon ? 1 : 0;
  const actualOpponent = isDraw ? 0.5 : playerWon ? 0 : 1;

  // K-factor: 50 for provisional matches (<10 played), 32 standard
  const playerK = playerProvisionalRemaining > 0 ? 50 : 32;
  const opponentK = opponentProvisionalRemaining > 0 ? 50 : 32;

  // Anti-farming dampening for repeated pairings in 24h: 1st match 100%, 2nd match 50%, 3rd match 25%, 4th+ 0%
  let dampeningMultiplier = 1.0;
  if (matchupsInPast24h === 1) dampeningMultiplier = 0.5;
  else if (matchupsInPast24h === 2) dampeningMultiplier = 0.25;
  else if (matchupsInPast24h >= 3) dampeningMultiplier = 0.0;

  const rawPlayerDelta = Math.round(playerK * (actualPlayer - expectedPlayer) * dampeningMultiplier);
  const rawOpponentDelta = Math.round(opponentK * (actualOpponent - expectedOpponent) * dampeningMultiplier);

  // Hard rating floor of 100
  const playerNewElo = Math.max(100, playerElo + rawPlayerDelta);
  const opponentNewElo = Math.max(100, opponentElo + rawOpponentDelta);

  return {
    playerNewElo,
    opponentNewElo,
    playerDelta: playerNewElo - playerElo,
    opponentDelta: opponentNewElo - opponentElo,
  };
}

export type RankTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Grandmaster';

export function getRankTier(elo: number): { tier: RankTier; icon: string; minElo: number } {
  if (elo >= 2000) return { tier: 'Grandmaster', icon: '👑', minElo: 2000 };
  if (elo >= 1700) return { tier: 'Diamond', icon: '💎', minElo: 1700 };
  if (elo >= 1450) return { tier: 'Platinum', icon: '🔮', minElo: 1450 };
  if (elo >= 1200) return { tier: 'Gold', icon: '🥇', minElo: 1200 };
  if (elo >= 1000) return { tier: 'Silver', icon: '🥈', minElo: 1000 };
  return { tier: 'Bronze', icon: '🥉', minElo: 100 };
}

