import React from 'react';
import type { Team, League } from '../../types';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';

interface ExitLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
  targetLeague: League;
  onConfirmExitAndJoin: () => void;
}

export const ExitLeagueModal: React.FC<ExitLeagueModalProps> = ({
  isOpen,
  onClose,
  team,
  targetLeague,
  onConfirmExitAndJoin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-3">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="font-display font-black text-2xl text-white">
            🔄 SWITCH ACTIVE LEAGUE?
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Teams can belong to <strong>ONE</strong> active league at a time.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 mb-5 text-xs font-mono">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-slate-400">Current Active League:</span>
            <span className="font-bold text-amber-400">{team.leagueName || 'Premier DevLeague'}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-500 block">Current Rank</span>
              <span className="text-white font-bold">#{team.leaguePosition || 1}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Season Points</span>
              <span className="text-emerald-400 font-bold">{team.points || 0} Pts</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] leading-relaxed">
            <ShieldAlert className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
            <strong>Points Carried Forward:</strong> All your accumulated season points (<strong>{team.points || 0} Pts</strong>) and match history will be carried over to {targetLeague.name}!
          </div>
        </div>

        <div className="text-xs font-mono text-center text-slate-300 mb-5">
          Switch to target league: <strong className="text-amber-400">{targetLeague.name}</strong>?
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirmExitAndJoin();
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-xs shadow-lg shadow-amber-500/20 transition"
          >
            Switch League
          </button>
        </div>
      </div>
    </div>
  );
};
