import React, { useState } from 'react';
import type { EAFCDevCard } from '../../types';
import { EAFCCard } from '../card/EAFCCard';
import { PRESET_DEVS } from '../../services/presets';
import { fetchGitHubUserStats } from '../../services/githubApi';
import { X, Swords, Trophy, Search, Loader2 } from 'lucide-react';

interface CardCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryCard: EAFCDevCard;
}

export const CardCompareModal: React.FC<CardCompareModalProps> = ({
  isOpen,
  onClose,
  primaryCard
}) => {
  const [secondaryCard, setSecondaryCard] = useState<EAFCDevCard>(PRESET_DEVS[1]);
  const [searchUsername, setSearchUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSearchCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchUsername.trim()) return;
    setLoading(true);
    setError('');

    try {
      const card = await fetchGitHubUserStats(searchUsername);
      setSecondaryCard(card);
    } catch (err: any) {
      setError(err.message || 'User not found');
    } finally {
      setLoading(false);
    }
  };

  const getStatDiffColor = (valA: number, valB: number) => {
    if (valA > valB) return 'text-emerald-400 font-extrabold';
    if (valA < valB) return 'text-rose-400 font-extrabold';
    return 'text-amber-400 font-bold';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/30 mb-2">
            <Swords className="w-4 h-4" /> HEAD-TO-HEAD CARD COMPARISON
          </div>
          <h2 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight">
            DEVELOPER STAT SHOWDOWN
          </h2>
        </div>

        <form onSubmit={handleSearchCompare} className="flex gap-2 max-w-md mx-auto mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Enter GitHub username to compare..."
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'COMPARE'}
          </button>
        </form>
        {error && <p className="text-center text-xs text-rose-400 mb-4">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="transform scale-90 md:scale-100">
              <EAFCCard card={primaryCard} interactive={true} />
            </div>
            {primaryCard.ratings.overall >= secondaryCard.ratings.overall && (
              <div className="mt-4 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 font-display font-extrabold text-sm flex items-center gap-1.5">
                <Trophy className="w-4 h-4" /> HIGHER OVR WINNER
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="font-display font-bold text-center text-slate-300 text-sm mb-4 uppercase tracking-wider">
              HEAD-TO-HEAD METRICS
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {[
                { label: 'OVERALL (OVR)', key: 'overall' },
                { label: 'PASSING (PAS)', key: 'pas' },
                { label: 'DRIBBLING (DRI)', key: 'dri' },
                { label: 'SHOOTING (SHO)', key: 'sho' },
                { label: 'PHYSICAL (PHY)', key: 'phy' },
                { label: 'PACE (PAC)', key: 'pac' },
                { label: 'DEFENSE (DEF)', key: 'def' },
                { label: 'STAMINA (STA)', key: 'sta' },
                { label: 'SKILL (SKL)', key: 'skl' },
              ].map(({ label, key }) => {
                const valA = (primaryCard.ratings as any)[key];
                const valB = (secondaryCard.ratings as any)[key];
                return (
                  <div key={key} className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                    <span className={getStatDiffColor(valA, valB)}>{valA}</span>
                    <span className="text-slate-400 font-bold uppercase text-[11px]">{label}</span>
                    <span className={getStatDiffColor(valB, valA)}>{valB}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="transform scale-90 md:scale-100">
              <EAFCCard card={secondaryCard} interactive={true} />
            </div>
            {secondaryCard.ratings.overall > primaryCard.ratings.overall && (
              <div className="mt-4 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 font-display font-extrabold text-sm flex items-center gap-1.5">
                <Trophy className="w-4 h-4" /> HIGHER OVR WINNER
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
