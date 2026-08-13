import type { EAFCDevCard, Team } from '../types';
import { PRESET_DEVS } from './presets';
import { getAllPlayersInTeam } from './teamService';

export type NetworkRelationship = 'you' | 'you_follow' | 'follows_you' | 'mutual' | 'teammate';

export interface NetworkLeaderboardEntry {
  card: EAFCDevCard;
  relationship: NetworkRelationship;
  relationshipLabel: string;
  isCurrentUser: boolean;
}

export function buildNetworkLeaderboard(
  currentUserCard: EAFCDevCard | null,
  following: string[],
  followers: string[],
  userTeam: Team | null,
  allKnownCards: EAFCDevCard[] = PRESET_DEVS
): NetworkLeaderboardEntry[] {
  if (!currentUserCard) return [];

  const currentUsername = currentUserCard.username.toLowerCase();
  const followingSet = new Set(following.map((f) => f.toLowerCase()));
  const followersSet = new Set(followers.map((f) => f.toLowerCase()));

  const teamPlayerUsernames = userTeam
    ? new Set(getAllPlayersInTeam(userTeam).map((p) => p.username.toLowerCase()))
    : new Set<string>();

  // Ensure current user is in card set
  const pool = [...allKnownCards];
  if (!pool.some((c) => c.username.toLowerCase() === currentUsername)) {
    pool.unshift(currentUserCard);
  }

  const networkEntries: NetworkLeaderboardEntry[] = [];
  const processedUsernames = new Set<string>();

  for (const card of pool) {
    const uname = card.username.toLowerCase();
    if (processedUsernames.has(uname)) continue;

    const isSelf = uname === currentUsername;
    const youFollow = followingSet.has(uname);
    const followsYou = followersSet.has(uname);
    const isTeammate = teamPlayerUsernames.has(uname);

    // Include if self, or you follow, or follows you, or teammate
    if (isSelf || youFollow || followsYou || isTeammate) {
      let relationship: NetworkRelationship = 'you';
      let label = 'YOU';

      if (isSelf) {
        relationship = 'you';
        label = 'YOU';
      } else if (youFollow && followsYou) {
        relationship = 'mutual';
        label = 'MUTUAL';
      } else if (youFollow) {
        relationship = 'you_follow';
        label = 'YOU FOLLOW';
      } else if (followsYou) {
        relationship = 'follows_you';
        label = 'FOLLOWS YOU';
      } else if (isTeammate) {
        relationship = 'teammate';
        label = 'TEAMMATE';
      }

      networkEntries.push({
        card: isSelf ? currentUserCard : card,
        relationship,
        relationshipLabel: label,
        isCurrentUser: isSelf,
      });

      processedUsernames.add(uname);
    }
  }

  return networkEntries;
}
