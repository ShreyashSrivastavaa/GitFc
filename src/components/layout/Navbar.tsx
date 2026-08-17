import React, { useState } from 'react';
import type { ActiveTab, EAFCDevCard } from '../../types';
import { Sparkles, Trophy, Star, Menu, X, LogOut, Layout } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onConnectGitHub: () => void;
  onOpenCreateTeamModal: () => void;
  onGoHome?: () => void;
  isConnected?: boolean;
  userCard?: EAFCDevCard | null;
  onLogout?: () => void;
  onViewMyCard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onConnectGitHub,
  onOpenCreateTeamModal,
  onGoHome,
  isConnected = false,
  userCard = null,
  onLogout,
  onViewMyCard,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      setActiveTab('generator');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* LOGO & BRAND */}
        <div
          onClick={handleLogoClick}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLogoClick(); }}
          className="flex items-center gap-2.5 cursor-pointer group min-h-[44px]"
          role="button"
          tabIndex={0}
          aria-label="GitCards Home"
        >
          <img
            src="/gitfc-clean.png"
            alt="GitFC Logo"
            className="w-9 h-9 object-contain rounded-xl drop-shadow-md group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="font-display font-black text-xl tracking-tight text-white flex items-center gap-1.5">
              GITCARDS <span className="text-amber-400 font-extrabold text-sm px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">UT 26</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">EA FC GitHub Stats Generator</div>
          </div>
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800" aria-label="Main Navigation">
          <button
            onClick={() => handleTabClick('generator')}
            aria-label="Card Generator Tab"
            className={`px-4 py-2.5 rounded-xl text-xs font-display font-extrabold transition-all flex items-center gap-1.5 min-h-[44px] ${
              activeTab === 'generator'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" /> CARD GENERATOR
          </button>

          <button
            onClick={() => handleTabClick('leagues')}
            aria-label="Leagues Tab"
            className={`px-3.5 py-2.5 rounded-xl text-xs font-display font-extrabold transition-all flex items-center gap-1.5 min-h-[44px] ${
              activeTab === 'leagues'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4" /> LEAGUES
          </button>

          <button
            onClick={() => handleTabClick('dressing-room')}
            aria-label="Dressing Room Tab"
            className={`px-3.5 py-2.5 rounded-xl text-xs font-display font-extrabold transition-all flex items-center gap-1.5 min-h-[44px] ${
              activeTab === 'dressing-room'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            🏟️ DRESSING ROOM
          </button>

          <button
            onClick={() => handleTabClick('leaderboard')}
            aria-label="Leaderboard Tab"
            className={`px-3.5 py-2.5 rounded-xl text-xs font-display font-extrabold transition-all flex items-center gap-1.5 min-h-[44px] ${
              activeTab === 'leaderboard'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            LEADERBOARD
          </button>
        </nav>

        {/* RIGHT ACTION BUTTONS */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/ShreyashSrivastavaa/GitFc"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 dark:text-amber-400 font-bold text-xs flex items-center gap-1.5 border border-amber-500/30 transition shadow-sm min-h-[44px]"
            title="Star GitCards on GitHub"
            aria-label="Star GitCards on GitHub"
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="hidden sm:inline">Star on GitHub</span>
          </a>

          <button
            onClick={onOpenCreateTeamModal}
            aria-label="Create Team"
            className="hidden sm:flex px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-xs hover:brightness-110 shadow-lg shadow-amber-500/20 items-center gap-1.5 transition min-h-[44px]"
          >
            + CREATE TEAM
          </button>

          {/* CONNECTED USER BADGE vs DISCONNECTED BUTTON */}
          {isConnected && userCard ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 transition min-h-[44px] cursor-pointer shadow-md"
                aria-label="User Account Menu"
                aria-expanded={isUserMenuOpen}
              >
                <div className="relative">
                  <img
                    src={userCard.avatarUrl}
                    alt={userCard.name}
                    className="w-6 h-6 rounded-full object-cover border border-amber-400"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                </div>
                <span className="hidden sm:inline font-mono font-bold text-amber-300">
                  @{userCard.username}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-display font-black text-[10px] border border-amber-500/30">
                  OVR {userCard.ratings.overall}
                </span>
              </button>

              {/* USER DROPDOWN MENU */}
              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl z-50 animate-fadeIn space-y-2">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center gap-3">
                      <img
                        src={userCard.avatarUrl}
                        alt={userCard.name}
                        className="w-10 h-10 rounded-xl object-cover border border-amber-400/50"
                      />
                      <div className="min-w-0">
                        <div className="font-display font-extrabold text-sm text-white truncate">
                          {userCard.name}
                        </div>
                        <div className="font-mono text-xs text-amber-400 flex items-center gap-1">
                          <span>@{userCard.username}</span>
                          <span className="text-emerald-400 text-[10px]">✓ Connected</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (onViewMyCard) onViewMyCard();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-bold text-slate-200 hover:bg-amber-500/10 hover:text-amber-300 flex items-center gap-2 transition cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-amber-400" /> View My Card Profile
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setActiveTab('dressing-room');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-bold text-slate-200 hover:bg-slate-800 flex items-center gap-2 transition cursor-pointer"
                      >
                        <Layout className="w-4 h-4 text-emerald-400" /> Squad Dressing Room
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setActiveTab('leagues');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-bold text-slate-200 hover:bg-slate-800 flex items-center gap-2 transition cursor-pointer"
                      >
                        <Trophy className="w-4 h-4 text-amber-400" /> League Standings
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (onLogout) onLogout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-bold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" /> Disconnect / Log Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onConnectGitHub}
              aria-label="Connect GitHub Account"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition min-h-[44px] cursor-pointer"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              <span className="hidden sm:inline">CONNECT</span>
            </button>
          )}

          {/* MOBILE HAMBURGER TOGGLE BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Mobile Navigation"
            aria-expanded={isMobileMenuOpen}
            className="md:hidden p-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 hover:bg-slate-800 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <nav className="md:hidden mt-3 p-3 bg-slate-900/95 border border-slate-800 rounded-2xl space-y-2 animate-fadeIn" aria-label="Mobile Navigation">
          {isConnected && userCard && (
            <div className="p-3 mb-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <img src={userCard.avatarUrl} alt={userCard.name} className="w-8 h-8 rounded-full border border-amber-400" />
                <div className="min-w-0">
                  <div className="font-display font-bold text-xs text-white truncate">{userCard.name}</div>
                  <div className="font-mono text-[10px] text-amber-400">@{userCard.username}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onLogout) onLogout();
                }}
                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-mono"
              >
                Logout
              </button>
            </div>
          )}

          <button
            onClick={() => handleTabClick('generator')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-display font-extrabold transition flex items-center gap-2 min-h-[44px] ${
              activeTab === 'generator' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" /> CARD GENERATOR
          </button>

          <button
            onClick={() => handleTabClick('leagues')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-display font-extrabold transition flex items-center gap-2 min-h-[44px] ${
              activeTab === 'leagues' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4" /> LEAGUES
          </button>

          <button
            onClick={() => handleTabClick('dressing-room')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-display font-extrabold transition flex items-center gap-2 min-h-[44px] ${
              activeTab === 'dressing-room' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            🏟️ DRESSING ROOM
          </button>

          <button
            onClick={() => handleTabClick('leaderboard')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-display font-extrabold transition flex items-center gap-2 min-h-[44px] ${
              activeTab === 'leaderboard' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            🏆 LEADERBOARD
          </button>

          <button
            onClick={() => {
              onOpenCreateTeamModal();
              setIsMobileMenuOpen(false);
            }}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-xs flex items-center justify-center gap-2 min-h-[44px]"
          >
            + CREATE TEAM
          </button>
        </nav>
      )}
    </header>
  );
};

