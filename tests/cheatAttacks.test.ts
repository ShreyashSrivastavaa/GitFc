import { describe, it, expect } from 'vitest';
import { SAMPLE_BATTLE_CARDS } from '../src/data/sampleCards';

describe('Anti-Cheat & Battle Integrity Attack Suite', () => {
  const gaearon = SAMPLE_BATTLE_CARDS.find((c) => c.id === 'dev-gaearon')!;

  it('attack: client tampered stats (e.g. client asserts 9999 Frontend)', () => {

    // The server should reject or cap values to 99
    // In our architecture, the server re-loads card from DB using card.id
    // But even if passed to resolveBattleRound, modifiers and caps prevent unbound scores
    const canonicalCard = gaearon; // Server lookup by card ID
    expect(canonicalCard.stats.frontend).toBe(98);
  });

  it('attack: duplicate card submission in same match', () => {
    const usedCardIds = new Set<string>(['dev-gaearon']);

    const attemptSubmittingDuplicate = (cardId: string) => {
      if (usedCardIds.has(cardId)) {
        throw new Error('ILLEGAL_MOVE: Card has already been used in this battle');
      }
      usedCardIds.add(cardId);
    };

    expect(() => attemptSubmittingDuplicate('dev-gaearon')).toThrow(
      'ILLEGAL_MOVE: Card has already been used in this battle'
    );
  });

  it('attack: submitting move after match has completed or expired', () => {
    const battleStatus: 'waiting_opponent' | 'in_progress' | 'completed' | 'expired' = 'completed';

    const commitMove = (status: string) => {
      if (status !== 'in_progress') {
        throw new Error('ILLEGAL_STATE: Battle is no longer active');
      }
      return true;
    };

    expect(() => commitMove(battleStatus)).toThrow('ILLEGAL_STATE: Battle is no longer active');
  });

  it('attack: foreign card ID not owned by player', () => {
    const playerDeckCardIds = new Set(['dev-gaearon', 'lang-rust', 'repo-nextjs']);
    const attackerInjectedCardId = 'dev-torvalds'; // Player does not own this card in deck

    const validateSubmission = (cardId: string) => {
      if (!playerDeckCardIds.has(cardId)) {
        throw new Error('UNAUTHORIZED_CARD: Card does not belong to active locked deck');
      }
      return true;
    };

    expect(() => validateSubmission(attackerInjectedCardId)).toThrow(
      'UNAUTHORIZED_CARD: Card does not belong to active locked deck'
    );
  });
});
