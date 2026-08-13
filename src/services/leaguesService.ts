import type { League, LeaderboardEntry, EAFCDevCard, UserLeagueMembership } from '../types';
import { PRESET_DEVS } from './presets';

export const LEAGUES_DATA: League[] = [
  {
    id: 'premier',
    name: 'Premier DevLeague',
    description: 'The pinnacle of developer competitions. Top global developers showcase their coding supremacy in a full-season format.',
    icon: '🏆',
    format: 'full',
    season: 2026,
    status: 'live',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    members: 2500,
    maxMembers: 100,
    category: 'featured',
    joinButtonStatus: 'Join League',
    requirements: {
      minStars: 500,
      minCommits: 5000,
      minFollowers: 1000,
    },
    prizes: {
      gold: '🥇 Golden Keyboard Trophy & Icon Card Skin',
      silver: '🥈 Silver Developer Shield',
      bronze: '🥉 Bronze Committer Medal',
    },
    rules: [
      'Top 100 global developers only',
      'Minimum 500+ GitHub Stars',
      'Weekly automated standings calculation based on Power Score',
    ],
  },
  {
    id: 'lightning',
    name: 'Lightning DevLeague',
    description: 'Fast commits, rapid merges, and high intensity. Global T20 development sprint tournament.',
    icon: '⚡',
    format: 't20',
    season: 2026,
    status: 'live',
    startDate: '2026-08-01',
    endDate: '2026-08-21',
    members: 5120,
    category: 'tournament',
    joinButtonStatus: 'Join League',
    requirements: {
      minStars: 10,
      minCommits: 100,
    },
    rules: [
      '20-day high frequency sprint',
      'Rankings updated daily based on commit velocity and PR merges',
    ],
  },
  {
    id: 'championship',
    name: 'Championship DevLeague',
    description: 'Test format coding marathon for long-term project endurance and codebase stability.',
    icon: '🏟️',
    format: 'test',
    season: 2026,
    status: 'off-season',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    members: 1840,
    category: 'tournament',
    joinButtonStatus: 'Coming Soon',
    requirements: {
      minCommits: 500,
    },
    rules: [
      '90-day endurance test',
      'Rewards code maintainability and issue resolution',
    ],
  },
  {
    id: 'opensource',
    name: 'Open Source DevLeague',
    description: 'Celebrating community contributions, public repository collaborations, and open-source impact.',
    icon: '🌟',
    format: 'community',
    season: 2026,
    status: 'live',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    members: 12400,
    category: 'tournament',
    joinButtonStatus: 'Join League',
    requirements: {
      minStars: 5,
    },
    rules: [
      'Open to all public repository contributors',
      'Bonus points for cross-repo PR merges',
    ],
  },
  {
    id: 'womenintech',
    name: 'Women in Tech DevLeague',
    description: 'Empowering and celebrating women developers globally. Breaking barriers and coding futures.',
    icon: '👩‍💻',
    format: 'full',
    season: 2026,
    status: 'live',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    members: 3200,
    category: 'tournament',
    joinButtonStatus: 'Join League',
    requirements: {},
    rules: [
      'Inclusive global league',
      'Mentorship and squad collaboration bonuses',
    ],
  },
  {
    id: 'startup',
    name: 'Startup Sprint DevLeague',
    description: 'High-speed product iteration league for startup founders, indie hackers, and product builders.',
    icon: '🚀',
    format: 'sprint',
    season: 2026,
    status: 'live',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    members: 2900,
    category: 'tournament',
    joinButtonStatus: 'Join League',
    requirements: {
      minCommits: 200,
    },
    rules: ['30-day rapid product deployment competition'],
  },
  {
    id: 'junior',
    name: 'Junior DevLeague',
    description: 'Designed for learning developers, students, and early-career coders under 2 years experience.',
    icon: '🎓',
    format: 'community',
    season: 2026,
    status: 'live',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    members: 8900,
    category: 'tournament',
    joinButtonStatus: 'Join League',
    requirements: {},
    rules: ['Encourages learning, daily streaks, and early contributions'],
  },
];

export function getLeagues(): League[] {
  return LEAGUES_DATA;
}

export function getLeagueById(id: string): League | undefined {
  return LEAGUES_DATA.find((l) => l.id === id);
}

export interface StandingsEntry extends LeaderboardEntry {
  points: number;
  wins: number;
  draws: number;
  losses: number;
}

export function getLeagueStandings(_leagueId: string, customCards: EAFCDevCard[] = []): StandingsEntry[] {
  const combined = [...customCards];
  PRESET_DEVS.forEach((preset) => {
    if (!combined.some((c) => c.username.toLowerCase() === preset.username.toLowerCase())) {
      combined.push(preset);
    }
  });

  // Sort by powerScore descending
  const sorted = [...combined].sort((a, b) => b.powerScore - a.powerScore);

  return sorted.map((card, idx) => {
    const wins = Math.max(5, Math.round(card.ratings.overall * 0.4 - idx));
    const draws = Math.max(1, Math.round(idx * 0.8 % 5));
    const losses = Math.max(0, 20 - wins - draws);
    const points = wins * 3 + draws * 1;

    return {
      rank: idx + 1,
      card,
      badgeCount: card.badges.length,
      views: 1200 + Math.round(card.powerScore * 0.15),
      wins,
      draws,
      losses,
      points,
    };
  });
}

export function createLeagueMembership(leagueId: string, currentRank: number = 1): UserLeagueMembership {
  return {
    leagueId,
    joinedDate: new Date().toISOString().split('T')[0],
    status: 'active',
    currentRank,
    points: 15,
    wins: 5,
    draws: 0,
    losses: 1,
  };
}
