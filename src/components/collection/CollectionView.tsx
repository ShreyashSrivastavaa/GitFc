import React, { useState } from 'react';
import { SAMPLE_BATTLE_CARDS } from '../../data/sampleCards';
import { BattleCardView } from '../card/BattleCardView';
import type { CardRarity } from '../../types/battleCard';
import { Search, Sparkles } from 'lucide-react';

export const CollectionView: React.FC = () => {
  const [selectedRarity, setSelectedRarity] = useState<CardRarity | 'all'>('all');
  const [search, setSearch] = useState('');

  const filteredCards = SAMPLE_BATTLE_CARDS.filter((card) => {
    if (selectedRarity !== 'all' && card.rarity !== selectedRarity) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        card.name.toLowerCase().includes(q) ||
        card.subtitle.toLowerCase().includes(q) ||
        card.primaryArchetype.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">CARD VAULT</h1>
          <p className="text-slate-400 text-xs mt-1">
            Browse and inspect your unlocked Developer, Repository, and Language battle cards.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400 font-medium">Vault Size:</span>
          <span className="font-black text-white tabular-nums">{SAMPLE_BATTLE_CARDS.length} Cards</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, handle, archetype..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        {/* Rarity Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['all', 'common', 'rare', 'epic', 'legendary', 'mythic'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRarity(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
                selectedRarity === r
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {filteredCards.map((card) => (
          <BattleCardView key={card.id} card={card} interactive showDerivationModal />
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-16 bg-slate-900/30 border border-slate-800/80 rounded-2xl my-8">
          <p className="text-sm font-bold text-slate-300">No cards matched your filter.</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting the rarity filter or search keywords.</p>
        </div>
      )}
    </div>
  );
};
