import React, { useState } from 'react';
import type { PackReward } from '../../types/powerups';
import { RARITY_THEMES } from '../../styles/tokens';
import { Sparkles, Check } from 'lucide-react';

interface PackOpeningModalProps {
  packTitle: string;
  rewards: [PackReward, PackReward, PackReward];
  refundedCommits?: number;
  onClose: () => void;
}

export const PackOpeningModal: React.FC<PackOpeningModalProps> = ({
  packTitle,
  rewards,
  refundedCommits = 0,
  onClose,
}) => {
  const [revealedIndex, setRevealedIndex] = useState<number>(0);

  const handleCardClick = (index: number) => {
    if (index === revealedIndex && revealedIndex < 3) {
      setRevealedIndex((prev) => prev + 1);
    }
  };

  const allRevealed = revealedIndex >= 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-amber-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-black uppercase tracking-wider text-cyan-300">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>PACK OPENING</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {packTitle}
          </h2>
          <p className="text-xs text-slate-400">
            {allRevealed
              ? 'All 3 items revealed! They have been added to your inventory.'
              : `Tap card #${revealedIndex + 1} to reveal your reward!`}
          </p>
        </div>

        {/* 3 Revealed Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {rewards.map((item, idx) => {
            const isRevealed = idx < revealedIndex;
            const isNext = idx === revealedIndex;
            const theme = RARITY_THEMES[item.rarity] || RARITY_THEMES.common;

            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(idx)}
                className={`relative aspect-[1/1.4] rounded-2xl p-4 flex flex-col items-center justify-between text-center select-none transition-all duration-300 cursor-pointer ${
                  isRevealed
                    ? `${theme.gradientBg} ${theme.borderClass} scale-100`
                    : isNext
                    ? 'bg-slate-950 border-2 border-dashed border-cyan-400/80 hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-pulse'
                    : 'bg-slate-950/50 border border-slate-800 opacity-40 cursor-not-allowed'
                }`}
              >
                {isRevealed ? (
                  <>
                    {/* Item Rarity Badge */}
                    <div
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase border ${theme.badgeBg}`}
                    >
                      {item.rarity}
                    </div>

                    {/* Big Item Icon */}
                    <div className="text-4xl my-auto drop-shadow-md">
                      {item.icon}
                    </div>

                    {/* Item Name & Details */}
                    <div className="space-y-1">
                      <div className="font-black text-white text-sm leading-tight">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-300 line-clamp-2">
                        {item.description}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="my-auto flex flex-col items-center justify-center space-y-2 text-slate-500">
                    <span className="text-3xl">🎁</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {isNext ? 'TAP TO REVEAL' : 'LOCKED'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Duplicate refund alert if any */}
        {refundedCommits > 0 && allRevealed && (
          <div className="mb-6 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300 font-semibold">
            🪙 Inventory stack cap reached: +{refundedCommits} Commits refunded!
          </div>
        )}

        {/* Action Button */}
        {allRevealed ? (
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <Check className="w-4 h-4" />
            <span>COLLECT & RETURN</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setRevealedIndex(3)}
            className="text-xs font-bold text-slate-400 hover:text-white underline transition-colors"
          >
            Reveal All at Once
          </button>
        )}
      </div>
    </div>
  );
};
