import {
  POWER_UP_CATALOG,
  type PackReward,
  type PackType,
  type PowerUpId,
  type PowerUpRarity,
  type UserInventory,
} from '../types/powerups';

export const CURRENT_PACK_ODDS_VERSION = '1.0.0';
export const PITY_THRESHOLD = 5; // Guaranteed Epic+ item every 5 packs
export const MAX_POWERUP_STACK = 5;
export const DUPLICATE_COMMIT_REFUND = 35; // Excess power-ups convert to 35 Commits

export interface PackOdds {
  common: number; // e.g. 0.65
  rare: number; // e.g. 0.25
  epic: number; // e.g. 0.08
  legendary: number; // e.g. 0.02
}

export const BASE_PACK_ODDS: PackOdds = {
  common: 0.65,
  rare: 0.25,
  epic: 0.08,
  legendary: 0.02,
};

/**
 * Seeded PRNG for reproducible pack opens
 */
function seededRandom(seed: string, offset: number): number {
  let hash = 0;
  const str = `${seed}:${offset}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 10000) / 10000;
}

/**
 * Roll a rarity tier given odds and pity count
 */
function rollRarity(rand: number, pityCount: number): { rarity: PowerUpRarity; triggeredPity: boolean } {
  if (pityCount >= PITY_THRESHOLD - 1) {
    // Pity trigger: guaranteed Epic (80%) or Legendary (20%)
    return {
      rarity: rand < 0.2 ? 'legendary' : 'epic',
      triggeredPity: true,
    };
  }

  if (rand < BASE_PACK_ODDS.legendary) return { rarity: 'legendary', triggeredPity: false };
  if (rand < BASE_PACK_ODDS.legendary + BASE_PACK_ODDS.epic) return { rarity: 'epic', triggeredPity: false };
  if (rand < BASE_PACK_ODDS.legendary + BASE_PACK_ODDS.epic + BASE_PACK_ODDS.rare) {
    return { rarity: 'rare', triggeredPity: false };
  }
  return { rarity: 'common', triggeredPity: false };
}

/**
 * Generates 3 deterministic items for an opened pack
 */
export function generatePackRewards(_packType: PackType, seed: string, currentPityCount: number): {
  rewards: [PackReward, PackReward, PackReward];
  newPityCount: number;
} {
  const rewards: PackReward[] = [];
  let pityTriggeredInPack = false;

  const powerUpsByRarity: Record<PowerUpRarity, PowerUpId[]> = {
    common: ['rubber-duck', 'coffee'],
    rare: ['stack-overflow', 'git-revert'],
    epic: ['code-review', 'hotfix'],
    legendary: ['merge-conflict'],
  };

  for (let slot = 0; slot < 3; slot++) {
    const randRarity = seededRandom(seed, slot * 2);
    const randType = seededRandom(seed, slot * 2 + 1);

    const { rarity, triggeredPity } = rollRarity(
      randRarity,
      slot === 2 && !pityTriggeredInPack ? currentPityCount : 0
    );

    if (triggeredPity) pityTriggeredInPack = true;
    if (rarity === 'epic' || rarity === 'legendary') pityTriggeredInPack = true;

    // 70% chance Power-Up, 30% chance Commits currency bundle
    if (randType < 0.7) {
      const candidates = powerUpsByRarity[rarity];
      const pIndex = Math.floor(seededRandom(seed, slot * 3 + 7) * candidates.length);
      const chosenPowerUpId = candidates[pIndex] || candidates[0];
      const def = POWER_UP_CATALOG[chosenPowerUpId];

      rewards.push({
        id: `reward-${slot}-${chosenPowerUpId}`,
        type: 'power_up',
        name: def.name,
        rarity,
        powerUpId: chosenPowerUpId,
        description: def.description,
        icon: def.icon,
      });
    } else {
      // Commits Currency Bundle
      const commitAmounts: Record<PowerUpRarity, number> = {
        common: 40,
        rare: 75,
        epic: 150,
        legendary: 300,
      };
      const amount = commitAmounts[rarity];
      rewards.push({
        id: `reward-${slot}-commits-${amount}`,
        type: 'commits',
        name: `${amount} Commits`,
        rarity,
        commitAmount: amount,
        description: `Soft currency for purchasing cards, packs, and upgrades.`,
        icon: '🪙',
      });
    }
  }

  const newPityCount = pityTriggeredInPack ? 0 : currentPityCount + 1;

  return {
    rewards: [rewards[0], rewards[1], rewards[2]],
    newPityCount,
  };
}

/**
 * Applies pack rewards to a user's inventory, respecting stack caps and duplicate refunds
 */
export function applyPackRewardsToInventory(
  inventory: UserInventory,
  rewards: PackReward[],
  newPityCount: number
): {
  updatedInventory: UserInventory;
  refundedCommits: number;
} {
  let newCommits = inventory.commits;
  let refundedCommits = 0;
  const newPowerUps = { ...inventory.powerUps };

  for (const reward of rewards) {
    if (reward.type === 'commits' && reward.commitAmount) {
      newCommits += reward.commitAmount;
    } else if (reward.type === 'power_up' && reward.powerUpId) {
      const currentQty = newPowerUps[reward.powerUpId] || 0;
      if (currentQty >= MAX_POWERUP_STACK) {
        // Exceeds stack cap (5): convert to Commits!
        newCommits += DUPLICATE_COMMIT_REFUND;
        refundedCommits += DUPLICATE_COMMIT_REFUND;
      } else {
        newPowerUps[reward.powerUpId] = currentQty + 1;
      }
    }
  }

  return {
    updatedInventory: {
      ...inventory,
      commits: newCommits,
      powerUps: newPowerUps,
      pityCount: newPityCount,
    },
    refundedCommits,
  };
}

/**
 * Creates default initial inventory for a new player
 */
export function createInitialInventory(): UserInventory {
  return {
    commits: 150,
    powerUps: {
      'rubber-duck': 2,
      coffee: 3,
      'stack-overflow': 1,
      'git-revert': 1,
      'code-review': 0,
      hotfix: 0,
      'merge-conflict': 0,
    },
    unopenedPacks: [
      { id: 'pack-starter-free', packType: 'daily_free', grantedAt: new Date().toISOString() },
    ],
    equippedPowerUps: ['coffee', 'rubber-duck'],
    pityCount: 0,
    lastDailyPackClaimedAt: null,
  };
}
