import { z } from 'zod';

export const GitHubRawMetricsSchema = z.object({
  username: z.string(),
  name: z.string().nullable().optional(),
  avatarUrl: z.string().url(),
  bio: z.string().nullable().optional(),
  followers: z.number().int().nonnegative(),
  following: z.number().int().nonnegative(),
  createdAt: z.string(),
  starsReceived: z.number().int().nonnegative(),
  forksCount: z.number().int().nonnegative(),
  externalPRsMerged: z.number().int().nonnegative(),
  commitsPastYear: z.number().int().nonnegative(),
  activeWeeksPastYear: z.number().int().min(0).max(52),
  longestStreakDays: z.number().int().nonnegative(),
  originalRepoCount: z.number().int().nonnegative(),
  distinctLanguagesCount: z.number().int().nonnegative(),
  distinctTopicsCount: z.number().int().nonnegative(),
  backendBytes: z.number().int().nonnegative(),
  backendRepoCount: z.number().int().nonnegative(),
  frontendBytes: z.number().int().nonnegative(),
  frontendRepoCount: z.number().int().nonnegative(),
  topLanguageName: z.string().optional(),
  topLanguageBytes: z.number().int().nonnegative(),
  topLanguageRepoShare: z.number().min(0).max(1).optional(),
});
export type GitHubRawMetrics = z.infer<typeof GitHubRawMetricsSchema>;

export const GitHubRepoItemSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  fullName: z.string(),
  description: z.string().nullable().optional(),
  stars: z.number().int().nonnegative().default(0),
  forks: z.number().int().nonnegative().default(0),
  primaryLanguage: z.string().nullable().optional(),
  updatedAt: z.string().optional(),
  isFork: z.boolean().default(false),
  sizeBytes: z.number().int().optional(),
  url: z.string().optional(),
});
export type GitHubRepoItem = z.infer<typeof GitHubRepoItemSchema>;

export const GitHubLanguageDepthSchema = z.object({
  language: z.string(),
  bytes: z.number().int().nonnegative(),
  repoCount: z.number().int().nonnegative(),
  percentage: z.number().min(0).max(100),
});
export type GitHubLanguageDepth = z.infer<typeof GitHubLanguageDepthSchema>;

export const GitHubSnapshotSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  username: z.string(),
  name: z.string().nullable().optional(),
  avatarUrl: z.string().url(),
  rawMetrics: GitHubRawMetricsSchema,
  topRepos: z.array(GitHubRepoItemSchema).optional(),
  languages: z.array(GitHubLanguageDepthSchema).optional(),
  fetchedAt: z.string(),
  expiresAt: z.string(),
  rulesetVersion: z.string(),
});
export type GitHubSnapshot = z.infer<typeof GitHubSnapshotSchema>;

