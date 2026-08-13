import type { EAFCDevCard } from '../types';
import { fetchGitHubUserStats } from './githubApi';
import { incrementCounterStats } from './statsService';

export interface AuthState {
  isConnected: boolean;
  userCard: EAFCDevCard | null;
  followers: string[];
  following: string[];
  token: string | null;
}

const AUTH_KEY = 'gitcards_auth_session';

export function getAuthState(): AuthState {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        isConnected: true,
        userCard: parsed.userCard || null,
        followers: parsed.followers || [],
        following: parsed.following || [],
        token: parsed.token || 'mock-jwt-token',
      };
    }
  } catch (e) {
    console.warn('Failed to parse auth session from localStorage', e);
  }

  return {
    isConnected: false,
    userCard: null,
    followers: [],
    following: [],
    token: null,
  };
}

export async function fetchUserSocialGraph(username: string): Promise<{ following: string[]; followers: string[] }> {
  try {
    const [followingRes, followersRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}/following?per_page=100`),
      fetch(`https://api.github.com/users/${username}/followers?per_page=100`),
    ]);

    let following: string[] = [];
    let followers: string[] = [];

    if (followingRes.ok) {
      const data = await followingRes.json();
      following = data.map((u: any) => u.login);
    }
    if (followersRes.ok) {
      const data = await followersRes.json();
      followers = data.map((u: any) => u.login);
    }

    return { following, followers };
  } catch (e) {
    console.warn('Could not fetch social graph from GitHub API', e);
    return { following: [], followers: [] };
  }
}

export async function loginWithGitHubUser(username: string): Promise<AuthState> {
  const userCard = await fetchGitHubUserStats(username);
  const socialGraph = await fetchUserSocialGraph(username);

  const following = socialGraph.following.length > 0 ? socialGraph.following : ['torvalds', 'gaearon', 'shadcn', 'sindresorhus'];
  const followers = socialGraph.followers.length > 0 ? socialGraph.followers : ['gaearon', 'mitchellh', 'rauchg'];

  const newState: AuthState = {
    isConnected: true,
    userCard,
    following,
    followers,
    token: `session_${Date.now()}_${username}`,
  };

  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(newState));
  } catch (e) {
    console.warn('Failed to store auth session', e);
  }

  incrementCounterStats();
  return newState;
}

export function logoutUser(): void {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (e) {
    console.warn('Failed to clear auth session', e);
  }
}

export function initiateGitHubOAuth(): void {
  const env = typeof process !== 'undefined' ? process.env : {};
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || env.GITHUB_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_GITHUB_CALLBACK_URL || env.GITHUB_CALLBACK_URL || `${window.location.origin}/api/auth/callback`;
  const state = Math.random().toString(36).substring(2);

  if (clientId && clientId !== 'Ov23li_your_client_id') {
    const oauthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=read:user,user:follow,public_repo&state=${state}`;
    window.location.href = oauthUrl;
  }
}
