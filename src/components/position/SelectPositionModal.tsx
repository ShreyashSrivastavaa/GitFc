import React, { useState, useEffect } from 'react';
import type { FootballPosition, EAFCDevCard } from '../../types';
import { POSITION_INFOS, assignPosition } from '../../services/positionService';
import { X, CheckCircle2, Sparkles, Shield, Award } from 'lucide-react';

interface SelectPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: EAFCDevCard;
  onSelectPosition: (position: FootballPosition) => void;
  leagueName?: string;
}

export const SelectPositionModal: React.FC<SelectPositionModalProps> = ({
  isOpen,
  onClose,
  card,
  onSelectPosition,
  leagueName,
}) => {
  const recommendedPos = assignPosition(card.stats);
  const [selectedPos, setSelectedPos] = useState<FootballPosition>(card.footballPosition || recommendedPos);
  const step = 2;

  useEffect(() => {
    if (card.footballPosition) {
      setSelectedPos(card.footballPosition);
    } else {
      setSelectedPos(recommendedPos);
    }
  }, [card, recommendedPos]);

  if (!isOpen) return null;

  const positionsList: FootballPosition[] = ['STRIKER', 'MIDFIELDER', 'DEFENDER', 'GOALKEEPER', 'MANAGER'];

  const handleConfirm = () => {
    onSelectPosition(selectedPos);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Header Progress */}
        <div className="flex items-center justify-center gap-2 mb-6 font-mono text-[11px] font-bold tracking-wider uppercase">
          <span className={`px-2.5 py-1 rounded-md ${step >= 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-500'}`}>
            1. TEAM
          </span>
          <span className="text-slate-600">›</span>
          <span className={`px-2.5 py-1 rounded-md ${step >= 2 ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-500'}`}>
            2. ROLE
          </span>
          <span className="text-slate-600">›</span>
          <span className={`px-2.5 py-1 rounded-md ${step >= 3 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-500'}`}>
            3. CONFIRM
          </span>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/30 mb-2">
            <Award className="w-3.5 h-3.5" /> {leagueName ? `JOINING ${leagueName.toUpperCase()}` : 'DEVELOPER POSITION CLASSIFICATION'}
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
            SELECT PLAYER POSITION
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose your strategic role in the developer team based on your GitHub contribution stats.
          </p>
        </div>

        {/* Position Selection Cards */}
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {positionsList.map((posKey) => {
            const pos = POSITION_INFOS[posKey];
            const isSelected = selectedPos === posKey;
            const isAutoRecommended = recommendedPos === posKey;

            return (
              <div
                key={posKey}
                onClick={() => setSelectedPos(posKey)}
                className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-slate-800/90 border-amber-400 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform shrink-0">
                    {pos.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-black text-base text-white truncate">
                        {pos.name}
                      </h3>
                      {isAutoRecommended && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" /> RECOMMENDED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {pos.description}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-[11px] font-mono text-slate-500">
                      <span>Requirement: <strong className="text-slate-300">{pos.requirement}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-center">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                    isSelected ? 'bg-amber-500 border-amber-400 text-slate-950' : 'border-slate-700 text-transparent'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Position Confirmation Summary */}
        <div className="mt-5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{POSITION_INFOS[selectedPos].icon}</span>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Selected Role</div>
              <div className="font-display font-extrabold text-sm text-amber-400">
                {POSITION_INFOS[selectedPos].name}
              </div>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-slate-400">
            Developer: <span className="text-white font-bold">@{card.username}</span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-xs hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center gap-2 transition"
          >
            <Shield className="w-4 h-4" /> Submit Position Entry
          </button>
        </div>
      </div>
    </div>
  );
};
