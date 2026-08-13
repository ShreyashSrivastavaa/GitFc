import React, { useState } from 'react';
import type { EAFCDevCard, CardRarity } from '../../types';
import { Search, Trophy } from 'lucide-react';

interface LeaderboardTableProps {
  cards: EAFCDevCard[];
  onSelectCard: (card: EAFCDevCard) => void;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  cards,
  onSelectCard
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'overall' | 'stars' | 'commits' | 'followers'>('overall');

  const filteredCards = cards
    .filter((card) => {
      const matchesSearch =
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.clubName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRarity = selectedRarity === 'all' || card.rarity === selectedRarity;
      return matchesSearch && matchesRarity;
    })
    .sort((a, b) => {
      if (sortBy === 'stars') return b.stats.stars - a.stats.stars;
      if (sortBy === 'commits') return b.stats.commits - a.stats.commits;
      if (sortBy === 'followers') return b.stats.followers - a.stats.followers;
      return b.ratings.overall - a.ratings.overall;
    });

  const getRarityBadge = (rarity: CardRarity) => {
    switch (rarity) {
      case 'icon':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-black uppercase">ICON</span>;
      case 'toty':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-500 text-white uppercase">TOTY</span>;
      case 'hero':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-500 text-white uppercase">HERO</span>;
      case 'gold':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-black uppercase">GOLD</span>;
      case 'silver':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-300 text-slate-900 uppercase">SILVER</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-700 text-amber-100 uppercase">BRONZE</span>;
    }
  };

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/30 mb-2">
            <Trophy className="w-3.5 h-3.5" /> EA FC WORLD LEADERBOARD
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
            TOP DEVELOPER RANKINGS
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search user or repo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Rarities</option>
            <option value="icon">ICON</option>
            <option value="toty">TOTY</option>
            <option value="hero">HERO</option>
            <option value="gold">GOLD</option>
            <option value="silver">SILVER</option>
            <option value="bronze">BRONZE</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
          >
            <option value="overall">Sort by OVR</option>
            <option value="stars">Sort by Stars</option>
            <option value="commits">Sort by Commits</option>
            <option value="followers">Sort by Followers</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/60 text-xs uppercase font-mono text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 font-bold">Rank</th>
              <th className="py-3.5 px-4 font-bold">Developer</th>
              <th className="py-3.5 px-4 font-bold text-center">OVR</th>
              <th className="py-3.5 px-4 font-bold text-center">Pos</th>
              <th className="py-3.5 px-4 font-bold text-center">Tier</th>
              <th className="py-3.5 px-4 font-bold text-right">Stars</th>
              <th className="py-3.5 px-4 font-bold text-right">Commits</th>
              <th className="py-3.5 px-4 font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredCards.map((card, index) => (
              <tr
                key={card.id}
                onClick={() => onSelectCard(card)}
                className="hover:bg-amber-500/5 cursor-pointer transition-colors group"
              >
                <td className="py-4 px-4 font-display font-extrabold text-base text-slate-400 group-hover:text-amber-400">
                  #{index + 1}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={card.avatarUrl}
                      alt={card.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-slate-700 group-hover:border-amber-400 transition"
                    />
                    <div>
                      <div className="font-display font-extrabold text-white text-base group-hover:text-amber-300 transition">
                        {card.name}
                      </div>
                      <div className="font-mono text-xs text-slate-400">
                        @{card.username} • <span className="text-slate-500">{card.clubName}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="font-display font-black text-xl text-amber-400">
                    {card.ratings.overall}
                  </span>
                </td>
                <td className="py-4 px-4 text-center font-mono font-bold text-xs text-slate-300">
                  {card.position}
                </td>
                <td className="py-4 px-4 text-center">
                  {getRarityBadge(card.rarity)}
                </td>
                <td className="py-4 px-4 text-right font-mono font-semibold text-amber-300">
                  ⭐ {card.stats.stars.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right font-mono text-slate-300">
                  ⚡ {card.stats.commits.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-center">
                  <button className="px-3 py-1.5 rounded-lg bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-300 text-xs font-bold transition">
                    VIEW CARD
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
