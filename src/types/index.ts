export type CardRarity = 'bronze' | 'silver' | 'gold' | 'hero' | 'toty' | 'icon';

export type CardPosition = 'GEN' | 'INF' | 'COL' | 'HUS' | 'DEV' | 'ARC';

export type FootballPosition = 'STRIKER' | 'MIDFIELDER' | 'DEFENDER' | 'GOALKEEPER' | 'MANAGER' | 'SUBSTITUTE';

export interface PositionInfo {
  id: FootballPosition;
  name: string;
  shortCode: string;
  icon: string;
  description: string;
  requirement: string;
  focusStats: string;
  badge: string;
  colorClass: string;
}

export type LeagueFormat = 'full' | 't20' | 'test' | 'sprint' | 'community';
export type LeagueStatus = 'live' | 'upcoming' | 'completed' | 'off-season';

export interface LeagueRequirements {
  minStars?: number;
  minCommits?: number;
  minFollowers?: number;
  minExperience?: string;
}

export interface LeaguePrizes {
  gold: string;
  silver: string;
  bronze: string;
}

export interface League {
  id: string;
  name: string;
  description: string;
  icon: string;
  format: LeagueFormat;
  season: number;
  status: LeagueStatus;
  startDate: string;
  endDate: string;
  members: number;
  maxMembers?: number;
  requirements: LeagueRequirements;
  prizes?: LeaguePrizes;
  rules: string[];
  category: 'featured' | 'tournament';
  joinButtonStatus?: 'Join League' | 'Registered' | 'Coming Soon' | 'Full';
}

export interface UserLeagueMembership {
  leagueId: string;
  joinedDate: string;
  status: 'active' | 'completed';
  currentRank: number;
  points: number;
  wins: number;
  draws: number;
  losses: number;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  rating: number; // 0-99
  isPinned: boolean;
  position: number; // 1-11 for starting XI
  url: string;
}

export interface AchievementBadge {
  id: string;
  name: string;
  icon: string;
  requirement: string;
  unlocked: boolean;
  unlockedDate?: string;
  progressPercent: number;
}

export interface DressingRoomData {
  startingXI: ProjectItem[];
  bench: ProjectItem[];
  teamValue: number;
  teamChemistry: number; // 0-100%
  squadDepth: number;
  avgRating: number;
  achievements: AchievementBadge[];
}

export interface GitHubRawStats {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  location: string;
  company: string;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
  
  // Advanced metrics
  commits: number;
  stars: number;
  prsMerged: number;
  issuesClosed: number;
  forks: number;
  streakDays: number;
  languages: string[];
}

export interface EAFCRatings {
  pac: number; // Pace (Streak)
  sho: number; // Shooting (PRs)
  pas: number; // Passing (Commits)
  dri: number; // Dribbling (Stars)
  def: number; // Defense (Closed Issues)
  phy: number; // Physical (Followers)
  sta: number; // Stamina (Forks)
  skl: number; // Skill (Languages)
  overall: number; // Overall Rating (0-99)
}

export interface DevBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface EAFCDevCard {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  location?: string;
  
  rarity: CardRarity;
  position: CardPosition;
  positionTitle: string;
  countryFlag: string; // Emoji or country code
  clubName: string; // e.g., "OPEN SOURCE FC" or top repo name
  
  // Football position extensions
  footballPosition: FootballPosition;
  footballPositionTitle: string;
  footballPositionBadge: string;

  // Competitive Leagues extensions
  leagues: UserLeagueMembership[];

  // Dressing Room Extensions
  dressingRoom?: DressingRoomData;

  ratings: EAFCRatings;
  powerScore: number;
  stats: GitHubRawStats;
  badges: DevBadge[];
  
  // Customization preferences
  skinStyle?: 'standard' | 'shiny' | 'animated';
  chemistryStyle?: 'SNIPER' | 'ENGINE' | 'ARCHITECT' | 'HUNTER' | 'SHADOW';
  customTitle?: string;
  
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  card: EAFCDevCard;
  badgeCount: number;
  views: number;
}

export type ActiveTab = 'generator' | 'pack-opener' | 'leaderboard' | 'squad-xi' | 'compare' | 'customizer' | 'leagues' | 'dressing-room';
