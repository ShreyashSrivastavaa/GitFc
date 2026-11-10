import React, { useState } from 'react';
import { SAMPLE_BATTLE_CARDS } from '../../data/sampleCards';
import { BattleCardView } from '../card/BattleCardView';
import { getRankTier } from '../../game/progression';
import { Sparkles } from 'lucide-react';

export const ProfileView: React.FC<{ username?: string }> = () => {
  const [favoriteCard] = useState(SAMPLE_BATTLE_CARDS[0]);
  const tier = getRankTier(2240);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-16 space-y-8">
      {/* Player Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={favoriteCard.avatarUrl}
          alt={favoriteCard.name}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
        />

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {favoriteCard.name}
            </h1>
            <span className="text-sm font-bold text-slate-400">@{favoriteCard.subtitle.replace(/^@/, '')}</span>
          </div>

          <p className="text-xs text-slate-400 max-w-md">
            Creator of Linux & Git. Competing in GitFC Competitive Season 2026.
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-bold text-amber-300">
              <span>{tier.icon}</span>
              <span>{tier.tier} Tier</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-bold text-cyan-400 tabular-nums">
              <span>🏆 2,240 ELO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Record & Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Battles</span>
          <div className="text-2xl font-black text-white mt-1 tabular-nums">52</div>
        </div>
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Win Rate</span>
          <div className="text-2xl font-black text-emerald-400 mt-1 tabular-nums">92.3%</div>
        </div>
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Global Rank</span>
          <div className="text-2xl font-black text-amber-400 mt-1 tabular-nums">#1</div>
        </div>
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Card Vault</span>
          <div className="text-2xl font-black text-cyan-400 mt-1 tabular-nums">8 Cards</div>
        </div>
      </div>

      {/* Showcase Favorite Card */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center">
        <h2 className="text-sm font-black text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>SHOWCASED SIGNATURE CARD</span>
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Your top rated developer card featured in match previews and challenges.
        </p>

        <BattleCardView card={favoriteCard} interactive showDerivationModal />
      </div>

      {/* Honesty & Platform Terms Footer */}
      <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-800/60">
        GitFC Competitive Arena • Built with verified public GitHub data • Ruleset v1.0.0
      </div>
    </div>
  );
};
