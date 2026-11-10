import { describe, it, expect } from 'vitest';
import { resolveBattleRound, validateDeck } from '../src/game/battleEngine';
import { SAMPLE_BATTLE_CARDS } from '../src/data/sampleCards';
import type { BattleCard } from '../src/types/battleCard';

describe('Server Battle Engine (RULESET 1.0.0)', () => {
  const torvalds = SAMPLE_BATTLE_CARDS.find((c) => c.id === 'dev-torvalds')!;
  const gaearon = SAMPLE_BATTLE_CARDS.find((c) => c.id === 'dev-gaearon')!;
  const rust = SAMPLE_BATTLE_CARDS.find((c) => c.id === 'lang-rust')!;
  const nextjs = SAMPLE_BATTLE_CARDS.find((c) => c.id === 'repo-nextjs')!;
  const mitchellh = SAMPLE_BATTLE_CARDS.find((c) => c.id === 'dev-mitchellh')!;
  const builder = SAMPLE_BATTLE_CARDS.find((c) => c.id === 'dev-contributor')!;

  it('correctly resolves round base stats and declares higher score winner', () => {
    // Torvalds (98 Backend) vs Gaearon (74 Backend)
    const result = resolveBattleRound({
      roundIndex: 1,
      category: 'backend',
      playerCard: torvalds,
      opponentCard: gaearon,
    });

    expect(result.winner).toBe('player');
    expect(result.playerRawScore).toBe(98);
    expect(result.opponentRawScore).toBe(74);
  });

  it('triggers category-match ability and boosts score', () => {
    // Gaearon has Reconciler (+10 Frontend when category is frontend)
    const result = resolveBattleRound({
      roundIndex: 1,
      category: 'frontend',
      playerCard: gaearon,
      opponentCard: torvalds,
    });

    expect(result.winner).toBe('player');
    expect(result.playerModifiers.length).toBeGreaterThan(0);
    expect(result.playerFinalScore).toBe(gaearon.stats.frontend + 10);
  });

  it('enforces shield immunity against opponent debuffs', () => {
    // Mitchellh has Vagrant Shield (-6 Opponent Backend)
    // Torvalds has C Mastery (SHIELD_IMMUNITY)
    const result = resolveBattleRound({
      roundIndex: 1,
      category: 'backend',
      playerCard: torvalds,
      opponentCard: mitchellh,
    });

    // Torvalds should have NO debuffs applied because he is shielded
    const torvaldsDebuffs = result.playerModifiers.filter((m) => m.delta < 0);
    expect(torvaldsDebuffs.length).toBe(0);
  });

  it('validates legal 5-card decks within budget limit', () => {
    // Legal deck: Mitchellh (87), Next.js (88), Rust (78), Builder (65), Gaearon (92) = 410 OVR <= 415
    const legalDeck = {
      cards: [mitchellh, nextjs, rust, builder, gaearon],
    };

    const validation = validateDeck(legalDeck);
    expect(validation.isLegal).toBe(true);
    expect(validation.totalPower).toBeLessThanOrEqual(415);
    expect(validation.violations.length).toBe(0);
  });

  it('rejects decks exceeding the 415 OVR budget cap', () => {
    // Over-budget deck: Torvalds (95) + Gaearon (92) + Shadcn (90) + Next.js (88) + Mitchellh (87) = 452 > 415
    const shadcn = SAMPLE_BATTLE_CARDS.find((c) => c.id === 'dev-shadcn')!;
    const overBudgetDeck = {
      cards: [torvalds, gaearon, shadcn, nextjs, mitchellh],
    };

    const validation = validateDeck(overBudgetDeck);
    expect(validation.isLegal).toBe(false);
    expect(validation.violations.some((v) => v.includes('budget limit'))).toBe(true);
  });

  it('rejects decks with duplicate cards or more than 2 Legendary/Mythic cards', () => {
    const shadcn = SAMPLE_BATTLE_CARDS.find((c) => c.id === 'dev-shadcn')!;
    // 3 Legendaries/Mythics: Torvalds (Mythic), Gaearon (Legendary), Shadcn (Legendary)
    const tooManyLegendsDeck = {
      cards: [torvalds, gaearon, shadcn, rust, builder],
    };

    const validation = validateDeck(tooManyLegendsDeck);
    expect(validation.isLegal).toBe(false);
    expect(validation.violations.some((v) => v.includes('Maximum 2 Legendary'))).toBe(true);
  });
});
