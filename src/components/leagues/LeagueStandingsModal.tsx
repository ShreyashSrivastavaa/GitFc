import React from 'react';
import type { League, EAFCDevCard } from '../../types';
import { getLeagueStandings } from '../../services/leaguesService';
import { X, Trophy } from 'lucide-react';

interface LeagueStandingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  league: League;
  customCards: EAFCDevCard[];
  onSelectCard: (card: EAFCDevCard) => void;
}

export const LeagueStandingsModal: React.FC<LeagueStandingsModalProps> = ({
  isOpen,
  onClose,
  league,
  customCards,
  onSelectCard,
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
              <Trophy className="w-3 h-3" /> {league.name.toUpperCase()} STANDINGS
            </div>
            <h2 className="font-display font-black text-2xl text-white tracking-tight">
              LEAGUE STANDINGS & RANKINGS
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
            <span className="text-slate-500 block text-[10px] uppercase">Season</span>
            <span className="text-white font-bold">{league.season}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Active Members</span>
            <span className="text-emerald-400 font-bold">{league.members.toLocaleString()} Devs</span>
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
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-4">Developer</th>
                <th className="py-3 px-4 text-center">Role</th>
                <th className="py-3 px-4 text-center">OVR</th>
                <th className="py-3 px-4 text-center">W - D - L</th>
                <th className="py-3 px-4 text-center">Pts</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
              {standings.map((entry) => {
                const getRankBadge = (r: number) => {
                  if (r === 1) return '🥇 1';
                  if (r === 2) return '🥈 2';
                  if (r === 3) return '🥉 3';
                  return `${r}`;
                };

                return (
                  <tr
                    key={entry.card.id}
                    className="hover:bg-amber-500/5 transition-colors group"
                  >
                    <td className="py-3.5 px-4 text-center font-bold text-amber-400">
                      {getRankBadge(entry.rank)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={entry.card.avatarUrl}
                          alt={entry.card.name}
                          className="w-9 h-9 rounded-xl object-cover border border-amber-400/40"
                        />
                        <div>
                          <div className="font-display font-extrabold text-white text-sm group-hover:text-amber-400 transition-colors">
                            {entry.card.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            @{entry.card.username}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700">
                        {entry.card.footballPositionBadge || '⚽'} {entry.card.footballPosition || 'STRIKER'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-display font-black text-sm text-amber-400">
                        {entry.card.ratings.overall}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center text-slate-400 font-bold">
                      {entry.wins} - {entry.draws} - {entry.losses}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30">
                        {entry.points} pts
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          onSelectCard(entry.card);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-[11px] font-bold transition"
                      >
                        View Card
                      </button>
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
