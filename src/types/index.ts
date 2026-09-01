export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'elite';

export type CardPosition = 
  | 'ST'   // High output solo striker
  | 'CAM'  // Broad & balanced creative playmaker
  | 'CM'   // Engine & all-rounder
  | 'CDM'  // Backend / infra / stability shield
  | 'CB'   // Core maintainer / repository defender
  | 'LB'   // Agile fullstack / speed flank
  | 'RB'   // Agile fullstack / speed flank
  | 'LW'   // Dynamic winger / rapid feature dev
  | 'RW'   // Precision winger / rapid feature dev
  | 'GK';  // Security / DevOps / infrastructure guardian

export type DevArchetype =
  | 'Open Source Machine'
  | 'Solo Striker'
  | 'Master Playmaker'
  | 'System Architect'
  | 'Night Coder'
  | 'Polyglot Prodigy'
  | 'Repository Guardian'
  | 'DevOps Titan'
  | 'Fullstack Maestro'
  | 'Rising Prospect';

export interface PositionMeta {
  code: CardPosition;
  name: string;
  category: 'ATT' | 'MID' | 'DEF' | 'GK';
  description: string;
  badge: string;
  glowColor: string;
}

export interface EAFCAttributes {
  att: number; // ATTACK: contribution volume/output
  pas: number; // PASSING: collaboration, PRs to other projects
  def: number; // DEFENDING: issue fixing, maintenance
  pac: number; // PACE: recent activity, consistency
  dri: number; // DRIBBLING: technical/language diversity
  sho: number; // SHOOTING: project completion signals
  vis: number; // VISION: breadth of tech/projects
  sta: number; // STAMINA: long-term consistency
  overall: number; // OVERALL RATING: integer 45-99
  
  // Legacy aliases
  phy?: number;
  skl?: number;
}

export interface DevBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
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
  
  // Computed & heuristic signals
  commits: number;
  stars: number;
  prsMerged: number;
  issuesClosed: number;
  forks: number;
  streakDays: number;
  languages: string[];
}

export interface GitFCDevCard {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  location: string;
  clubName: string; // e.g. "OPEN SOURCE FC" or company
  countryFlag: string;
  
  rarity: CardRarity;
  rarityTitle: string;
  position: CardPosition;
  positionCategory: 'ATT' | 'MID' | 'DEF' | 'GK';
  positionTitle: string;
  archetype: DevArchetype;
  archetypeDescription: string;
  
  attributes: EAFCAttributes;
  ratings: EAFCAttributes;
  footballPosition?: string;
  footballPositionTitle?: string;
  footballPositionBadge?: string;
  chemistryStyle?: string;
  skinStyle?: string;
  
  powerScore: number;
  stats: GitHubRawStats;
  badges: DevBadge[];
  
  strengths: string[];
  weaknesses: string[];
  playstyle: string;
  
  // Pack Friday & Card Evolution Data Model Foundation
  cardVersion?: number;
  edition?: string;
  lastRefreshedAt?: string;
  isPackFridayRefreshed?: boolean;
  
  createdAt: string;
}

// Alias for backwards compatibility with any existing imports
export type EAFCDevCard = GitFCDevCard;
export type EAFCRatings = EAFCAttributes;

export interface LeaderboardEntry {
  rank: number;
  card: GitFCDevCard;
  badgeCount: number;
  views: number;
}

export type ActiveTab = 'generator' | 'profile' | 'compare' | 'leaderboard' | 'team-hub' | 'leagues' | 'dressing-room' | 'customizer';

// Legacy compatibility types for ancillary views
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
  message?: string;
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
  badge: string;
  manager: GitFCDevCard;
  founded: string;
  players: TeamRoster;
  totalPlayers: number;
  formation: string;
  squadValue: number;
  squadChemistry: number;
  averageRating: number;
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
  tier: 'tier1' | 'tier2' | 'tier3';
  format: 'full' | 't20' | 'test' | 'sprint' | 'community';
  season: number;
  status: 'live' | 'upcoming' | 'completed' | 'off-season';
  startDate: string;
  endDate: string;
  members: number;
  maxTeams?: number;
  minRating: number;
  requirements: LeagueRequirements;
  prizes?: LeaguePrizes;
  rules: string[];
  category: 'featured' | 'tournament' | 'regional' | 'community';
  joinButtonStatus?: 'Join League' | 'Registered' | 'Coming Soon' | 'Full';
}
export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  rating: number;
  isPinned: boolean;
  position: number;
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
  teamChemistry: number;
  squadDepth: number;
  avgRating: number;
  achievements: AchievementBadge[];
}

