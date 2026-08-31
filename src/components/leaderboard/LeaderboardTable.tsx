import React, { useState } from 'react';
import type { EAFCDevCard, CardRarity, Team } from '../../types';
import { Trophy, Lock, UserPlus, Copy, Check } from 'lucide-react';
import { buildNetworkLeaderboard, type NetworkRelationship } from '../../services/leaderboardService';
import { AddNetworkDevModal } from './AddNetworkDevModal';

interface LeaderboardTableProps {
  cards: EAFCDevCard[];
  isConnected: boolean;
  currentUserCard: EAFCDevCard | null;
  following: string[];
  followers: string[];
  userTeam: Team | null;
  onConnectGitHub: () => void;
  onSelectCard: (card: EAFCDevCard) => void;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  cards,
  isConnected,
  currentUserCard,
  following,
  followers,
  userTeam,
  onConnectGitHub,
  onSelectCard,
}) => {
  const [filterRelation, setFilterRelation] = useState<'all' | 'following' | 'followers' | 'teammate' | 'mutual' | 'custom'>('all');
  const [sortBy, setSortBy] = useState<'overall' | 'stars' | 'commits' | 'followers'>('overall');
  const [copiedLink, setCopiedLink] = useState(false);

  // Custom added developers saved in localStorage
  const [addedNetworkCards, setAddedNetworkCards] = useState<EAFCDevCard[]>(() => {
    try {
      const saved = localStorage.getItem('gitfc_custom_network_cards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddDevToNetwork = (card: EAFCDevCard) => {
    setAddedNetworkCards((prev) => {
      if (prev.some((c) => c.username.toLowerCase() === card.username.toLowerCase())) {
        return prev;
      }
      const updated = [...prev, card];
      try {
        localStorage.setItem('gitfc_custom_network_cards', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleRemoveDevFromNetwork = (username: string) => {
    setAddedNetworkCards((prev) => {
      const updated = prev.filter((c) => c.username.toLowerCase() !== username.toLowerCase());
      try {
        localStorage.setItem('gitfc_custom_network_cards', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // If not connected to GitHub -> Show Connect Wall
  if (!isConnected || !currentUserCard) {
    return (
      <div className="w-full dark-banner rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md text-center max-w-3xl mx-auto my-6 space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/30 mb-3 uppercase">
            🏆 DEVELOPER LEADERBOARD
          </div>
          <h2 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight">
            CONNECT YOUR GITHUB TO VIEW RANKINGS
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
            Connect your GitHub to see how you rank among your network!
          </p>
        </div>

        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-left max-w-md mx-auto space-y-3 font-mono text-xs text-slate-300">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span>•</span> Compare with people you follow
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span>•</span> See your followers' rankings
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span>•</span> Find top devs in your circle
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onConnectGitHub}
            className="py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-sm hover:brightness-110 shadow-xl shadow-amber-500/20 inline-flex items-center gap-2 transition cursor-pointer"
          >
            <Lock className="w-4 h-4" /> 🔗 Connect GitHub to View
          </button>
        </div>
      </div>
    );
  }

  // Connected State -> Build Network Leaderboard
  const networkEntries = buildNetworkLeaderboard(
    currentUserCard,
    following,
    followers,
    userTeam,
    cards,
    addedNetworkCards
  );

  const filteredEntries = networkEntries
    .filter((entry) => {
      if (filterRelation === 'following') return entry.relationship === 'you_follow' || entry.relationship === 'mutual' || entry.isCurrentUser;
      if (filterRelation === 'followers') return entry.relationship === 'follows_you' || entry.relationship === 'mutual' || entry.isCurrentUser;
      if (filterRelation === 'teammate') return entry.relationship === 'teammate' || entry.isCurrentUser;
      if (filterRelation === 'mutual') return entry.relationship === 'mutual' || entry.isCurrentUser;
      if (filterRelation === 'custom') return entry.relationship === 'custom' || entry.isCurrentUser;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'stars') return b.card.stats.stars - a.card.stats.stars;
      if (sortBy === 'commits') return b.card.stats.commits - a.card.stats.commits;
      if (sortBy === 'followers') return b.card.stats.followers - a.card.stats.followers;
      return b.card.ratings.overall - a.card.ratings.overall;
    });

  const handleCopyLink = () => {
    const origin = window.location.origin.includes('localhost') ? 'https://gitfc.vercel.app' : window.location.origin;
    const inviteUrl = `${origin}/?card=${encodeURIComponent(currentUserCard.username)}`;
    const text = `Check out my EA FC GitHub Player Card & compare ratings on GitFC! ⚽ ${inviteUrl}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const getRelationshipBadge = (relationship: NetworkRelationship) => {
    switch (relationship) {
      case 'you':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-slate-950 uppercase border border-amber-400">YOU</span>;
      case 'mutual':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-500/20 text-purple-300 uppercase border border-purple-400/40">MUTUAL</span>;
      case 'you_follow':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-500/20 text-blue-300 uppercase border border-blue-400/40">YOU FOLLOW</span>;
      case 'follows_you':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 uppercase border border-emerald-400/40">FOLLOWS YOU</span>;
      case 'teammate':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-yellow-500/20 text-yellow-300 uppercase border border-yellow-400/40">TEAMMATE</span>;
      case 'custom':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-300 uppercase border border-cyan-400/40">ADDED DEV</span>;
    }
  };

  const getRarityBadge = (rarity: CardRarity) => {
    switch (rarity) {
      case 'elite':
        return <span className="px-2 py-0.5 rounded text-[10px] font-gaming font-black bg-cyan-400 text-slate-950 uppercase border border-cyan-300">ELITE</span>;
      case 'legendary':
        return <span className="px-2 py-0.5 rounded text-[10px] font-gaming font-black bg-purple-500 text-white uppercase border border-purple-400">LEGENDARY</span>;
      case 'epic':
        return <span className="px-2 py-0.5 rounded text-[10px] font-gaming font-black bg-amber-400 text-slate-950 uppercase border border-amber-300">EPIC</span>;
      case 'rare':
        return <span className="px-2 py-0.5 rounded text-[10px] font-gaming font-black bg-slate-300 text-slate-900 uppercase border border-slate-200">RARE</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-gaming font-black bg-amber-800 text-amber-100 uppercase border border-amber-700">COMMON</span>;
    }
  };

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/30 mb-2">
            <Trophy className="w-3.5 h-3.5" /> GITHUB NETWORK RANKINGS
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
            🏆 YOUR DEVELOPER NETWORK RANKINGS
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Showing developers in your GitHub network & added cards (@{currentUserCard.username})
          </p>
        </div>

        {/* Action & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-xs hover:brightness-110 shadow transition flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" /> + ADD DEV TO NETWORK
          </button>

          <select
            value={filterRelation}
            onChange={(e) => setFilterRelation(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Network ({networkEntries.length})</option>
            <option value="custom">Added Devs ({addedNetworkCards.length})</option>
            <option value="following">Following only</option>
            <option value="followers">Followers only</option>
            <option value="teammate">Team members only</option>
            <option value="mutual">Mutual connections</option>
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

      {/* Low Network Count Banner (< 5 users) */}
      {networkEntries.length < 5 && (
        <div className="bg-slate-950 border border-amber-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-300">
          <div>
            <span className="text-amber-400 font-bold">
              Only {networkEntries.length} developer{networkEntries.length === 1 ? '' : 's'} in your network leaderboard.
            </span>{' '}
            Search and add any GitHub dev or copy your card invite link!
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" /> + Add Dev to Network
            </button>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              {copiedLink ? 'Copied Card Invite Link!' : 'Copy Invite Link'}
            </button>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/60 text-xs uppercase font-mono text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 font-bold">Rank</th>
              <th className="py-3.5 px-4 font-bold">Developer</th>
              <th className="py-3.5 px-4 font-bold text-center">Network</th>
              <th className="py-3.5 px-4 font-bold text-center">OVR</th>
              <th className="py-3.5 px-4 font-bold text-center">Tier</th>
              <th className="py-3.5 px-4 font-bold text-right">Stars</th>
              <th className="py-3.5 px-4 font-bold text-right">Commits</th>
              <th className="py-3.5 px-4 font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredEntries.map((entry, index) => {
              const card = entry.card;
              const rankMedal =
                index === 0 ? '🥇 1' : index === 1 ? '🥈 2' : index === 2 ? '🥉 3' : `→ ${index + 1}`;

              return (
                <tr
                  key={card.id}
                  onClick={() => onSelectCard(card)}
                  className={`transition-colors cursor-pointer group ${
                    entry.isCurrentUser
                      ? 'bg-amber-500/10 hover:bg-amber-500/20 border-l-4 border-amber-400 font-semibold'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  <td className="py-4 px-4 font-display font-black text-base text-amber-400">
                    {rankMedal}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={card.avatarUrl}
                        alt={card.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-slate-700 group-hover:border-amber-400 transition"
                      />
                      <div>
                        <div className="font-display font-extrabold text-white text-base group-hover:text-amber-300 transition flex items-center gap-2">
                          <span>{card.name}</span>
                          {entry.isCurrentUser && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black">
                              YOUR CARD
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-xs text-slate-400">
                          @{card.username} • <span className="text-slate-500">{card.clubName}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {getRelationshipBadge(entry.relationship)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-display font-black text-xl text-amber-400">
                      {card.ratings.overall}
                    </span>
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
                      {entry.isCurrentUser ? 'YOUR CARD' : 'VIEW CARD'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer controls */}
      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div>Showing developers in your network ({networkEntries.length} total)</div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" /> + Add Dev to Network
          </button>

          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            {copiedLink ? 'Copied Card Invite Link!' : 'Copy Invite Link'}
          </button>
        </div>
      </div>

      {/* ADD DEVELOPER TO NETWORK MODAL */}
      <AddNetworkDevModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        addedNetworkCards={addedNetworkCards}
        onAddDevToNetwork={handleAddDevToNetwork}
        onRemoveDevFromNetwork={handleRemoveDevFromNetwork}
      />
    </div>
  );
};
