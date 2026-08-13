import React, { useState, useEffect } from 'react';
import type { EAFCDevCard, ActiveTab } from './types';
import { fetchGitHubUserStats } from './services/githubApi';
import { PRESET_DEVS } from './services/presets';

import { Navbar } from './components/layout/Navbar';
import { EAFCCard } from './components/card/EAFCCard';
import { CardCustomizer } from './components/card/CardCustomizer';
import { LeaderboardTable } from './components/leaderboard/LeaderboardTable';
import { UltimateXISquad } from './components/leaderboard/UltimateXISquad';
import { CardCompareModal } from './components/compare/CardCompareModal';
import { PackOpenerModal } from './components/pack/PackOpenerModal';
import { ExportModal } from './components/share/ExportModal';
import { ConnectModal } from './components/layout/ConnectModal';

import { Search, Sparkles, Download, Swords, Loader2 } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('generator');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCard, setCurrentCard] = useState<EAFCDevCard>(PRESET_DEVS[0]);
  const [leaderboardCards, setLeaderboardCards] = useState<EAFCDevCard[]>(PRESET_DEVS);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [isPackModalOpen, setIsPackModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cardUser = params.get('card');
    if (cardUser) {
      handleLookupUser(cardUser);
    }
  }, []);

  const handleLookupUser = async (username: string) => {
    if (!username.trim()) return;
    setLoading(true);
    setError('');

    try {
      const card = await fetchGitHubUserStats(username);
      setCurrentCard(card);

      setLeaderboardCards((prev) => {
        if (prev.some((c) => c.username.toLowerCase() === card.username.toLowerCase())) {
          return prev;
        }
        return [card, ...prev];
      });
    } catch (err: any) {
      setError(err.message || 'Error fetching GitHub stats');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookupUser(searchQuery);
  };

  const handleConnectGitHub = () => {
    setIsConnectModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPackStore={() => setIsPackModalOpen(true)}
        onConnectGitHub={handleConnectGitHub}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        {activeTab === 'generator' && (
          <div className="space-y-10">
            <div className="relative bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/30 mb-4">
                  <Sparkles className="w-4 h-4" /> EA FC 25 ULTIMATE TEAM GITHUB EDITION
                </div>
                <h1 className="font-display font-black text-4xl md:text-6xl text-white tracking-tight leading-none">
                  TRANSFORM YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">GITHUB STATS</span> INTO ULTIMATE UT CARDS
                </h1>
                <p className="mt-4 text-slate-300 text-sm md:text-base leading-relaxed">
                  Enter any GitHub username to generate an authentic EA FC Ultimate Team player card with dynamic 0-99 ratings, metallic rarity skins, position shields, and 1-click PNG/README exports.
                </p>

                <form onSubmit={handleSearchSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Enter GitHub username (e.g. torvalds, gaearon, shadcn)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 font-medium shadow-inner"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-base hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'GENERATE CARD'}
                  </button>
                </form>
                {error && <p className="mt-3 text-xs font-mono text-rose-400">{error}</p>}

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="font-bold text-slate-300">TRY ICONIC DEVS:</span>
                  {['torvalds', 'gaearon', 'shadcn', 'mitchellh', 'rauchg', 'sindresorhus'].map((user) => (
                    <button
                      key={user}
                      onClick={() => handleLookupUser(user)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-700 transition"
                    >
                      @{user}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative group">
                  <EAFCCard
                    card={currentCard}
                    elementId="ea-fc-export-card"
                    interactive={true}
                  />
                </div>

                <div className="flex items-center gap-3 mt-6 w-full max-w-[340px]">
                  <button
                    onClick={() => setIsExportModalOpen(true)}
                    className="flex-1 py-3 rounded-2xl bg-amber-500 text-slate-950 font-display font-extrabold text-sm hover:bg-amber-400 shadow-xl flex items-center justify-center gap-2 transition"
                  >
                    <Download className="w-4 h-4" /> EXPORT CARD
                  </button>

                  <button
                    onClick={() => setIsCompareModalOpen(true)}
                    className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 flex items-center justify-center gap-1.5 transition"
                    title="Compare stats head-to-head"
                  >
                    <Swords className="w-4 h-4 text-amber-400" /> COMPARE
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={currentCard.avatarUrl}
                      alt={currentCard.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-lg"
                    />
                    <div>
                      <h2 className="font-display font-black text-2xl text-white">
                        {currentCard.name}
                      </h2>
                      <p className="font-mono text-xs text-amber-400 font-semibold">
                        @{currentCard.username} • {currentCard.positionTitle}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {currentCard.bio}
                      </p>
                    </div>
                  </div>

                  <div className="text-right bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">POWER SCORE</div>
                    <div className="font-display font-black text-2xl text-amber-400">
                      {currentCard.powerScore.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                  <h3 className="font-display font-extrabold text-lg text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> EA FC STAT RATING BREAKDOWN
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    {[
                      { label: 'PASSING (Commits)', value: currentCard.ratings.pas, raw: `${currentCard.stats.commits.toLocaleString()} Commits` },
                      { label: 'DRIBBLING (Stars)', value: currentCard.ratings.dri, raw: `${currentCard.stats.stars.toLocaleString()} Stars` },
                      { label: 'SHOOTING (PRs)', value: currentCard.ratings.sho, raw: `${currentCard.stats.prsMerged.toLocaleString()} PRs` },
                      { label: 'PHYSICAL (Followers)', value: currentCard.ratings.phy, raw: `${currentCard.stats.followers.toLocaleString()} Followers` },
                      { label: 'PACE (Streak)', value: currentCard.ratings.pac, raw: `${currentCard.stats.streakDays} Days` },
                      { label: 'DEFENSE (Issues)', value: currentCard.ratings.def, raw: `${currentCard.stats.issuesClosed.toLocaleString()} Closed` },
                      { label: 'STAMINA (Forks)', value: currentCard.ratings.sta, raw: `${currentCard.stats.forks.toLocaleString()} Forks` },
                      { label: 'SKILL (Languages)', value: currentCard.ratings.skl, raw: `${currentCard.stats.languages.length} Tech Stack` },
                    ].map((stat) => (
                      <div key={stat.label} className="space-y-1">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-slate-300 font-bold">{stat.label}</span>
                          <span className="text-amber-400 font-extrabold">{stat.value}/99 <span className="text-slate-500 font-normal">({stat.raw})</span></span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-500"
                            style={{ width: `${stat.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <CardCustomizer card={currentCard} onUpdateCard={setCurrentCard} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardTable
            cards={leaderboardCards}
            onSelectCard={(card) => {
              setCurrentCard(card);
              setActiveTab('generator');
            }}
          />
        )}

        {activeTab === 'squad-xi' && (
          <UltimateXISquad
            cards={leaderboardCards}
            onSelectCard={(card) => {
              setCurrentCard(card);
              setActiveTab('generator');
            }}
          />
        )}

        {activeTab === 'compare' && (
          <div className="space-y-6">
            <div className="text-center py-6">
              <h2 className="font-display font-black text-3xl text-white">DEVELOPER STAT COMPARISON</h2>
              <p className="text-slate-400 text-sm mt-1">Compare any two GitHub profiles head-to-head in EA FC Ultimate Team format.</p>
            </div>
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="mx-auto px-8 py-4 rounded-2xl bg-amber-500 text-slate-950 font-display font-extrabold text-base hover:bg-amber-400 shadow-2xl flex items-center justify-center gap-2"
            >
              <Swords className="w-5 h-5" /> OPEN HEAD-TO-HEAD STAT SHOWDOWN
            </button>
          </div>
        )}
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 py-8 px-4 lg:px-8 text-center text-xs text-slate-500 font-mono mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-300">EA FC Ultimate Team - GitHub Stats Card Generator</span>
          </div>
          <div>
            Created with React 18, Vite, Tailwind CSS & GitHub REST API
          </div>
        </div>
      </footer>

      <PackOpenerModal
        isOpen={isPackModalOpen}
        onClose={() => setIsPackModalOpen(false)}
        onSelectCard={(card) => {
          setCurrentCard(card);
          setActiveTab('generator');
        }}
      />

      <CardCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        primaryCard={currentCard}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        card={currentCard}
        cardElementId="ea-fc-export-card"
      />

      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnect={(username) => {
          handleLookupUser(username);
          setActiveTab('generator');
        }}
      />
    </div>
  );
}

export default App;
