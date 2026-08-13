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

export type TeamPlayerPosition = 'GK' | 'CB' | 'RB' | 'LB' | 'CM' | 'CAM' | 'ST' | 'LW' | 'RW';
export type TeamPlayerRole = 'Starting' | 'Substitute' | 'Reserve';

export interface TeamPlayer {
  userId: string;
  username: string;
  name: string;
  avatarUrl: string;
  position: TeamPlayerPosition;
  role: TeamPlayerRole;
  overall: number;
  joinedTeam: string;
  stats: GitHubRawStats;
}

export interface TeamInvite {
  id: string;
  teamId: string;
  teamName: string;
  teamBadge: string;
  invitedBy: string;
  invitedUser: string;
  suggestedPosition?: string;
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  inviteCode: string;
}

export interface TeamRoster {
  goalkeeper: TeamPlayer[];
  defenders: TeamPlayer[];
  midfielders: TeamPlayer[];
  forwards: TeamPlayer[];
  substitutes: TeamPlayer[];
}

export interface Team {
  id: string;
  name: string;
  description: string;
  badge: string; // Emoji e.g. 🔴
  manager: EAFCDevCard; // Manager details
  founded: string;
  
  players: TeamRoster;
  totalPlayers: number; // Max 15
  formation: string; // e.g. "4-4-3", "4-3-3", "3-5-2"
  
  squadValue: number; // Combined power score
  squadChemistry: number; // 0-100%
  averageRating: number; // Avg OVR
  
  // Exclusive League Membership (Only 1 active league allowed)
  leagueId: string | null;
  leagueName: string | null;
  leaguePosition: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  
  inviteCode: string;
  invites: TeamInvite[];
  isPrivate: boolean;
  createdAt: string;
}

export type LeagueTier = 'tier1' | 'tier2' | 'tier3';
export type LeagueFormat = 'full' | 't20' | 'test' | 'sprint' | 'community';
export type LeagueStatus = 'live' | 'upcoming' | 'completed' | 'off-season';

export interface LeagueRequirements {
  minStars?: number;
  minCommits?: number;
  minFollowers?: number;
  minRating?: number;
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
  tier: LeagueTier;
  format: LeagueFormat;
  season: number;
  status: LeagueStatus;
  startDate: string;
  endDate: string;
  members: number; // Team count
  maxTeams?: number;
  minRating: number;
  requirements: LeagueRequirements;
  prizes?: LeaguePrizes;
  rules: string[];
  category: 'featured' | 'tournament' | 'regional' | 'community';
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

  // Competitive Leagues & Team extensions
  leagues: UserLeagueMembership[];
  teamId?: string;
  teamName?: string;

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

export type ActiveTab = 'generator' | 'leagues' | 'dressing-room' | 'leaderboard' | 'customizer' | 'team-hub';
