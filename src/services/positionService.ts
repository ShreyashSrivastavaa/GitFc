import type { FootballPosition, PositionInfo, GitHubRawStats } from '../types';

export const POSITION_INFOS: Record<FootballPosition, PositionInfo> = {
  STRIKER: {
    id: 'STRIKER',
    name: 'Striker (CF/ST)',
    shortCode: 'ST',
    icon: '⚽',
    description: 'Focuses on output: High Stars, Impact & Feature Delivery',
    requirement: 'Stars > 100',
    focusStats: 'Stars & Output Impact',
    badge: '⭐',
    colorClass: 'from-rose-500 to-amber-500 border-rose-500/40 text-rose-400',
  },
  MIDFIELDER: {
    id: 'MIDFIELDER',
    name: 'Midfielder (CM/CAM)',
    shortCode: 'CAM',
    icon: '🎯',
    description: 'Balanced Playmaker: High Commits & Open Pull Requests',
    requirement: 'Commits > 500 & PRs > 50',
    focusStats: 'Commits & Collaborations',
    badge: '🎯',
    colorClass: 'from-amber-500 to-yellow-400 border-amber-500/40 text-amber-400',
  },
  DEFENDER: {
    id: 'DEFENDER',
    name: 'Defender (CB/RB/LB)',
    shortCode: 'CB',
    icon: '🛡️',
    description: 'Code Quality Specialist: Code Reviews & Issue Resolution',
    requirement: 'Issues Closed > 100',
    focusStats: 'Issues Closed & Code Quality',
    badge: '🛡️',
    colorClass: 'from-emerald-500 to-teal-400 border-emerald-500/40 text-emerald-400',
  },
  GOALKEEPER: {
    id: 'GOALKEEPER',
    name: 'Goalkeeper (GK)',
    shortCode: 'GK',
    icon: '🔒',
    description: 'System Guardian: Infrastructure, Security & Repository Forks',
    requirement: 'Forks > 50',
    focusStats: 'Forks & Security Maintenance',
    badge: '🔒',
    colorClass: 'from-sky-500 to-blue-600 border-sky-500/40 text-sky-400',
  },
  MANAGER: {
    id: 'MANAGER',
    name: 'Manager (Coach)',
    shortCode: 'MGR',
    icon: '👑',
    description: 'Technical Leader: Community Influence & High Followers',
    requirement: 'Followers > 500',
    focusStats: 'Leadership & Followers',
    badge: '👑',
    colorClass: 'from-purple-500 to-indigo-500 border-purple-500/40 text-purple-400',
  },
  SUBSTITUTE: {
    id: 'SUBSTITUTE',
    name: 'Impact Sub (Versatile)',
    shortCode: 'SUB',
    icon: '🔄',
    description: 'Emerging Developer: Flexible across all roles',
    requirement: 'Default Role',
    focusStats: 'All-Round Growth',
    badge: '⚪',
    colorClass: 'from-slate-600 to-slate-400 border-slate-500/40 text-slate-300',
  },
};

export function assignPosition(stats: GitHubRawStats): FootballPosition {
  if (stats.stars > 100) return 'STRIKER';
  if (stats.commits > 500 && stats.prsMerged > 50) return 'MIDFIELDER';
  if (stats.issuesClosed > 100) return 'DEFENDER';
  if (stats.forks > 50) return 'GOALKEEPER';
  if (stats.followers > 500) return 'MANAGER';
  return 'SUBSTITUTE';
}

export function getPositionInfo(position: FootballPosition): PositionInfo {
  return POSITION_INFOS[position] || POSITION_INFOS.SUBSTITUTE;
}
