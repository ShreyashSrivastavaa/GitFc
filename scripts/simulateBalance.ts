import { resolveBattleRound, validateDeck } from '../src/game/battleEngine';
import { SAMPLE_BATTLE_CARDS } from '../src/data/sampleCards';
import type { BattleCard, StatKey } from '../src/types/battleCard';
import type { PowerUpId } from '../src/types/powerups';

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
 * Monte Carlo Tactical Battle Simulation with Power-Up Balance Testing (10,000 Matches)
 * Tests power-up contribution across 10,000 diverse simulated matches.
 */
function runSimulation(numMatches = 10000) {
  console.log('=================================================================');
  console.log('    GITFC POWER-UP & TACTICAL DECK SIMULATION (10,000 MATCHES)    ');
  console.log('=================================================================');

  // Pool of cards for diverse ladder simulations
  const cardPool: BattleCard[] = [...SAMPLE_BATTLE_CARDS];

  const buildRandomLegalDeck = (): BattleCard[] => {
    const shuffled = [...cardPool].sort(() => Math.random() - 0.5);
    const chosen: BattleCard[] = [];
    for (const c of shuffled) {
      if (chosen.length >= 5) break;
      const testDeck = [...chosen, c];
      const val = validateDeck({ cards: testDeck });
      // Keep adding if within budget
      if (val.totalPower <= 415) {
        chosen.push(c);
      }
    }
    // Fallback if needed
    while (chosen.length < 5) {
      chosen.push(cardPool[cardPool.length - 1]);
    }
    return chosen;
  };

  const playMatch = (
    pDeck: BattleCard[],
    oDeck: BattleCard[],
    categories: StatKey[],
    playerLoadout: PowerUpId[],
    opponentLoadout: PowerUpId[]
  ) => {
    const tCards = [...pDeck];
    const bCards = [...oDeck];

    let tScore = 0;
    let bScore = 0;

    let pUsed = 0;
    let oUsed = 0;

    for (let round = 1; round <= 5; round++) {
      const cat = categories[round - 1];

      tCards.sort((a, b) => b.stats[cat] - a.stats[cat]);
      const tCard = tCards.shift()!;

      bCards.sort((a, b) => b.stats[cat] - a.stats[cat]);
      const bCard = bCards.shift()!;

      let pPU: PowerUpId | undefined;
      if (pUsed < playerLoadout.length && round >= 2) {
        pPU = playerLoadout[pUsed];
        pUsed++;
      }

      let oPU: PowerUpId | undefined;
      if (oUsed < opponentLoadout.length && round >= 3) {
        oPU = opponentLoadout[oUsed];
        oUsed++;
      }

      const roundRes = resolveBattleRound({
        roundIndex: round,
        category: cat,
        playerCard: tCard,
        opponentCard: bCard,
        playerPowerUp: pPU,
        opponentPowerUp: oPU,
      });

      if (roundRes.winner === 'player') tScore++;
      else if (roundRes.winner === 'opponent') bScore++;

      if (tScore >= 3 || bScore >= 3) break;
    }

    return tScore > bScore ? 1 : 0;
  };

  let baselineWins = 0;
  let coffeeWins = 0;
  let stackWins = 0;
  let fullLoadoutWins = 0;
  let symmetricWins = 0;

  for (let m = 0; m < numMatches; m++) {
    const pDeck = buildRandomLegalDeck();
    const oDeck = buildRandomLegalDeck();

    const categories: StatKey[] = [];
    const usedCategories = new Set<StatKey>();
    while (categories.length < 5) {
      const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      if (!usedCategories.has(cat)) {
        usedCategories.add(cat);
        categories.push(cat);
      }
    }

    baselineWins += playMatch(pDeck, oDeck, categories, [], []);
    coffeeWins += playMatch(pDeck, oDeck, categories, ['coffee'], []);
    stackWins += playMatch(pDeck, oDeck, categories, ['stack-overflow'], []);
    fullLoadoutWins += playMatch(pDeck, oDeck, categories, ['coffee', 'stack-overflow'], []);
    symmetricWins += playMatch(pDeck, oDeck, categories, ['coffee', 'stack-overflow'], ['coffee']);
  }

  const baselineWinRate = (baselineWins / numMatches) * 100;
  const coffeeWinRate = (coffeeWins / numMatches) * 100;
  const stackWinRate = (stackWins / numMatches) * 100;
  const fullLoadoutWinRate = (fullLoadoutWins / numMatches) * 100;
  const symmetricWinRate = (symmetricWins / numMatches) * 100;

  const coffeeDelta = coffeeWinRate - baselineWinRate;
  const stackDelta = stackWinRate - baselineWinRate;
  const loadoutDelta = fullLoadoutWinRate - baselineWinRate;

  console.log(`1. Baseline Win Rate (No Power-Ups): ${baselineWinRate.toFixed(2)}%`);
  console.log(`2. Single Item [Coffee]: ${coffeeWinRate.toFixed(2)}% (Delta: +${coffeeDelta.toFixed(2)}%)`);
  console.log(`3. Single Item [Stack Overflow]: ${stackWinRate.toFixed(2)}% (Delta: +${stackDelta.toFixed(2)}%)`);
  console.log(`4. Full Loadout [Coffee + Stack Overflow]: ${fullLoadoutWinRate.toFixed(2)}% (Total Delta: +${loadoutDelta.toFixed(2)}%)`);
  console.log(`5. Competitive Loadout vs Opponent Coffee: ${symmetricWinRate.toFixed(2)}%`);

  console.log('\n================== BALANCE TARGET CHECKS ==================');
  const maxLoadoutPass = loadoutDelta <= 8.0 && loadoutDelta >= 0;
  const singleItemPass = coffeeDelta <= 4.0 && stackDelta <= 4.0;

  console.log(`Target 1: Max loadout contribution <= +8.0% -> +${loadoutDelta.toFixed(2)}% (${maxLoadoutPass ? 'PASSED' : 'FAILED'})`);
  console.log(`Target 2: Single item contribution <= +4.0% -> Coffee +${coffeeDelta.toFixed(2)}%, Stack +${stackDelta.toFixed(2)}% (${singleItemPass ? 'PASSED' : 'FAILED'})`);
  console.log(`Overall Balance Verification: ${maxLoadoutPass && singleItemPass ? 'SUCCESS' : 'NEEDS TUNING'}`);
  console.log('===========================================================');
}

runSimulation(10000);
