import React, { useState } from 'react';
import type { EAFCDevCard } from '../../types';
import { fetchGitHubUserStats } from '../../services/githubApi';
import { PRESET_DEVS } from '../../services/presets';
import { X, UserPlus, Search, Check, Trash2, Loader2, Sparkles } from 'lucide-react';

interface AddNetworkDevModalProps {
  isOpen: boolean;
  onClose: () => void;
  addedNetworkCards: EAFCDevCard[];
  onAddDevToNetwork: (card: EAFCDevCard) => void;
  onRemoveDevFromNetwork: (username: string) => void;
}

export const AddNetworkDevModal: React.FC<AddNetworkDevModalProps> = ({
  isOpen,
  onClose,
  addedNetworkCards,
  onAddDevToNetwork,
  onRemoveDevFromNetwork,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchedCard, setSearchedCard] = useState<EAFCDevCard | null>(null);

  if (!isOpen) return null;

  const addedUsernames = new Set(addedNetworkCards.map((c) => c.username.toLowerCase()));

  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    setSearchedCard(null);

    try {
      const card = await fetchGitHubUserStats(searchQuery.trim());
      setSearchedCard(card);
    } catch (err: any) {
      setError(err.message || 'GitHub user not found');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAddPreset = (presetCard: EAFCDevCard) => {
    onAddDevToNetwork(presetCard);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/30 mb-2">
            <UserPlus className="w-3.5 h-3.5" /> EXPAND YOUR NETWORK
          </div>
          <h3 className="font-display font-black text-xl sm:text-2xl text-white">
            ADD DEVELOPER TO NETWORK
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Search any GitHub user to add them directly into your personal developer leaderboard rankings!
          </p>
        </div>

        {/* SEARCH FORM */}
        <form onSubmit={handleSearchUser} className="space-y-3">
          <div className="relative flex items-center bg-slate-950 border border-slate-700/80 rounded-2xl p-1.5 focus-within:border-amber-400 transition-colors">
            <span className="pl-3 text-slate-500 font-mono text-sm font-bold">@</span>
            <input
              type="text"
              placeholder="enter github username (e.g. torvalds)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-2 pr-3 py-2 bg-transparent text-white placeholder-slate-500 text-xs font-mono focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-xs transition shadow flex items-center gap-1.5 shrink-0"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              FETCH CARD
            </button>
          </div>
          {error && <p className="text-xs font-mono text-rose-400 pl-1">{error}</p>}
        </form>

        {/* SEARCH RESULT PREVIEW CARD */}
        {searchedCard && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={searchedCard.avatarUrl}
                  alt={searchedCard.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-amber-400"
                />
                <div>
                  <div className="font-display font-extrabold text-sm text-white flex items-center gap-2">
                    {searchedCard.name}
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-black">
                      OVR {searchedCard.ratings.overall}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    @{searchedCard.username} • {searchedCard.footballPositionTitle}
                  </div>
                </div>
              </div>

              {addedUsernames.has(searchedCard.username.toLowerCase()) ? (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> ADDED
                </span>
              ) : (
                <button
                  onClick={() => onAddDevToNetwork(searchedCard)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-xs hover:brightness-110 shadow transition flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" /> ADD TO NETWORK
                </button>
              )}
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
              <span>⭐ {searchedCard.stats.stars.toLocaleString()} Stars</span>
              <span>⚡ {searchedCard.stats.commits.toLocaleString()} Commits</span>
              <span>🤝 {searchedCard.stats.prsMerged.toLocaleString()} PRs</span>
            </div>
          </div>
        )}

        {/* QUICK ADD FEATURED ICON DEVS */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="block text-xs font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> QUICK ADD FEATURED ICONS
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_DEVS.map((preset) => {
              const isAdded = addedUsernames.has(preset.username.toLowerCase());
              return (
                <button
                  key={preset.id}
                  onClick={() => handleQuickAddPreset(preset)}
                  disabled={isAdded}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition border flex items-center gap-1.5 ${
                    isAdded
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 cursor-default opacity-80'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-amber-400 hover:text-amber-300'
                  }`}
                >
                  <span>{preset.countryFlag}</span>
                  <span>@{preset.username}</span>
                  <span className="text-[10px] text-amber-400">({preset.ratings.overall})</span>
                  {isAdded ? <Check className="w-3 h-3 text-emerald-400" /> : <UserPlus className="w-3 h-3 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* LIST OF CURRENTLY ADDED NETWORK DEVS */}
        {addedNetworkCards.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-bold uppercase">
              <span>YOUR ADDED NETWORK DEVS ({addedNetworkCards.length})</span>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {addedNetworkCards.map((card) => (
                <div
                  key={card.id}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={card.avatarUrl} alt={card.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                    <span className="font-display font-extrabold text-white truncate">{card.name}</span>
                    <span className="text-slate-500 font-mono text-[11px] truncate">@{card.username}</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold shrink-0">
                      OVR {card.ratings.overall}
                    </span>
                  </div>

                  <button
                    onClick={() => onRemoveDevFromNetwork(card.username)}
                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition shrink-0 ml-2"
                    title="Remove from Network"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
