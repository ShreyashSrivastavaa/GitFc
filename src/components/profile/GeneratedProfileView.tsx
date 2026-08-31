import React, { useState } from 'react';
import type { GitFCDevCard } from '../../types';
import { EAFCCard } from '../card/EAFCCard';
import { 
  Download, 
  Share2, 
  Sparkles, 
  Swords, 
  ExternalLink, 
  Check, 
  Trophy, 
  Zap, 
  Shield, 
  GitCommit, 
  Flame, 
  RotateCcw,
  ShieldAlert
} from 'lucide-react';

interface GeneratedProfileViewProps {
  card: GitFCDevCard;
  userTeam?: any;
  isConnected?: boolean;
  onOpenExportModal: () => void;
  onOpenConnectModal?: () => void;
  onOpenCreateTeamModal?: () => void;
  onResetSearch: () => void;
  onLookupUser: (username: string) => Promise<GitFCDevCard | null>;
  onNavigateToLeagues?: () => void;
  onCompare?: (card: GitFCDevCard) => void;
}

export const GeneratedProfileView: React.FC<GeneratedProfileViewProps> = ({
  card,
  onOpenExportModal,
  onResetSearch,
  onCompare,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const attrs = card.attributes;

  const handleCopyProfileLink = () => {
    const url = `${window.location.origin}/?card=${encodeURIComponent(card.username)}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareTwitter = () => {
    const text = `⚽ Check out my GitFC Developer Card!
Rating: ${attrs.overall} OVR | ${card.position} (${card.archetype})
Attack: ${attrs.att} | Passing: ${attrs.pas} | Vision: ${attrs.vis}

Generate yours here:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-12 animate-fadeIn max-w-6xl mx-auto px-2 sm:px-4">
      
      {/* TOP ACTION BAR: BACK & SHARING */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gitfc-border">
        <button
          onClick={onResetSearch}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-gitfc-border text-slate-300 hover:text-white hover:border-gitfc-neonGreen/40 font-gaming text-xs font-bold uppercase transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> SCOUT ANOTHER DEV
        </button>

        <div className="flex items-center gap-3">
          {onCompare && (
            <button
              onClick={() => onCompare(card)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-gitfc-electricBlue/40 text-gitfc-electricBlue font-gaming text-xs font-bold uppercase transition shadow-sm"
            >
              <Swords className="w-3.5 h-3.5" /> FACE-OFF / COMPARE
            </button>
          )}

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-gitfc-neonGreen via-emerald-400 to-teal-400 text-slate-950 font-gaming text-xs font-black uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,255,135,0.5)] transition"
          >
            <Download className="w-3.5 h-3.5" /> EXPORT HD PNG
          </button>
        </div>
      </div>

      {/* HERO SPOTLIGHT: 3D CARD + IDENTITY PROFILE DOSSIER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* LEFT COLUMN: HERO 3D PLAYER CARD */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          {/* Ambient Glow */}
          <div className="absolute w-[360px] h-[520px] bg-gradient-to-tr from-gitfc-neonGreen/20 via-gitfc-electricBlue/20 to-gitfc-gold/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 drop-shadow-[0_30px_50px_rgba(0,0,0,0.9)]">
            <EAFCCard card={card} elementId="ea-fc-export-card" interactive={true} />
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-gitfc-neonGreen" />
            <span>Hover or move mouse to tilt in 3D</span>
          </div>
        </div>

        {/* RIGHT COLUMN: PLAYER DOSSIER & ATTRIBUTE BREAKDOWN */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* PLAYER HEADER & ARCHETYPE */}
          <div className="bg-gitfc-card/80 border border-gitfc-border rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-gaming font-bold uppercase bg-gitfc-neonGreen/10 border border-gitfc-neonGreen/30 text-gitfc-neonGreen mb-2">
                  <span>{card.positionCategory}</span> • {card.positionTitle}
                </div>
                <h1 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                  {card.name}
                </h1>
                <div className="flex items-center gap-2 mt-1 text-sm font-mono text-slate-400">
                  <span>@{card.username}</span>
                  <span>•</span>
                  <span>{card.clubName}</span>
                  <span>•</span>
                  <span>{card.countryFlag} {card.location}</span>
                </div>
              </div>

              {/* RATING BADGE */}
              <div className="flex flex-col items-center bg-black/60 border-2 border-gitfc-gold/50 px-5 py-3 rounded-2xl shadow-xl">
                <span className="font-gaming font-black text-4xl text-gitfc-gold leading-none">
                  {attrs.overall}
                </span>
                <span className="font-gaming font-bold text-[10px] tracking-widest uppercase text-slate-400 mt-1">
                  OVR RATING
                </span>
              </div>
            </div>

            {/* BIO & ARCHETYPE SUMMARY */}
            <div className="mt-6 pt-4 border-t border-gitfc-border/80">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="font-gaming font-bold text-xs uppercase tracking-wider text-amber-300">
                  SIGNATURE ARCHETYPE: {card.archetype}
                </span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {card.archetypeDescription}
              </p>
            </div>
          </div>

          {/* STRENGTHS & TACTICAL PLAYSTYLE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* STRENGTHS & WEAKNESSES */}
            <div className="bg-gitfc-card/80 border border-gitfc-border rounded-3xl p-5 shadow-xl space-y-3">
              <div className="font-gaming font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-400" /> KEY STRENGTHS
              </div>
              <div className="space-y-1.5">
                {card.strengths.map((str, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-emerald-300 font-semibold bg-emerald-950/30 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                    <span>⚡</span> {str}
                  </div>
                ))}
              </div>

              <div className="font-gaming font-bold text-xs uppercase tracking-wider text-slate-400 pt-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" /> ROOM FOR GROWTH
              </div>
              <div className="space-y-1.5">
                {card.weaknesses.map((weak, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-amber-300/90 font-medium bg-amber-950/20 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                    <span>🛡️</span> {weak}
                  </div>
                ))}
              </div>
            </div>

            {/* PLAYSTYLE TACTICAL IDENTITY */}
            <div className="bg-gitfc-card/80 border border-gitfc-border rounded-3xl p-5 shadow-xl space-y-3 flex flex-col justify-between">
              <div>
                <div className="font-gaming font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-rose-400" /> TACTICAL PLAYSTYLE
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                  "{card.playstyle}"
                </p>
              </div>

              {/* UNLOCKED BADGES */}
              <div className="pt-3 border-t border-gitfc-border/80">
                <span className="text-[11px] font-gaming font-bold uppercase text-slate-400 block mb-2">
                  DEV BADGES UNLOCKED ({card.badges.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {card.badges.map((b) => (
                    <span 
                      key={b.id} 
                      title={`${b.name}: ${b.description}`} 
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 border border-gitfc-border text-xs text-slate-300 hover:border-gitfc-gold/50 transition cursor-help"
                    >
                      <span>{b.icon}</span>
                      <span className="font-gaming font-bold text-[11px]">{b.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* SHARE CONTROLS */}
          <div className="bg-gradient-to-r from-gitfc-card via-slate-900 to-gitfc-card border border-gitfc-border rounded-3xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <span className="font-gaming font-bold text-xs text-slate-300 uppercase tracking-wider">
              SHARE PLAYER CARD
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShareTwitter}
                className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-gaming text-xs font-bold uppercase border border-sky-400/30 transition flex items-center gap-1.5 cursor-pointer"
              >
                SHARE TO X
              </button>
              <button
                onClick={handleCopyProfileLink}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-gaming text-xs font-bold uppercase border border-white/10 transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                {copiedLink ? 'COPIED LINK!' : 'COPY URL'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* SUPPORTING GITHUB TELEMETRY SUMMARY (FOOTBALL IDENTITY STAYS PRIMARY) */}
      <div className="pt-8 border-t border-gitfc-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-gaming font-black text-xl text-white uppercase tracking-wider flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-gitfc-neonGreen" />
              SUPPORTING GITHUB TELEMETRY
            </h3>
            <p className="text-slate-400 text-xs font-mono">
              Raw signals collected from public GitHub API logs
            </p>
          </div>
          <a
            href={`https://github.com/${card.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-mono text-gitfc-electricBlue hover:underline"
          >
            github.com/{card.username} <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-gitfc-card/60 border border-gitfc-border rounded-2xl p-4 text-center">
            <div className="text-slate-400 text-[10px] font-mono uppercase mb-1">Commits</div>
            <div className="font-gaming font-extrabold text-2xl text-white">{card.stats.commits.toLocaleString()}</div>
          </div>

          <div className="bg-gitfc-card/60 border border-gitfc-border rounded-2xl p-4 text-center">
            <div className="text-slate-400 text-[10px] font-mono uppercase mb-1">Stars Earned</div>
            <div className="font-gaming font-extrabold text-2xl text-gitfc-gold">{card.stats.stars.toLocaleString()}</div>
          </div>

          <div className="bg-gitfc-card/60 border border-gitfc-border rounded-2xl p-4 text-center">
            <div className="text-slate-400 text-[10px] font-mono uppercase mb-1">PRs Merged</div>
            <div className="font-gaming font-extrabold text-2xl text-gitfc-neonGreen">{card.stats.prsMerged.toLocaleString()}</div>
          </div>

          <div className="bg-gitfc-card/60 border border-gitfc-border rounded-2xl p-4 text-center">
            <div className="text-slate-400 text-[10px] font-mono uppercase mb-1">Issues Solved</div>
            <div className="font-gaming font-extrabold text-2xl text-gitfc-electricBlue">{card.stats.issuesClosed.toLocaleString()}</div>
          </div>

          <div className="bg-gitfc-card/60 border border-gitfc-border rounded-2xl p-4 text-center">
            <div className="text-slate-400 text-[10px] font-mono uppercase mb-1">Active Streak</div>
            <div className="font-gaming font-extrabold text-2xl text-pink-400">{card.stats.streakDays} Days</div>
          </div>

          <div className="bg-gitfc-card/60 border border-gitfc-border rounded-2xl p-4 text-center">
            <div className="text-slate-400 text-[10px] font-mono uppercase mb-1">Public Repos</div>
            <div className="font-gaming font-extrabold text-2xl text-purple-400">{card.stats.publicRepos}</div>
          </div>
        </div>

        {/* LANGUAGES */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-gaming font-bold text-slate-400 uppercase">TECH STACK:</span>
          {card.stats.languages.map((lang) => (
            <span key={lang} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-gitfc-border text-xs font-mono text-slate-300">
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* ENTERTAINMENT DISCLAIMER */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3 text-slate-400 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
        <span>
          GitFC is an entertainment and social developer identity product. All ratings and positions are algorithmic gamification signals, not real engineering evaluations.
        </span>
      </div>

    </div>
  );
};
