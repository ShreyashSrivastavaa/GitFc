import React from 'react';
import type { League, EAFCDevCard, Team } from '../../types';
import { getLeagueStandings } from '../../services/leaguesService';
import { X, Trophy } from 'lucide-react';

interface LeagueStandingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  league: League;
  customCards: EAFCDevCard[];
  userTeam?: Team | null;
}

export const LeagueStandingsModal: React.FC<LeagueStandingsModalProps> = ({
  isOpen,
  onClose,
  league,
  customCards,
  userTeam,
}) => {
  if (!isOpen) return null;

  const standings = getLeagueStandings(league.id, customCards);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl shrink-0">
            {league.icon}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/30">
              <Trophy className="w-3 h-3" /> {league.name.toUpperCase()} TABLE
            </div>
            <h2 className="font-display font-black text-2xl text-white tracking-tight">
              LEAGUE STANDINGS & MATCHDAY TABLE
            </h2>
          </div>
        </div>

        {/* League Info Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-5 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Format</span>
            <span className="text-amber-400 font-bold uppercase">{league.format} Season</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Min Team Rating</span>
            <span className="text-white font-bold">{league.minRating || 80}+ OVR</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Division Teams</span>
            <span className="text-emerald-400 font-bold">{league.maxTeams || 20} Teams</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Status</span>
            <span className="text-sky-400 font-bold uppercase">{league.status}</span>
          </div>
        </div>

        {/* Standings Table */}
        <div className="flex-1 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950/60">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800 sticky top-0 backdrop-blur-md">
                <th className="py-3 px-4 text-center">Pos</th>
                <th className="py-3 px-4">Team Squad</th>
                <th className="py-3 px-4 text-center">P</th>
                <th className="py-3 px-4 text-center">W</th>
                <th className="py-3 px-4 text-center">D</th>
                <th className="py-3 px-4 text-center">L</th>
                <th className="py-3 px-4 text-center">GD</th>
                <th className="py-3 px-4 text-center">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
              {standings.map((entry, idx) => {
                const isUserTeam = userTeam && userTeam.name.toLowerCase() === entry.card.clubName.toLowerCase();
                const played = entry.wins + entry.draws + entry.losses;

                return (
                  <tr
                    key={entry.card.id}
                    className={`transition-colors ${
                      isUserTeam ? 'bg-amber-500/15 border-l-4 border-l-amber-400' : 'hover:bg-slate-900/60'
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center font-bold text-amber-400">
                      {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `${idx + 1}`}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg shrink-0">
                          {entry.card.username === 'torvalds' ? '🔴' : '🔵'}
                        </div>
                        <div>
                          <div className="font-display font-extrabold text-white text-sm">
                            {entry.card.clubName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Managed by @{entry.card.username}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center text-slate-300 font-bold">{played}</td>
                    <td className="py-3.5 px-4 text-center text-emerald-400 font-bold">{entry.wins}</td>
                    <td className="py-3.5 px-4 text-center text-amber-400 font-bold">{entry.draws}</td>
                    <td className="py-3.5 px-4 text-center text-rose-400 font-bold">{entry.losses}</td>
                    <td className="py-3.5 px-4 text-center text-slate-300 font-bold">
                      {entry.goalDiff > 0 ? `+${entry.goalDiff}` : entry.goalDiff}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30">
                        {entry.points} pts
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
