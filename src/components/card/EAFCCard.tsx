import React, { useState, useRef } from 'react';
import type { EAFCDevCard } from '../../types';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface EAFCCardProps {
  card: EAFCDevCard;
  scale?: number;
  interactive?: boolean;
  elementId?: string;
  showDetails?: boolean;
}

export const EAFCCard: React.FC<EAFCCardProps> = ({
  card,
  scale = 1,
  interactive = true,
  elementId,
  showDetails = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState('rotateX(0deg) rotateY(0deg)');
  const [shineStyle, setShineStyle] = useState({ opacity: 0, x: '50%', y: '50%' });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTransformStyle(`rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
    setShineStyle({
      opacity: 0.8,
      x: `${((x / rect.width) * 100).toFixed(1)}%`,
      y: `${((y / rect.height) * 100).toFixed(1)}%`
    });
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setTransformStyle('rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setShineStyle({ opacity: 0, x: '50%', y: '50%' });
  };

  const getRarityConfig = () => {
    switch (card.rarity) {
      case 'icon':
        return {
          bgClass: 'bg-eafc-icon icon-glow-effect',
          headerColor: 'text-amber-300',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
          glowColor: 'rgba(251, 191, 36, 0.5)',
          label: 'ICON'
        };
      case 'toty':
        return {
          bgClass: 'bg-eafc-toty toty-glow-effect',
          headerColor: 'text-blue-200',
          badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
          glowColor: 'rgba(59, 130, 246, 0.5)',
          label: 'TOTY'
        };
      case 'hero':
        return {
          bgClass: 'bg-eafc-hero',
          headerColor: 'text-purple-200',
          badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
          glowColor: 'rgba(168, 85, 247, 0.4)',
          label: 'HERO'
        };
      case 'gold':
        return {
          bgClass: 'bg-eafc-gold',
          headerColor: 'text-amber-950',
          badgeBg: 'bg-amber-950/20 text-amber-950 border-amber-950/30',
          glowColor: 'rgba(243, 198, 76, 0.4)',
          label: 'GOLD'
        };
      case 'silver':
        return {
          bgClass: 'bg-eafc-silver',
          headerColor: 'text-slate-900',
          badgeBg: 'bg-slate-900/20 text-slate-900 border-slate-900/30',
          glowColor: 'rgba(209, 213, 219, 0.4)',
          label: 'SILVER'
        };
      default:
        return {
          bgClass: 'bg-eafc-bronze',
          headerColor: 'text-amber-100',
          badgeBg: 'bg-black/30 text-amber-200 border-amber-500/30',
          glowColor: 'rgba(200, 125, 70, 0.3)',
          label: 'BRONZE'
        };
    }
  };

  const config = getRarityConfig();
  const isDarkCard = card.rarity === 'toty' || card.rarity === 'hero' || card.rarity === 'icon' || card.rarity === 'bronze';

  return (
    <div className="card-perspective inline-block select-none" style={{ transform: `scale(${scale})` }}>
      <div
        id={elementId}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transform: transformStyle }}
        className={`card-tilt-inner relative w-[340px] h-[520px] rounded-3xl p-4 shadow-2xl border-4 ${config.bgClass} flex flex-col justify-between overflow-hidden cursor-pointer transition-shadow duration-300`}
      >
        <div
          className="absolute inset-0 holographic-overlay transition-opacity duration-300 pointer-events-none"
          style={{
            opacity: shineStyle.opacity,
            background: `radial-gradient(circle at ${shineStyle.x} ${shineStyle.y}, rgba(255, 255, 255, 0.45) 0%, transparent 60%)`
          }}
        />

        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex flex-col items-center">
            <span className={`font-display font-black text-5xl tracking-tighter leading-none ${config.headerColor}`}>
              {card.ratings.overall}
            </span>
            <span className={`font-display font-extrabold text-lg tracking-wider ${config.headerColor} uppercase`}>
              {card.position}
            </span>
            <span className="text-xl mt-1 leading-none">{card.countryFlag}</span>
            <div className={`mt-1 font-bold text-[10px] tracking-widest uppercase px-1.5 py-0.5 rounded border ${config.badgeBg}`}>
              {card.clubName.slice(0, 10)}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className={`px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase border backdrop-blur-md shadow-sm ${config.badgeBg} flex items-center gap-1`}>
              {card.rarity === 'toty' || card.rarity === 'icon' ? <Sparkles className="w-3 h-3 animate-pulse" /> : <ShieldCheck className="w-3 h-3" />}
              {config.label}
            </div>

            {card.footballPosition && (
              <div className="px-2 py-0.5 rounded-full bg-black/60 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold flex items-center gap-1 shadow">
                <span>{card.footballPositionBadge || '⚽'}</span>
                <span>{card.footballPosition}</span>
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center my-1">
          <div className="relative">
            <div
              className="absolute -inset-2 rounded-full blur-md opacity-80 animate-pulse"
              style={{ backgroundColor: config.glowColor }}
            />
            <img
              src={card.avatarUrl}
              alt={card.name}
              className="relative w-32 h-32 rounded-full object-cover border-4 border-white/80 shadow-2xl bg-slate-900"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${card.username}`;
              }}
            />
            <div className="absolute -bottom-2 right-0 bg-black/80 text-amber-400 font-mono font-bold text-[10px] px-2 py-0.5 rounded-md border border-amber-500/40 shadow">
              {card.chemistryStyle || 'SNIPER'}
            </div>
          </div>

          <h2 className={`mt-3 font-display font-black text-2xl tracking-tight text-center leading-tight ${config.headerColor} drop-shadow-md`}>
            {card.name.length > 18 ? card.name.slice(0, 18) + '...' : card.name}
          </h2>
          <p className={`font-mono text-xs font-medium opacity-80 ${isDarkCard ? 'text-slate-300' : 'text-amber-950'}`}>
            @{card.username}
          </p>
        </div>

        <div className="relative z-10 my-1 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        {showDetails && (
          <div className="relative z-10 grid grid-cols-2 gap-x-4 gap-y-1.5 px-3 py-2 bg-black/25 backdrop-blur-md rounded-2xl border border-white/10">
            <div className="flex justify-between items-center font-display text-sm font-bold">
              <span className={`opacity-80 text-xs font-mono uppercase ${isDarkCard ? 'text-slate-300' : 'text-amber-950'}`}>PAS</span>
              <span className={`text-base font-extrabold ${config.headerColor}`}>{card.ratings.pas}</span>
            </div>
            <div className="flex justify-between items-center font-display text-sm font-bold">
              <span className={`opacity-80 text-xs font-mono uppercase ${isDarkCard ? 'text-slate-300' : 'text-amber-950'}`}>DRI</span>
              <span className={`text-base font-extrabold ${config.headerColor}`}>{card.ratings.dri}</span>
            </div>

            <div className="flex justify-between items-center font-display text-sm font-bold">
              <span className={`opacity-80 text-xs font-mono uppercase ${isDarkCard ? 'text-slate-300' : 'text-amber-950'}`}>SHO</span>
              <span className={`text-base font-extrabold ${config.headerColor}`}>{card.ratings.sho}</span>
            </div>
            <div className="flex justify-between items-center font-display text-sm font-bold">
              <span className={`opacity-80 text-xs font-mono uppercase ${isDarkCard ? 'text-slate-300' : 'text-amber-950'}`}>PHY</span>
              <span className={`text-base font-extrabold ${config.headerColor}`}>{card.ratings.phy}</span>
            </div>

            <div className="flex justify-between items-center font-display text-sm font-bold">
              <span className={`opacity-80 text-xs font-mono uppercase ${isDarkCard ? 'text-slate-300' : 'text-amber-950'}`}>PAC</span>
              <span className={`text-base font-extrabold ${config.headerColor}`}>{card.ratings.pac}</span>
            </div>
            <div className="flex justify-between items-center font-display text-sm font-bold">
              <span className={`opacity-80 text-xs font-mono uppercase ${isDarkCard ? 'text-slate-300' : 'text-amber-950'}`}>DEF</span>
              <span className={`text-base font-extrabold ${config.headerColor}`}>{card.ratings.def}</span>
            </div>

            <div className="flex justify-between items-center font-display text-sm font-bold">
              <span className={`opacity-80 text-xs font-mono uppercase ${isDarkCard ? 'text-slate-300' : 'text-amber-950'}`}>STA</span>
              <span className={`text-base font-extrabold ${config.headerColor}`}>{card.ratings.sta}</span>
            </div>
            <div className="flex justify-between items-center font-display text-sm font-bold">
              <span className={`opacity-80 text-xs font-mono uppercase ${isDarkCard ? 'text-slate-300' : 'text-amber-950'}`}>SKL</span>
              <span className={`text-base font-extrabold ${config.headerColor}`}>{card.ratings.skl}</span>
            </div>
          </div>
        )}

        <div className="relative z-10 flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            {card.badges.slice(0, 3).map((badge) => (
              <span
                key={badge.id}
                title={`${badge.name}: ${badge.description}`}
                className="text-base bg-black/40 px-1.5 py-0.5 rounded border border-white/10 hover:scale-110 transition-transform"
              >
                {badge.icon}
              </span>
            ))}
          </div>

          <div className={`text-[10px] font-mono font-semibold opacity-75 ${isDarkCard ? 'text-slate-300' : 'text-amber-950'}`}>
            ⭐ {card.stats.stars.toLocaleString()} Stars
          </div>
        </div>
      </div>
    </div>
  );
};
