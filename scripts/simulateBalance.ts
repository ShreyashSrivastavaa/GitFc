import { resolveBattleRound, validateDeck } from '../src/game/battleEngine';
import { SAMPLE_BATTLE_CARDS } from '../src/data/sampleCards';
import type { BattleCard, StatKey } from '../src/types/battleCard';

const CATEGORIES: StatKey[] = [
  'backend',
  'frontend',
  'openSource',
  'innovation',
  'consistency',
  'popularity',
  'languageMastery',
];

/**
 * Monte Carlo Tactical Battle Simulation
 * Deck A (Tactical / Specialized Lower OVR ~79 Avg):
 * - High synergy, category counters, abilities
 * Deck B (Brute Force High OVR ~87 Avg):
 * - Raw stats, no synergy tuning
 */
function runSimulation(numMatches = 5000) {
  // Tactical Deck (~395 Total OVR, Avg 79)
  const gaearon = SAMPLE_BATTLE_CARDS.find((c) => c.id === 'dev-gaearon')!; // 92 OVR, +10 Frontend
  const rust = SAMPLE_BATTLE_CARDS.find((c) => c.id === 'lang-rust')!; // 78 OVR, +7 Language
  const mitchellh = SAMPLE_BATTLE_CARDS.find((c) => c.id === 'dev-mitchellh')!; // 87 OVR, -6 Opponent Backend
  const builder = SAMPLE_BATTLE_CARDS.find((c) => c.id === 'dev-contributor')!; // 65 OVR
  const antirez = SAMPLE_BATTLE_CARDS.find((c) => c.id === 'dev-antirez')!; // 86 OVR, +8 Consistency in Final Round

  const tacticalDeck: BattleCard[] = [gaearon, rust, mitchellh, builder, antirez];
  const tacticalValidation = validateDeck({ cards: tacticalDeck });

  // Brute Force Deck (~415 Total OVR, Avg 83 - Cap)
  const torvalds = SAMPLE_BATTLE_CARDS.find((c) => c.id === 'dev-torvalds')!; // 95 OVR
  const shadcn = SAMPLE_BATTLE_CARDS.find((c) => c.id === 'dev-shadcn')!; // 90 OVR
  const nextjs = SAMPLE_BATTLE_CARDS.find((c) => c.id === 'repo-nextjs')!; // 88 OVR
  const bruteBuilder = SAMPLE_BATTLE_CARDS.find((c) => c.id === 'dev-contributor')!; // 65 OVR
  const bruteRust = SAMPLE_BATTLE_CARDS.find((c) => c.id === 'lang-rust')!; // 78 OVR

  const bruteDeck: BattleCard[] = [torvalds, shadcn, nextjs, bruteBuilder, bruteRust];
  const bruteValidation = validateDeck({ cards: bruteDeck });

  console.log('=== DECK BALANCE SIMULATION CONFIGURATION ===');
  console.log(`Tactical Deck Total OVR: ${tacticalValidation.totalPower} (Avg ${tacticalValidation.averageRating}) - Legal: ${tacticalValidation.isLegal}`);
  console.log(`Brute Force Deck Total OVR: ${bruteValidation.totalPower} (Avg ${bruteValidation.averageRating}) - Legal: ${bruteValidation.isLegal}`);

  let tacticalWins = 0;
  let bruteWins = 0;
  let ties = 0;

  for (let m = 0; m < numMatches; m++) {
    // Best of 5 Match
    const categories: StatKey[] = [];
    const usedCategories = new Set<StatKey>();
    while (categories.length < 5) {
      const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      if (!usedCategories.has(cat)) {
        usedCategories.add(cat);
        categories.push(cat);
      }
    }

    // Clone available cards
    const tCards = [...tacticalDeck];
    const bCards = [...bruteDeck];

    let tScore = 0;
    let bScore = 0;

    for (let round = 1; round <= 5; round++) {
      const cat = categories[round - 1];

      // Tactical player picks the best matching card for the category
      tCards.sort((a, b) => b.stats[cat] - a.stats[cat]);
      const tCard = tCards.shift()!;

      // Brute player picks highest overall available card (naive play)
      bCards.sort((a, b) => b.stats.overall - a.stats.overall);
      const bCard = bCards.shift()!;

      const roundRes = resolveBattleRound({
        roundIndex: round,
        category: cat,
        playerCard: tCard,
        opponentCard: bCard,
      });

      if (roundRes.winner === 'player') tScore++;
      else if (roundRes.winner === 'opponent') bScore++;

      // Majority Clinch check (3 wins in Bo5)
      if (tScore >= 3 || bScore >= 3) break;
    }

    if (tScore > bScore) tacticalWins++;
    else if (bScore > tScore) bruteWins++;
    else ties++;
  }

  const tacticalWinRate = ((tacticalWins / numMatches) * 100).toFixed(2);
  const bruteWinRate = ((bruteWins / numMatches) * 100).toFixed(2);

  console.log('\n=== SIMULATION RESULTS (5,000 MATCHES) ===');
  console.log(`Tactical Deck Wins: ${tacticalWins} (${tacticalWinRate}%)`);
  console.log(`Brute Force Deck Wins: ${bruteWins} (${bruteWinRate}%)`);
  console.log(`Ties: ${ties}`);
  console.log(`Target: Tactical Deck >= 40% win rate against +20 OVR advantage`);
  console.log(`Result: ${parseFloat(tacticalWinRate) >= 40 ? 'PASSED (Strategy Expressed)' : 'FAILED'}`);
}

runSimulation(5000);
