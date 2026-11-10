import React, { useState } from 'react';
import { BattleCardView } from '../card/BattleCardView';
import { SAMPLE_BATTLE_CARDS } from '../../data/sampleCards';
import { Swords, Sparkles, Search, ArrowRight } from 'lucide-react';
import type { BattleCard } from '../../types/battleCard';

interface LandingViewProps {
  onBuildDeck: () => void;
  onChallenge: (username?: string) => void;
  onPreviewUser: (username: string) => Promise<BattleCard | null>;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onBuildDeck,
  onChallenge,
  onPreviewUser,
}) => {
  const [previewQuery, setPreviewQuery] = useState('');
  const [activeCard, setActiveCard] = useState<BattleCard>(SAMPLE_BATTLE_CARDS[0]);
  const [loading, setLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewQuery.trim()) return;

    setLoading(true);
    setPreviewError('');
    try {
      const card = await onPreviewUser(previewQuery.trim());
      if (card) {
        setActiveCard(card);
      } else {
        setPreviewError(`Could not find GitHub user @${previewQuery}`);
      }
    } catch {
      setPreviewError('Failed to scout developer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center pb-24 md:pb-16">
      {/* Hero Section */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 md:pt-14 pb-12 flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        {/* Left Hero Messaging */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>SEASON 2026 • COMPETITIVE CARD BATTLER</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
            Turn Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">GitHub Profile</span> Into a Battle Deck.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
            Your profile is your player. Your repositories are your weapons. Your commits, PRs, and languages are your stats. Build a 5-card strategic squad and compete in server-resolved tactical battles.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
            <button
              type="button"
              onClick={onBuildDeck}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>BUILD YOUR DECK</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onChallenge()}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm uppercase tracking-wider border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2"
            >
              <Swords className="w-4 h-4 text-cyan-400" />
              <span>CHALLENGE A DEVELOPER</span>
            </button>
          </div>

          {/* Instant Username Scout Form */}
          <div className="pt-4 max-w-md mx-auto lg:mx-0">
            <p className="text-xs font-semibold text-slate-400 mb-2">
              Preview any public GitHub profile with no login:
            </p>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={previewQuery}
                  onChange={(e) => setPreviewQuery(e.target.value)}
                  placeholder="e.g. torvalds, gaearon, shadcn"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Scouting...' : 'Scout'}
              </button>
            </form>
            {previewError && (
              <p className="text-xs text-red-400 mt-2 font-medium">{previewError}</p>
            )}
          </div>
        </div>

        {/* Right Hero: Live Card Showcase with Quick Selectors */}
        <div className="flex-1 flex flex-col items-center">
          <div className="relative flex justify-center">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 blur-2xl rounded-full" />
            <BattleCardView card={activeCard} interactive showDerivationModal />
          </div>

          {/* Quick Preset Selector */}
          <div className="mt-6 flex items-center justify-center gap-2 flex-wrap max-w-sm">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Sample Cards:</span>
            {SAMPLE_BATTLE_CARDS.slice(0, 4).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCard(c)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                  activeCard.id === c.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/80 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {c.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3-Step How It Works Section */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800/80">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            HOW GITFC WORKS
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            From raw GitHub activity to competitive, turn-based battle outcomes in three steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-lg">
              1
            </div>
            <h3 className="text-lg font-bold text-white">Generate Your Cards</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sign in with GitHub. GitFC derives your Developer Card and top Repository Cards with 7 transparent, versioned stats and unique abilities.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-lg">
              2
            </div>
            <h3 className="text-lg font-bold text-white">Build a Balanced Deck</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Assemble a 5-card squad under a strict budget cap (≤ 415 OVR). Balance Backend power with Frontend velocity and language synergies.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-lg">
              3
            </div>
            <h3 className="text-lg font-bold text-white">Battle & Climb the Ladder</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Play asynchronous Best-of-3 or Best-of-5 rounds. Secretly commit cards each round, trigger abilities, and climb the verified ELO leaderboard.
            </p>
          </div>
        </div>
      </section>

      {/* Rarity Showcase */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-800/80">
        <div className="text-center space-y-1 mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            5 Deterministic Rarity Tiers
          </h2>
          <p className="text-slate-400 text-xs">
            Rarity is earned purely by overall rating—never bought or gambled.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {[
            { name: 'Common', ovr: '≤ 69', desc: 'Dependable Foundation', icon: '🛡️', color: 'border-slate-500' },
            { name: 'Rare', ovr: '70–79', desc: 'Specialized 1 Ability', icon: '💎', color: 'border-cyan-400' },
            { name: 'Epic', ovr: '80–88', desc: 'High-Impact Synergies', icon: '🔮', color: 'border-purple-400' },
            { name: 'Legendary', ovr: '89–94', desc: 'Elite Open Source Icons', icon: '👑', color: 'border-amber-400' },
            { name: 'Mythic', ovr: '≥ 95', desc: 'Generational Architects', icon: '⚡', color: 'border-pink-500' },
          ].map((r) => (
            <div
              key={r.name}
              className={`p-4 rounded-xl bg-slate-900/80 border ${r.color} flex flex-col items-center text-center`}
            >
              <span className="text-2xl mb-1">{r.icon}</span>
              <span className="font-black text-white text-sm">{r.name}</span>
              <span className="text-xs font-bold text-slate-300 tabular-nums">{r.ovr} OVR</span>
              <span className="text-[10px] text-slate-400 mt-1">{r.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Honesty & Transparency Disclaimer Footer */}
      <section className="w-full max-w-3xl px-4 text-center mt-6">
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          <p className="font-bold text-slate-300">🎮 HONESTY GUARANTEE</p>
          <p>
            GitFC ratings are calculated deterministically from public GitHub activity for entertainment and competitive gameplay. They are not an engineering evaluation, hiring signal, or measure of real-world ability.
          </p>
        </div>
      </section>
    </div>
  );
};
