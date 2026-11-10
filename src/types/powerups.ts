import { z } from 'zod';

export const PowerUpRarityEnum = z.enum(['common', 'rare', 'epic', 'legendary']);
export type PowerUpRarity = z.infer<typeof PowerUpRarityEnum>;

export const PowerUpIdEnum = z.enum([
  'rubber-duck',
  'coffee',
  'stack-overflow',
  'git-revert',
  'code-review',
  'hotfix',
  'merge-conflict',
]);
export type PowerUpId = z.infer<typeof PowerUpIdEnum>;

export interface PowerUpDefinition {
  id: PowerUpId;
  name: string;
  rarity: PowerUpRarity;
  description: string;
  icon: string;
  rankedAllowed: boolean; // Only Common and Rare allowed in Ranked play
  maxPerRoundBonus?: number; // Capped at +6
}

export const POWER_UP_CATALOG: Record<PowerUpId, PowerUpDefinition> = {
  'rubber-duck': {
    id: 'rubber-duck',
    name: 'Rubber Duck',
    rarity: 'common',
    description: "Reveal the opponent's strongest stat category for their remaining cards.",
    icon: '🦆',
    rankedAllowed: true,
  },
  coffee: {
    id: 'coffee',
    name: 'Coffee Boost',
    rarity: 'common',
    description: '+2 to your card score for this round.',
    icon: '☕',
    rankedAllowed: true,
    maxPerRoundBonus: 2,
  },
  'stack-overflow': {
    id: 'stack-overflow',
    name: 'Stack Overflow',
    rarity: 'rare',
    description: "Borrow up to 2 points of the opponent's played card stat for this round.",
    icon: '📋',
    rankedAllowed: true,
    maxPerRoundBonus: 2,
  },
  'git-revert': {
    id: 'git-revert',
    name: 'Git Revert',
    rarity: 'rare',
    description: 'After losing a round, replay that round once with a different unused card.',
    icon: '⏪',
    rankedAllowed: true,
  },
  'code-review': {
    id: 'code-review',
    name: 'Code Review',
    rarity: 'epic',
    description: "Cancel the opponent's ability for this round (Casual & Boss only).",
    icon: '🔍',
    rankedAllowed: false,
  },
  hotfix: {
    id: 'hotfix',
    name: 'Emergency Hotfix',
    rarity: 'epic',
    description: 'Change the round category to a new random category before lock-in (Casual only).',
    icon: '🩹',
    rankedAllowed: false,
  },
  'merge-conflict': {
    id: 'merge-conflict',
    name: 'Merge Conflict',
    rarity: 'legendary',
    description: "Both players' round scores are averaged toward the category mean (neutralizes big stat gaps).",
    icon: '💥',
    rankedAllowed: false,
  },
};

export const InventoryItemTypeEnum = z.enum(['power_up', 'commits', 'cosmetic_frame', 'arena_theme', 'title']);
export type InventoryItemType = z.infer<typeof InventoryItemTypeEnum>;

export const PackRewardSchema = z.object({
  id: z.string(),
  type: InventoryItemTypeEnum,
  name: stringOrEmpty(),
  rarity: PowerUpRarityEnum,
  powerUpId: PowerUpIdEnum.optional(),
  commitAmount: z.number().int().optional(),
  description: z.string(),
  icon: z.string(),
});
export type PackReward = z.infer<typeof PackRewardSchema>;

function stringOrEmpty() {
  return z.string();
}

export const PackTypeEnum = z.enum(['daily_free', 'achievement', 'commit_pack']);
export type PackType = z.infer<typeof PackTypeEnum>;

export const PackAuditLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  packType: PackTypeEnum,
  seed: z.string(),
  oddsVersion: z.string(),
  rewards: z.array(PackRewardSchema).length(3),
  openedAt: z.string(),
});
export type PackAuditLog = z.infer<typeof PackAuditLogSchema>;

export const UserInventorySchema = z.object({
  commits: z.number().int().default(100), // Soft currency
  powerUps: z.record(PowerUpIdEnum, z.number().int().min(0).max(5)), // Max stack: 5
  unopenedPacks: z.array(
    z.object({
      id: z.string(),
      packType: PackTypeEnum,
      grantedAt: z.string(),
    })
  ),
  equippedPowerUps: z.array(PowerUpIdEnum).max(2).default([]),
  pityCount: z.number().int().default(0), // Guaranteed Epic+ at 5
  lastDailyPackClaimedAt: z.string().nullable().default(null),
});
export type UserInventory = z.infer<typeof UserInventorySchema>;
