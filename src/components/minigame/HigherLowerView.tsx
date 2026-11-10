import React, { useState } from 'react';
import { SAMPLE_BATTLE_CARDS } from '../../data/sampleCards';
import { STAT_METADATA } from '../../styles/tokens';
import type { StatKey } from '../../types/battleCard';
import { ArrowUp, ArrowDown, Sparkles, RefreshCw, Trophy } from 'lucide-react';

interface HigherLowerViewProps {
  onEarnCommits: (amount: number) => void;
}

export const HigherLowerView: React.FC<HigherLowerViewProps> = ({ onEarnCommits }) => {
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gamesPlayedToday, setGamesPlayedToday] = useState(0);
  const maxGamesPerDay = 10;

  const categories: StatKey[] = ['backend', 'frontend', 'openSource', 'innovation', 'consistency', 'popularity', 'languageMastery'];

  const getRandomState = () => {
    const cardAIndex = Math.floor(Math.random() * SAMPLE_BATTLE_CARDS.length);
    let cardBIndex = Math.floor(Math.random() * (SAMPLE_BATTLE_CARDS.length - 1));
    if (cardBIndex >= cardAIndex) cardBIndex += 1;

    const cat = categories[Math.floor(Math.random() * categories.length)];
    return {
      cardA: SAMPLE_BATTLE_CARDS[cardAIndex],
      cardB: SAMPLE_BATTLE_CARDS[cardBIndex],
      category: cat,
    };
  };

  const [gameState, setGameState] = useState(getRandomState);
  const [revealed, setRevealed] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  const handleGuess = (guess: 'higher' | 'lower') => {
    if (revealed || gamesPlayedToday >= maxGamesPerDay) return;

    const scoreA = gameState.cardA.stats[gameState.category];
    const scoreB = gameState.cardB.stats[gameState.category];

    const isHigher = scoreB >= scoreA;
    const isCorrect = (guess === 'higher' && isHigher) || (guess === 'lower' && !isHigher);

    setRevealed(true);
    setLastCorrect(isCorrect);
    setGamesPlayedToday((prev) => prev + 1);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highScore) setHighScore(newStreak);
      onEarnCommits(20 + newStreak * 5); // Base 20 + streak bonus
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setGameState(getRandomState());
    setRevealed(false);
    setLastCorrect(null);
  };

  const catMeta = STAT_METADATA[gameState.category];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            <h1 className="text-3xl font-black text-white tracking-tight">HIGHER OR LOWER</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Test your developer trivia knowledge. Guess if the second developer's stat is higher or lower to build streaks and earn Commits!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 font-bold">Streak:</span>
            <span className="font-black text-white text-sm tabular-nums">{streak}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 font-bold">Best:</span>
            <span className="font-black text-cyan-400 text-sm tabular-nums">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Category Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
          COMPARISON CATEGORY
        </span>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-xl">{catMeta.icon}</span>
          <h2 className="text-lg font-black text-white">{catMeta.label}</h2>
        </div>
      </div>

      {/* Duel Cards Stage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Card A (Known Stat) */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col items-center text-center space-y-4">
          <img
            src={gameState.cardA.avatarUrl}
            alt={gameState.cardA.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-slate-700 shadow-md"
          />
          <div>
            <h3 className="font-black text-white text-lg">{gameState.cardA.name}</h3>
            <span className="text-xs text-slate-400">{gameState.cardA.subtitle}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 w-full max-w-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {catMeta.short} Rating
            </span>
            <div className="text-4xl font-black text-cyan-400 tabular-nums mt-1">
              {gameState.cardA.stats[gameState.category]}
            </div>
          </div>
        </div>

        {/* Card B (Guess Higher or Lower) */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col items-center text-center space-y-4">
          <img
            src={gameState.cardB.avatarUrl}
            alt={gameState.cardB.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-slate-700 shadow-md"
          />
          <div>
            <h3 className="font-black text-white text-lg">{gameState.cardB.name}</h3>
            <span className="text-xs text-slate-400">{gameState.cardB.subtitle}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 w-full max-w-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {catMeta.short} Rating
            </span>
            {revealed ? (
              <div
                className={`text-4xl font-black tabular-nums mt-1 ${
                  lastCorrect ? 'text-emerald-400 animate-in zoom-in-95' : 'text-rose-400'
                }`}
              >
                {gameState.cardB.stats[gameState.category]}
              </div>
            ) : (
              <div className="text-3xl font-black text-slate-600 my-1">???</div>
            )}
          </div>

          {/* Buttons or Result */}
          {revealed ? (
            <div className="w-full space-y-2">
              <div
                className={`text-sm font-bold uppercase tracking-wider ${
                  lastCorrect ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {lastCorrect ? '🎉 Correct! +Commits Earned' : '❌ Wrong Guess! Streak Reset'}
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Next Developer</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 w-full max-w-xs pt-1">
              <button
                type="button"
                onClick={() => handleGuess('higher')}
                className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <ArrowUp className="w-4 h-4" />
                <span>HIGHER</span>
              </button>
              <button
                type="button"
                onClick={() => handleGuess('lower')}
                className="flex-1 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <ArrowDown className="w-4 h-4" />
                <span>LOWER</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Daily Cap Info */}
      <div className="text-center text-[11px] text-slate-500">
        Daily Cap: {gamesPlayedToday} / {maxGamesPerDay} matches played today. Resets at 00:00 UTC.
      </div>
    </div>
  );
};
