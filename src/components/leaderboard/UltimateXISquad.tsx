import React from 'react';
import type { EAFCDevCard } from '../../types';
import { EAFCCard } from '../card/EAFCCard';
import { Trophy } from 'lucide-react';

interface UltimateXISquadProps {
  cards: EAFCDevCard[];
  onSelectCard: (card: EAFCDevCard) => void;
}

export const UltimateXISquad: React.FC<UltimateXISquadProps> = ({ cards, onSelectCard }) => {
  const sorted = [...cards].sort((a, b) => b.ratings.overall - a.ratings.overall);

  const squadSlots = [
    { pos: 'LW', label: 'Left Wing', card: sorted[1] || sorted[0] },
    { pos: 'ST', label: 'Striker GOAT', card: sorted[0] },
    { pos: 'RW', label: 'Right Wing', card: sorted[2] || sorted[0] },

    { pos: 'LCM', label: 'Left Midfield', card: sorted[3] || sorted[0] },
    { pos: 'CAM', label: 'Playmaker', card: sorted[4] || sorted[0] },
    { pos: 'RCM', label: 'Right Midfield', card: sorted[5] || sorted[0] },

    { pos: 'LB', label: 'Left Back', card: sorted[6] || sorted[0] },
    { pos: 'LCB', label: 'Center Back', card: sorted[7] || sorted[0] },
    { pos: 'RCB', label: 'Center Back', card: sorted[8] || sorted[0] },
    { pos: 'RB', label: 'Right Back', card: sorted[9] || sorted[0] },

    { pos: 'GK', label: 'Goalkeeper Core', card: sorted[10] || sorted[0] }
  ];

  const avgOverall = Math.round(
    squadSlots.reduce((acc, slot) => acc + (slot.card ? slot.card.ratings.overall : 85), 0) / squadSlots.length
  );

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 font-mono text-xs font-bold border border-green-500/30 mb-2">
            <Trophy className="w-3.5 h-3.5" /> EA FC ULTIMATE XI SQUAD
          </div>
          <h2 className="font-display font-black text-3xl text-white tracking-tight">
            4-3-3 OPEN SOURCE ALL-STARS
          </h2>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 px-5 py-2.5 rounded-2xl border border-slate-800">
          <div className="text-center">
            <div className="text-[10px] font-mono text-slate-400 uppercase">SQUAD OVR</div>
            <div className="font-display font-black text-2xl text-amber-400">{avgOverall}</div>
          </div>
          <div className="w-[1px] h-8 bg-slate-800" />
          <div className="text-center">
            <div className="text-[10px] font-mono text-slate-400 uppercase">CHEMISTRY</div>
            <div className="font-display font-black text-2xl text-green-400">33 / 33</div>
          </div>
        </div>
      </div>

      <div className="relative mt-6 rounded-2xl pitch-bg border-4 border-green-900/50 p-6 md:p-10 min-h-[750px] flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/10 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/10 pointer-events-none" />

        <div className="grid grid-cols-3 gap-4 place-items-center z-10">
          {[squadSlots[0], squadSlots[1], squadSlots[2]].map((slot) => (
            <PitchPlayerCard key={slot.pos} slot={slot} onSelectCard={onSelectCard} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 place-items-center z-10 my-8">
          {[squadSlots[3], squadSlots[4], squadSlots[5]].map((slot) => (
            <PitchPlayerCard key={slot.pos} slot={slot} onSelectCard={onSelectCard} />
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2 md:gap-4 place-items-center z-10">
          {[squadSlots[6], squadSlots[7], squadSlots[8], squadSlots[9]].map((slot) => (
            <PitchPlayerCard key={slot.pos} slot={slot} onSelectCard={onSelectCard} />
          ))}
        </div>

        <div className="flex justify-center z-10 mt-6">
          <PitchPlayerCard slot={squadSlots[10]} onSelectCard={onSelectCard} />
        </div>
      </div>
    </div>
  );
};

const PitchPlayerCard: React.FC<{
  slot: { pos: string; label: string; card: EAFCDevCard };
  onSelectCard: (card: EAFCDevCard) => void;
}> = ({ slot, onSelectCard }) => {
  const card = slot.card;
  if (!card) return null;

  return (
    <div
      onClick={() => onSelectCard(card)}
      className="flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform"
    >
      <div className="transform scale-[0.65] md:scale-75 -my-14">
        <EAFCCard card={card} interactive={false} showDetails={false} />
      </div>

      <div className="mt-2 px-3 py-1 rounded-lg bg-slate-950/90 border border-amber-500/40 text-center shadow-lg backdrop-blur-md">
        <div className="font-display font-extrabold text-xs text-amber-400">{slot.pos}</div>
        <div className="font-sans font-bold text-[10px] text-white truncate max-w-[100px]">
          {card.name}
        </div>
      </div>
    </div>
  );
};
