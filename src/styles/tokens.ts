import type { CardRarity, StatKey } from '../types/battleCard';

export interface RarityTheme {
  name: string;
  badge: string;
  icon: string;
  borderClass: string;
  glowClass: string;
  gradientBg: string;
  badgeBg: string;
  textColor: string;
  accentColor: string;
  foilOverlay: string;
  cornerStyle: string;
}

export const RARITY_THEMES: Record<CardRarity, RarityTheme> = {
  common: {
    name: 'Common',
    badge: 'COMMON',
    icon: '🛡️',
    borderClass: 'border-slate-500/60 shadow-[0_4px_20px_rgba(100,116,139,0.15)]',
    glowClass: 'from-slate-700/20 to-slate-900/40',
    gradientBg: 'bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950',
    badgeBg: 'bg-slate-700/80 border-slate-500/60 text-slate-200',
    textColor: 'text-slate-300',
    accentColor: '#94a3b8',
    foilOverlay: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-400/10 via-transparent to-transparent',
    cornerStyle: 'rounded-2xl border-2',
  },
  rare: {
    name: 'Rare',
    badge: 'RARE',
    icon: '💎',
    borderClass: 'border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.35)]',
    glowClass: 'from-cyan-500/25 to-blue-950/60',
    gradientBg: 'bg-gradient-to-b from-[#0c2a4d] via-[#091e38] to-[#040e1c]',
    badgeBg: 'bg-cyan-950/80 border-cyan-400/70 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.4)]',
    textColor: 'text-cyan-300',
    accentColor: '#06b6d4',
    foilOverlay: 'bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.2),_transparent_70%)]',
    cornerStyle: 'rounded-2xl border-2',
  },
  epic: {
    name: 'Epic',
    badge: 'EPIC',
    icon: '🔮',
    borderClass: 'border-purple-400/90 shadow-[0_0_30px_rgba(168,85,247,0.45)]',
    glowClass: 'from-purple-600/30 to-purple-950/80',
    gradientBg: 'bg-gradient-to-b from-[#2e1065] via-[#1c0840] to-[#0d0221]',
    badgeBg: 'bg-purple-950/80 border-purple-400/80 text-purple-200 shadow-[0_0_14px_rgba(168,85,247,0.5)]',
    textColor: 'text-purple-300',
    accentColor: '#a855f7',
    foilOverlay: 'bg-[radial-gradient(circle_at_30%_20%,_rgba(192,132,252,0.25),_transparent_60%)]',
    cornerStyle: 'rounded-2xl border-2 ring-1 ring-purple-500/50',
  },
  legendary: {
    name: 'Legendary',
    badge: 'LEGENDARY',
    icon: '👑',
    borderClass: 'border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.55)]',
    glowClass: 'from-amber-500/35 to-amber-950/80',
    gradientBg: 'bg-gradient-to-b from-[#3d2707] via-[#211402] to-[#0d0701]',
    badgeBg: 'bg-amber-950/90 border-amber-400 text-amber-200 shadow-[0_0_18px_rgba(245,158,11,0.6)]',
    textColor: 'text-amber-300',
    accentColor: '#eab308',
    foilOverlay: 'bg-[radial-gradient(circle_at_50%_0%,_rgba(251,191,36,0.3),_transparent_75%)]',
    cornerStyle: 'rounded-2xl border-[2.5px] ring-2 ring-amber-400/30',
  },
  mythic: {
    name: 'Mythic',
    badge: 'MYTHIC',
    icon: '⚡',
    borderClass: 'border-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 p-[2.5px] shadow-[0_0_45px_rgba(236,72,153,0.55)]',
    glowClass: 'from-pink-500/30 via-purple-600/30 to-cyan-500/30',
    gradientBg: 'bg-gradient-to-b from-[#180828] via-[#0d0317] to-[#04010a]',
    badgeBg: 'bg-gradient-to-r from-pink-600/80 to-purple-600/80 border-pink-400/80 text-white shadow-[0_0_20px_rgba(236,72,153,0.7)]',
    textColor: 'text-pink-300',
    accentColor: '#ec4899',
    foilOverlay: 'bg-[linear-gradient(135deg,_rgba(236,72,153,0.2)_0%,_rgba(139,92,246,0.2)_50%,_rgba(6,182,212,0.2)_100%)]',
    cornerStyle: 'rounded-2xl',
  },
};

export const STAT_METADATA: Record<
  StatKey,
  { label: string; short: string; description: string; icon: string; color: string }
> = {
  backend: {
    label: 'Backend Engineering',
    short: 'BAK',
    description: 'Server systems, API pipelines, database efficiency, and backend architecture.',
    icon: '🖥️',
    color: '#38bdf8',
  },
  frontend: {
    label: 'Frontend Engineering',
    short: 'FRO',
    description: 'UI/UX precision, modern web frameworks, component architecture, and reactivity.',
    icon: '🎨',
    color: '#f43f5e',
  },
  openSource: {
    label: 'Open Source Footprint',
    short: 'OPS',
    description: 'Community contributions, merged external pull requests, stars, and external reach.',
    icon: '🌐',
    color: '#10b981',
  },
  innovation: {
    label: 'Innovation & Variety',
    short: 'INV',
    description: 'Language diversity, novel original projects, and architectural experimentation.',
    icon: '💡',
    color: '#a855f7',
  },
  consistency: {
    label: 'Cadence & Streaks',
    short: 'CON',
    description: 'Contribution regularity, weekly activity consistency, and long-term momentum.',
    icon: '🔥',
    color: '#f59e0b',
  },
  popularity: {
    label: 'Popularity & Gravity',
    short: 'POP',
    description: 'Followers, forks, repository stargazers, and community ecosystem recognition.',
    icon: '⭐',
    color: '#eab308',
  },
  languageMastery: {
    label: 'Language Depth',
    short: 'LAN',
    description: 'Code volume and deep specialization within dominant primary programming languages.',
    icon: '⚡',
    color: '#06b6d4',
  },
};

