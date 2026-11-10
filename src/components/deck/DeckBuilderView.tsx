import React, { useState } from 'react';
import { SAMPLE_BATTLE_CARDS } from '../../data/sampleCards';
import { BattleCardView } from '../card/BattleCardView';
import { validateDeck } from '../../game/battleEngine';
import type { BattleCard } from '../../types/battleCard';
import { ShieldAlert, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

interface DeckBuilderViewProps {
  onStartBattle?: () => void;
}

export const DeckBuilderView: React.FC<DeckBuilderViewProps> = ({ onStartBattle }) => {
  // Initial 5-card default squad
  const [selectedCards, setSelectedCards] = useState<BattleCard[]>([
    SAMPLE_BATTLE_CARDS[1], // Gaearon (92)
    SAMPLE_BATTLE_CARDS[3], // Mitchellh (87)
    SAMPLE_BATTLE_CARDS[4], // Antirez (86)
    SAMPLE_BATTLE_CARDS[6], // Rust (78)
    SAMPLE_BATTLE_CARDS[7], // Builder (65)
  ]);

  const deckValidation = validateDeck({ cards: selectedCards });

  const handleToggleCard = (card: BattleCard) => {
    const isSelected = selectedCards.some((c) => c.id === card.id);
    if (isSelected) {
      setSelectedCards((prev) => prev.filter((c) => c.id !== card.id));
    } else {
      if (selectedCards.length >= 5) return;
      setSelectedCards((prev) => [...prev, card]);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">SQUAD DECK BUILDER</h1>
          <p className="text-slate-400 text-xs mt-1">
            Construct your 5-card competitive deck. The server enforces a strict budget cap of 415 OVR.
          </p>
        </div>

        {onStartBattle && (
          <button
            type="button"
            disabled={!deckValidation.isLegal}
            onClick={onStartBattle}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            CONFIRM & ENTER ARENA
          </button>
        )}
      </div>

      {/* Live Balance & Budget Dashboard */}
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-8 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center sm:text-left">
          {/* Card Count */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Selected Cards
            </span>
            <div className="text-2xl font-black text-white mt-0.5 tabular-nums">
              {selectedCards.length} / 5
            </div>
          </div>

          {/* Budget Meter */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Deck Budget (OVR Cap)
            </span>
            <div
              className={`text-2xl font-black mt-0.5 tabular-nums ${
                deckValidation.totalPower > 415 ? 'text-red-400' : 'text-cyan-400'
              }`}
            >
              {deckValidation.totalPower} / 415
            </div>
          </div>

          {/* Average Rating */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Average Squad Rating
            </span>
            <div className="text-2xl font-black text-white mt-0.5 tabular-nums">
              {deckValidation.averageRating} OVR
            </div>
          </div>

          {/* Legal Status */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Deck Legality
            </span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-sm">
              {deckValidation.isLegal ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> BATTLE READY
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> REJECTED
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Violations Warning Box */}
        {deckValidation.violations.length > 0 && (
          <div className="mt-4 p-3 bg-red-950/40 border border-red-500/40 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-300">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Guardrail Violations:</span>
            </div>
            {deckValidation.violations.map((v, i) => (
              <p key={i} className="text-xs text-red-300/90 pl-5">
                • {v}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Active Deck Slots Tray */}
      <div className="mb-10">
        <h2 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>ACTIVE 5-CARD SQUAD</span>
          <span className="text-xs font-normal text-slate-400">(Tap any card to remove)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center">
          {selectedCards.map((card) => (
            <div key={card.id} className="relative group">
              <BattleCardView
                card={card}
                interactive
                selected
                onSelect={() => handleToggleCard(card)}
              />
              <button
                type="button"
                onClick={() => handleToggleCard(card)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md text-xs font-bold"
                aria-label="Remove card"
              >
                ✕
              </button>
            </div>
          ))}
          {Array.from({ length: 5 - selectedCards.length }).map((_, idx) => (
            <div
              key={idx}
              className="w-full max-w-[280px] aspect-[1/1.48] rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center p-4 text-center text-slate-600"
            >
              <Sparkles className="w-6 h-6 mb-2" />
              <span className="text-xs font-bold uppercase tracking-wider">Empty Slot {selectedCards.length + idx + 1}</span>
              <span className="text-[10px] mt-1 text-slate-500">Select a card below</span>
            </div>
          ))}
        </div>
      </div>

      {/* Available Vault Cards to Add */}
      <div>
        <h2 className="text-sm font-black text-white uppercase tracking-wider mb-4">
          YOUR CARD VAULT (TAP TO ADD)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {SAMPLE_BATTLE_CARDS.map((card) => {
            const isSelected = selectedCards.some((c) => c.id === card.id);
            return (
              <div key={card.id} className={`transition-opacity ${isSelected ? 'opacity-40' : ''}`}>
                <BattleCardView
                  card={card}
                  interactive
                  selected={isSelected}
                  onSelect={() => handleToggleCard(card)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
