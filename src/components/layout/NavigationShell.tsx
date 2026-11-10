import React from 'react';
import { Home, Swords, Layers, Trophy, User, Sparkles } from 'lucide-react';

export type NavTab = 'home' | 'battle' | 'collection' | 'leaderboard' | 'profile';

interface NavigationShellProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  userRating?: number;
  userShards?: number;
  isConnected: boolean;
  username?: string;
  onConnectClick: () => void;
}

export const NavigationShell: React.FC<NavigationShellProps> = ({
  activeTab,
  onTabChange,
  userRating = 1000,
  userShards = 0,
  isConnected,
  username,
  onConnectClick,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'battle', label: 'Battle', icon: <Swords className="w-5 h-5" /> },
    { id: 'collection', label: 'Cards', icon: <Layers className="w-5 h-5" /> },
    { id: 'leaderboard', label: 'Rankings', icon: <Trophy className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Top Header Bar (Desktop & Mobile) */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => onTabChange('home')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <span className="font-black text-slate-950 text-xl tracking-tighter">G</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-white tracking-tight">GitFC</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  ARENA
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 hidden sm:block">
                Competitive Developer Card Battler
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Status / Connect Button */}
          <div className="flex items-center gap-3">
            {isConnected ? (
              <div className="flex items-center gap-2.5">
                {/* Rating Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <span className="text-amber-400">🏆</span>
                  <span className="font-black text-white tabular-nums">{userRating}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">ELO</span>
                </div>

                {/* Shards Currency */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-black text-white tabular-nums">{userShards}</span>
                </div>

                {/* Profile Pill */}
                <button
                  type="button"
                  onClick={() => onTabChange('profile')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors border border-slate-700"
                >
                  <span>@{username}</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onConnectClick}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
              >
                Connect GitHub
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-lg transition-colors ${
                  isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className={`${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] mt-1 font-semibold tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
