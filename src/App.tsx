import React, { useState, useEffect } from 'react';
import type { EAFCDevCard, ActiveTab, Team } from './types';
import { fetchGitHubUserStats } from './services/githubApi';
import { PRESET_DEVS } from './services/presets';
import { createDefaultTeam } from './services/teamService';

import { Navbar } from './components/layout/Navbar';
import { EAFCCard } from './components/card/EAFCCard';
import { CardCustomizer } from './components/card/CardCustomizer';
import { LeaderboardTable } from './components/leaderboard/LeaderboardTable';
import { ExportModal } from './components/share/ExportModal';
import { ConnectModal } from './components/layout/ConnectModal';
import { LeaguesView } from './components/leagues/LeaguesView';
import { DressingRoomView } from './components/dressingroom/DressingRoomView';
import { SelectPositionModal } from './components/position/SelectPositionModal';
import { CreateTeamModal } from './components/team/CreateTeamModal';

import { Sparkles, Download, Loader2 } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('generator');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCard, setCurrentCard] = useState<EAFCDevCard>(PRESET_DEVS[0]);
  const [leaderboardCards, setLeaderboardCards] = useState<EAFCDevCard[]>(PRESET_DEVS);
  const [userTeam, setUserTeam] = useState<Team | null>(() => createDefaultTeam(PRESET_DEVS[0]));

  const [selectedShellRarity, setSelectedShellRarity] = useState<CardRarity>('toty');
  const [isCardSearched, setIsCardSearched] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

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
      setIsCardSearched(true);

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
        onConnectGitHub={handleConnectGitHub}
        onOpenCreateTeamModal={() => setIsCreateTeamOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        {activeTab === 'generator' && (
          <div className="space-y-12">
            {/* HERO SECTION: FLOATING CARD + SIDE-BY-SIDE SEARCH */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center min-h-[500px]">
              {/* LEFT COLUMN: HERO TEXT & SEARCH FORM */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> YOUR GITHUB. YOUR SQUAD.
                </div>

                <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
                  Turn your GitHub Profile into an <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-amber-500">EA FC Player Card</span>
                </h1>

                <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl">
                  GitCards maps your developer activity—commits, issues, pull requests, streaks, and languages—into custom, premium EA FC Ultimate Team player cards with custom ratings and themes.
                </p>

                {/* SEARCH INPUT CONTAINER */}
                <form onSubmit={handleSearchSubmit} className="relative max-w-lg">
                  <div className="relative flex items-center bg-slate-950/90 border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl focus-within:border-amber-400/80 transition-colors">
                    <span className="pl-4 text-slate-500 font-mono text-sm font-bold">@</span>
                    <input
                      type="text"
                      placeholder="enter github username (e.g. torvalds)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-2 pr-4 py-3 bg-transparent text-white placeholder-slate-500 text-sm font-medium focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-display font-black text-sm hover:brightness-110 shadow-lg shrink-0 flex items-center gap-1.5 transition"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate'}
                    </button>
                  </div>
                  {error && <p className="mt-2 text-xs font-mono text-rose-400">{error}</p>}
                </form>

                {/* SUB-BADGES & QUICK DEVS */}
                <div className="space-y-3 pt-1">
                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span>✨</span> Join 1,200+ developers who generated cards
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span>⚡</span> 100% SECURE, READ-ONLY PUBLIC API
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="font-bold text-slate-400">TRY ICONIC DEVS:</span>
                    {['torvalds', 'gaearon', 'shadcn', 'mitchellh', 'rauchg', 'sindresorhus'].map((user) => (
                      <button
                        key={user}
                        onClick={() => handleLookupUser(user)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-800 transition"
                      >
                        @{user}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: FLOATING SHOWCASE CARD WITH AMBIENT GLOW & FC 26 SHELL SELECTOR */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-6">
                {/* FC 26 CARD SHELL TYPE SELECTOR PILLS */}
                <div className="z-10 mb-4 flex flex-wrap items-center justify-center gap-1.5 max-w-[360px]">
                  {[
                    { id: 'toty', label: '💎 TOTY' },
                    { id: 'toty_icon', label: '🔵 TOTY ICON' },
                    { id: 'icon', label: '👑 ICON' },
                    { id: 'scream', label: '🌙 SCREAM' },
                    { id: 'world_tour', label: '🌈 WORLD TOUR' },
                    { id: 'totw', label: '⚡ TOTW' },
                    { id: 'heroes', label: '🦸 HEROES' },
                    { id: 'tots', label: '🌟 TOTS' },
                    { id: 'evos', label: '🧪 EVOS' },
                    { id: 'centurions', label: '🔴 CENTURIONS' },
                    { id: 'gold', label: '🥇 GOLD' },
                  ].map((shell) => (
                    <button
                      key={shell.id}
                      onClick={() => setSelectedShellRarity(shell.id as any)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold border transition ${
                        selectedShellRarity === shell.id
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow'
                          : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {shell.label}
                    </button>
                  ))}
                </div>

                {/* Ambient Radial Glow Aura */}
                <div className="absolute w-[340px] h-[480px] bg-gradient-to-tr from-amber-500/25 via-emerald-500/20 to-amber-400/30 rounded-full blur-3xl pointer-events-none animate-glow-pulse" />

                {/* Floating Animated Empty/Populated EA FC Card Shell */}
                <div className="relative z-10 animate-float drop-shadow-[0_25px_40px_rgba(0,0,0,0.85)]">
                  <EAFCCard
                    card={isCardSearched ? currentCard : null}
                    isEmpty={!isCardSearched}
                    rarityOverride={selectedShellRarity}
                    elementId="ea-fc-export-card"
                    interactive={true}
                  />
                </div>

                {/* Export / Action Button */}
                <button
                  onClick={() => {
                    if (!isCardSearched) {
                      handleLookupUser(searchQuery || 'torvalds');
                    } else {
                      setIsExportModalOpen(true);
                    }
                  }}
                  className="mt-6 z-10 w-full max-w-[320px] py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-sm hover:brightness-110 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition"
                >
                  <Download className="w-4 h-4" /> {isCardSearched ? 'EXPORT CARD' : 'GENERATE CARD PROFILE'}
                </button>
              </div>
            </div>

            {/* BELOW HERO: STAT RATINGS & CUSTOMIZER STUDIO */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-8 border-t border-slate-800/80">
              <div className="lg:col-span-12 space-y-6">
                {/* DEV SUMMARY BAR */}
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

                  <div className="text-right bg-slate-950 px-5 py-3 rounded-2xl border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">POWER SCORE</div>
                    <div className="font-display font-black text-3xl text-amber-400">
                      {currentCard.powerScore.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* STAT BREAKDOWN GRID */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
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

                {/* CARD CUSTOMIZER STUDIO */}
                <CardCustomizer
                  card={currentCard}
                  onUpdateCard={setCurrentCard}
                  onOpenPositionModal={() => setIsPositionModalOpen(true)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leagues' && (
          <LeaguesView
            customCards={leaderboardCards}
            userTeam={userTeam}
            onUpdateTeam={setUserTeam}
          />
        )}

        {activeTab === 'dressing-room' && (
          <DressingRoomView
            card={currentCard}
            team={userTeam}
            onUpdateTeam={setUserTeam}
            onOpenCreateTeamModal={() => setIsCreateTeamOpen(true)}
          />
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

      <SelectPositionModal
        isOpen={isPositionModalOpen}
        onClose={() => setIsPositionModalOpen(false)}
        card={currentCard}
        onSelectPosition={(position) => {
          const updated = {
            ...currentCard,
            footballPosition: position,
          };
          setCurrentCard(updated);
        }}
      />

      <CreateTeamModal
        isOpen={isCreateTeamOpen}
        onClose={() => setIsCreateTeamOpen(false)}
        userCard={currentCard}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onCreateTeam={(newTeam) => {
          setUserTeam(newTeam);
          setActiveTab('dressing-room');
        }}
      />
    </div>
  );
}

export default App;
