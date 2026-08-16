import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface PreloaderProps {
  onComplete?: () => void;
  minDuration?: number;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete, minDuration = 1400 }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / minDuration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setIsFading(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 400); // 400ms fade transition
      }
    }, 20);

    return () => clearInterval(interval);
  }, [minDuration, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#07090e] flex flex-col items-center justify-center p-4 transition-opacity duration-500 select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* AMBIENT GLOW BACKGROUND */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-64 h-64 sm:w-80 sm:h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse delay-700" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm w-full">
        {/* LOGO SHIELD WITH METALLIC RING */}
        <div className="relative group">
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 opacity-75 blur-md animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-950 border-2 border-amber-400/60 flex items-center justify-center p-3 shadow-2xl backdrop-blur-xl">
            <img
              src="/gitfc-clean.png"
              alt="GitFC Logo"
              className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-bounce"
            />
          </div>
        </div>

        {/* GITFC BRAND TITLE */}
        <div className="space-y-1.5">
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight text-white flex items-center justify-center gap-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 drop-shadow-md">
              GITFC
            </span>
            <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 uppercase tracking-widest">
              UT 26
            </span>
          </h1>
          <p className="text-[11px] sm:text-xs font-mono font-bold text-slate-400 tracking-widest uppercase">
            EA FC GITHUB STATS GENERATOR
          </p>
        </div>

        {/* LOADING PROGRESS BAR */}
        <div className="w-full space-y-2 pt-4">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" /> LOADING ULTIMATE EXPERIENCE...
            </span>
            <span className="text-amber-400 font-extrabold">{progress}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 transition-all duration-75 shadow-lg shadow-amber-500/30"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
          100% Client-Side Read-Only • Instant EA FC Card Engine
        </div>
      </div>
    </div>
  );
};
