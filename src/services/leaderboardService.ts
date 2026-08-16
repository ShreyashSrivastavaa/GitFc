import type { EAFCDevCard, Team } from '../types';
import { PRESET_DEVS } from './presets';
import { getAllPlayersInTeam } from './teamService';

export type NetworkRelationship = 'you' | 'you_follow' | 'follows_you' | 'mutual' | 'teammate' | 'custom';

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
  allKnownCards: EAFCDevCard[] = PRESET_DEVS,
  customNetworkCards: EAFCDevCard[] = []
): NetworkLeaderboardEntry[] {
  if (!currentUserCard) return [];

  const currentUsername = currentUserCard.username.toLowerCase();
  const followingSet = new Set(following.map((f) => f.toLowerCase()));
  const followersSet = new Set(followers.map((f) => f.toLowerCase()));
  const customSet = new Set(customNetworkCards.map((c) => c.username.toLowerCase()));

  const teamPlayerUsernames = userTeam
    ? new Set(getAllPlayersInTeam(userTeam).map((p) => p.username.toLowerCase()))
    : new Set<string>();

  // Pool includes preset/community cards + custom added cards
  const poolMap = new Map<string, EAFCDevCard>();
  
  // Add preset / known cards
  allKnownCards.forEach((c) => poolMap.set(c.username.toLowerCase(), c));
  
  // Add custom network cards
  customNetworkCards.forEach((c) => poolMap.set(c.username.toLowerCase(), c));

  // Ensure current user is in map
  poolMap.set(currentUsername, currentUserCard);

  const networkEntries: NetworkLeaderboardEntry[] = [];
  const processedUsernames = new Set<string>();

  for (const [uname, card] of poolMap.entries()) {
    if (processedUsernames.has(uname)) continue;

    const isSelf = uname === currentUsername;
    const youFollow = followingSet.has(uname);
    const followsYou = followersSet.has(uname);
    const isTeammate = teamPlayerUsernames.has(uname);
    const isCustom = customSet.has(uname);

    // Include if self, or you follow, or follows you, or teammate, or custom added
    if (isSelf || youFollow || followsYou || isTeammate || isCustom) {
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
      } else if (isCustom) {
        relationship = 'custom';
        label = 'ADDED DEV';
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
