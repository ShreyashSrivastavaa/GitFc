import React, { useState, useEffect } from 'react';
import type { GitFCDevCard } from '../../types';
import { EAFCCard } from '../card/EAFCCard';
import { Sparkles, Compass, Search, Terminal, Zap, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScoutSequenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  card: GitFCDevCard | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const SCOUT_STEPS = [
  { id: 1, title: 'CONNECTING SATELLITE RADAR', detail: 'Locating GitHub profile & repos...', icon: Search },
  { id: 2, title: 'ANALYZING COMMIT TELEMETRY', detail: 'Scoring velocity, streaks & pull requests...', icon: Terminal },
  { id: 3, title: 'CALIBRATING ATTRIBUTES', detail: 'Calculating OVR, position & signature archetype...', icon: Zap },
  { id: 4, title: 'PLAYER REVEAL', detail: 'Generating authentic trading card...', icon: Sparkles },
];

export const ScoutSequenceModal: React.FC<ScoutSequenceModalProps> = ({
  isOpen,
  onClose,
  username,
  card,
  isLoading,
  error,
  onRetry,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setRevealed(false);
      return;
    }

    if (isLoading) {
      setRevealed(false);
      setCurrentStep(1);
      const t1 = setTimeout(() => setCurrentStep(2), 700);
      const t2 = setTimeout(() => setCurrentStep(3), 1500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else if (card && !error) {
      setCurrentStep(4);
      const t3 = setTimeout(() => {
        setRevealed(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00ff87', '#00d2ff', '#f5c518', '#a855f7'],
        });
      }, 500);
      return () => clearTimeout(t3);
    }
  }, [isOpen, isLoading, card, error]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg bg-gitfc-card/95 border-2 border-gitfc-border rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col items-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Error State: Gaming "PLAYER NOT FOUND" / Rate Limit */}
        {error ? (
          <div className="w-full flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500/50 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            </div>
            
            <span className="font-gaming font-black text-2xl tracking-wider uppercase text-white mb-2">
              SCOUT REPORT: FAILED
            </span>
            
            <p className="text-slate-300 text-sm max-w-md mb-6 leading-relaxed">
              {error.includes('not found') || error.includes('404')
                ? `GitHub player "@${username}" could not be located on the global radar. Please check the spelling.`
                : error.includes('rate limit')
                ? `GitHub radar is temporarily cooling down. Sign in or try again in a few moments.`
                : error}
            </p>

            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={onRetry}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-gaming font-bold tracking-wider hover:opacity-90 transition-opacity"
              >
                RE-SCOUT
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-gaming font-bold tracking-wider transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        ) : revealed && card ? (
          /* Success: Card Revealed */
          <div className="flex flex-col items-center text-center py-2 animate-scaleUp">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-gaming font-bold uppercase bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center gap-1.5 shadow">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                PLAYER SCOUTED SUCCESSFULLY
              </span>
            </div>

            <div className="my-2 transform hover:scale-105 transition-transform duration-300">
              <EAFCCard card={card} scale={0.92} interactive={true} />
            </div>

            <div className="mt-4 flex gap-3 w-full max-w-sm">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gitfc-neonGreen via-emerald-400 to-teal-400 text-slate-950 font-gaming font-black tracking-widest uppercase hover:shadow-[0_0_25px_rgba(0,255,135,0.6)] transition-all"
              >
                VIEW FULL PROFILE
              </button>
            </div>
          </div>
        ) : (
          /* Scouting In-Progress Animation */
          <div className="w-full flex flex-col items-center text-center py-8">
            <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-gitfc-neonGreen/30 animate-ping opacity-40" />
              <div className="absolute inset-2 rounded-full border border-gitfc-electricBlue/40 animate-pulse" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border-2 border-gitfc-neonGreen flex items-center justify-center shadow-[0_0_30px_rgba(0,255,135,0.4)]">
                <Compass className="w-10 h-10 text-gitfc-neonGreen animate-spin [animation-duration:6s]" />
              </div>
            </div>

            <span className="font-gaming font-black text-2xl tracking-wider text-white uppercase mb-1">
              SCOUTING @{username || 'DEVELOPER'}
            </span>
            <p className="text-slate-400 text-xs font-mono mb-6">
              Scanning public repositories & commit logs...
            </p>

            <div className="w-full space-y-3 max-w-md text-left">
              {SCOUT_STEPS.map((step) => {
                const isCurrent = currentStep === step.id;
                const isDone = currentStep > step.id;
                const Icon = step.icon;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                      isCurrent
                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(0,255,135,0.15)]'
                        : isDone
                        ? 'bg-slate-900/60 border-emerald-500/30 opacity-80'
                        : 'bg-slate-900/30 border-white/5 opacity-40'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-gaming font-bold ${
                        isCurrent
                          ? 'bg-gitfc-neonGreen text-slate-950 animate-bounce'
                          : isDone
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {isDone ? '✓' : <Icon className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-gaming font-bold text-xs tracking-wider text-white truncate">
                        {step.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {step.detail}
                      </div>
                    </div>

                    {isCurrent && (
                      <div className="w-2 h-2 rounded-full bg-gitfc-neonGreen animate-ping" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};


