import { describe, it, expect } from 'vitest';
import { computeStatBlock, determineRarity, generateDeveloperCard } from '../src/game/cardGenerator';
import type { GitHubRawMetrics, GitHubSnapshot } from '../src/types/github';

describe('Card Generation Engine (RULESET 1.0.0)', () => {
  const baseMetrics: GitHubRawMetrics = {
    username: 'octocat',
    name: 'The Octocat',
    avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
    bio: 'Mascot developer',
    followers: 1200,
    following: 10,
    createdAt: '2015-01-01T00:00:00Z',
    starsReceived: 3500,
    forksCount: 800,
    externalPRsMerged: 45,
    commitsPastYear: 1400,
    activeWeeksPastYear: 48,
    longestStreakDays: 62,
    originalRepoCount: 22,
    distinctLanguagesCount: 6,
    distinctTopicsCount: 14,
    backendBytes: 4500000,
    backendRepoCount: 12,
    frontendBytes: 1500000,
    frontendRepoCount: 6,
    topLanguageName: 'TypeScript',
    topLanguageBytes: 3000000,
    topLanguageRepoShare: 0.55,
  };

  it('generates completely deterministic stats for the same input', () => {
    const run1 = computeStatBlock(baseMetrics);
    const run2 = computeStatBlock(baseMetrics);

    expect(run1.stats).toEqual(run2.stats);
    expect(run1.stats.overall).toBeGreaterThanOrEqual(30);
    expect(run1.stats.overall).toBeLessThanOrEqual(99);
  });

  it('correctly maps overall score to deterministic rarity thresholds', () => {
    expect(determineRarity(96)).toBe('mythic');
    expect(determineRarity(95)).toBe('mythic');
    expect(determineRarity(94)).toBe('legendary');
    expect(determineRarity(89)).toBe('legendary');
    expect(determineRarity(85)).toBe('epic');
    expect(determineRarity(75)).toBe('rare');
    expect(determineRarity(65)).toBe('common');
  });

  it('applies anti-gaming penalty for accounts younger than 30 days', () => {
    const brandNewMetrics: GitHubRawMetrics = {
      ...baseMetrics,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days old
    };

    const normal = computeStatBlock(baseMetrics);
    const penalized = computeStatBlock(brandNewMetrics);

    expect(penalized.stats.backend).toBeLessThan(normal.stats.backend);
    expect(penalized.stats.frontend).toBeLessThan(normal.stats.frontend);
  });

  it('builds a full BattleCard with valid abilities and ruleset version', () => {
    const snapshot: GitHubSnapshot = {
      id: 'snap-1',
      username: baseMetrics.username,
      name: baseMetrics.name,
      avatarUrl: baseMetrics.avatarUrl,
      rawMetrics: baseMetrics,
      fetchedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      rulesetVersion: '1.0.0',
    };

    const card = generateDeveloperCard(snapshot);
    expect(card.id).toBe('dev-octocat');
    expect(card.rulesetVersion).toBe('1.0.0');
    expect(card.stats.overall).toBeGreaterThan(70);
    expect(['common', 'rare', 'epic', 'legendary', 'mythic']).toContain(card.rarity);
    expect(card.abilities.length).toBeGreaterThanOrEqual(1);
  });
});

