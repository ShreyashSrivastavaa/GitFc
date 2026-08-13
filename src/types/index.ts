export type CardRarity = 'bronze' | 'silver' | 'gold' | 'hero' | 'toty' | 'icon';

export type CardPosition = 'GEN' | 'INF' | 'COL' | 'HUS' | 'DEV' | 'ARC';

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

export type ActiveTab = 'generator' | 'pack-opener' | 'leaderboard' | 'squad-xi' | 'compare' | 'customizer';
