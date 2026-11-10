import type { BattleCard, StatKey, RoundResult } from '../types/battleCard';
import { STAT_METADATA } from '../styles/tokens';
import type { PowerUpId } from '../types/powerups';
import { POWER_UP_CATALOG } from '../types/powerups';

export interface AbilityResolutionModifier {
  name: string;
  delta: number;
}

/**
 * Procedural developer battle commentary generator
 */
export function generateRoundCommentary(params: {
  category: StatKey;
  winner: 'player' | 'opponent' | 'tie';
  delta: number;
  playerPowerUp?: PowerUpId;
  opponentPowerUp?: PowerUpId;
}): string {
  const { winner, delta, playerPowerUp, opponentPowerUp } = params;

  if (playerPowerUp === 'coffee') {
    return '☕ Coffee kicked in! Extra commit velocity carried the round.';
  }
  if (playerPowerUp === 'stack-overflow') {
    return '📋 Pasted code from Stack Overflow and it passed all unit tests on the first try.';
  }
  if (playerPowerUp === 'code-review') {
    return '🔍 Code Review rejected the opponent branch for missing test coverage!';
  }
  if (playerPowerUp === 'merge-conflict' || opponentPowerUp === 'merge-conflict') {
    return '💥 Merge conflict in 42 files! Both squads bogged down in rebase.';
  }

  if (winner === 'player') {
    if (delta >= 15) {
      const blowouts = [
        'PR merged directly to main without waiting for CI!',
        'Deployed straight to production on a Friday with zero downtime.',
        'Total 10x engineering showcase. The terminal did not lie.',
      ];
      return blowouts[Math.abs(delta) % blowouts.length];
    }
    const closes = [
      'It works on my machine... and it worked in the arena!',
      'Clutched the sprint deadline with 10 seconds remaining.',
      'One-line hotfix fixed the memory leak just in time.',
    ];
    return closes[Math.abs(delta) % closes.length];
  } else if (winner === 'opponent') {
    if (delta >= 15) {
      return 'Git blame pointed directly at your commit.';
    }
    return 'Failed the lint check by a single trailing comma.';
  }
  return 'Stalemate! Both developers are still debating tabs vs spaces in the comments.';
}

/**
 * 5-Phase Ability & Score Resolution Order (RULESET 1.0.0)
 * 1. Shield Check: Does either side have SHIELD_IMMUNITY?
 * 2. Power-Up Pre-Check (Code Review cancels opponent abilities)
 * 3. Debuffs: Apply opponent debuffs if not shielded
 * 4. Conditional Boosts: Apply condition-based buffs (Round index, higher OVR opponent, category match)
 * 5. Power-Up Score Adjustments (Capped at +6 per round)
 * 6. Modifier Capping: Net modifiers capped at [-18, +18]
 */
export function resolveBattleRound(params: {
  roundIndex: number;
  category: StatKey;
  playerCard: BattleCard;
  opponentCard: BattleCard;
  playerPowerUp?: PowerUpId;
  opponentPowerUp?: PowerUpId;
  isRanked?: boolean;
}): RoundResult & {
  commentary: string;
  playerPowerUpApplied?: string;
  opponentPowerUpApplied?: string;
} {
  const {
    roundIndex,
    category,
    playerCard,
    opponentCard,
    playerPowerUp,
    opponentPowerUp,
    isRanked = false,
  } = params;

  // Validate ranked legality
  if (isRanked) {
    if (playerPowerUp && !POWER_UP_CATALOG[playerPowerUp]?.rankedAllowed) {
      throw new Error(`ILLEGAL_POWERUP: ${playerPowerUp} is not permitted in Ranked battles`);
    }
    if (opponentPowerUp && !POWER_UP_CATALOG[opponentPowerUp]?.rankedAllowed) {
      throw new Error(`ILLEGAL_POWERUP: ${opponentPowerUp} is not permitted in Ranked battles`);
    }
  }

  let playerBase = playerCard.stats[category] || 50;
  let opponentBase = opponentCard.stats[category] || 50;

  // Merge Conflict legendary power-up: averages scores toward 50
  if (playerPowerUp === 'merge-conflict' || opponentPowerUp === 'merge-conflict') {
    playerBase = Math.round((playerBase + 50) / 2);
    opponentBase = Math.round((opponentBase + 50) / 2);
  }

  let playerShielded = false;
  let opponentShielded = false;

  // Code Review power-up cancels abilities
  const playerAbilitiesDisabled = opponentPowerUp === 'code-review';
  const opponentAbilitiesDisabled = playerPowerUp === 'code-review';

  // Phase 1: Check Shields
  if (!playerAbilitiesDisabled) {
    for (const ab of playerCard.abilities) {
      if (ab.effectType === 'SHIELD_IMMUNITY') playerShielded = true;
    }
  }
  if (!opponentAbilitiesDisabled) {
    for (const ab of opponentCard.abilities) {
      if (ab.effectType === 'SHIELD_IMMUNITY') opponentShielded = true;
    }
  }

  const playerModifiers: AbilityResolutionModifier[] = [];
  const opponentModifiers: AbilityResolutionModifier[] = [];

  // Phase 2: Debuffs
  if (!opponentAbilitiesDisabled) {
    for (const ab of opponentCard.abilities) {
      if (ab.effectType === 'DEBUFF_OPPONENT_STAT' && !playerShielded) {
        if (!ab.targetStat || ab.targetStat === category) {
          playerModifiers.push({ name: `${opponentCard.name}'s ${ab.name}`, delta: ab.modifierValue });
        }
      }
    }
  }
  if (!playerAbilitiesDisabled) {
    for (const ab of playerCard.abilities) {
      if (ab.effectType === 'DEBUFF_OPPONENT_STAT' && !opponentShielded) {
        if (!ab.targetStat || ab.targetStat === category) {
          opponentModifiers.push({ name: `${playerCard.name}'s ${ab.name}`, delta: ab.modifierValue });
        }
      }
    }
  }

  // Phase 3: Self Boosts & Conditions
  if (!playerAbilitiesDisabled) {
    for (const ab of playerCard.abilities) {
      if (ab.effectType === 'BOOST_SELF_STAT' || ab.effectType === 'EXTRA_CATEGORY_BOOST') {
        let applies = false;
        if (ab.trigger === 'ALWAYS') applies = true;
        if (ab.trigger === 'ROUND_3_OR_LATER' && roundIndex >= 3) applies = true;
        if (ab.trigger === 'FINAL_ROUND' && (roundIndex === 3 || roundIndex === 5)) applies = true;
        if (ab.trigger === 'CATEGORY_MATCH' && ab.targetStat === category) applies = true;
        if (ab.trigger === 'OPPONENT_HIGHER_OVR' && opponentCard.stats.overall > playerCard.stats.overall) applies = true;

        if (applies) {
          playerModifiers.push({ name: ab.name, delta: ab.modifierValue });
        }
      }
    }
  }

  if (!opponentAbilitiesDisabled) {
    for (const ab of opponentCard.abilities) {
      if (ab.effectType === 'BOOST_SELF_STAT' || ab.effectType === 'EXTRA_CATEGORY_BOOST') {
        let applies = false;
        if (ab.trigger === 'ALWAYS') applies = true;
        if (ab.trigger === 'ROUND_3_OR_LATER' && roundIndex >= 3) applies = true;
        if (ab.trigger === 'FINAL_ROUND' && (roundIndex === 3 || roundIndex === 5)) applies = true;
        if (ab.trigger === 'CATEGORY_MATCH' && ab.targetStat === category) applies = true;
        if (ab.trigger === 'OPPONENT_HIGHER_OVR' && playerCard.stats.overall > opponentCard.stats.overall) applies = true;

        if (applies) {
          opponentModifiers.push({ name: ab.name, delta: ab.modifierValue });
        }
      }
    }
  }

  // Phase 4: Power-Up Score Modifiers (Strictly Capped at +3 total)
  let playerPowerUpApplied: string | undefined;
  let opponentPowerUpApplied: string | undefined;

  if (playerPowerUp === 'coffee') {
    const boost = playerCard.stats[category] >= 88 ? 1 : 2;
    playerModifiers.push({ name: 'Coffee Boost', delta: boost });
    playerPowerUpApplied = `Coffee (+${boost})`;
  } else if (playerPowerUp === 'stack-overflow') {
    const borrowed = opponentCard.stats[category] >= 88 ? 1 : 2;
    playerModifiers.push({ name: 'Stack Overflow Borrow', delta: borrowed });
    playerPowerUpApplied = `Stack Overflow (+${borrowed})`;
  }

  if (opponentPowerUp === 'coffee') {
    const boost = opponentCard.stats[category] >= 88 ? 1 : 2;
    opponentModifiers.push({ name: 'Coffee Boost', delta: boost });
    opponentPowerUpApplied = `Coffee (+${boost})`;
  } else if (opponentPowerUp === 'stack-overflow') {
    const borrowed = playerCard.stats[category] >= 88 ? 1 : 2;
    opponentModifiers.push({ name: 'Stack Overflow Borrow', delta: borrowed });
    opponentPowerUpApplied = `Stack Overflow (+${borrowed})`;
  }

  // Phase 5: Modifier Capping: Net modifiers capped at [-18, +18]
  const sumMods = (mods: AbilityResolutionModifier[]) => {
    const rawSum = mods.reduce((sum, m) => sum + m.delta, 0);
    return Math.min(18, Math.max(-18, rawSum));
  };

  const pNet = sumMods(playerModifiers);
  const oNet = sumMods(opponentModifiers);

  const playerFinalScore = Math.max(0, playerBase + pNet);
  const opponentFinalScore = Math.max(0, opponentBase + oNet);

  // Phase 6: Determine Winner & Deterministic Tie-Break
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
      // Tie-break 2: Lower rarity wins
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
      else winner = 'player';
    }
  }

  const commentary = generateRoundCommentary({
    category,
    winner,
    delta: Math.abs(playerFinalScore - opponentFinalScore),
    playerPowerUp,
    opponentPowerUp,
  });

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
    commentary,
    playerPowerUpApplied,
    opponentPowerUpApplied,
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
