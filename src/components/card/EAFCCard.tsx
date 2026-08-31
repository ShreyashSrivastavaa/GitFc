import React, { useState, useRef } from 'react';
import type { GitFCDevCard } from '../../types';
import { Shield } from 'lucide-react';

interface EAFCCardProps {
  card?: GitFCDevCard | null;
  scale?: number;
  interactive?: boolean;
  elementId?: string;
  showDetails?: boolean;
  isEmpty?: boolean;
  rarityOverride?: string;
}

export const EAFCCard: React.FC<EAFCCardProps> = ({
  card,
  scale = 1,
  interactive = true,
  elementId,
  isEmpty = false,
  rarityOverride,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState('rotateX(0deg) rotateY(0deg)');
  const [shineStyle, setShineStyle] = useState({ opacity: 0, x: '50%', y: '50%' });

  if (isEmpty || !card) {
    return (
      <div 
        className="w-[320px] h-[480px] rounded-2xl border-2 border-dashed border-gitfc-border bg-gitfc-card/50 flex flex-col items-center justify-center p-6 text-center text-slate-500"
        style={{ transform: `scale(${scale})` }}
      >
        <Shield className="w-12 h-12 mb-3 stroke-[1.5] text-slate-600 animate-pulse" />
        <span className="font-gaming font-bold text-sm tracking-wider uppercase text-slate-400">NO PLAYER SCOUTED</span>
        <p className="text-xs mt-1 text-slate-500">Enter a GitHub username to generate card</p>
      </div>
    );
  }

  const effectiveRarity = rarityOverride || card.rarity || 'epic';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;

    setTransformStyle(`rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
    setShineStyle({
      opacity: 0.85,
      x: `${((x / rect.width) * 100).toFixed(1)}%`,
      y: `${((y / rect.height) * 100).toFixed(1)}%`,
    });
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setTransformStyle('rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setShineStyle({ opacity: 0, x: '50%', y: '50%' });
  };

  const getRarityConfig = () => {
    switch (effectiveRarity) {
      case 'elite':
        return {
          bgClass: 'bg-card-elite glow-elite',
          accentText: 'text-sky-300',
          badgeBorder: 'border-cyan-400/50 bg-cyan-950/40 text-cyan-200',
          badgeTitleBg: 'bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-300 text-slate-950',
          label: 'ELITE TOTY',
          icon: '💎',
        };
      case 'legendary':
        return {
          bgClass: 'bg-card-legendary glow-legendary',
          accentText: 'text-purple-300',
          badgeBorder: 'border-purple-400/50 bg-purple-950/40 text-purple-200',
          badgeTitleBg: 'bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 text-slate-950',
          label: 'LEGENDARY ICON',
          icon: '👑',
        };
      case 'epic':
        return {
          bgClass: 'bg-card-epic glow-epic',
          accentText: 'text-amber-300',
          badgeBorder: 'border-amber-400/50 bg-amber-950/40 text-amber-200',
          badgeTitleBg: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-amber-950',
          label: 'EPIC GOLD',
          icon: '⭐',
        };
      case 'rare':
        return {
          bgClass: 'bg-card-rare glow-rare',
          accentText: 'text-slate-200',
          badgeBorder: 'border-slate-400/40 bg-slate-800/60 text-slate-200',
          badgeTitleBg: 'bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 text-slate-900',
          label: 'RARE SILVER',
          icon: '⚡',
        };
      default:
        return {
          bgClass: 'bg-card-common glow-common',
          accentText: 'text-amber-200',
          badgeBorder: 'border-amber-700/50 bg-amber-950/40 text-amber-200',
          badgeTitleBg: 'bg-gradient-to-r from-amber-600 to-amber-700 text-amber-100',
          label: 'COMMON BRONZE',
          icon: '🛡️',
        };
    }
  };

  const config = getRarityConfig();
  const attrs = card.attributes || {
    att: 80, pas: 80, def: 80, pac: 80, dri: 80, sho: 80, vis: 80, sta: 80, overall: 80
  };

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        perspective: '1200px',
      }}
      className="inline-block transition-transform duration-200 select-none"
    >
      <div
        id={elementId}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: transformStyle,
          transition: interactive ? 'transform 0.15s ease-out' : 'none',
          transformStyle: 'preserve-3d',
        }}
        className={`relative w-[340px] h-[520px] rounded-3xl p-3 cursor-pointer shadow-2xl border-2 transition-all duration-300 overflow-hidden ea-fc-card-shape ${config.bgClass}`}
      >
        {/* Holographic Shine Layer */}
        <div
          className="absolute inset-0 holographic-shine z-20 pointer-events-none transition-opacity duration-200"
          style={{
            opacity: shineStyle.opacity,
            backgroundPosition: `${shineStyle.x} ${shineStyle.y}`,
          }}
        />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/15 to-transparent pointer-events-none z-10" />

        {/* Inner Card Content */}
        <div className="relative w-full h-full flex flex-col justify-between z-10 text-white">
          
          {/* Header Section: Rating + Position + Country + Club + Avatar */}
          <div className="flex items-start justify-between px-2 pt-2">
            
            {/* Left Column: OVR & Position */}
            <div className="flex flex-col items-center text-center z-20">
              <span className="font-gaming font-extrabold text-5xl tracking-tighter leading-none text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                {attrs.overall}
              </span>
              <span className="font-gaming font-bold text-xl tracking-wider text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {card.position}
              </span>
              
              <div className="w-6 h-[1.5px] bg-white/40 my-1.5" />
              
              <span className="text-xl drop-shadow" title="Country / Region">
                {card.countryFlag || '🌐'}
              </span>
              
              <div className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-gaming font-semibold tracking-wider uppercase bg-black/40 border border-white/20 text-white/90 max-w-[64px] truncate">
                {card.clubName || 'GITFC'}
              </div>
            </div>

            {/* Right: Player Avatar with Glow Backing */}
            <div className="relative flex-1 flex justify-center items-center mt-1 -mr-2">
              <div className="relative w-36 h-36">
                <div className="absolute inset-0 rounded-full bg-white/20 blur-md transform scale-95" />
                <img
                  src={card.avatarUrl}
                  alt={card.name}
                  crossOrigin="anonymous"
                  className="relative w-full h-full object-cover rounded-full border-2 border-white/60 shadow-[0_10px_25px_rgba(0,0,0,0.7)]"
                />
                <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-gaming font-bold bg-slate-950/90 border border-white/40 text-emerald-400 shadow-md">
                  {card.positionCategory || 'ATT'}
                </div>
              </div>
            </div>
          </div>

          {/* Center Info: Player Name & Archetype */}
          <div className="px-2 text-center mt-1">
            <h2 className="font-display font-extrabold text-2xl tracking-wide uppercase text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)] truncate">
              {card.name || card.username}
            </h2>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <span className="text-xs text-white/70 font-mono">@{card.username}</span>
              <span className="text-white/40">•</span>
              <span className="text-xs font-gaming font-bold text-amber-300 drop-shadow truncate max-w-[160px]">
                {card.archetype}
              </span>
            </div>

            {/* Rarity Pill */}
            <div className="mt-1 flex justify-center">
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-gaming font-extrabold tracking-widest uppercase shadow-md ${config.badgeTitleBg}`}>
                {config.label}
              </span>
            </div>
          </div>

          {/* Bottom Grid: 8 Football Attributes (2 rows of 4) */}
          <div className="px-2 pt-2 pb-1 border-t border-white/20 bg-black/40 backdrop-blur-md rounded-2xl mx-1 mb-1">
            <div className="grid grid-cols-4 gap-y-2 gap-x-1 text-center">
              
              <div className="flex flex-col items-center">
                <span className="font-gaming font-black text-lg leading-none text-white drop-shadow">
                  {attrs.att}
                </span>
                <span className="font-gaming font-bold text-[10px] tracking-wider text-white/70">
                  ATT
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-gaming font-black text-lg leading-none text-white drop-shadow">
                  {attrs.pas}
                </span>
                <span className="font-gaming font-bold text-[10px] tracking-wider text-white/70">
                  PAS
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-gaming font-black text-lg leading-none text-white drop-shadow">
                  {attrs.def}
                </span>
                <span className="font-gaming font-bold text-[10px] tracking-wider text-white/70">
                  DEF
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-gaming font-black text-lg leading-none text-white drop-shadow">
                  {attrs.pac}
                </span>
                <span className="font-gaming font-bold text-[10px] tracking-wider text-white/70">
                  PAC
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-gaming font-black text-lg leading-none text-white drop-shadow">
                  {attrs.dri}
                </span>
                <span className="font-gaming font-bold text-[10px] tracking-wider text-white/70">
                  DRI
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-gaming font-black text-lg leading-none text-white drop-shadow">
                  {attrs.sho}
                </span>
                <span className="font-gaming font-bold text-[10px] tracking-wider text-white/70">
                  SHO
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-gaming font-black text-lg leading-none text-white drop-shadow">
                  {attrs.vis}
                </span>
                <span className="font-gaming font-bold text-[10px] tracking-wider text-white/70">
                  VIS
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-gaming font-black text-lg leading-none text-white drop-shadow">
                  {attrs.sta}
                </span>
                <span className="font-gaming font-bold text-[10px] tracking-wider text-white/70">
                  STA
                </span>
              </div>
            </div>
          </div>

          {/* Footer Watermark */}
          <div className="text-center pb-0.5">
            <span className="font-gaming font-bold text-[9px] tracking-widest text-white/50 uppercase">
              GITFC.XYZ • OFFICIAL DEV CARD
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
