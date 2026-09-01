import React, { useState, useEffect } from 'react';
import type { EAFCDevCard, ActiveTab, Team, TeamInvite } from './types';
import { fetchGitHubUserStats } from './services/githubApi';
import { PRESET_DEVS } from './services/presets';
import { createDefaultTeam, addPlayerToRoster } from './services/teamService';
import { getAuthState, loginWithGitHubUser, logoutUser } from './services/authService';
import { incrementCounterStats } from './services/statsService';
import { trackEvent } from './services/analytics';
import { recomputeCard } from './services/cardCalculator';

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

  useEffect(() => {
    trackEvent('landing_page_view');

    // Check saved session auth
    const savedAuth = getAuthState();
    if (savedAuth.isConnected && savedAuth.userCard) {
      setIsConnected(true);
      setCurrentCard(savedAuth.userCard);
      setUserFollowers(savedAuth.followers);
      setUserFollowing(savedAuth.following);
      setUserTeam(createDefaultTeam(savedAuth.userCard));
      setIsCardSearched(true);
    }

    const params = new URLSearchParams(window.location.search);
    const authStatus = params.get('auth');
    const authUser = params.get('username');
    const authMessage = params.get('message');

    if (authStatus === 'success' && authUser) {
      trackEvent('github_auth_completed', { username: authUser });
      handleConnectGitHubUser(authUser);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authStatus === 'error') {
      setError(authMessage || 'GitHub sign-in could not be completed. Please try again.');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const cardUser = params.get('card');
      if (cardUser) {
        trackEvent('shared_card_viewed', { username: cardUser });
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

      trackEvent('card_generated', {
        username: card.username,
        ovr: card.attributes?.overall || card.ratings?.overall,
        position: card.position,
        archetype: card.archetype,
        rarity: card.rarity,
      });

      // Increment stats counter ONCE strictly after successful card generation
      console.log(`[App] Card generation succeeded for @${username}. Triggering counter increment.`);
      await new Promise((r) => setTimeout(r, 100));
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

  const handleRefreshPackFriday = async (cardToRefresh: EAFCDevCard) => {
    setIsRefreshing(true);
    try {
      // Re-fetch latest stats
      const freshData = await fetchGitHubUserStats(cardToRefresh.username);
      const recomputed = recomputeCard(cardToRefresh, freshData.stats);
      setCurrentCard(recomputed);
      trackEvent('card_generated', {
        username: recomputed.username,
        ovr: recomputed.attributes?.overall,
        isPackFridayRefresh: true,
      });
    } catch (err: any) {
      console.warn('Pack Friday refresh error:', err);
    } finally {
      setIsRefreshing(false);
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
        setIsCardSearched(true);

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

  const handleLogout = () => {
    logoutUser();
    setIsConnected(false);
    setIsCardSearched(false);
    setCurrentCard(PRESET_DEVS[0]);
    setUserTeam(null);
  };

  const handleViewMyCard = () => {
    const savedAuth = getAuthState();
    if (savedAuth.userCard) {
      setCurrentCard(savedAuth.userCard);
    }
    setIsCardSearched(true);
    setActiveTab('generator');
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
        isConnected={isConnected}
        userCard={isConnected ? currentCard : null}
        onLogout={handleLogout}
        onViewMyCard={handleViewMyCard}
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
              onUpdateCard={(updated) => setCurrentCard(updated)}
              onRefreshPackFriday={handleRefreshPackFriday}
              isRefreshing={isRefreshing}
            />
          ) : (
            <div className="space-y-12">
              {/* CONNECTED USER QUICK ACCESS BANNER IF CONNECTED */}
              {isConnected && currentCard && (
                <div className="p-4 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={currentCard.avatarUrl} alt={currentCard.name} className="w-10 h-10 rounded-full border border-amber-400 object-cover" />
                    <div>
                      <div className="font-display font-extrabold text-sm text-white flex items-center gap-2">
                        <span>Connected as {currentCard.name} (@{currentCard.username})</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30 font-bold">✓ ACTIVE</span>
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        OVR {currentCard.ratings.overall} • {currentCard.footballPositionTitle}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleViewMyCard}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-xs hover:brightness-110 shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" /> VIEW MY PLAYER CARD
                  </button>
                </div>
              )}

              {/* HERO SECTION: FLOATING EMPTY CARD + SIDE-BY-SIDE SEARCH */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center min-h-[500px]">
                {/* LEFT COLUMN: HERO TEXT & SEARCH FORM */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" /> YOUR GITHUB. YOUR SQUAD. • 100% CLIENT-SIDE READ-ONLY
                    </div>
                    <a
                      href="https://www.producthunt.com/products/gitfc?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-gitfc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block transition-transform hover:scale-105"
                      aria-label="GitFC on Product Hunt"
                    >
                      <img
                        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1237125&theme=dark&t=1788158120807"
                        alt="GitFC - Your GitHub profile, turned into a shareable card | Product Hunt"
                        width="200"
                        height="43"
                        className="h-[34px] w-auto object-contain"
                      />
                    </a>
                  </div>

                  <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12]">
                    Turn your GitHub into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-gitfc-neonGreen via-gitfc-electricBlue to-gitfc-gold">Football Card</span>
                  </h1>

                  <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-xl font-normal">
                    Generate authentic EA FC & FIFA-style trading cards from your public GitHub commits, PRs, stars, and language diversity in seconds.
                  </p>

                  {/* HORIZONTAL FEATURE BADGES */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 text-slate-300 text-xs font-gaming font-semibold border border-gitfc-border flex items-center gap-1.5 shadow-sm">
                      <span className="text-gitfc-neonGreen font-bold">⚡</span> 8 Authentic Attributes
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 text-slate-300 text-xs font-gaming font-semibold border border-gitfc-border flex items-center gap-1.5 shadow-sm">
                      <span className="text-gitfc-electricBlue font-bold">🎯</span> Tactical Dev Positions
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 text-slate-300 text-xs font-gaming font-semibold border border-gitfc-border flex items-center gap-1.5 shadow-sm">
                      <span className="text-gitfc-gold font-bold">✨</span> 3D Holographic Export
                    </span>
                  </div>

                  {/* PRIMARY SEARCH & CTA CONTAINER */}
                  <form onSubmit={handleSearchSubmit} className="relative max-w-lg pt-2">
                    <div className="relative flex items-center bg-slate-950/90 border-2 border-gitfc-border rounded-2xl p-1.5 shadow-2xl focus-within:border-gitfc-neonGreen transition-all">
                      <span className="pl-4 text-gitfc-neonGreen font-gaming text-base font-bold">@</span>
                      <input
                        type="text"
                        placeholder="Enter GitHub username (e.g. torvalds)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-2 pr-4 py-3 bg-transparent text-white placeholder-slate-500 text-sm font-medium focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        onClick={() => trackEvent('cta_click', { ctaName: 'create_my_card_hero', username: searchQuery })}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-gitfc-neonGreen via-emerald-400 to-teal-400 text-slate-950 font-gaming font-black text-sm tracking-wider uppercase hover:shadow-[0_0_25px_rgba(0,255,135,0.6)] shrink-0 flex items-center gap-1.5 transition-all cursor-pointer hover:brightness-110"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : 'CREATE MY CARD'}
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
                      <span className="font-gaming font-bold text-slate-300">SCOUT TRENDING PLAYERS:</span>
                      {['torvalds', 'gaearon', 'antfu', 'shadcn', 'mitchellh', 'rauchg'].map((user) => (
                        <button
                          key={user}
                          onClick={() => {
                            setSearchQuery(user);
                            trackEvent('cta_click', { ctaName: 'trending_dev_pill', username: user });
                            handleLookupUser(user);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 hover:bg-gitfc-neonGreen/20 hover:text-gitfc-neonGreen hover:border-gitfc-neonGreen/40 border border-slate-800 transition cursor-pointer shadow-xs font-gaming font-semibold"
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
                  <div className="absolute w-[340px] h-[480px] bg-gradient-to-tr from-gitfc-neonGreen/20 via-gitfc-electricBlue/20 to-gitfc-gold/20 rounded-full blur-3xl pointer-events-none animate-glow-pulse" />

                  {/* Floating Animated Showcase Card */}
                  <div className="relative z-10 animate-float drop-shadow-[0_25px_40px_rgba(0,0,0,0.85)]">
                    <EAFCCard
                      card={PRESET_DEVS[0]}
                      interactive={true}
                    />
                  </div>

                  {/* Quick Scout Showcase Action Button */}
                  <button
                    onClick={() => {
                      const target = searchQuery || (isConnected && currentCard ? currentCard.username : 'torvalds');
                      trackEvent('cta_click', { ctaName: 'scout_showcase_card', username: target });
                      handleLookupUser(target);
                    }}
                    className="mt-6 z-10 w-full max-w-[320px] py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-gaming font-black text-sm tracking-widest uppercase hover:shadow-[0_0_25px_rgba(245,197,24,0.6)] flex items-center justify-center gap-2 transition-all cursor-pointer hover:brightness-110"
                  >
                    <Sparkles className="w-4 h-4" /> SCOUT THIS CARD
                  </button>
                </div>
              </div>

              {/* LANDING DETAILS: HOW IT WORKS, GITHUB TO FOOTBALL TRANSLATION */}
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
        userCard={isConnected ? currentCard : null}
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
