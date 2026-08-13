import React from 'react';
import type { EAFCDevCard, CardRarity, CardPosition } from '../../types';
import { Sliders } from 'lucide-react';

interface CardCustomizerProps {
  card: EAFCDevCard;
  onUpdateCard: (updated: EAFCDevCard) => void;
  onOpenPositionModal?: () => void;
}

export const CardCustomizer: React.FC<CardCustomizerProps> = ({ card, onUpdateCard, onOpenPositionModal }) => {
  const handleRarityChange = (rarity: CardRarity) => {
    onUpdateCard({ ...card, rarity });
  };

  const handlePositionChange = (position: CardPosition) => {
    const positionTitles: Record<CardPosition, string> = {
      GEN: 'Full Stack Generalist',
      INF: 'Open Source Influencer',
      COL: 'Master Collaborator',
      HUS: 'Daily Code Hustler',
      DEV: 'Core Developer',
      ARC: 'System Architect'
    };
    onUpdateCard({ ...card, position, positionTitle: positionTitles[position] });
  };

  const handleChemChange = (chemistryStyle: any) => {
    onUpdateCard({ ...card, chemistryStyle });
  };

  const handleFlagChange = (countryFlag: string) => {
    onUpdateCard({ ...card, countryFlag });
  };

  const handleClubChange = (clubName: string) => {
    onUpdateCard({ ...card, clubName });
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
        <Sliders className="w-5 h-5 text-amber-400" />
        <h3 className="font-display font-extrabold text-lg text-white">CARD CUSTOMIZER STUDIO</h3>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-2 uppercase font-bold">
            CARD RARITY TIER SKIN
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'bronze', label: '🥉 BRONZE' },
              { id: 'silver', label: '🥈 SILVER' },
              { id: 'gold', label: '🥇 GOLD' },
              { id: 'hero', label: '💜 HERO' },
              { id: 'toty', label: '🔷 TOTY' },
              { id: 'icon', label: '👑 ICON' }
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => handleRarityChange(r.id as CardRarity)}
                className={`py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all border ${
                  card.rarity === r.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-mono text-slate-400 uppercase font-bold">
              FOOTBALL TACTICAL POSITION
            </label>
            {onOpenPositionModal && (
              <button
                onClick={onOpenPositionModal}
                className="text-[11px] font-mono text-amber-400 font-bold hover:underline"
              >
                CHANGE ROLE WIZARD →
              </button>
            )}
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{card.footballPositionBadge || '⚽'}</span>
              <div>
                <div className="font-display font-extrabold text-sm text-white">
                  {card.footballPositionTitle || 'Striker (CF/ST)'}
                </div>
                <div className="text-[10px] font-mono text-amber-400 font-bold">
                  {card.footballPosition || 'STRIKER'}
                </div>
              </div>
            </div>

            {onOpenPositionModal && (
              <button
                onClick={onOpenPositionModal}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition"
              >
                SELECT ROLE
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-2 uppercase font-bold">
            STAT POSITION CATEGORY
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['GEN', 'INF', 'COL', 'HUS', 'DEV', 'ARC'] as CardPosition[]).map((pos) => (
              <button
                key={pos}
                onClick={() => handlePositionChange(pos)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition border ${
                  card.position === pos
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-2 uppercase font-bold">
            CHEMISTRY STYLE
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['SNIPER', 'ENGINE', 'ARCHITECT', 'HUNTER', 'SHADOW'].map((chem) => (
              <button
                key={chem}
                onClick={() => handleChemChange(chem)}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-mono font-bold transition border ${
                  card.chemistryStyle === chem
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {chem}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1 font-bold">FLAG EMOJI</label>
            <input
              type="text"
              value={card.countryFlag}
              onChange={(e) => handleFlagChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1 font-bold">CLUB / TEAM</label>
            <input
              type="text"
              value={card.clubName}
              onChange={(e) => handleClubChange(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400 font-mono text-xs uppercase"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
