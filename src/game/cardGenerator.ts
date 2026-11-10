import type { GitHubRawMetrics, GitHubSnapshot } from '../types/github';
import type { BattleCard, CardRarity, StatBlock, StatDerivation } from '../types/battleCard';

export const CURRENT_RULESET_VERSION = '1.0.0';

/**
 * Normalizes any number to integer in range [minVal, maxVal]
 */
function clamp(val: number, minVal: number, maxVal: number): number {
  return Math.min(maxVal, Math.max(minVal, Math.round(val)));
}

/**
 * Computes the 7 pure battle stats from normalized GitHub raw metrics
 */
export function computeStatBlock(metrics: GitHubRawMetrics): {
  stats: StatBlock;
  derivation: StatDerivation;
} {
  // Anti-gaming guards:
  // 1. Discount accounts younger than 30 days
  const accountAgeDays = Math.max(1, Math.round((Date.now() - new Date(metrics.createdAt).getTime()) / 86400000));
  const agePenaltyMultiplier = accountAgeDays < 30 ? 0.7 : 1.0;

  // 2. Cap per-repo star contribution to prevent single-viral-repo distortion
  const cappedStars = Math.min(250000, metrics.starsReceived);

  // 1. BACKEND (0-99): Server languages (Go, Rust, Python, Java, C#, C++, PHP, Node.js)
  const backendRaw = Math.log10(metrics.backendBytes + 1) * 9.5 + metrics.backendRepoCount * 3.5;
  const backend = clamp(backendRaw * agePenaltyMultiplier, 25, 99);

  // 2. FRONTEND (0-99): Web technologies (TypeScript, JavaScript, CSS, HTML, Vue, Svelte)
  const frontendRaw = Math.log10(metrics.frontendBytes + 1) * 9.5 + metrics.frontendRepoCount * 3.5;
  const frontend = clamp(frontendRaw * agePenaltyMultiplier, 25, 99);

  // 3. OPEN SOURCE (0-99): Stars, forks, external PRs merged
  const openSourceRaw =
    Math.log10(cappedStars + 1) * 14 +
    Math.log10(metrics.forksCount + 1) * 8 +
    Math.min(15, metrics.externalPRsMerged * 1.5);
  const openSource = clamp(openSourceRaw, 20, 99);

  // 4. INNOVATION (0-99): Language diversity & original non-fork repos
  const innovationRaw =
    metrics.distinctLanguagesCount * 5.5 +
    metrics.originalRepoCount * 1.8 +
    Math.min(15, metrics.distinctTopicsCount * 1.2);
  const innovation = clamp(innovationRaw, 25, 99);

  // 5. CONSISTENCY (0-99): Active weeks & streaks
  const consistencyRaw =
    (metrics.activeWeeksPastYear / 52) * 55 +
    Math.min(44, metrics.longestStreakDays * 0.8);
  const consistency = clamp(consistencyRaw, 30, 99);

  // 6. POPULARITY (0-99): Community gravity
  const popularityRaw =
    Math.log10(metrics.followers + 1) * 18 +
    Math.log10(cappedStars + 1) * 10;
  const popularity = clamp(popularityRaw, 20, 99);

  // 7. LANGUAGE MASTERY (0-99): Depth in top dominant language
  const languageMasteryRaw =
    Math.log10(metrics.topLanguageBytes + 1) * 11 +
    (metrics.topLanguageRepoShare || 0.4) * 20;
  const languageMastery = clamp(languageMasteryRaw, 30, 99);

  // OVERALL RATING BLEND (Weighted formula)
  const overall = clamp(
    backend * 0.16 +
      frontend * 0.16 +
      openSource * 0.18 +
      innovation * 0.14 +
      consistency * 0.14 +
      popularity * 0.12 +
      languageMastery * 0.1,
    30,
    99
  );

  const stats: StatBlock = {
    backend,
    frontend,
    openSource,
    innovation,
    consistency,
    popularity,
    languageMastery,
    overall,
  };

  const derivation: StatDerivation = {
    backend: {
      value: backend,
      formulaDescription: 'Derived from backend code volume and backend-specialized repositories.',
      primaryFactors: [
        `${(metrics.backendBytes / 1024 / 1024).toFixed(1)} MB code`,
        `${metrics.backendRepoCount} backend repos`,
      ],
    },
    frontend: {
      value: frontend,
      formulaDescription: 'Derived from web framework bytes, UI components, and client repos.',
      primaryFactors: [
        `${(metrics.frontendBytes / 1024 / 1024).toFixed(1)} MB code`,
        `${metrics.frontendRepoCount} frontend repos`,
      ],
    },
    openSource: {
      value: openSource,
      formulaDescription: 'Logarithmic reach across stars, forks, and merged external contributions.',
      primaryFactors: [
        `${metrics.starsReceived} stars`,
        `${metrics.forksCount} forks`,
        `${metrics.externalPRsMerged} merged external PRs`,
      ],
    },
    innovation: {
      value: innovation,
      formulaDescription: 'Evaluates polyglot breadth, original non-fork repos, and topic diversity.',
      primaryFactors: [
        `${metrics.distinctLanguagesCount} languages`,
        `${metrics.originalRepoCount} original repos`,
      ],
    },
    consistency: {
      value: consistency,
      formulaDescription: 'Contribution cadence and regular commit activity across the past 52 weeks.',
      primaryFactors: [
        `${metrics.activeWeeksPastYear}/52 active weeks`,
        `${metrics.longestStreakDays} day streak`,
      ],
    },
    popularity: {
      value: popularity,
      formulaDescription: 'Community interest and social developer gravity.',
      primaryFactors: [
        `${metrics.followers} followers`,
        `${metrics.starsReceived} total stars`,
      ],
    },
    languageMastery: {
      value: languageMastery,
      formulaDescription: 'Specialization and volume in dominant programming language.',
      primaryFactors: [
        `${metrics.topLanguageName || 'Dominant'} (${(metrics.topLanguageBytes / 1024 / 1024).toFixed(1)} MB)`,
      ],
    },
  };

  return { stats, derivation };
}

/**
 * Derives card rarity deterministically from overall rating
 */
export function determineRarity(overall: number): CardRarity {
  if (overall >= 95) return 'mythic';
  if (overall >= 89) return 'legendary';
  if (overall >= 80) return 'epic';
  if (overall >= 70) return 'rare';
  return 'common';
}

/**
 * Builds developer battle card from snapshot
 */
export function generateDeveloperCard(snapshot: GitHubSnapshot): BattleCard {
  const { stats, derivation } = computeStatBlock(snapshot.rawMetrics);
  const rarity = determineRarity(stats.overall);

  // Determine Primary Archetype
  let primaryArchetype = 'Generalist Engineer';
  if (stats.backend >= stats.frontend + 15 && stats.backend >= 80) {
    primaryArchetype = 'Backend Architect';
  } else if (stats.frontend >= stats.backend + 15 && stats.frontend >= 80) {
    primaryArchetype = 'Frontend Prodigy';
  } else if (stats.openSource >= 85) {
    primaryArchetype = 'Open Source Pillar';
  } else if (stats.innovation >= 85) {
    primaryArchetype = 'Polyglot Innovator';
  } else if (stats.consistency >= 85) {
    primaryArchetype = 'Relentless Shipper';
  }

  // Deterministic ability assignment based on archetype and rarity
  const abilities = [];
  if (rarity === 'rare' || rarity === 'epic' || rarity === 'legendary' || rarity === 'mythic') {
    if (primaryArchetype.includes('Backend')) {
      abilities.push({
        id: `ab-backend-spec-${snapshot.username}`,
        name: 'Server Lockdown',
        description: '+8 to Backend in Backend category',
        trigger: 'CATEGORY_MATCH' as const,
        effectType: 'EXTRA_CATEGORY_BOOST' as const,
        targetStat: 'backend' as const,
        modifierValue: 8,
        icon: '🖥️',
      });
    } else if (primaryArchetype.includes('Frontend')) {
      abilities.push({
        id: `ab-frontend-spec-${snapshot.username}`,
        name: 'Hydration Burst',
        description: '+8 to Frontend in Frontend category',
        trigger: 'CATEGORY_MATCH' as const,
        effectType: 'EXTRA_CATEGORY_BOOST' as const,
        targetStat: 'frontend' as const,
        modifierValue: 8,
        icon: '⚡',
      });
    } else {
      abilities.push({
        id: `ab-open-source-${snapshot.username}`,
        name: 'Community Surge',
        description: '+7 to Open Source in Round 3+',
        trigger: 'ROUND_3_OR_LATER' as const,
        effectType: 'BOOST_SELF_STAT' as const,
        targetStat: 'openSource' as const,
        modifierValue: 7,
        icon: '🌐',
      });
    }
  }

  if (rarity === 'legendary' || rarity === 'mythic') {
    abilities.push({
      id: `ab-underdog-shield-${snapshot.username}`,
      name: 'Resilience Shield',
      description: 'Ignores opponent ability debuffs this round',
      trigger: 'ALWAYS' as const,
      effectType: 'SHIELD_IMMUNITY' as const,
      modifierValue: 0,
      icon: '🛡️',
    });
  }

  return {
    id: `dev-${snapshot.username.toLowerCase()}`,
    type: 'developer',
    ownerId: snapshot.userId,
    name: snapshot.name || snapshot.username,
    subtitle: `@${snapshot.username}`,
    avatarUrl: snapshot.avatarUrl,
    rarity,
    stats,
    primaryArchetype,
    abilities,
    derivation,
    rulesetVersion: CURRENT_RULESET_VERSION,
    createdAt: new Date().toISOString().split('T')[0],
    sourceUrl: `https://github.com/${snapshot.username}`,
  };
}

const BACKEND_LANGS = ['Go', 'Rust', 'Python', 'Java', 'C#', 'C', 'C++', 'PHP', 'Ruby', 'Kotlin', 'Scala', 'Elixir', 'Shell', 'Dockerfile'];
const FRONTEND_LANGS = ['TypeScript', 'JavaScript', 'HTML', 'CSS', 'Vue', 'Svelte', 'Astro', 'SCSS', 'Swift', 'Dart'];

/**
 * Generates a Repository Card derived from user's public repository metrics
 */
export function generateRepoCard(repo: {
  name: string;
  fullName?: string;
  description?: string | null;
  stars: number;
  forks: number;
  primaryLanguage?: string | null;
  sizeBytes?: number;
  url?: string;
}, ownerUsername: string): BattleCard {
  const lang = repo.primaryLanguage || 'TypeScript';
  const isBackend = BACKEND_LANGS.includes(lang);
  const isFrontend = FRONTEND_LANGS.includes(lang);

  const starPower = Math.min(99, Math.max(30, Math.round(Math.log10(repo.stars + 1) * 22 + 35)));
  const forkPower = Math.min(99, Math.max(25, Math.round(Math.log10(repo.forks + 1) * 18 + 30)));
  const sizePower = Math.min(99, Math.max(35, Math.round(Math.log10((repo.sizeBytes || 50000) + 1) * 12 + 20)));

  const backend = isBackend ? Math.min(98, starPower + 10) : Math.max(30, starPower - 15);
  const frontend = isFrontend ? Math.min(98, starPower + 10) : Math.max(30, starPower - 15);
  const openSource = Math.min(99, Math.max(30, Math.round((starPower * 0.7) + (forkPower * 0.3))));
  const innovation = Math.min(99, Math.max(35, Math.round((starPower * 0.5) + (sizePower * 0.5))));
  const consistency = Math.min(95, Math.max(40, Math.round((starPower * 0.4) + 45)));
  const popularity = Math.min(99, Math.max(25, starPower));
  const languageMastery = Math.min(98, Math.max(40, sizePower + 15));

  const overall = clamp(
    backend * 0.16 +
      frontend * 0.16 +
      openSource * 0.18 +
      innovation * 0.14 +
      consistency * 0.14 +
      popularity * 0.12 +
      languageMastery * 0.1,
    35,
    98
  );

  const rarity = determineRarity(overall);
  const primaryArchetype = isBackend ? 'Backend Repository' : isFrontend ? 'Frontend Framework' : 'Open Source Weapon';

  const abilities = [];
  if (rarity === 'rare' || rarity === 'epic' || rarity === 'legendary' || rarity === 'mythic') {
    abilities.push({
      id: `ab-repo-${repo.name.toLowerCase()}`,
      name: `${lang} Engine`,
      description: `+6 to ${isBackend ? 'Backend' : 'Frontend'} in ${isBackend ? 'Backend' : 'Frontend'} round`,
      trigger: 'CATEGORY_MATCH' as const,
      effectType: 'EXTRA_CATEGORY_BOOST' as const,
      targetStat: (isBackend ? 'backend' : 'frontend') as any,
      modifierValue: 6,
      icon: '📦',
    });
  }

  const stats: StatBlock = {
    backend,
    frontend,
    openSource,
    innovation,
    consistency,
    popularity,
    languageMastery,
    overall,
  };

  return {
    id: `repo-${ownerUsername.toLowerCase()}-${repo.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    type: 'repository',
    name: repo.name,
    subtitle: repo.fullName || `${ownerUsername}/${repo.name}`,
    rarity,
    stats,
    primaryArchetype,
    abilities,
    rulesetVersion: CURRENT_RULESET_VERSION,
    createdAt: new Date().toISOString().split('T')[0],
    sourceUrl: repo.url || `https://github.com/${ownerUsername}/${repo.name}`,
  };
}

/**
 * Generates a Language Card derived from depth in a programming language
 */
export function generateLanguageCard(lang: {
  language: string;
  bytes: number;
  repoCount?: number;
  percentage?: number;
}, ownerUsername: string): BattleCard {
  const isBackend = BACKEND_LANGS.includes(lang.language);
  const isFrontend = FRONTEND_LANGS.includes(lang.language);
  const depthScore = Math.min(98, Math.max(45, Math.round(Math.log10(lang.bytes + 1) * 11 + 25)));

  const backend = isBackend ? depthScore : Math.max(30, depthScore - 20);
  const frontend = isFrontend ? depthScore : Math.max(30, depthScore - 20);
  const openSource = Math.min(95, depthScore - 5);
  const innovation = Math.min(96, Math.max(40, depthScore));
  const consistency = Math.min(95, Math.max(45, depthScore - 2));
  const popularity = Math.min(94, depthScore - 8);
  const languageMastery = Math.min(99, Math.max(50, depthScore + 8));

  const overall = clamp(
    backend * 0.14 +
      frontend * 0.14 +
      openSource * 0.14 +
      innovation * 0.14 +
      consistency * 0.14 +
      popularity * 0.1 +
      languageMastery * 0.2,
    40,
    98
  );

  const rarity = determineRarity(overall);

  const abilities = [
    {
      id: `ab-lang-${lang.language.toLowerCase()}`,
      name: `${lang.language} Specialization`,
      description: `+7 Language Depth when category is Language Mastery`,
      trigger: 'CATEGORY_MATCH' as const,
      effectType: 'EXTRA_CATEGORY_BOOST' as const,
      targetStat: 'languageMastery' as const,
      modifierValue: 7,
      icon: '⚡',
    },
  ];

  const stats: StatBlock = {
    backend,
    frontend,
    openSource,
    innovation,
    consistency,
    popularity,
    languageMastery,
    overall,
  };

  return {
    id: `lang-${ownerUsername.toLowerCase()}-${lang.language.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    type: 'language',
    name: `${lang.language} Mastery`,
    subtitle: `Deep Specialization (${((lang.bytes) / 1024 / 1024).toFixed(1)} MB)`,
    rarity,
    stats,
    primaryArchetype: `${lang.language} Specialist`,
    abilities,
    rulesetVersion: CURRENT_RULESET_VERSION,
    createdAt: new Date().toISOString().split('T')[0],
  };
}

/**
 * Generates the user's complete self-contained squad from their own GitHub data:
 * 1 Developer Card + Top Repository Cards + Top Language Cards
 */
export function generateUserFullSquad(snapshot: any): BattleCard[] {
  const cards: BattleCard[] = [];

  // 1. Developer Card
  cards.push(generateDeveloperCard(snapshot));

  // 2. Repository Cards
  const topRepos = snapshot.topRepos || [
    {
      name: `${snapshot.username}-core`,
      fullName: `${snapshot.username}/${snapshot.username}-core`,
      stars: Math.max(12, Math.round((snapshot.rawMetrics.starsReceived || 30) * 0.45)),
      forks: Math.max(4, Math.round((snapshot.rawMetrics.forksCount || 10) * 0.4)),
      primaryLanguage: snapshot.rawMetrics.topLanguageName || 'TypeScript',
      sizeBytes: 1500000,
    },
    {
      name: 'api-service',
      fullName: `${snapshot.username}/api-service`,
      stars: Math.max(8, Math.round((snapshot.rawMetrics.starsReceived || 20) * 0.3)),
      forks: Math.max(2, Math.round((snapshot.rawMetrics.forksCount || 8) * 0.3)),
      primaryLanguage: 'Go',
      sizeBytes: 900000,
    },
    {
      name: 'web-client',
      fullName: `${snapshot.username}/web-client`,
      stars: Math.max(15, Math.round((snapshot.rawMetrics.starsReceived || 25) * 0.35)),
      forks: Math.max(3, Math.round((snapshot.rawMetrics.forksCount || 6) * 0.3)),
      primaryLanguage: 'TypeScript',
      sizeBytes: 1200000,
    },
  ];

  for (const repo of topRepos) {
    cards.push(generateRepoCard(repo, snapshot.username));
  }

  // 3. Language Cards
  const languages = snapshot.languages || [
    {
      language: snapshot.rawMetrics.topLanguageName || 'TypeScript',
      bytes: snapshot.rawMetrics.topLanguageBytes || 2400000,
      percentage: 60,
    },
    {
      language: 'Python',
      bytes: Math.round((snapshot.rawMetrics.topLanguageBytes || 2000000) * 0.5),
      percentage: 25,
    },
  ];

  for (const lang of languages) {
    cards.push(generateLanguageCard(lang, snapshot.username));
  }

  return cards;
}
