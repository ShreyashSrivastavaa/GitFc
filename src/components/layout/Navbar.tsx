import React from 'react';
import type { ActiveTab } from '../../types';
import { Sparkles, Trophy, Gift, Swords, Zap } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenPackStore: () => void;
  onConnectGitHub: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenPackStore,
  onConnectGitHub
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div
          onClick={() => setActiveTab('generator')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 font-display font-black text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            FC
          </div>
          <div>
            <div className="font-display font-black text-xl tracking-tight text-white flex items-center gap-1.5">
              GITCARDS <span className="text-amber-400 font-extrabold text-sm px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">UT 25</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">EA FC GitHub Stats Generator</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2 rounded-xl text-xs font-display font-extrabold transition-all flex items-center gap-1.5 ${
              activeTab === 'generator'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> CARD GENERATOR
          </button>

          <button
            onClick={() => setActiveTab('leagues')}
            className={`px-3.5 py-2 rounded-xl text-xs font-display font-extrabold transition-all flex items-center gap-1.5 ${
              activeTab === 'leagues'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" /> LEAGUES
          </button>

          <button
            onClick={() => setActiveTab('dressing-room')}
            className={`px-3.5 py-2 rounded-xl text-xs font-display font-extrabold transition-all flex items-center gap-1.5 ${
              activeTab === 'dressing-room'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            🏟️ DRESSING ROOM
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-display font-extrabold transition-all flex items-center gap-1.5 ${
              activeTab === 'leaderboard'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            LEADERBOARD
          </button>

          <button
            onClick={() => setActiveTab('squad-xi')}
            className={`px-3.5 py-2 rounded-xl text-xs font-display font-extrabold transition-all flex items-center gap-1.5 ${
              activeTab === 'squad-xi'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> ULTIMATE XI
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3.5 py-2 rounded-xl text-xs font-display font-extrabold transition-all flex items-center gap-1.5 ${
              activeTab === 'compare'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Swords className="w-3.5 h-3.5" /> SHOWDOWN
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPackStore}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-xs hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition"
          >
            <Gift className="w-4 h-4" /> PACK STORE
          </button>

          <button
            onClick={onConnectGitHub}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition"
          >
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg> CONNECT GITHUB
          </button>
        </div>
      </div>
    </header>
  );
};
