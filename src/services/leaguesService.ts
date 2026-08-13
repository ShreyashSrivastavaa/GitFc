import type { League, LeaderboardEntry, EAFCDevCard, UserLeagueMembership } from '../types';
import { PRESET_DEVS } from './presets';

export const LEAGUES_DATA: League[] = [
  // TIER 1: ELITE LEAGUES
  {
    id: 'premier',
    name: 'Premier DevLeague',
    description: 'The pinnacle of developer competitions. Top global developer teams showcase their coding supremacy in a 20-team division.',
    icon: '🏆',
    tier: 'tier1',
    format: 'full',
    season: 2026,
    status: 'live',
    startDate: '2026-09-01',
    endDate: '2027-05-31',
    members: 20,
    maxTeams: 20,
    minRating: 85,
    category: 'featured',
    joinButtonStatus: 'Join League',
    requirements: {
      minRating: 85,
      minStars: 500,
    },
    prizes: {
      gold: '🥇 Golden Keyboard Trophy & Icon Card Skin',
      silver: '🥈 Silver Developer Shield',
      bronze: '🥉 Bronze Committer Medal',
    },
    rules: [
      'Maximum 20 teams per division',
      'Exclusive membership: teams can belong to only 1 league at a time',
      'Top 4 teams qualify for UEFA DevLeague playoffs',
      'Bottom 2 teams relegated to Championship DevLeague',
    ],
  },
  {
    id: 'uefa',
    name: 'UEFA DevLeague (Champions)',
    description: 'International Champions Tournament. Top champions from domestic leagues compete for global supremacy.',
    icon: '⚽',
    tier: 'tier1',
    format: 'full',
    season: 2026,
    status: 'live',
    startDate: '2026-09-15',
    endDate: '2027-05-25',
    members: 32,
    maxTeams: 32,
    minRating: 88,
    category: 'featured',
    joinButtonStatus: 'Join League',
    requirements: {
      minRating: 88,
    },
    rules: [
      '32-team group stage + knockout rounds',
      'Only champions and top 4 finishers from domestic leagues',
    ],
  },
  {
    id: 'la-devleague',
    name: 'La DevLeague',
    description: 'Spanish Tech Championship for high-precision, elegant code architects.',
    icon: '🇪🇸',
    tier: 'tier1',
    format: 'full',
    season: 2026,
    status: 'live',
    startDate: '2026-09-01',
    endDate: '2027-05-31',
    members: 20,
    maxTeams: 20,
    minRating: 80,
    category: 'tournament',
    joinButtonStatus: 'Join League',
    requirements: {
      minRating: 80,
    },
    rules: ['20 teams full season competition'],
  },
  {
    id: 'serie-devleague',
    name: 'Serie DevLeague',
    description: 'Italian Developer League focusing on rock-solid security defense and tactical code structure.',
    icon: '🇮🇹',
    tier: 'tier1',
    format: 'full',
    season: 2026,
    status: 'live',
    startDate: '2026-09-01',
    endDate: '2027-05-31',
    members: 20,
    maxTeams: 20,
    minRating: 78,
    category: 'tournament',
    joinButtonStatus: 'Join League',
    requirements: {
      minRating: 78,
    },
    rules: ['20 teams full season competition'],
  },
  {
    id: 'ligue-devleague',
    name: 'Ligue DevLeague',
    description: 'French Tech League featuring fast-paced young talent and product builders.',
    icon: '🇫🇷',
    tier: 'tier1',
    format: 'full',
    season: 2026,
    status: 'live',
    startDate: '2026-09-01',
    endDate: '2027-05-31',
    members: 20,
    maxTeams: 20,
    minRating: 77,
    category: 'tournament',
    joinButtonStatus: 'Join League',
    requirements: {
      minRating: 77,
    },
    rules: ['20 teams full season competition'],
  },
  {
    id: 'championship',
    name: 'Championship DevLeague',
    description: 'Secondary division coding marathon with promotion to Premier DevLeague.',
    icon: '🏴',
    tier: 'tier1',
    format: 'test',
    season: 2026,
    status: 'live',
    startDate: '2026-09-01',
    endDate: '2027-05-31',
    members: 24,
    maxTeams: 24,
    minRating: 65,
    category: 'tournament',
    joinButtonStatus: 'Join League',
    requirements: {
      minRating: 65,
    },
    rules: ['Top 2 teams automatically promoted to Premier DevLeague'],
  },

  // TIER 2: REGIONAL LEAGUES
  {
    id: 'asian-devleague',
    name: 'Asian DevLeague',
    description: 'Pan-Asian developer championship for high-velocity engineering teams.',
    icon: '🌐',
    tier: 'tier2',
    format: 'full',
    season: 2026,
    status: 'live',
    startDate: '2026-09-01',
    endDate: '2027-05-31',
    members: 20,
    minRating: 75,
    category: 'regional',
    joinButtonStatus: 'Join League',
    requirements: {
      minRating: 75,
    },
    rules: ['Regional squad competition'],
  },
  {
    id: 'american-devleague',
    name: 'American DevLeague',
    description: 'North & South American tech championship.',
    icon: '🌎',
    tier: 'tier2',
    format: 'full',
    season: 2026,
    status: 'live',
    startDate: '2026-09-01',
    endDate: '2027-05-31',
    members: 20,
    minRating: 75,
    category: 'regional',
    joinButtonStatus: 'Join League',
    requirements: {
      minRating: 75,
    },
    rules: ['Regional squad competition'],
  },
  {
    id: 'pacific-devleague',
    name: 'Pacific DevLeague',
    description: 'Australia, New Zealand & Oceania developer tournament.',
    icon: '🌏',
    tier: 'tier2',
    format: 'full',
    season: 2026,
    status: 'upcoming',
    startDate: '2026-10-01',
    endDate: '2027-06-30',
    members: 16,
    minRating: 70,
    category: 'regional',
    joinButtonStatus: 'Coming Soon',
    requirements: {
      minRating: 70,
    },
    rules: ['Regional squad competition'],
  },

  // TIER 3: COMMUNITY LEAGUES
  {
    id: 'opensource',
    name: 'Open Source DevLeague',
    description: 'Celebrating open-source contributors, public repo maintainers, and community leaders.',
    icon: '🌟',
    tier: 'tier3',
    format: 'community',
    season: 2026,
    status: 'live',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    members: 124,
    minRating: 50,
    category: 'community',
    joinButtonStatus: 'Join League',
    requirements: {},
    rules: ['Open to all teams with public GitHub repositories'],
  },
  {
    id: 'womenintech',
    name: 'Women in Tech DevLeague',
    description: 'Empowering and celebrating women developers globally. Breaking barriers, coding futures.',
    icon: '👩‍💻',
    tier: 'tier3',
    format: 'full',
    season: 2026,
    status: 'live',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    members: 45,
    minRating: 50,
    category: 'community',
    joinButtonStatus: 'Join League',
    requirements: {},
    rules: ['Inclusive global team competition'],
  },
  {
    id: 'startup',
    name: 'Startup Sprint DevLeague',
    description: 'High-speed monthly sprint league for startup founders, indie hackers, and product builders.',
    icon: '🚀',
    tier: 'tier3',
    format: 'sprint',
    season: 2026,
    status: 'live',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    members: 60,
    minRating: 60,
    category: 'community',
    joinButtonStatus: 'Join League',
    requirements: {
      minRating: 60,
    },
    rules: ['30-day rapid iteration product deployment competition'],
  },
  {
    id: 'junior',
    name: 'Junior DevLeague',
    description: 'Designed for learning developers, students, and early-career coders under 2 years experience.',
    icon: '🎓',
    tier: 'tier3',
    format: 'community',
    season: 2026,
    status: 'live',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    members: 89,
    minRating: 40,
    category: 'community',
    joinButtonStatus: 'Join League',
    requirements: {},
    rules: ['Encourages learning, team streaks, and early contributions'],
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
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  isUserTeam?: boolean;
}

export function getLeagueStandings(_leagueId: string, customCards: EAFCDevCard[] = []): StandingsEntry[] {
  const combined = [...customCards];
  PRESET_DEVS.forEach((preset) => {
    if (!combined.some((c) => c.username.toLowerCase() === preset.username.toLowerCase())) {
      combined.push(preset);
    }
  });

  const sorted = [...combined].sort((a, b) => b.powerScore - a.powerScore);

  return sorted.map((card, idx) => {
    const wins = Math.max(5, Math.round(card.ratings.overall * 0.4 - idx));
    const draws = Math.max(1, Math.round((idx * 0.8) % 5));
    const losses = Math.max(0, 19 - wins - draws);
    const points = wins * 3 + draws * 1;
    const goalsFor = Math.round(card.ratings.overall * 0.5 + wins * 2);
    const goalsAgainst = Math.round(losses * 2 + 10);
    const goalDiff = goalsFor - goalsAgainst;

    return {
      rank: idx + 1,
      card,
      badgeCount: card.badges.length,
      views: 1200 + Math.round(card.powerScore * 0.15),
      wins,
      draws,
      losses,
      points,
      goalsFor,
      goalsAgainst,
      goalDiff,
    };
  });
}

export function createLeagueMembership(leagueId: string, currentRank: number = 1): UserLeagueMembership {
  return {
    leagueId,
    joinedDate: new Date().toISOString().split('T')[0],
    status: 'active',
    currentRank,
    points: 34,
    wins: 11,
    draws: 1,
    losses: 7,
  };
}
