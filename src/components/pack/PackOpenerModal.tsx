import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { EAFCCard } from '../card/EAFCCard';
import type { EAFCDevCard } from '../../types';
import { PRESET_DEVS } from '../../services/presets';
import { X, Trophy, Gift, Play, Zap } from 'lucide-react';

interface PackOpenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCard: (card: EAFCDevCard) => void;
}

export const PackOpenerModal: React.FC<PackOpenerModalProps> = ({
  isOpen,
  onClose,
  onSelectCard
}) => {
  const [stage, setStage] = useState<'select' | 'opening' | 'walkout' | 'reveal'>('select');
  const [revealedCard, setRevealedCard] = useState<EAFCDevCard | null>(null);
  const [countdown, setCountdown] = useState(3);

  if (!isOpen) return null;

  const handleOpenPack = (packType: 'gold' | 'hero' | 'toty') => {
    setStage('opening');
    setCountdown(3);

    let pool = PRESET_DEVS;
    if (packType === 'hero') {
      pool = PRESET_DEVS.filter(c => c.rarity === 'hero' || c.rarity === 'toty');
    } else if (packType === 'toty') {
      pool = PRESET_DEVS.filter(c => c.rarity === 'toty' || c.rarity === 'icon');
    }

    const card = pool[Math.floor(Math.random() * pool.length)] || PRESET_DEVS[0];
    setRevealedCard(card);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerWalkout(card);
          return 0;
        }
        return prev - 1;
      });
    }, 900);
  };

  const triggerWalkout = (card: EAFCDevCard) => {
    setStage('walkout');

    if (card.ratings.overall >= 90) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    setTimeout(() => {
      setStage('reveal');
    }, 2000);
  };

  const handleReset = () => {
    setStage('select');
    setRevealedCard(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {stage === 'select' && (
          <div className="flex flex-col items-center text-center py-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 font-mono text-sm font-bold border border-amber-500/30 mb-4">
              <Gift className="w-4 h-4" /> EA FC ULTIMATE TEAM PACK STORE
            </div>
            <h2 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight">
              OPEN DEVELOPER PACK
            </h2>
            <p className="mt-2 text-slate-400 max-w-lg text-sm md:text-base">
              Test your luck! Open an EA FC Ultimate Team pack to reveal legendary open-source developer walkouts with special animations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full">
              <div className="relative group bg-gradient-to-b from-amber-950/60 to-slate-950 p-6 rounded-2xl border-2 border-amber-500/50 hover:border-amber-400 hover:scale-105 transition-all flex flex-col items-center justify-between">
                <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-4xl shadow-xl">
                  🎁
                </div>
                <h3 className="mt-4 font-display font-extrabold text-xl text-amber-300">GOLD DEV PACK</h3>
                <p className="text-xs text-slate-400 mt-1">Contains Gold+ rating developers</p>
                <button
                  onClick={() => handleOpenPack('gold')}
                  className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-extrabold text-sm hover:brightness-110 shadow-lg flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" /> OPEN PACK
                </button>
              </div>

              <div className="relative group bg-gradient-to-b from-purple-950/60 to-slate-950 p-6 rounded-2xl border-2 border-purple-500/50 hover:border-purple-400 hover:scale-105 transition-all flex flex-col items-center justify-between">
                <div className="w-20 h-20 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-4xl shadow-xl">
                  ⚡
                </div>
                <h3 className="mt-4 font-display font-extrabold text-xl text-purple-300">HERO DEV PACK</h3>
                <p className="text-xs text-slate-400 mt-1">Guaranteed 90+ Hero rating</p>
                <button
                  onClick={() => handleOpenPack('hero')}
                  className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-400 text-white font-display font-extrabold text-sm hover:brightness-110 shadow-lg flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" /> OPEN PACK
                </button>
              </div>

              <div className="relative group bg-gradient-to-b from-blue-950/60 to-slate-950 p-6 rounded-2xl border-2 border-blue-500/50 hover:border-blue-400 hover:scale-105 transition-all flex flex-col items-center justify-between">
                <div className="w-20 h-20 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-4xl shadow-xl">
                  🏆
                </div>
                <h3 className="mt-4 font-display font-extrabold text-xl text-blue-300">TOTY ICON PACK</h3>
                <p className="text-xs text-slate-400 mt-1">Ultimate 94+ Icon & TOTY devs</p>
                <button
                  onClick={() => handleOpenPack('toty')}
                  className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-400 text-white font-display font-extrabold text-sm hover:brightness-110 shadow-lg flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" /> OPEN PACK
                </button>
              </div>
            </div>
          </div>
        )}

        {stage === 'opening' && (
          <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-72 h-72 rounded-full bg-amber-500/20 blur-3xl animate-pulse" />
              <div className="font-display font-black text-8xl text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-yellow-600 animate-bounce">
                {countdown}
              </div>
            </div>
            <p className="mt-6 font-mono text-amber-400 tracking-widest text-sm uppercase animate-pulse">
              OPENING PACK... PREPARE FOR WALKOUT
            </p>
          </div>
        )}

        {stage === 'walkout' && revealedCard && (
          <div className="flex flex-col items-center justify-center py-16 min-h-[400px] text-center animate-pulse">
            <div className="text-6xl mb-4">✨ 🎆 ✨</div>
            <span className="font-mono text-sm tracking-widest text-amber-400 uppercase font-bold">
              {revealedCard.countryFlag} {revealedCard.location} • {revealedCard.position}
            </span>
            <h3 className="font-display font-black text-4xl md:text-6xl text-white mt-2 tracking-tight">
              {revealedCard.name.toUpperCase()}
            </h3>
            <div className="mt-4 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-amber-500 text-slate-950 font-display font-extrabold text-xl shadow-lg">
              <Trophy className="w-6 h-6" /> OVR {revealedCard.ratings.overall}
            </div>
          </div>
        )}

        {stage === 'reveal' && revealedCard && (
          <div className="flex flex-col items-center py-4 animate-fade-in">
            <div className="text-center mb-6">
              <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                PACK WALKOUT REVEALED
              </span>
              <h2 className="font-display font-black text-3xl text-white">
                {revealedCard.name}
              </h2>
            </div>

            <EAFCCard card={revealedCard} interactive={true} />

            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold text-sm transition"
              >
                OPEN ANOTHER PACK
              </button>
              <button
                onClick={() => {
                  onSelectCard(revealedCard);
                  onClose();
                }}
                className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-display font-extrabold text-sm transition shadow-lg flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" /> INSPECT & CUSTOMIZE CARD
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
