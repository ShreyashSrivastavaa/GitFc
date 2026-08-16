import React, { useState, useEffect } from 'react';
import type { EAFCDevCard, ActiveTab, Team, TeamInvite } from './types';
import { fetchGitHubUserStats } from './services/githubApi';
import { PRESET_DEVS } from './services/presets';
import { createDefaultTeam, addPlayerToRoster } from './services/teamService';
import { getAuthState, loginWithGitHubUser } from './services/authService';
import { incrementCounterStats } from './services/statsService';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { EAFCCard } from './components/card/EAFCCard';
import { LeaderboardTable } from './components/leaderboard/LeaderboardTable';
import { ExportModal } from './components/share/ExportModal';
import { ConnectModal } from './components/layout/ConnectModal';
import { LeaguesView } from './components/leagues/LeaguesView';
import { DressingRoomView } from './components/dressingroom/DressingRoomView';
import { CreateTeamModal } from './components/team/CreateTeamModal';
import { LandingDetails } from './components/landing/LandingDetails';
import { GeneratedProfileView } from './components/profile/GeneratedProfileView';
import { UsageCounter } from './components/common/UsageCounter';
import { TeamInviteBanner } from './components/team/TeamInviteBanner';
import { SEOHead } from './components/common/SEOHead';
import { Preloader } from './components/common/Preloader';

import { Sparkles, Loader2 } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

export function App() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('generator');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCard, setCurrentCard] = useState<EAFCDevCard>(PRESET_DEVS[0]);
  const [leaderboardCards, setLeaderboardCards] = useState<EAFCDevCard[]>(PRESET_DEVS);
  const [userTeam, setUserTeam] = useState<Team | null>(null);

  const [isCardSearched, setIsCardSearched] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userFollowers, setUserFollowers] = useState<string[]>([]);
  const [userFollowing, setUserFollowing] = useState<string[]>([]);

  const [pendingInvite, setPendingInvite] = useState<TeamInvite | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

  useEffect(() => {
    // Check saved session auth
    const savedAuth = getAuthState();
    if (savedAuth.isConnected && savedAuth.userCard) {
      setIsConnected(true);
      setCurrentCard(savedAuth.userCard);
      setUserFollowers(savedAuth.followers);
      setUserFollowing(savedAuth.following);
      setUserTeam(createDefaultTeam(savedAuth.userCard));
    }

    const params = new URLSearchParams(window.location.search);
    const authStatus = params.get('auth');
    const authUser = params.get('username');
    const authMessage = params.get('message');

    if (authStatus === 'success' && authUser) {
      handleConnectGitHubUser(authUser);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authStatus === 'error') {
      setError(authMessage || 'GitHub sign-in could not be completed. Please try again.');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const cardUser = params.get('card');
      if (cardUser) {
        handleLookupUser(cardUser);
      }
    }
  }, []);

  const handleLookupUser = async (username: string) => {
    if (!username.trim()) return null;
    setLoading(true);
    setError('');

    try {
      const card = await fetchGitHubUserStats(username);
      setCurrentCard(card);
      setIsCardSearched(true);

      // Increment stats counter
      incrementCounterStats();

      setLeaderboardCards((prev) => {
        if (prev.some((c) => c.username.toLowerCase() === card.username.toLowerCase())) {
          return prev;
        }
        return [card, ...prev];
      });
      return card;
    } catch (err: any) {
      setError(err.message || 'Error fetching GitHub stats');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGitHubUser = async (username: string) => {
    setLoading(true);
    try {
      const authState = await loginWithGitHubUser(username);
      if (authState.userCard) {
        setIsConnected(true);
        setCurrentCard(authState.userCard);
        setUserFollowers(authState.followers);
        setUserFollowing(authState.following);
        setUserTeam(createDefaultTeam(authState.userCard));

        setLeaderboardCards((prev) => {
          if (prev.some((c) => c.username.toLowerCase() === authState.userCard!.username.toLowerCase())) {
            return prev;
          }
          return [authState.userCard!, ...prev];
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate user');
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

  const handleAcceptInvite = async (invite: TeamInvite) => {
    if (userTeam && currentCard) {
      const updated = addPlayerToRoster(userTeam, currentCard, invite.suggestedPosition || 'MID');
      setUserTeam(updated);
    }
    setPendingInvite(null);
    setActiveTab('dressing-room');
  };

  const handleDeclineInvite = () => {
    setPendingInvite(null);
  };

  const handleGoHome = () => {
    setActiveTab('generator');
    setIsCardSearched(false);
    if (window.location.search) {
      window.history.pushState({}, document.title, window.location.pathname);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black transition-colors duration-200 overflow-x-hidden max-w-full w-full">
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}
      <SEOHead
        activeTab={activeTab}
        isCardSearched={isCardSearched}
        currentCard={isCardSearched ? currentCard : null}
      />
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onConnectGitHub={handleConnectGitHub}
        onOpenCreateTeamModal={() => setIsCreateTeamOpen(true)}
        onGoHome={handleGoHome}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8 space-y-6 overflow-x-hidden">
        {/* IN-APP TEAM INVITATION NOTIFICATION BANNER */}
        {pendingInvite && (
          <TeamInviteBanner
            invite={pendingInvite}
            onAccept={handleAcceptInvite}
            onDecline={handleDeclineInvite}
          />
        )}

        {activeTab === 'generator' && (
          isCardSearched ? (
            <GeneratedProfileView
              card={currentCard}
              userTeam={userTeam}
              isConnected={isConnected}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onOpenConnectModal={() => setIsConnectModalOpen(true)}
              onOpenCreateTeamModal={() => setIsCreateTeamOpen(true)}
              onResetSearch={() => setIsCardSearched(false)}
              onLookupUser={handleLookupUser}
              onNavigateToLeagues={() => setActiveTab('leagues')}
            />
          ) : (
            <div className="space-y-12">
              {/* HERO SECTION: FLOATING EMPTY CARD + SIDE-BY-SIDE SEARCH */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center min-h-[500px]">
                {/* LEFT COLUMN: HERO TEXT & SEARCH FORM */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" /> YOUR GITHUB. YOUR SQUAD. • 100% CLIENT-SIDE READ-ONLY
                  </div>

                  <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15]">
                    Turn your GitHub Profile into an <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-amber-500">EA FC Player Card</span>
                  </h1>

                  <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-xl font-normal">
                    GitCards maps your developer activity—commits, issues, pull requests, streaks, and languages—into custom, premium EA FC Ultimate Team player cards with custom ratings and themes.
                  </p>

                  {/* HORIZONTAL FEATURE BADGES */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 text-xs font-mono font-medium border border-slate-800 flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span> 100% Free & Open Source
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 text-xs font-mono font-medium border border-slate-800 flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span> Algorithmic OVR Ratings
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 text-xs font-mono font-medium border border-slate-800 flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span> 1-Click High-Res PNG Export
                    </span>
                  </div>

                  {/* SEARCH INPUT CONTAINER */}
                  <form onSubmit={handleSearchSubmit} className="relative max-w-lg pt-2">
                    <div className="relative flex items-center bg-slate-950/90 border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl focus-within:border-amber-500 transition-colors">
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
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-display font-black text-sm hover:brightness-110 shadow-lg shrink-0 flex items-center gap-1.5 transition cursor-pointer"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate'}
                      </button>
                    </div>
                    {error && <p className="mt-2 text-xs font-mono text-rose-400">{error}</p>}
                  </form>

                  {/* SUB-BADGES & QUICK DEVS */}
                  <div className="space-y-3 pt-1">
                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400">
                      <UsageCounter prefixEmoji="⚡" />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                      <span className="font-bold text-slate-400">TRY ICONIC DEVS:</span>
                      {['torvalds', 'gaearon', 'shadcn', 'mitchellh', 'rauchg', 'sindresorhus'].map((user) => (
                        <button
                          key={user}
                          onClick={() => handleLookupUser(user)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-800 transition cursor-pointer shadow-xs"
                        >
                          @{user}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: FLOATING SHOWCASE CARD WITH AMBIENT GLOW */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-6">
                  {/* Ambient Radial Glow Aura */}
                  <div className="absolute w-[340px] h-[480px] bg-gradient-to-tr from-amber-500/25 via-emerald-500/20 to-amber-400/30 rounded-full blur-3xl pointer-events-none animate-glow-pulse" />

                  {/* Floating Animated Empty EA FC Card Shell */}
                  <div className="relative z-10 animate-float drop-shadow-[0_25px_40px_rgba(0,0,0,0.85)]">
                    <EAFCCard
                      card={null}
                      isEmpty={true}
                      elementId="ea-fc-export-card"
                      interactive={true}
                    />
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleLookupUser(searchQuery || 'torvalds')}
                    className="mt-6 z-10 w-full max-w-[320px] py-3.5 rounded-2xl bg-[#FF8C00] hover:bg-[#E07B00] text-white font-display font-black text-sm hover:-translate-y-0.5 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" /> GENERATE CARD PROFILE
                  </button>
                </div>
              </div>

              {/* LANDING DETAILS: HOW IT WORKS, GITHUB TO EA FC TRANSLATION, THE RULE BOOK */}
              <LandingDetails />
            </div>
          )
        )}

        {activeTab === 'leagues' && (
          <LeaguesView
            customCards={leaderboardCards}
            userTeam={userTeam}
            onUpdateTeam={setUserTeam}
            isConnected={isConnected}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
          />
        )}

        {activeTab === 'dressing-room' && (
          <DressingRoomView
            card={currentCard}
            team={userTeam}
            onUpdateTeam={setUserTeam}
            onOpenCreateTeamModal={() => setIsCreateTeamOpen(true)}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
            isConnected={isConnected}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardTable
            cards={leaderboardCards}
            isConnected={isConnected}
            currentUserCard={isConnected ? currentCard : null}
            following={userFollowing}
            followers={userFollowers}
            userTeam={userTeam}
            onConnectGitHub={handleConnectGitHub}
            onSelectCard={(card) => {
              setCurrentCard(card);
              setActiveTab('generator');
            }}
          />
        )}
      </main>

      <Footer />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        card={currentCard}
        cardElementId="ea-fc-export-card"
      />

      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnect={async (username) => {
          const targetUser = username === 'authenticated_user' ? (currentCard?.username || 'torvalds') : username;
          await handleConnectGitHubUser(targetUser);
          setActiveTab('generator');
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

      <Analytics />
    </div>
  );
}

export default App;
