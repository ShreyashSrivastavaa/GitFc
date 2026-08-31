import type { 
  GitHubRawStats, 
  EAFCAttributes, 
  CardRarity, 
  DevArchetype, 
  DevBadge, 
  GitFCDevCard, 
  PositionMeta 
} from '../types';

/**
 * 8 Core Football Attributes derived from playful interpretation of GitHub activity
 * ATTACK (ATT): Contribution volume / total output
 * PASSING (PAS): Collaboration / PRs to other repos
 * DEFENDING (DEF): Issue resolution, bug fixing, maintenance
 * PACE (PAC): Recent activity velocity & commit streak
 * DRIBBLING (DRI): Technical flexibility & language diversity
 * SHOOTING (SHO): Project completion signals & public repos
 * VISION (VIS): Breadth of tech stack & ecosystem footprint
 * STAMINA (STA): Long-term consistency & tenure
 */
export function calculateFootballAttributes(stats: GitHubRawStats): EAFCAttributes {
  // ATTACK: Commits + output volume (scaled 40-99)
  const att = Math.min(99, Math.max(45, Math.round((stats.commits / 1400) * 44 + 52)));

  // PASSING: PRs merged & team collaboration (scaled 40-99)
  const pas = Math.min(99, Math.max(42, Math.round((stats.prsMerged / 60) * 45 + 50)));

  // DEFENDING: Issue fixing & repository maintenance
  const def = Math.min(99, Math.max(40, Math.round((stats.issuesClosed / 80) * 45 + 48)));

  // PACE: Active streak & current momentum
  const pac = Math.min(99, Math.max(46, Math.round((stats.streakDays / 250) * 45 + 50)));

  // DRIBBLING: Language diversity & star dexterity
  const dri = Math.min(99, Math.max(48, Math.round((stats.languages.length / 8) * 30 + (stats.stars / 300) * 18 + 48)));

  // SHOOTING: Project completions & merged deliverables
  const sho = Math.min(99, Math.max(44, Math.round((stats.publicRepos / 40) * 25 + (stats.prsMerged / 50) * 25 + 48)));

  // VISION: Ecosystem footprint, stars & forks
  const vis = Math.min(99, Math.max(42, Math.round((stats.stars / 400) * 30 + (stats.forks / 150) * 20 + 48)));

  // STAMINA: Follower gravity & sustained activity
  const sta = Math.min(99, Math.max(45, Math.round((stats.followers / 500) * 32 + (stats.commits / 2000) * 20 + 48)));

  // OVERALL RATING (OVR): Transparent weighted composite (always clean integer like "92 OVR", no decimals)
  const weighted = (att * 0.18) + (pas * 0.16) + (dri * 0.14) + (sho * 0.14) + (vis * 0.12) + (pac * 0.10) + (def * 0.08) + (sta * 0.08);
  const overall = Math.min(99, Math.max(48, Math.round(weighted)));

  return { att, pas, def, pac, dri, sho, vis, sta, overall, phy: sta, skl: dri };
}

/**
 * 10 Player Positions mapped logically to developer behavior
 */
export function determinePosition(stats: GitHubRawStats, attrs: EAFCAttributes): PositionMeta {
  // Backend / infra / security / DevOps
  if (stats.languages.some(l => ['Go', 'Rust', 'Docker', 'Shell', 'C', 'C++'].includes(l)) && (attrs.def >= 75 || attrs.sta >= 80)) {
    if (attrs.def > attrs.att) {
      return {
        code: 'GK',
        name: 'Infrastructure Guardian',
        category: 'GK',
        description: 'Uptime defender, DevOps master, keeping pipelines running flawlessly 24/7.',
        badge: '🧤',
        glowColor: '#06b6d4',
      };
    }
    return {
      code: 'CDM',
      name: 'System Anchor',
      category: 'DEF',
      description: 'The defensive midfield shield, orchestrating backend services and data pipelines.',
      badge: '🛡️',
      glowColor: '#3b82f6',
    };
  }

  // Pure High-output Solo Striker
  if (attrs.att >= 82 && attrs.sho >= 80) {
    return {
      code: 'ST',
      name: 'Solo Striker',
      category: 'ATT',
      description: 'Lethal contributor who ships fast and racks up massive commit counts.',
      badge: '⚡',
      glowColor: '#f59e0b',
    };
  }

  // Broad & Balanced Creative Playmaker
  if (attrs.vis >= 78 && attrs.pas >= 78) {
    return {
      code: 'CAM',
      name: 'Master Playmaker',
      category: 'MID',
      description: 'Visionary architect connecting repositories and driving collaborative open source.',
      badge: '🎯',
      glowColor: '#a855f7',
    };
  }

  // Dynamic Wingers (Fast Feature Velocity)
  if (attrs.pac >= 80) {
    return {
      code: 'LW',
      name: 'Velocity Winger',
      category: 'ATT',
      description: 'Rapid sprint specialist breaking through PR queues with blazing speed.',
      badge: '🚀',
      glowColor: '#ec4899',
    };
  }

  if (attrs.dri >= 80) {
    return {
      code: 'RW',
      name: 'Polyglot Winger',
      category: 'ATT',
      description: 'Agile frontend and cross-language maestro cutting into complex codebases.',
      badge: '✨',
      glowColor: '#10b981',
    };
  }

  // High Collaboration & Engine
  if (attrs.pas >= 75) {
    return {
      code: 'CM',
      name: 'Box-to-Box Midfielder',
      category: 'MID',
      description: 'The tireless engine powering team PRs, code reviews, and community discussions.',
      badge: '⚙️',
      glowColor: '#6366f1',
    };
  }

  // Maintainer / Defender
  if (attrs.def >= 72 || stats.issuesClosed > 40) {
    return {
      code: 'CB',
      name: 'Repo Guardian',
      category: 'DEF',
      description: 'Unflinching code reviewer, triage master, and bug stomper.',
      badge: '🧱',
      glowColor: '#64748b',
    };
  }

  // Agile Flanks
  if (stats.publicRepos > 20) {
    return {
      code: 'LB',
      name: 'Fullstack Flank',
      category: 'DEF',
      description: 'Versatile builder covering entire project stacks from database to UI.',
      badge: '🔄',
      glowColor: '#14b8a6',
    };
  }

  // Default Central Midfielder
  return {
    code: 'CM',
    name: 'Core Developer',
    category: 'MID',
    description: 'Steady all-round playmaker driving day-to-day repository engineering.',
    badge: '⚽',
    glowColor: '#3b82f6',
  };
}

/**
 * Developer Archetype based on signature habits
 */
export function determineArchetype(stats: GitHubRawStats, attrs: EAFCAttributes): { archetype: DevArchetype; description: string } {
  if (stats.commits > 2500 || attrs.att >= 92) {
    return { archetype: 'Open Source Machine', description: 'Non-stop commit engine delivering relentless codebase volume.' };
  }
  if (stats.languages.length >= 6 || attrs.dri >= 88) {
    return { archetype: 'Polyglot Prodigy', description: 'Fluent across multiple language ecosystems and paradigms.' };
  }
  if (stats.stars > 1000 || attrs.vis >= 90) {
    return { archetype: 'Master Playmaker', description: 'Creator of high-impact repos loved by the community.' };
  }
  if (stats.streakDays > 120 || attrs.pac >= 88) {
    return { archetype: 'Night Coder', description: 'Disciplined streak runner pushing green squares every single day.' };
  }
  if (attrs.def >= 82 || stats.issuesClosed > 60) {
    return { archetype: 'Repository Guardian', description: 'Keeping codebases clean, stable, and battle-ready.' };
  }
  if (stats.languages.some(l => ['Go', 'Rust', 'C++', 'Docker', 'Kubernetes'].includes(l))) {
    return { archetype: 'DevOps Titan', description: 'Rock-solid backend, cloud infra, and deployment architecture.' };
  }
  if (stats.publicRepos > 25 && attrs.sho >= 80) {
    return { archetype: 'Solo Striker', description: 'Prolific builder who conceptualizes and ships entire projects independently.' };
  }
  if (attrs.overall >= 80) {
    return { archetype: 'Fullstack Maestro', description: 'Harmonious blend of architectural vision and execution speed.' };
  }
  return { archetype: 'Rising Prospect', description: 'Emerging talent steadily leveling up their open source career.' };
}

/**
 * 5 Rarity Tiers based on genuine percentile distribution
 * Common (Bronze) -> Rare (Silver) -> Epic (Gold) -> Legendary (Amethyst) -> Elite (TOTY Neon)
 */
export function determineRarity(overall: number, stats: GitHubRawStats): { rarity: CardRarity; title: string } {
  if (overall >= 92 || stats.stars >= 3000 || (stats.commits >= 4000 && stats.followers >= 500)) {
    return { rarity: 'elite', title: 'ELITE TOTY' };
  }
  if (overall >= 86 || stats.stars >= 800 || stats.commits >= 2000) {
    return { rarity: 'legendary', title: 'LEGENDARY ICON' };
  }
  if (overall >= 78 || stats.stars >= 200 || stats.commits >= 800) {
    return { rarity: 'epic', title: 'EPIC GOLD' };
  }
  if (overall >= 68 || stats.commits >= 300 || stats.publicRepos >= 8) {
    return { rarity: 'rare', title: 'RARE SILVER' };
  }
  return { rarity: 'common', title: 'COMMON BRONZE' };
}

export function generateDevBadges(stats: GitHubRawStats): DevBadge[] {
  const badges: DevBadge[] = [];

  if (stats.stars >= 500) {
    badges.push({ id: 'star-lord', name: 'Star Titan', icon: '⭐', description: 'Over 500 GitHub stars accumulated' });
  }
  if (stats.commits >= 1000) {
    badges.push({ id: 'commit-machine', name: 'Commit Machine', icon: '⚡', description: 'Over 1,000 commits logged' });
  }
  if (stats.followers >= 250) {
    badges.push({ id: 'influencer', name: 'Dev Icon', icon: '👑', description: 'Over 250 followers on GitHub' });
  }
  if (stats.languages.length >= 5) {
    badges.push({ id: 'polyglot', name: 'Polyglot', icon: '🌍', description: 'Fluent in 5+ programming languages' });
  }
  if (stats.streakDays >= 90) {
    badges.push({ id: 'streaker', name: 'Unstoppable', icon: '🔥', description: '90+ day contribution streak' });
  }
  if (stats.prsMerged >= 40) {
    badges.push({ id: 'pr-champion', name: 'PR Champion', icon: '🤝', description: '40+ pull requests merged' });
  }
  if (badges.length === 0) {
    badges.push({ id: 'rising-star', name: 'Rising Star', icon: '🚀', description: 'Building the future of open source' });
  }

  return badges;
}

export function deriveStrengthsAndWeaknesses(attrs: EAFCAttributes): { strengths: string[]; weaknesses: string[]; playstyle: string } {
  const attrList = [
    { name: 'Attack Output', val: attrs.att },
    { name: 'Collaboration & PRs', val: attrs.pas },
    { name: 'Bug Fixing & Defense', val: attrs.def },
    { name: 'Sprint Pace & Streak', val: attrs.pac },
    { name: 'Language Versatility', val: attrs.dri },
    { name: 'Project Completion', val: attrs.sho },
    { name: 'Architectural Vision', val: attrs.vis },
    { name: 'Long-Term Stamina', val: attrs.sta },
  ].sort((a, b) => b.val - a.val);

  const strengths = attrList.slice(0, 2).map(a => `${a.name} (${a.val})`);
  const weaknesses = attrList.slice(-2).map(a => `${a.name} (${a.val})`);

  let playstyle = 'High-tempo direct engineering with an emphasis on rapid delivery.';
  if (attrs.vis >= 80 && attrs.pas >= 80) {
    playstyle = 'Tiki-taka open source: high collaboration, frequent PRs, and architectural cohesion.';
  } else if (attrs.def >= 80) {
    playstyle = 'Rock-solid defense: impeccable code quality, ruthless bug hunting, and stable infrastructure.';
  } else if (attrs.pac >= 85) {
    playstyle = 'Counter-attacking speed: explosive sprints, fast shipping, and relentless daily momentum.';
  }

  return { strengths, weaknesses, playstyle };
}

export function buildGitFCCard(stats: GitHubRawStats): GitFCDevCard {
  const attributes = calculateFootballAttributes(stats);
  const posMeta = determinePosition(stats, attributes);
  const { archetype, description: archetypeDescription } = determineArchetype(stats, attributes);
  const { rarity, title: rarityTitle } = determineRarity(attributes.overall, stats);
  const badges = generateDevBadges(stats);
  const { strengths, weaknesses, playstyle } = deriveStrengthsAndWeaknesses(attributes);

  const powerScore = Math.round(
    (stats.stars * 15) +
    (stats.followers * 12) +
    (stats.commits * 2) +
    (stats.prsMerged * 20) +
    (stats.forks * 10) +
    (attributes.overall * 40)
  );

  const clubName = stats.company ? stats.company.replace(/^@/, '').toUpperCase() : 'OPEN SOURCE FC';

  return {
    id: stats.username.toLowerCase(),
    username: stats.username,
    name: stats.name || stats.username,
    avatarUrl: stats.avatarUrl,
    bio: stats.bio || 'Open Source Contributor & Developer',
    location: stats.location || 'Global Developer',
    clubName,
    countryFlag: '🌐',
    
    rarity,
    rarityTitle,
    position: posMeta.code,
    positionCategory: posMeta.category,
    positionTitle: posMeta.name,
    archetype,
    archetypeDescription,
    
    attributes,
    // Backward compatibility aliases
    ratings: attributes,
    footballPosition: posMeta.code,
    footballPositionTitle: posMeta.name,
    footballPositionBadge: posMeta.badge,
    
    powerScore,
    stats,
    badges,
    
    strengths,
    weaknesses,
    playstyle,
    
    createdAt: new Date().toISOString().split('T')[0],
  };
}

// Backward compatibility helper
export const buildEAFCCard = buildGitFCCard;
export const calculateEAFCRatings = calculateFootballAttributes;

