import React, { useState } from 'react';
import type { BattleCard, StatKey } from '../../types/battleCard';
import { RARITY_THEMES, STAT_METADATA } from '../../styles/tokens';
import { Info, Sparkles, ExternalLink } from 'lucide-react';

interface BattleCardViewProps {
  card: BattleCard;
  interactive?: boolean;
  selected?: boolean;
  compact?: boolean;
  onSelect?: () => void;
  showDerivationModal?: boolean;
}

export const BattleCardView: React.FC<BattleCardViewProps> = ({
  card,
  interactive = false,
  selected = false,
  onSelect,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const theme = RARITY_THEMES[card.rarity] || RARITY_THEMES.common;

  const statOrder: StatKey[] = [
    'backend',
    'frontend',
    'openSource',
    'innovation',
    'consistency',
    'popularity',
    'languageMastery',
  ];

  // Rarity-specific badge styling
  const isMythic = card.rarity === 'mythic';

  const cardContent = (
    <div
      className={`relative w-full max-w-[320px] aspect-[1/1.48] rounded-2xl overflow-hidden text-white transition-all duration-300 select-none ${
        interactive ? 'cursor-pointer hover:-translate-y-1 hover:shadow-2xl' : ''
      } ${selected ? 'ring-4 ring-cyan-400 scale-[1.02]' : ''} ${
        !isMythic ? `${theme.gradientBg} ${theme.borderClass}` : theme.gradientBg
      }`}
      onClick={interactive && onSelect ? onSelect : undefined}
      role={interactive ? 'button' : 'region'}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(e) => {
        if (interactive && onSelect && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-label={`${card.name}, ${card.stats.overall} Overall ${theme.name} card`}
    >
      {/* Decorative foil overlay */}
      <div className={`absolute inset-0 pointer-events-none ${theme.foilOverlay}`} />

      {/* Header Bar: Overall Rating, Rarity Badge & Archetype */}
      <div className="relative z-10 px-4 pt-3.5 pb-2 flex items-start justify-between">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-black tracking-tighter leading-none tabular-nums drop-shadow-md">
            {card.stats.overall}
          </span>
          <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase mt-0.5">
            OVR
          </span>
        </div>

        {/* Center: Rarity Tag with Icon (Accessibility: Color-blind safe) */}
        <div className="flex flex-col items-center">
          <div
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase border ${theme.badgeBg}`}
          >
            <span>{theme.icon}</span>
            <span>{theme.badge}</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-300 mt-1 uppercase tracking-wider">
            {card.type}
          </span>
        </div>

        {/* Info button for stat derivation transparency */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowInfo(!showInfo);
          }}
          className="p-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-600/50"
          aria-label="View stat computation breakdown"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Middle Portrait / Emblem Area */}
      <div className="relative z-10 px-4 flex flex-col items-center my-1">
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full overflow-hidden border-2 shadow-inner bg-slate-900"
            style={{ borderColor: theme.accentColor }}
          >
            {card.avatarUrl ? (
              <img
                src={card.avatarUrl}
                alt={card.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-slate-800 text-slate-300">
                {card.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div
            className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-slate-950 uppercase shadow"
            style={{ backgroundColor: theme.accentColor }}
          >
            {card.primaryArchetype.split(' ')[0]}
          </div>
        </div>

        {/* Name & Subtitle */}
        <h3 className="mt-2 text-base font-black tracking-tight text-white truncate max-w-[240px] text-center">
          {card.name}
        </h3>
        <p className="text-[11px] font-medium text-slate-400 truncate max-w-[200px]">
          {card.subtitle}
        </p>
      </div>

      {/* Stats Grid: 7 Strategic Battle Stats */}
      <div className="relative z-10 px-3 py-2 mx-3 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-sm">
        <div className="grid grid-cols-4 gap-x-2 gap-y-1.5 text-center">
          {statOrder.slice(0, 4).map((key) => {
            const meta = STAT_METADATA[key];
            const val = card.stats[key];
            return (
              <div key={key} className="flex flex-col items-center">
                <span className="text-[9px] font-bold text-slate-400 tracking-wider">
                  {meta.short}
                </span>
                <span className="text-sm font-black tabular-nums text-white">
                  {val}
                </span>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 text-center mt-1 pt-1 border-t border-slate-800/60">
          {statOrder.slice(4).map((key) => {
            const meta = STAT_METADATA[key];
            const val = card.stats[key];
            return (
              <div key={key} className="flex flex-col items-center">
                <span className="text-[9px] font-bold text-slate-400 tracking-wider">
                  {meta.short}
                </span>
                <span className="text-sm font-black tabular-nums text-white">
                  {val}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Abilities Section */}
      <div className="relative z-10 px-4 pt-2 pb-3">
        {card.abilities.length > 0 ? (
          <div className="space-y-1">
            {card.abilities.slice(0, 2).map((ab) => (
              <div
                key={ab.id}
                className="flex items-center gap-1.5 text-[10px] text-slate-300 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800"
              >
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="font-bold text-white truncate">{ab.name}:</span>
                <span className="truncate text-slate-400">{ab.description}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-1 text-[10px] text-slate-500 font-medium italic">
            Standard Card • No Innate Abilities
          </div>
        )}
      </div>

      {/* Transparent Stat Breakdown Overlay Modal */}
      {showInfo && (
        <div className="absolute inset-0 z-30 bg-slate-950/95 p-4 flex flex-col justify-between text-left text-xs overflow-y-auto animate-in fade-in duration-150">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-black text-white text-sm">STAT FORMULAS</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInfo(false);
                }}
                className="text-slate-400 hover:text-white font-bold px-2 py-0.5 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 mb-3">
              Every GitFC rating is deterministic and calculated server-side from public GitHub activity.
            </p>

            <div className="space-y-2">
              {statOrder.map((key) => {
                const meta = STAT_METADATA[key];
                const score = card.stats[key];
                return (
                  <div key={key} className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                    <div className="flex justify-between font-bold text-white text-[11px]">
                      <span>{meta.label}</span>
                      <span className="text-cyan-400 tabular-nums">{score} / 99</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{meta.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 mt-2 flex items-center justify-between text-[10px] text-slate-400">
            <span>Ruleset v{card.rulesetVersion}</span>
            {card.sourceUrl && (
              <a
                href={card.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-cyan-400 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                GitHub Profile <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Bottom Footer Disclaimer */}
      <div className="absolute bottom-1 inset-x-0 text-center text-[7.5px] font-medium tracking-tight text-slate-500/80 pointer-events-none">
        GitFC game rating • Entertainment only
      </div>
    </div>
  );

  if (isMythic) {
    return (
      <div className="p-[2.5px] rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-500 shadow-[0_0_35px_rgba(236,72,153,0.35)]">
        {cardContent}
      </div>
    );
  }

  return cardContent;
};
