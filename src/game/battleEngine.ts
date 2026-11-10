import type { BattleCard, StatKey, RoundResult } from '../types/battleCard';
import { STAT_METADATA } from '../styles/tokens';

export interface AbilityResolutionModifier {
  name: string;
  delta: number;
}

/**
 * 5-Phase Ability & Score Resolution Order (RULESET 1.0.0)
 * 1. Shield Check: Does either side have SHIELD_IMMUNITY?
 * 2. Debuffs: Apply opponent debuffs if not shielded
 * 3. Conditional Boosts: Apply condition-based buffs (Round index, higher OVR opponent, category match)
 * 4. Synergy: Apply deck language/archetype synergies
 * 5. Modifier Capping: Net modifiers capped at [-18, +18]
 */
export function resolveBattleRound(params: {
  roundIndex: number;
  category: StatKey;
  playerCard: BattleCard;
  opponentCard: BattleCard;
}): RoundResult {
  const { roundIndex, category, playerCard, opponentCard } = params;

  const playerBase = playerCard.stats[category] || 50;
  const opponentBase = opponentCard.stats[category] || 50;

  let playerShielded = false;
  let opponentShielded = false;

  // Phase 1: Check Shields
  for (const ab of playerCard.abilities) {
    if (ab.effectType === 'SHIELD_IMMUNITY') playerShielded = true;
  }
  for (const ab of opponentCard.abilities) {
    if (ab.effectType === 'SHIELD_IMMUNITY') opponentShielded = true;
  }

  const playerModifiers: AbilityResolutionModifier[] = [];
  const opponentModifiers: AbilityResolutionModifier[] = [];

  // Phase 2: Debuffs (applied to the OTHER player if unshielded)
  for (const ab of opponentCard.abilities) {
    if (ab.effectType === 'DEBUFF_OPPONENT_STAT' && !playerShielded) {
      if (!ab.targetStat || ab.targetStat === category) {
        playerModifiers.push({ name: `${opponentCard.name}'s ${ab.name}`, delta: ab.modifierValue });
      }
    }
  }
  for (const ab of playerCard.abilities) {
    if (ab.effectType === 'DEBUFF_OPPONENT_STAT' && !opponentShielded) {
      if (!ab.targetStat || ab.targetStat === category) {
        opponentModifiers.push({ name: `${playerCard.name}'s ${ab.name}`, delta: ab.modifierValue });
      }
    }
  }

  // Phase 3: Self Boosts & Conditions
  const checkTriggers = (card: BattleCard, isOpponent = false) => {
    const opp = isOpponent ? playerCard : opponentCard;
    const mods = isOpponent ? opponentModifiers : playerModifiers;

    for (const ab of card.abilities) {
      if (ab.effectType === 'BOOST_SELF_STAT' || ab.effectType === 'EXTRA_CATEGORY_BOOST') {
        let applies = false;
        if (ab.trigger === 'ALWAYS') applies = true;
        if (ab.trigger === 'ROUND_3_OR_LATER' && roundIndex >= 3) applies = true;
        if (ab.trigger === 'FINAL_ROUND' && (roundIndex === 3 || roundIndex === 5)) applies = true;
        if (ab.trigger === 'CATEGORY_MATCH' && ab.targetStat === category) applies = true;
        if (ab.trigger === 'OPPONENT_HIGHER_OVR' && opp.stats.overall > card.stats.overall) applies = true;

        if (applies) {
          mods.push({ name: ab.name, delta: ab.modifierValue });
        }
      }
    }
  };

  checkTriggers(playerCard, false);
  checkTriggers(opponentCard, true);

  // Phase 4: Cap modifiers between [-18, +18]
  const sumMods = (mods: AbilityResolutionModifier[]) => {
    const rawSum = mods.reduce((sum, m) => sum + m.delta, 0);
    return Math.min(18, Math.max(-18, rawSum));
  };

  const pNet = sumMods(playerModifiers);
  const oNet = sumMods(opponentModifiers);

  const playerFinalScore = Math.max(0, playerBase + pNet);
  const opponentFinalScore = Math.max(0, opponentBase + oNet);

  // Phase 5: Determine Winner & Deterministic Tie-Break
  let winner: 'player' | 'opponent' | 'tie' = 'tie';
  if (playerFinalScore > opponentFinalScore) {
    winner = 'player';
  } else if (opponentFinalScore > playerFinalScore) {
    winner = 'opponent';
  } else {
    // Deterministic tie-break 1: Overall rating
    if (playerCard.stats.overall > opponentCard.stats.overall) {
      winner = 'player';
    } else if (opponentCard.stats.overall > playerCard.stats.overall) {
      winner = 'opponent';
    } else {
      // Tie-break 2: Lower rarity wins (strategic underdog triumph)
      const rarityWeight: Record<string, number> = {
        common: 1,
        rare: 2,
        epic: 3,
        legendary: 4,
        mythic: 5,
      };
      const pR = rarityWeight[playerCard.rarity] || 1;
      const oR = rarityWeight[opponentCard.rarity] || 1;
      if (pR < oR) winner = 'player';
      else if (oR < pR) winner = 'opponent';
      else winner = 'player'; // Defender / Challenger stable deterministic tiebreak
    }
  }

  return {
    roundIndex,
    category,
    categoryLabel: STAT_METADATA[category]?.label || category,
    playerCard,
    opponentCard,
    playerRawScore: playerBase,
    opponentRawScore: opponentBase,
    playerModifiers,
    opponentModifiers,
    playerFinalScore,
    opponentFinalScore,
    winner,
  };
}

/**
 * Validates 5-Card Deck Legal Requirements
 */
export function validateDeck(deck: { cards: BattleCard[] }): {
  isLegal: boolean;
  totalPower: number;
  averageRating: number;
  budgetUsed: number;
  violations: string[];
} {
  const violations: string[] = [];

  if (deck.cards.length !== 5) {
    violations.push(`A deck must contain exactly 5 cards (currently ${deck.cards.length}).`);
  }

  // 1. Check unique cards (no duplicate card IDs)
  const ids = new Set(deck.cards.map((c) => c.id));
  if (ids.size !== deck.cards.length) {
    violations.push('A deck cannot contain duplicate cards.');
  }

  // 2. Budget Cap: Combined overall cannot exceed 415 (average 83 OVR)
  const totalPower = deck.cards.reduce((sum, c) => sum + c.stats.overall, 0);
  const averageRating = deck.cards.length > 0 ? Math.round(totalPower / deck.cards.length) : 0;
  const budgetMax = 415;

  if (totalPower > budgetMax) {
    violations.push(`Deck exceeds budget limit of ${budgetMax} OVR (current: ${totalPower}).`);
  }

  // 3. Rarity Cap: Max 2 cards of Legendary or Mythic tier
  const eliteCount = deck.cards.filter((c) => c.rarity === 'legendary' || c.rarity === 'mythic').length;
  if (eliteCount > 2) {
    violations.push(`Maximum 2 Legendary or Mythic cards allowed per deck (current: ${eliteCount}).`);
  }

  // 4. Archetype Diversity: At least 2 distinct primary archetypes
  const archetypes = new Set(deck.cards.map((c) => c.primaryArchetype));
  if (deck.cards.length === 5 && archetypes.size < 2) {
    violations.push('Deck must feature at least 2 distinct primary stat archetypes.');
  }

  return {
    isLegal: violations.length === 0,
    totalPower,
    averageRating,
    budgetUsed: totalPower,
    violations,
  };
}
