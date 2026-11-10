import { z } from 'zod';

export const CardRarityEnum = z.enum(['common', 'rare', 'epic', 'legendary', 'mythic']);
export type CardRarity = z.infer<typeof CardRarityEnum>;

export const CardTypeEnum = z.enum(['developer', 'repository', 'language', 'special']);
export type CardType = z.infer<typeof CardTypeEnum>;

export const StatKeyEnum = z.enum([
  'backend',
  'frontend',
  'openSource',
  'innovation',
  'consistency',
  'popularity',
  'languageMastery',
]);
export type StatKey = z.infer<typeof StatKeyEnum>;

export const StatBlockSchema = z.object({
  backend: z.number().int().min(0).max(99),
  frontend: z.number().int().min(0).max(99),
  openSource: z.number().int().min(0).max(99),
  innovation: z.number().int().min(0).max(99),
  consistency: z.number().int().min(0).max(99),
  popularity: z.number().int().min(0).max(99),
  languageMastery: z.number().int().min(0).max(99),
  overall: z.number().int().min(0).max(99),
});
export type StatBlock = z.infer<typeof StatBlockSchema>;

export const StatDerivationSchema = z.record(
  StatKeyEnum,
  z.object({
    value: z.number(),
    formulaDescription: z.string(),
    primaryFactors: z.array(z.string()),
  })
);
export type StatDerivation = z.infer<typeof StatDerivationSchema>;

export const AbilityTriggerEnum = z.enum([
  'ALWAYS',
  'ROUND_3_OR_LATER',
  'FINAL_ROUND',
  'CATEGORY_MATCH',
  'OPPONENT_HIGHER_OVR',
  'POLYGLOT_DECK',
]);
export type AbilityTrigger = z.infer<typeof AbilityTriggerEnum>;

export const AbilityEffectTypeEnum = z.enum([
  'BOOST_SELF_STAT',
  'DEBUFF_OPPONENT_STAT',
  'SHIELD_IMMUNITY',
  'EXTRA_CATEGORY_BOOST',
]);
export type AbilityEffectType = z.infer<typeof AbilityEffectTypeEnum>;

export const AbilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  trigger: AbilityTriggerEnum,
  effectType: AbilityEffectTypeEnum,
  targetStat: StatKeyEnum.optional(),
  modifierValue: z.number().int(),
  icon: z.string(),
});
export type Ability = z.infer<typeof AbilitySchema>;

export const BattleCardSchema = z.object({
  id: z.string(),
  type: CardTypeEnum,
  ownerId: z.string().optional(),
  name: z.string(),
  subtitle: z.string(), // e.g. "@torvalds" or "torvalds/linux" or "Rust"
  avatarUrl: z.string().url().optional(),
  rarity: CardRarityEnum,
  stats: StatBlockSchema,
  primaryArchetype: z.string(), // e.g. "Backend Architect", "Frontend Prodigy"
  abilities: z.array(AbilitySchema),
  derivation: StatDerivationSchema.optional(),
  rulesetVersion: z.string().default('1.0.0'),
  createdAt: z.string(),
  sourceUrl: z.string().optional(), // GitHub link
});
export type BattleCard = z.infer<typeof BattleCardSchema>;

export const DeckSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(32),
  cards: z.array(BattleCardSchema).length(5),
  totalPower: z.number().int(),
  averageRating: z.number().int(),
  isLegal: z.boolean(),
  budgetUsed: z.number().int(),
  budgetMax: z.number().int().default(415),
  violations: z.array(z.string()),
});
export type Deck = z.infer<typeof DeckSchema>;

export const RoundResultSchema = z.object({
  roundIndex: z.number().int().min(1).max(5),
  category: StatKeyEnum,
  categoryLabel: z.string(),
  playerCard: BattleCardSchema,
  opponentCard: BattleCardSchema,
  playerRawScore: z.number(),
  opponentRawScore: z.number(),
  playerModifiers: z.array(z.object({ name: z.string(), delta: z.number() })),
  opponentModifiers: z.array(z.object({ name: z.string(), delta: z.number() })),
  playerFinalScore: z.number(),
  opponentFinalScore: z.number(),
  winner: z.enum(['player', 'opponent', 'tie']),
});
export type RoundResult = z.infer<typeof RoundResultSchema>;

export const BattleStateSchema = z.object({
  id: z.string(),
  format: z.enum(['bo3', 'bo5']),
  status: z.enum(['waiting_opponent', 'in_progress', 'completed', 'expired']),
  roundIndex: z.number().int(),
  playerScore: z.number().int(),
  opponentScore: z.number().int(),
  rounds: z.array(RoundResultSchema),
  activeCategory: StatKeyEnum.optional(),
  playerCommitted: z.boolean(),
  opponentCommitted: z.boolean(),
  winner: z.enum(['player', 'opponent', 'tie']).nullable(),
  eloDelta: z.number().optional(),
  xpEarned: z.number().optional(),
});
export type BattleState = z.infer<typeof BattleStateSchema>;
