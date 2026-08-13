import type { EAFCDevCard, DressingRoomData, ProjectItem, AchievementBadge } from '../types';

export function generateDressingRoomData(card: EAFCDevCard): DressingRoomData {
  const { stats, ratings } = card;

  // Generate Starting XI projects (top 11 repos/projects)
  const defaultProjects: Partial<ProjectItem>[] = [
    { name: `${card.username}/core-engine`, description: 'High performance core execution engine', stars: Math.round(stats.stars * 0.4), forks: Math.round(stats.forks * 0.35), language: stats.languages[0] || 'TypeScript' },
    { name: `${card.username}/ui-component-library`, description: 'Accessible & modern design system components', stars: Math.round(stats.stars * 0.25), forks: Math.round(stats.forks * 0.2), language: stats.languages[1] || 'React' },
    { name: `${card.username}/api-gateway-service`, description: 'Scalable REST & GraphQL API gateway', stars: Math.round(stats.stars * 0.15), forks: Math.round(stats.forks * 0.15), language: stats.languages[2] || 'Go' },
    { name: `${card.username}/ai-agent-toolkit`, description: 'LLM agentic workflows & tooling', stars: Math.round(stats.stars * 0.1), forks: Math.round(stats.forks * 0.1), language: 'Python' },
    { name: `${card.username}/database-migrations`, description: 'Zero-downtime database pipeline utilities', stars: Math.round(stats.stars * 0.05) + 40, forks: 15, language: 'SQL' },
    { name: `${card.username}/auth-identity-provider`, description: 'OAuth2 & OIDC authentication service', stars: 85, forks: 22, language: 'TypeScript' },
    { name: `${card.username}/devops-terraform-modules`, description: 'Production IaC modules for GCP & AWS', stars: 65, forks: 18, language: 'HCL' },
    { name: `${card.username}/cli-tools`, description: 'Developer productivity CLI utilities', stars: 120, forks: 30, language: 'Rust' },
    { name: `${card.username}/testing-suite`, description: 'End-to-end testing & benchmarking suite', stars: 45, forks: 10, language: 'TypeScript' },
    { name: `${card.username}/documentation-site`, description: 'Interactive project docs & guides', stars: 90, forks: 25, language: 'MDX' },
    { name: `${card.username}/mobile-app-client`, description: 'Cross-platform mobile application', stars: 110, forks: 28, language: 'Flutter' },
  ];

  const startingXI: ProjectItem[] = defaultProjects.map((proj, idx) => {
    const projStars = proj.stars || 50;
    const projRating = Math.min(99, Math.max(70, Math.round(ratings.overall - (idx * 1.5) + (projStars > 100 ? 4 : 0))));
    return {
      id: `proj-${idx + 1}`,
      name: proj.name || `project-${idx + 1}`,
      description: proj.description || 'Open source project repository',
      stars: projStars,
      forks: proj.forks || 10,
      language: proj.language || 'TypeScript',
      rating: projRating,
      isPinned: idx < 3,
      position: idx + 1,
      url: `https://github.com/${proj.name}`,
    };
  });

  const bench: ProjectItem[] = [
    {
      id: 'proj-12',
      name: `${card.username}/experimental-lab`,
      description: 'Prototypes, research & micro-benchmarks',
      stars: 35,
      forks: 8,
      language: 'Python',
      rating: 74,
      isPinned: false,
      position: 12,
      url: `https://github.com/${card.username}/experimental-lab`,
    },
    {
      id: 'proj-13',
      name: `${card.username}/dotfiles`,
      description: 'Personal shell & editor configurations',
      stars: 62,
      forks: 14,
      language: 'Shell',
      rating: 72,
      isPinned: false,
      position: 13,
      url: `https://github.com/${card.username}/dotfiles`,
    },
  ];

  // Calculate squad stats
  const totalStars = startingXI.reduce((acc, p) => acc + p.stars, 0);
  const teamValue = Math.round(card.powerScore * 1.15 + totalStars * 5);
  const chemistryBase = Math.min(100, Math.round(75 + (stats.languages.length * 4) + (stats.commits > 500 ? 10 : 0)));
  const avgRating = Math.round(startingXI.reduce((acc, p) => acc + p.rating, 0) / startingXI.length);

  // Calculate achievements
  const achievements: AchievementBadge[] = [
    {
      id: 'badge-commits',
      name: '10,000+ Commits Club',
      icon: '🔥',
      requirement: 'Reach 1,000+ total contributions',
      unlocked: stats.commits >= 800,
      unlockedDate: '2024-03-15',
      progressPercent: Math.min(100, Math.round((stats.commits / 1000) * 100)),
    },
    {
      id: 'badge-polyglot',
      name: 'Polyglot Developer',
      icon: '🌐',
      requirement: 'Master 5+ programming languages',
      unlocked: stats.languages.length >= 5,
      unlockedDate: '2024-05-10',
      progressPercent: Math.min(100, Math.round((stats.languages.length / 5) * 100)),
    },
    {
      id: 'badge-stars',
      name: 'Open Source Legend',
      icon: '⭐',
      requirement: 'Earn 100+ GitHub Stars across repos',
      unlocked: stats.stars >= 100,
      unlockedDate: '2024-06-01',
      progressPercent: Math.min(100, Math.round((stats.stars / 100) * 100)),
    },
    {
      id: 'badge-prs',
      name: 'Collaboration King',
      icon: '🤝',
      requirement: 'Merge 30+ Pull Requests',
      unlocked: stats.prsMerged >= 30,
      unlockedDate: '2024-07-20',
      progressPercent: Math.min(100, Math.round((stats.prsMerged / 30) * 100)),
    },
    {
      id: 'badge-nightowl',
      name: 'Night Owl Developer',
      icon: '🦉',
      requirement: 'Maintain a 30+ day coding streak',
      unlocked: stats.streakDays >= 30,
      unlockedDate: '2024-08-01',
      progressPercent: Math.min(100, Math.round((stats.streakDays / 30) * 100)),
    },
    {
      id: 'badge-guardian',
      name: 'Security & Bug Guardian',
      icon: '🛡️',
      requirement: 'Close 25+ Issues & Vulnerabilities',
      unlocked: stats.issuesClosed >= 25,
      unlockedDate: '2024-08-10',
      progressPercent: Math.min(100, Math.round((stats.issuesClosed / 25) * 100)),
    },
  ];

  return {
    startingXI,
    bench,
    teamValue,
    teamChemistry: chemistryBase,
    squadDepth: stats.publicRepos || 15,
    avgRating,
    achievements,
  };
}
