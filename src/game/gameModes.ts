import type { BattleCard, StatKey } from '../types/battleCard';
import { SAMPLE_BATTLE_CARDS } from '../data/sampleCards';

export interface ChaosModifier {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  applyModifier: (stat: StatKey, rawScore: number, card: BattleCard) => number;
}

export const CHAOS_MODIFIERS: ChaosModifier[] = [
  {
    id: 'friday-deploy',
    name: 'Friday Deploy',
    tagline: 'High Risk, Double Consistency',
    description: 'Consistency stat counts 1.5x in all Consistency rounds.',
    icon: '🔥',
    applyModifier: (stat, rawScore) => {
      return stat === 'consistency' ? Math.round(rawScore * 1.5) : rawScore;
    },
  },
  {
    id: 'hackathon-mode',
    name: '48-Hour Hackathon',
    tagline: 'Rapid Innovation Surge',
    description: 'Innovation stat counts 1.5x in all Innovation rounds.',
    icon: '⚡',
    applyModifier: (stat, rawScore) => {
      return stat === 'innovation' ? Math.round(rawScore * 1.5) : rawScore;
    },
  },
  {
    id: 'tabs-vs-spaces',
    name: 'Tabs vs Spaces Dispute',
    tagline: 'Syntax Inversion',
    description: 'Frontend and Backend stats swap places during calculations!',
    icon: '↔️',
    applyModifier: (stat, rawScore, card) => {
      if (stat === 'backend') return card.stats.frontend;
      if (stat === 'frontend') return card.stats.backend;
      return rawScore;
    },
  },
  {
    id: 'clean-architecture',
    name: 'Clean Code Crusade',
    tagline: 'Discipline Pays Off',
    description: 'All cards receive +4 points across all categories.',
    icon: '🧹',
    applyModifier: (_stat, rawScore) => rawScore + 4,
  },
];

/**
 * Gets the active Chaos Modifier deterministically from a match seed
 */
export function getMatchChaosModifier(seed: string): ChaosModifier {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % CHAOS_MODIFIERS.length;
  return CHAOS_MODIFIERS[index];
}

export interface DailyBoss {
  id: string;
  name: string;
  title: string;
  description: string;
  avatarUrl: string;
  deck: BattleCard[];
  rewardCommits: number;
}

export function getTodayBoss(): DailyBoss {
  // 3 Rotating Bosses based on day of month
  const day = new Date().getDate();
  const bossIndex = day % 3;

  if (bossIndex === 0) {
    return {
      id: 'boss-linux',
      name: 'The Monolithic Kernel',
      title: 'Linux Maintainer Syndicate',
      description: 'Massive backend and open source reach. High endurance, immune to cheap debuffs.',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1024025?v=4',
      deck: [
        SAMPLE_BATTLE_CARDS[0], // Torvalds (95)
        SAMPLE_BATTLE_CARDS[4], // Antirez (86)
        SAMPLE_BATTLE_CARDS[6], // Rust (78)
        SAMPLE_BATTLE_CARDS[3], // Mitchellh (87)
        SAMPLE_BATTLE_CARDS[7], // Builder (65)
      ],
      rewardCommits: 150,
    };
  } else if (bossIndex === 1) {
    return {
      id: 'boss-react',
      name: 'Virtual DOM Titan',
      title: 'React Core Architecture',
      description: 'Supreme frontend velocity, state reconciliation, and UI craftsmanship.',
      avatarUrl: 'https://avatars.githubusercontent.com/u/810438?v=4',
      deck: [
        SAMPLE_BATTLE_CARDS[1], // Gaearon (92)
        SAMPLE_BATTLE_CARDS[2], // Shadcn (90)
        SAMPLE_BATTLE_CARDS[5], // Next.js (88)
        SAMPLE_BATTLE_CARDS[6], // Rust (78)
        SAMPLE_BATTLE_CARDS[7], // Builder (65)
      ],
      rewardCommits: 150,
    };
  } else {
    return {
      id: 'boss-infra',
      name: 'Cloud Infrastructure Hydra',
      title: 'Distributed Systems Core',
      description: 'Master of scale, DevOps pipelines, containerization, and backend resilience.',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1299?v=4',
      deck: [
        SAMPLE_BATTLE_CARDS[3], // Mitchellh (87)
        SAMPLE_BATTLE_CARDS[4], // Antirez (86)
        SAMPLE_BATTLE_CARDS[0], // Torvalds (95)
        SAMPLE_BATTLE_CARDS[6], // Rust (78)
        SAMPLE_BATTLE_CARDS[7], // Builder (65)
      ],
      rewardCommits: 150,
    };
  }
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  rewardCommits: number;
  completed: boolean;
}

export function getDailyChallenges(): DailyChallenge[] {
  return [
    {
      id: 'ch-battle-play',
      title: 'Code Warrior',
      description: 'Play 1 match in Arena or Ghost Battle',
      rewardCommits: 35,
      completed: true,
    },
    {
      id: 'ch-power-up',
      title: 'Tactical Deployment',
      description: 'Use a Power-Up during any battle round',
      rewardCommits: 40,
      completed: false,
    },
    {
      id: 'ch-boss-fight',
      title: 'Boss Challenger',
      description: 'Face the Daily Open-Source Boss in battle',
      rewardCommits: 50,
      completed: false,
    },
  ];
}
