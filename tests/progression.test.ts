import { describe, it, expect } from 'vitest';
import { calculateEloUpdate, getRankTier } from '../src/game/progression';

describe('Ranked ELO & Anti-Farming Engine', () => {
  it('correctly awards ELO for victory against an equal opponent', () => {
    const res = calculateEloUpdate({
      playerElo: 1000,
      opponentElo: 1000,
      playerWon: true,
      playerProvisionalRemaining: 0,
      opponentProvisionalRemaining: 0,
    });

    expect(res.playerDelta).toBe(16); // 32 * (1 - 0.5)
    expect(res.opponentDelta).toBe(-16);
    expect(res.playerNewElo).toBe(1016);
    expect(res.opponentNewElo).toBe(984);
  });

  it('uses higher K-factor (50) for provisional placement matches', () => {
    const res = calculateEloUpdate({
      playerElo: 1000,
      opponentElo: 1000,
      playerWon: true,
      playerProvisionalRemaining: 8, // Provisional
    });

    expect(res.playerDelta).toBe(25); // 50 * (1 - 0.5)
    expect(res.playerNewElo).toBe(1025);
  });

  it('dampens rating change to 0% after 3 repeated pairings in 24h to block collusive farming', () => {
    const farmedMatch = calculateEloUpdate({
      playerElo: 1000,
      opponentElo: 1000,
      playerWon: true,
      matchupsInPast24h: 3, // 4th match
    });

    expect(farmedMatch.playerDelta).toBe(0);
    expect(farmedMatch.opponentDelta).toBe(0);
    expect(farmedMatch.playerNewElo).toBe(1000);
  });

  it('maps rating to appropriate competitive rank tier', () => {
    expect(getRankTier(2150).tier).toBe('Grandmaster');
    expect(getRankTier(1800).tier).toBe('Diamond');
    expect(getRankTier(1500).tier).toBe('Platinum');
    expect(getRankTier(1250).tier).toBe('Gold');
    expect(getRankTier(1050).tier).toBe('Silver');
    expect(getRankTier(850).tier).toBe('Bronze');
  });
});

