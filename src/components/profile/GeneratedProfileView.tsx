import React, { useState } from 'react';
import type { EAFCDevCard, Team } from '../../types';
import { EAFCCard } from '../card/EAFCCard';
import { Download, Star, MessageCircle, Copy, Check, ArrowLeft, Trophy, Sparkles, Award } from 'lucide-react';

interface GeneratedProfileViewProps {
  card: EAFCDevCard;
  userTeam: Team | null;
  onOpenExportModal: () => void;
  onOpenConnectModal: () => void;
  onOpenCreateTeamModal: () => void;
  onResetSearch: () => void;
  onLookupUser: (username: string) => void;
}

export const GeneratedProfileView: React.FC<GeneratedProfileViewProps> = ({
  card,
  userTeam,
  onOpenExportModal,
  onOpenConnectModal,
  onOpenCreateTeamModal,
  onResetSearch,
  onLookupUser,
}) => {
  const [matchFormat, setMatchFormat] = useState<'premier' | 'champions' | 'worldcup'>('premier');
  const [lockNotice, setLockNotice] = useState('');

  // COMPETITION DIFFICULTY PROGRESSION: Premier League < Champions League < World Cup
  // Progressive Unlock Rules: Only allow next level if previous level is qualified/won (OVR / Power Score / Badges)
  const isChampionsUnlocked =
    card.ratings.overall >= 82 ||
    card.powerScore >= 5000 ||
    card.badges.some((b) => b.id === 'star-lord' || b.id === 'commit-machine' || b.id === 'pr-champion');

  const isWorldCupUnlocked =
    isChampionsUnlocked &&
    (card.ratings.overall >= 90 ||
      card.powerScore >= 15000 ||
      card.rarity === 'toty' ||
      card.rarity === 'toty_icon' ||
      card.rarity === 'icon');

  const handleSelectMode = (mode: 'premier' | 'champions' | 'worldcup') => {
    if (mode === 'champions' && !isChampionsUnlocked) {
      setLockNotice('🔒 Champions League Locked! Win Premier League or reach 82+ OVR to unlock.');
      setTimeout(() => setLockNotice(''), 4000);
      return;
    }
    if (mode === 'worldcup' && !isWorldCupUnlocked) {
      setLockNotice('🔒 World Cup Locked! Win Champions League or reach 90+ OVR to unlock.');
      setTimeout(() => setLockNotice(''), 4000);
      return;
    }
    setMatchFormat(mode);
    setLockNotice('');
  };

  // DIFFICULTY ATTRIBUTE MULTIPLIER MATRIX
  const getFormatMultiplier = () => {
    switch (matchFormat) {
      case 'champions':
        return { pas: 1.04, sho: 1.05, dri: 1.03, phy: 1.04, pac: 1.05, def: 1.04, label: 'CHAMPIONS LEAGUE (PRO TIER - HARD)' };
      case 'worldcup':
        return { pas: 1.08, sho: 1.10, dri: 1.06, phy: 1.08, pac: 1.10, def: 1.08, label: 'WORLD CUP (PINNACLE TIER - EXTREME)' };
      default:
        return { pas: 1.0, sho: 1.0, dri: 1.0, phy: 1.0, pac: 1.0, def: 1.0, label: 'PREMIER LEAGUE (BASE TIER - REGULAR)' };
    }
  };

  const currentMultiplier = getFormatMultiplier();

  const getScaledValue = (val: number, mult: number) => {
    return Math.min(99, Math.round(val * mult));
  };
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onLookupUser(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const handleShareTwitter = () => {
    const text = `Check out my EA FC GitHub Player Card! OVR ${card.ratings.overall} ${card.footballPositionTitle} (@${card.username}) on GitCards! ⚽🔥`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = `Check out my EA FC GitHub Player Card! OVR ${card.ratings.overall} ${card.footballPositionTitle} (@${card.username}) on GitCards! ⚽ https://gitcards.dev`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const handleCopyGitHubBadge = () => {
    const badgeMarkdown = `[![GitCards Player Card](https://img.shields.io/badge/EA_FC_Card-${card.ratings.overall}_OVR-gold?style=for-the-badge&logo=github)](${window.location.href})`;
    navigator.clipboard.writeText(badgeMarkdown);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* TOP BAR: BACK BUTTON + SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <button
          onClick={onResetSearch}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold transition border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> GENERATE ANOTHER CARD
        </button>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-2xl px-3 py-1.5 focus-within:border-amber-400">
            <span className="text-slate-500 font-mono text-xs font-bold">@</span>
            <input
              type="text"
              placeholder="github username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-white text-xs font-mono px-2 py-1 focus:outline-none w-36 sm:w-48"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-xs transition shadow"
          >
            SEARCH
          </button>
        </form>
      </div>

      {/* MAIN GENERATED PROFILE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: FLOATING EA FC CARD + ACTIONS */}
        <div className="lg:col-span-5 flex flex-col items-center space-y-6">
          <div className="relative animate-float drop-shadow-[0_25px_40px_rgba(0,0,0,0.9)]">
            <EAFCCard card={card} elementId="ea-fc-export-card" interactive={true} />
          </div>

          <div className="w-full max-w-[340px] space-y-3">
            <button
              onClick={onOpenExportModal}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-display font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" /> DOWNLOAD CARD PNG
            </button>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-full py-3 rounded-2xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition border ${
                isFavorite
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
              {isFavorite ? 'FAVORITED PLAYER CARD' : 'FAVORITE PLAYER CARD'}
            </button>

            {/* SHARE SCORECARD BUTTONS */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="block text-center text-[10px] font-mono text-slate-500 uppercase font-bold tracking-widest">
                SHARE CARD PROFILE
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleShareTwitter}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-sky-500/20 hover:text-sky-300 border border-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <span className="text-sky-400 font-bold">𝕏</span> Twitter / X
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-emerald-500/20 hover:text-emerald-300 border border-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp
                </button>
                <button
                  onClick={handleShareLinkedIn}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-blue-500/20 hover:text-blue-300 border border-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <span className="text-blue-400 font-bold">in</span> LinkedIn
                </button>
                <button
                  onClick={handleCopyGitHubBadge}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition"
                >
                  {copiedBadge ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                  {copiedBadge ? 'Copied!' : 'GitHub Badge'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PLAYER ATTRIBUTES & FOOTBALL DETAILS */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* PLAYER HEADER & OVR BADGE */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
                    {card.name}
                  </h1>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-display font-black text-base">
                    OVR {card.ratings.overall}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="font-mono text-xs font-bold text-amber-400">
                    🏆 RANK #{card.powerScore > 20000 ? '1' : '46'} GLOBAL
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="font-mono text-xs text-slate-400 font-semibold">
                    @{card.username}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold flex items-center gap-1.5">
                    <span>⚡</span> Developer Archetype: <strong className="text-white">{card.positionTitle}</strong>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono text-xs font-bold flex items-center gap-1.5">
                    <span>{card.footballPositionBadge || '⚽'}</span> Position: <strong className="text-white">{card.position}</strong> ({card.footballPositionTitle})
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                  {card.bio}
                </p>
              </div>
            </div>
          </div>

          {/* LEAGUE MEMBERSHIP BANNER */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display font-extrabold text-sm text-white">
                  {userTeam ? `Squad: ${userTeam.name}` : 'Enrolled in Premier League (Tier 1)'}
                </div>
                <div className="text-xs text-slate-400">
                  {userTeam ? `${userTeam.totalPlayers}/15 Teammates Registered` : 'Official EA FC Developer League Membership'}
                </div>
              </div>
            </div>

            <button
              onClick={userTeam ? onOpenCreateTeamModal : onOpenConnectModal}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-mono font-bold transition shrink-0"
            >
              {userTeam ? 'MANAGE SQUAD' : 'JOIN LEAGUE'}
            </button>
          </div>

          {/* MATCH FORMAT COMPETITION SELECTOR WITH PROGRESSIVE LOCKS */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                SELECT MATCH COMPETITION MODE (PREMIER LEAGUE &lt; CHAMPIONS LEAGUE &lt; WORLD CUP)
              </label>
              <span className="text-[10px] font-mono font-bold text-amber-400">
                {currentMultiplier.label}
              </span>
            </div>

            {lockNotice && (
              <div className="px-4 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold animate-pulse">
                {lockNotice}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* 1. PREMIER LEAGUE - UNLOCKED BY DEFAULT */}
              <button
                onClick={() => handleSelectMode('premier')}
                className={`py-3 px-3 rounded-2xl text-xs font-bold font-mono transition-all border flex flex-col items-center justify-center gap-1 ${
                  matchFormat === 'premier'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-lg'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span>⚽</span>
                  <span>PREMIER LEAGUE</span>
                </div>
                <span className="text-[9px] font-normal opacity-80">REGULAR DIFFICULTY</span>
              </button>

              {/* 2. CHAMPIONS LEAGUE - REQUIRES PREMIER QUALIFICATION (OVR 82+) */}
              <button
                onClick={() => handleSelectMode('champions')}
                className={`py-3 px-3 rounded-2xl text-xs font-bold font-mono transition-all border flex flex-col items-center justify-center gap-1 relative ${
                  matchFormat === 'champions'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-lg'
                    : isChampionsUnlocked
                    ? 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    : 'bg-slate-950/60 text-slate-500 border-slate-800/80 cursor-not-allowed opacity-75'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span>{isChampionsUnlocked ? '🏆' : '🔒'}</span>
                  <span>CHAMPIONS LEAGUE</span>
                </div>
                <span className={`text-[9px] font-normal ${isChampionsUnlocked ? 'text-amber-400' : 'text-slate-500'}`}>
                  {isChampionsUnlocked ? 'PRO TIER (HARD)' : 'REQUIRES OVR 82+'}
                </span>
              </button>

              {/* 3. WORLD CUP - REQUIRES CHAMPIONS LEAGUE QUALIFICATION (OVR 90+) */}
              <button
                onClick={() => handleSelectMode('worldcup')}
                className={`py-3 px-3 rounded-2xl text-xs font-bold font-mono transition-all border flex flex-col items-center justify-center gap-1 relative ${
                  matchFormat === 'worldcup'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-lg'
                    : isWorldCupUnlocked
                    ? 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    : 'bg-slate-950/60 text-slate-500 border-slate-800/80 cursor-not-allowed opacity-75'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span>{isWorldCupUnlocked ? '🌍' : '🔒'}</span>
                  <span>WORLD CUP</span>
                </div>
                <span className={`text-[9px] font-normal ${isWorldCupUnlocked ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isWorldCupUnlocked ? 'LEGENDARY TIER' : 'REQUIRES OVR 90+'}
                </span>
              </button>
            </div>
          </div>

          {/* DETAILED FORMAT ATTRIBUTES WITH COMPETITION SCALING */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-sm text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> DETAILED FORMAT ATTRIBUTES
              </h3>
              <span className="text-[10px] font-mono text-slate-400 font-semibold">
                SCALED FOR {matchFormat.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'PASSING (COMMITS)', value: getScaledValue(card.ratings.pas, currentMultiplier.pas), raw: `${card.stats.commits.toLocaleString()} Commits` },
                { label: 'SHOOTING (PRS MERGED)', value: getScaledValue(card.ratings.sho, currentMultiplier.sho), raw: `${card.stats.prsMerged.toLocaleString()} PRs` },
                { label: 'DRIBBLING (STARS)', value: getScaledValue(card.ratings.dri, currentMultiplier.dri), raw: `${card.stats.stars.toLocaleString()} Stars` },
                { label: 'PHYSICAL (FOLLOWERS)', value: getScaledValue(card.ratings.phy, currentMultiplier.phy), raw: `${card.stats.followers.toLocaleString()} Followers` },
                { label: 'PACE (STREAK)', value: getScaledValue(card.ratings.pac, currentMultiplier.pac), raw: `${card.stats.streakDays} Days` },
                { label: 'DEFENSE (ISSUES CLOSED)', value: getScaledValue(card.ratings.def, currentMultiplier.def), raw: `${card.stats.issuesClosed.toLocaleString()} Closed` },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-300 font-bold">{stat.label}</span>
                    <span className="text-amber-400 font-extrabold">
                      {stat.value}/99 <span className="text-slate-500 text-[10px] font-normal">({stat.raw})</span>
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-yellow-300 transition-all duration-500"
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTBALL CAREER STATS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center shadow-lg">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">CAREER GOALS</div>
              <div className="font-display font-black text-2xl text-white mt-1">
                {card.stats.commits.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Total Commits</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center shadow-lg">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">FAN FOLLOWING</div>
              <div className="font-display font-black text-2xl text-amber-400 mt-1">
                {card.stats.followers.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">GitHub Followers</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center shadow-lg">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">MATCHES PLAYED</div>
              <div className="font-display font-black text-2xl text-white mt-1">
                {card.stats.publicRepos}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Public Repositories</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center shadow-lg">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">FAVORITE PLAY</div>
              <div className="font-display font-black text-lg text-emerald-400 mt-1 truncate">
                {card.stats.languages[0] || 'TypeScript'}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Primary Tech Stack</div>
            </div>
          </div>

          {/* UNLOCKED MATCH BADGES */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="font-display font-extrabold text-sm text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <Award className="w-4 h-4" /> UNLOCKED MATCH BADGES
            </h3>
            <div className="flex flex-wrap gap-2">
              {card.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono font-bold flex items-center gap-2"
                >
                  <span className="text-sm">{badge.icon}</span>
                  <span>{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
