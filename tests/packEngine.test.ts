import { describe, it, expect } from 'vitest';
import {
  generatePackRewards,
  applyPackRewardsToInventory,
  createInitialInventory,
  PITY_THRESHOLD,
  MAX_POWERUP_STACK,
  DUPLICATE_COMMIT_REFUND,
} from '../src/game/packEngine';
import type { PackReward } from '../src/types/powerups';

describe('Pack & Power-Up System (RULESET 1.0.0)', () => {
  it('generates exactly 3 items per pack deterministically from a seed', () => {
    const seed = 'seed-test-pack-123';
    const pack1 = generatePackRewards('daily_free', seed, 0);
    const pack2 = generatePackRewards('daily_free', seed, 0);

    expect(pack1.rewards.length).toBe(3);
    expect(pack1.rewards).toEqual(pack2.rewards);
  });

  it('triggers pity timer for guaranteed Epic or Legendary on the 5th pack', () => {
    // With currentPityCount = PITY_THRESHOLD - 1 (4), slot 3 triggers pity
    const pityPack = generatePackRewards('commit_pack', 'test-pity-seed-99', PITY_THRESHOLD - 1);
    const hasEpicOrLegendary = pityPack.rewards.some(
      (r) => r.rarity === 'epic' || r.rarity === 'legendary'
    );

    expect(hasEpicOrLegendary).toBe(true);
    expect(pityPack.newPityCount).toBe(0); // Resets pity
  });

  it('converts excess power-ups to Commits when inventory stack exceeds cap (5)', () => {
    const inventory = createInitialInventory();
    // Set coffee to maximum stack (5)
    inventory.powerUps['coffee'] = MAX_POWERUP_STACK;
    const initialCommits = inventory.commits;

    const mockReward: PackReward = {
      id: 'reward-coffee',
      type: 'power_up',
      name: 'Coffee Boost',
      rarity: 'common',
      powerUpId: 'coffee',
      description: '+4 score',
      icon: '☕',
    };

    const { updatedInventory, refundedCommits } = applyPackRewardsToInventory(
      inventory,
      [mockReward],
      0
    );

    // Quantity should stay capped at 5
    expect(updatedInventory.powerUps['coffee']).toBe(MAX_POWERUP_STACK);
    // Refunded Commits should increase
    expect(refundedCommits).toBe(DUPLICATE_COMMIT_REFUND);
    expect(updatedInventory.commits).toBe(initialCommits + DUPLICATE_COMMIT_REFUND);
  });
});
