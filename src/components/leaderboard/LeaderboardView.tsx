import React, { useState } from 'react';
import { Trophy, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { getRankTier } from '../../game/progression';

interface LeaderboardPlayer {
  rank: number;
  username: string;
  name: string;
  avatarUrl: string;
  elo: number;
  wins: number;
  losses: number;
  winRate: string;
  rankDelta: number; // positive = climbed, negative = dropped, 0 = unchanged
  topCardName: string;
}

const SAMPLE_LEADERBOARD: LeaderboardPlayer[] = [
  {
    rank: 1,
    username: 'torvalds',
    name: 'Linus Torvalds',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1024025?v=4',
    elo: 2240,
    wins: 48,
    losses: 4,
    winRate: '92.3%',
    rankDelta: 0,
    topCardName: 'Kernel Architect (95 OVR)',
  },
  {
    rank: 2,
    username: 'gaearon',
    name: 'Dan Abramov',
    avatarUrl: 'https://avatars.githubusercontent.com/u/810438?v=4',
    elo: 2085,
    wins: 41,
    losses: 7,
    winRate: '85.4%',
    rankDelta: 2,
    topCardName: 'Frontend Visionary (92 OVR)',
  },
  {
    rank: 3,
    username: 'shadcn',
    name: 'shadcn',
    avatarUrl: 'https://avatars.githubusercontent.com/u/124599?v=4',
    elo: 1990,
    wins: 38,
    losses: 9,
    winRate: '80.8%',
    rankDelta: -1,
    topCardName: 'UI Component Master (90 OVR)',
  },
  {
    rank: 4,
    username: 'mitchellh',
    name: 'Mitchell Hashimoto',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1299?v=4',
    elo: 1845,
    wins: 32,
    losses: 11,
    winRate: '74.4%',
    rankDelta: 1,
    topCardName: 'Systems Leader (87 OVR)',
  },
  {
    rank: 5,
    username: 'antirez',
    name: 'Salvatore Sanfilippo',
    avatarUrl: 'https://avatars.githubusercontent.com/u/65632?v=4',
    elo: 1810,
    wins: 29,
    losses: 12,
    winRate: '70.7%',
    rankDelta: 0,
    topCardName: 'In-Memory Architect (86 OVR)',
  },
];

export const LeaderboardView: React.FC<{ currentUsername?: string }> = ({
  currentUsername = 'you',
}) => {
  const [tab, setTab] = useState<'global' | 'weekly' | 'friends'>('global');

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h1 className="text-3xl font-black text-white tracking-tight">RANKED LADDER</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Verified competitive ELO ratings. Practice bots and unranked matches are excluded.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['global', 'weekly', 'friends'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                tab === t
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                <th className="py-3.5 px-4">Player</th>
                <th className="py-3.5 px-4">Rank Tier</th>
                <th className="py-3.5 px-4 text-center">Rating</th>
                <th className="py-3.5 px-4 text-center">Record (W-L)</th>
                <th className="py-3.5 px-4 text-center">Win Rate</th>
                <th className="py-3.5 px-4 text-center w-20">Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {SAMPLE_LEADERBOARD.map((player) => {
                const tierMeta = getRankTier(player.elo);
                const isUser = player.username.toLowerCase() === currentUsername.toLowerCase();

                return (
                  <tr
                    key={player.username}
                    className={`transition-colors hover:bg-slate-850/60 ${
                      isUser ? 'bg-cyan-950/30 border-l-4 border-cyan-400' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-black tabular-nums text-xs ${
                          player.rank === 1
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : player.rank === 2
                            ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                            : player.rank === 3
                            ? 'bg-amber-700/20 text-amber-400 border border-amber-700/40'
                            : 'text-slate-400 font-bold'
                        }`}
                      >
                        {player.rank}
                      </span>
                    </td>

                    {/* Player Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={player.avatarUrl}
                          alt={player.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{player.name}</div>
                          <div className="text-[11px] text-slate-400">@{player.username}</div>
                        </div>
                      </div>
                    </td>

                    {/* Tier */}
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300">
                        <span>{tierMeta.icon}</span>
                        <span>{tierMeta.tier}</span>
                      </div>
                    </td>

                    {/* ELO */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-black text-white text-sm tabular-nums text-cyan-400">
                        {player.elo}
                      </span>
                    </td>

                    {/* Record */}
                    <td className="py-3.5 px-4 text-center font-bold text-slate-300 tabular-nums">
                      {player.wins}W - {player.losses}L
                    </td>

                    {/* Win Rate */}
                    <td className="py-3.5 px-4 text-center font-black text-white tabular-nums">
                      {player.winRate}
                    </td>

                    {/* Rank Delta */}
                    <td className="py-3.5 px-4 text-center">
                      {player.rankDelta > 0 ? (
                        <div className="inline-flex items-center gap-0.5 text-emerald-400 font-bold text-xs">
                          <ArrowUp className="w-3.5 h-3.5" />
                          <span>{player.rankDelta}</span>
                        </div>
                      ) : player.rankDelta < 0 ? (
                        <div className="inline-flex items-center gap-0.5 text-rose-400 font-bold text-xs">
                          <ArrowDown className="w-3.5 h-3.5" />
                          <span>{Math.abs(player.rankDelta)}</span>
                        </div>
                      ) : (
                        <Minus className="w-3.5 h-3.5 text-slate-600 mx-auto" />
                      )}
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
