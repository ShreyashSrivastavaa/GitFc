import React, { useState } from 'react';
import { BattleCardView } from '../card/BattleCardView';
import { SAMPLE_BATTLE_CARDS } from '../../data/sampleCards';
import { getTodayBoss, getDailyChallenges } from '../../game/gameModes';
import { Swords, Sparkles, Search, ArrowRight, Flame, Gift, ShieldAlert, CheckCircle2 } from 'lucide-react';
import type { BattleCard } from '../../types/battleCard';

interface LandingViewProps {
  onBuildDeck: () => void;
  onChallenge: (username?: string) => void;
  onBattleBoss: () => void;
  onOpenPacks: () => void;
  onPreviewUser: (username: string) => Promise<BattleCard | null>;
  dailyStreak?: number;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onBuildDeck,
  onChallenge,
  onBattleBoss,
  onOpenPacks,
  onPreviewUser,
  dailyStreak = 3,
}) => {
  const [previewQuery, setPreviewQuery] = useState('');
  const [activeCard, setActiveCard] = useState<BattleCard>(SAMPLE_BATTLE_CARDS[0]);
  const [loading, setLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');

  const todayBoss = getTodayBoss();
  const dailyChallenges = getDailyChallenges();

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
      setPreviewError('Failed to load developer profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center pb-24 md:pb-16">
      {/* Top Banner: Daily Streak & Active Events */}
      <div className="w-full bg-slate-900/60 border-b border-slate-800/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-bold text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{dailyStreak}-Day Battle Streak</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Streak protection active</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenPacks}
              className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Daily Pack Ready</span>
            </button>
            <span className="text-slate-600">•</span>
            <button
              type="button"
              onClick={onBattleBoss}
              className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 font-bold transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Today's Boss: {todayBoss.name}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-12 flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        {/* Left Hero Messaging */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>SEASON 2026 • COMPETITIVE CARD BATTLER</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
            Turn Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">GitHub Profile</span> Into a Battle Squad.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
            Your profile is your player. Your repositories and top languages are your cards. Build a 5-card strategic squad and compete in server-resolved tactical battles.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
            <button
              type="button"
              onClick={onBuildDeck}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>ENTER THE ARENA</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onBattleBoss}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-purple-950/70 hover:bg-purple-900 text-purple-200 font-bold text-sm uppercase tracking-wider border border-purple-500/40 hover:border-purple-400 transition-all flex items-center justify-center gap-2"
            >
              <Swords className="w-4 h-4 text-purple-400" />
              <span>FIGHT TODAY'S BOSS</span>
            </button>

            <button
              type="button"
              onClick={() => onChallenge()}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold text-sm uppercase tracking-wider border border-slate-800 hover:border-slate-750 transition-all flex items-center justify-center gap-2"
            >
              <span>CHALLENGE BY LINK</span>
            </button>
          </div>

          {/* Instant Username Profile Preview Form */}
          <div className="pt-4 max-w-md mx-auto lg:mx-0">
            <p className="text-xs font-semibold text-slate-400 mb-2">
              Preview your card stats from any public GitHub profile:
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
                {loading ? 'Loading...' : 'Preview'}
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

      {/* Daily Challenges & Boss Row */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-800/80">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Boss Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-purple-950 text-purple-300 border border-purple-500/40">
                  DAILY OPEN-SOURCE BOSS
                </span>
                <span className="text-xs font-bold text-amber-400">+{todayBoss.rewardCommits} Commits</span>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={todayBoss.avatarUrl}
                  alt={todayBoss.name}
                  className="w-12 h-12 rounded-xl object-cover border border-purple-400/50"
                />
                <div>
                  <h3 className="font-black text-white text-base">{todayBoss.name}</h3>
                  <p className="text-xs text-purple-300 font-semibold">{todayBoss.title}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{todayBoss.description}</p>
            </div>

            <button
              type="button"
              onClick={onBattleBoss}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider transition-colors"
            >
              CHALLENGE BOSS (UNRANKED)
            </button>
          </div>

          {/* Daily Challenges Box */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-black text-white text-sm">3 DAILY CHALLENGES</span>
                <span className="text-[11px] text-slate-400">Resets in 14h 22m</span>
              </div>
              <div className="space-y-2.5">
                {dailyChallenges.map((ch) => (
                  <div
                    key={ch.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 ${ch.completed ? 'text-emerald-400' : 'text-slate-600'}`}
                      />
                      <div>
                        <div className="font-bold text-white">{ch.title}</div>
                        <div className="text-[10px] text-slate-400">{ch.description}</div>
                      </div>
                    </div>
                    <span className="font-bold text-amber-400 tabular-nums shrink-0">
                      +{ch.rewardCommits} 🪙
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenPacks}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4 text-cyan-400" />
              <span>VIEW POWER-UP PACKS</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3-Step How It Works Section */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-800/80">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            HOW GITFC WORKS
          </h2>
          <p className="text-slate-400 text-xs max-w-xl mx-auto">
            From raw GitHub activity to competitive, turn-based battle outcomes in three steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-lg">
              1
            </div>
            <h3 className="text-lg font-bold text-white">Generate Your Squad</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connect your GitHub account. GitFC derives your Developer Card, Repository Cards, and Language Cards directly from your own public activity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-lg">
              2
            </div>
            <h3 className="text-lg font-bold text-white">Build a Tactical Deck</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Assemble a 5-card squad under a strict budget cap (≤ 415 OVR). Equip up to 2 power-ups (Coffee, Stack Overflow, Rubber Duck) to shape key rounds.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-lg">
              3
            </div>
            <h3 className="text-lg font-bold text-white">Battle & Climb the Ladder</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Play Best-of-5 rounds with simultaneous secret card selection. Challenge the Daily Boss or climb the verified ELO leaderboard.
            </p>
          </div>
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
