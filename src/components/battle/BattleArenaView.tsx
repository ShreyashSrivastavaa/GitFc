import React, { useState } from 'react';
import type { BattleCard, RoundResult, StatKey } from '../../types/battleCard';
import { BattleCardView } from '../card/BattleCardView';
import { STAT_METADATA } from '../../styles/tokens';
import { resolveBattleRound } from '../../game/battleEngine';
import { Swords, RefreshCw, CheckCircle2 } from 'lucide-react';

interface BattleArenaViewProps {
  playerDeck: BattleCard[];
  opponentDeck: BattleCard[];
  opponentName?: string;
  onBattleComplete?: (winner: 'player' | 'opponent' | 'tie', score: string) => void;
  onExit?: () => void;
}

export const BattleArenaView: React.FC<BattleArenaViewProps> = ({
  playerDeck,
  opponentDeck,
  opponentName = 'GitFC Training Bot',
  onBattleComplete,
  onExit,
}) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  // Available cards for selection
  const [availablePlayerCards, setAvailablePlayerCards] = useState<BattleCard[]>([...playerDeck]);
  const [availableOpponentCards, setAvailableOpponentCards] = useState<BattleCard[]>([...opponentDeck]);

  // Round choices
  const [selectedCard, setSelectedCard] = useState<BattleCard | null>(null);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [battleOver, setBattleOver] = useState(false);

  // Round category schedule
  const roundCategories: StatKey[] = [
    'backend',
    'frontend',
    'openSource',
    'innovation',
    'consistency',
  ];
  const activeCategory = roundCategories[currentRound - 1] || 'backend';
  const categoryMeta = STAT_METADATA[activeCategory];

  const handleLockIn = () => {
    if (!selectedCard || isRevealing || battleOver) return;

    setIsRevealing(true);

    // Bot selects best card for current category
    const oppCardsSorted = [...availableOpponentCards].sort(
      (a, b) => b.stats[activeCategory] - a.stats[activeCategory]
    );
    const chosenOpponentCard = oppCardsSorted[0] || availableOpponentCards[0];

    // Simulate simultaneous reveal timing
    setTimeout(() => {
      const result = resolveBattleRound({
        roundIndex: currentRound,
        category: activeCategory,
        playerCard: selectedCard,
        opponentCard: chosenOpponentCard,
      });

      setRoundResult(result);

      let newPScore = playerScore;
      let newOScore = opponentScore;

      if (result.winner === 'player') {
        newPScore += 1;
        setPlayerScore(newPScore);
      } else if (result.winner === 'opponent') {
        newOScore += 1;
        setOpponentScore(newOScore);
      }

      // Remove used cards
      setAvailablePlayerCards((prev) => prev.filter((c) => c.id !== selectedCard.id));
      setAvailableOpponentCards((prev) => prev.filter((c) => c.id !== chosenOpponentCard.id));

      // Clinch condition for Best of 3 or 5
      if (newPScore >= 3 || newOScore >= 3 || currentRound >= 5) {
        setBattleOver(true);
        const overallWinner = newPScore > newOScore ? 'player' : newOScore > newPScore ? 'opponent' : 'tie';
        if (onBattleComplete) {
          onBattleComplete(overallWinner, `${newPScore} - ${newOScore}`);
        }
      }

      setIsRevealing(false);
    }, 900);
  };

  const handleNextRound = () => {
    if (battleOver) return;
    setCurrentRound((prev) => prev + 1);
    setSelectedCard(null);
    setRoundResult(null);
  };

  const handleRestart = () => {
    setCurrentRound(1);
    setPlayerScore(0);
    setOpponentScore(0);
    setAvailablePlayerCards([...playerDeck]);
    setAvailableOpponentCards([...opponentDeck]);
    setSelectedCard(null);
    setRoundResult(null);
    setBattleOver(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Scoreboard Header */}
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Player Side */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center font-black text-cyan-300">
            YOU
          </div>
          <div>
            <div className="text-sm font-bold text-white">Your Squad</div>
            <div className="text-xs text-slate-400">{availablePlayerCards.length} cards remaining</div>
          </div>
        </div>

        {/* Center Score & Round Tracker */}
        <div className="flex flex-col items-center">
          <div className="px-3 py-1 rounded-full bg-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-300 border border-slate-700 mb-1">
            ROUND {currentRound} OF 5 • BEST OF 5
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums flex items-center gap-3">
            <span className={playerScore > opponentScore ? 'text-cyan-400' : 'text-white'}>
              {playerScore}
            </span>
            <span className="text-slate-600">:</span>
            <span className={opponentScore > playerScore ? 'text-red-400' : 'text-white'}>
              {opponentScore}
            </span>
          </div>
        </div>

        {/* Opponent Side */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-bold text-white">{opponentName}</div>
            <div className="text-xs text-slate-400">{availableOpponentCards.length} cards remaining</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center font-black text-purple-300">
            BOT
          </div>
        </div>
      </div>

      {/* Category Announcement Banner */}
      <div className="w-full max-w-md bg-gradient-to-r from-cyan-950/60 via-slate-900 to-purple-950/60 border border-cyan-500/30 rounded-xl p-3 text-center mb-6">
        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
          ROUND {currentRound} BATTLE CATEGORY
        </span>
        <div className="flex items-center justify-center gap-2 mt-0.5">
          <span className="text-lg">{categoryMeta.icon}</span>
          <h2 className="text-lg font-black text-white">{categoryMeta.label}</h2>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">{categoryMeta.description}</p>
      </div>

      {/* Arena Stage: Card Clash or Winner Display */}
      {battleOver ? (
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 my-8 animate-in zoom-in-95">
          <div className="text-5xl">
            {playerScore > opponentScore ? '🏆' : playerScore < opponentScore ? '💀' : '🤝'}
          </div>
          <h2 className="text-2xl font-black text-white">
            {playerScore > opponentScore
              ? 'VICTORY!'
              : playerScore < opponentScore
              ? 'DEFEAT'
              : 'DRAW'}
          </h2>
          <p className="text-sm text-slate-400">
            Final Match Score: <span className="font-bold text-white">{playerScore} - {opponentScore}</span>
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Rematch</span>
            </button>
            {onExit && (
              <button
                type="button"
                onClick={onExit}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Exit Arena
              </button>
            )}
          </div>
        </div>
      ) : roundResult ? (
        /* Round Result Breakdown */
        <div className="w-full max-w-3xl bg-slate-900/90 border border-slate-800 rounded-2xl p-6 mb-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider">
            {roundResult.winner === 'player' ? (
              <span className="text-cyan-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> YOU WON ROUND {currentRound}
              </span>
            ) : roundResult.winner === 'opponent' ? (
              <span className="text-red-400 flex items-center gap-1.5">
                OPPONENT WON ROUND {currentRound}
              </span>
            ) : (
              <span className="text-amber-400">ROUND TIED</span>
            )}
          </div>

          {/* Cards Comparison Grid */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-cyan-400 mb-2">YOUR CARD</span>
              <BattleCardView card={roundResult.playerCard} />
              <div className="mt-2 text-sm font-black text-white">
                Final Score: <span className="text-cyan-400 text-lg">{roundResult.playerFinalScore}</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-slate-600 font-black text-xl my-4 sm:my-0">
              VS
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-purple-400 mb-2">OPPONENT CARD</span>
              <BattleCardView card={roundResult.opponentCard} />
              <div className="mt-2 text-sm font-black text-white">
                Final Score: <span className="text-purple-400 text-lg">{roundResult.opponentFinalScore}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextRound}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all"
          >
            CONTINUE TO ROUND {currentRound + 1}
          </button>
        </div>
      ) : (
        /* Card Selection Tray */
        <div className="w-full flex flex-col items-center space-y-6">
          <div className="text-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              SELECT YOUR CARD FOR THIS ROUND
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose the card best suited for {categoryMeta.label}. It will be locked and revealed simultaneously.
            </p>
          </div>

          {/* Selection Hand */}
          <div className="flex items-center justify-center gap-4 flex-wrap max-w-4xl">
            {availablePlayerCards.map((card) => {
              const isSelected = selectedCard?.id === card.id;
              return (
                <div key={card.id} className="relative group">
                  <BattleCardView
                    card={card}
                    interactive
                    selected={isSelected}
                    onSelect={() => setSelectedCard(card)}
                  />
                  <div className="text-center mt-2">
                    <span className="text-xs font-black text-cyan-400 tabular-nums">
                      {categoryMeta.short}: {card.stats[activeCategory]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lock In CTA Button */}
          <button
            type="button"
            disabled={!selectedCard || isRevealing}
            onClick={handleLockIn}
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-cyan-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isRevealing ? (
              <span>REVEALING SIMULTANEOUSLY...</span>
            ) : (
              <>
                <Swords className="w-4 h-4" />
                <span>LOCK IN CARD FOR ROUND {currentRound}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
