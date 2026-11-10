# GitFC: Codebase & Architecture Audit (Phase 1)

Date: November 2026  
Status: Complete  
Audit Lead: Senior Product Designer, Game Designer & Full-Stack Engineer  

---

## 1. Executive Summary

GitFC is currently a client-side SPA (React 19 + Vite 8 + Tailwind CSS 3.4) with basic Vercel Serverless Functions (`/api/*`). Originally built as a cosmetic "EA FC Developer Card Generator" with toy football squad simulations, it lacks true game mechanics, persistence, security, and integrity.

The client relies heavily on `localStorage`, client-side estimated statistics (e.g. `commits = publicRepos * 35`), mock social graphs, unauthenticated CounterAPI calls, and hardcoded preset profiles. While the visual aesthetic (EA FC neon/glassmorphism card layout) and client build tooling are modern and fast, virtually no server-side game state, database persistence, or anti-cheat safeguards currently exist.

To transform GitFC into a competitive developer card-battle platform, the foundation must shift from **client-side cosmetic toy** to a **server-authoritative, persistent, deterministic card-battler**.

---

## 2. Technical Stack & Tooling Analysis

| Layer | Current Implementation | Audit Findings & Recommendations |
|---|---|---|
| **Framework & Language** | React 19.2.8, TypeScript ~6.0.2, Vite 8.2.0 | Excellent modern foundation. High build performance (~2.7s build time). TypeScript strict mode configured via `tsconfig.app.json` and `tsconfig.node.json`. |
| **CSS & Design Tokens** | Tailwind CSS 3.4.19, PostCSS 8.5.26, Autoprefixer 10.5.4 | Standard Tailwind setup. Custom color gradients and keyframe animations configured for EA FC gold/toty/fut-champs themes. Missing unified design tokens for 5 game rarities and accessibility/reduced-motion contracts. |
| **Linting & Code Quality** | Oxlint 1.75.0 (`npm run lint`), `tsc -b` | Oxlint runs in ~67ms. Passes cleanly with 2 minor unused variable warnings in `counterService.ts`. No ESLint / Prettier config files committed. |
| **Testing & CI** | **None** | No test runner (no Vitest, Jest, or Playwright). Zero unit tests, integration tests, or CI workflow files (`.github/workflows` does not exist). |
| **Deployment & Hosting** | Vercel (SPA + Serverless Functions in `/api`) | `vercel.json` provides rewrites for `/api/*` and client fallback to `/index.html`. Vercel Node runtime (`@vercel/node` 5.10.1). |

---

## 3. Architecture & Folder Structure

```
ea-fc-github-cards/
├── api/                     # Vercel Serverless Functions
│   ├── auth/
│   │   ├── login.ts         # Initiates GitHub OAuth
│   │   └── callback.ts      # Exchanges code for token & sets cookie
│   ├── github/
│   │   └── user.ts          # Proxy for GitHub profile & repos (in-memory rate-limited)
│   ├── stats/
│   │   ├── count.ts         # Upstash Redis / in-memory card generation counter
│   │   └── increment.ts     # Counter increment endpoint
│   ├── og.ts                # Serverless SVG dynamic Open Graph image generator
│   └── stats.ts             # Proxy aggregator for stats
├── src/
│   ├── components/
│   │   ├── card/            # EAFCCard visual presentation & customizer
│   │   ├── compare/         # Two-card compare modal
│   │   ├── dressingroom/    # Card customizer / dressing room
│   │   ├── landing/         # Landing details & features showcase
│   │   ├── layout/          # Navbar, Footer, ConnectModal, ThemeToggle
│   │   ├── leaderboard/     # LeaderboardTable, UltimateXISquad
│   │   ├── leagues/         # Simulated leagues view & modal
│   │   ├── pack/            # Pack opener simulation modal
│   │   ├── position/        # Position selector modal
│   │   ├── products/        # Cross-promotion directory
│   │   ├── profile/         # GeneratedProfileView
│   │   ├── share/           # ExportModal (PNG export via html-to-image)
│   │   └── team/            # Squad management & invite modals
│   ├── services/
│   │   ├── authService.ts   # localStorage-backed auth state
│   │   ├── cardCalculator.ts# Toy formulas converting GitHub stats to football stats
│   │   ├── githubApi.ts     # Client GitHub API fetcher with fallbacks
│   │   ├── matchEngine.ts   # Client-side random football match simulation
│   │   ├── teamService.ts   # 11-player squad logic in localStorage
│   │   └── statsService.ts  # CounterAPI / Upstash client caller
│   └── types/               # TypeScript interfaces
```

---

## 4. Deep-Dive Audits

### 4.1 Authentication & Session Management
- **Current Flow**:
  - `api/auth/login.ts` redirects to GitHub OAuth with scope `read:user,public_repo` (violates minimal scope requirement `read:user`).
  - State token uses `randomState = Math.random().toString(36) + Date.now()` (not cryptographically secure).
  - Callback sets a cookie `gitfc_session` with unencrypted plaintext JSON (`{ username, name, avatarUrl }`) without a cryptographic signature (HMAC/JWT).
  - Client side (`authService.ts`) ignores the cookie and creates a dummy token `session_${Date.now()}_${username}` stored in `localStorage` under `gitcards_auth_session`.
- **Verdict**: Completely insecure. Any client can fake identity by writing to `localStorage`. Must be replaced with a signed/encrypted server-side session (iron-session or JWT in HTTP-only, secure, SameSite cookies) and minimal `read:user` scope.

### 4.2 Database & State Persistence
- **Current State**:
  - **No database exists.**
  - An unused `MONGODB_URI` exists in `.env.local`, but MongoDB is not imported or used anywhere in the codebase.
  - Cards, teams, matches, squads, and network connections are stored exclusively in the browser's `localStorage` (`gitcards_auth_session`, `gitcards_custom_team`, `gitcards_created_teams`, `gitcards_recent_searches`).
  - Upstash Redis is partially used for an aggregate card generation counter (`gitfc:card_generations`), with hardcoded fallback credentials committed in the serverless endpoints.
- **Verdict**: Incompatible with competitive gaming. Server-side Postgres database (Neon/Supabase) is strictly required for users, cards, decks, battles, and rankings.

### 4.3 GitHub API Usage & Rate Limits
- **Current Strategy**:
  - Calls REST `/users/{username}` and `/users/{username}/repos?per_page=100&sort=updated`.
  - Commits, PRs, and streaks are **not fetched from GitHub**; they are estimated using naive formulas:
    - `commits = publicRepos * 35 + totalStars * 1.5 + followers * 2`
    - `prsMerged = publicRepos * 1.8 + totalStars * 0.4`
    - `streakDays = totalStars * 0.8 + publicRepos * 2`
  - In-memory caching (`Map<string, ...>`) in serverless function `api/github/user.ts` is ephemeral and does not persist across cold starts.
  - Directly falls back to client-side unauthenticated `fetch('https://api.github.com/...')` if proxy fails, immediately exhausting the client's 60 req/hr rate limit.
- **Verdict**: Must switch to authentic server-side fetching (GraphQL API v4 for accurate commit contributions, PRs, and language distributions) with a persistent `github_snapshots` table (TTL 6-24h).

### 4.4 Game Logic & Battle Engine
- **Current Engine** (`src/services/matchEngine.ts`):
  - Simulates football scores (`homeGoals`, `awayGoals`) using `Math.random()` and team average rating in the browser.
  - Zero deck-building constraints, zero round-based battles, zero RPS/category synergy, zero abilities, zero tie-break rules, and zero server validation.
- **Verdict**: Complete rewrite required in pure, versioned, unit-tested functions under `lib/game/` or `src/game/`.

### 4.5 Security Vulnerabilities & Exposures
1. **Critical Secret Exposure Risk in `.env.local`**:
   - Contains live GitHub Client Secrets, MongoDB credentials with cleartext passwords (`Shreyash1531%40`), and Upstash Redis tokens.
   - Hardcoded Upstash REST tokens are also embedded directly in `api/stats/count.ts` and `api/stats/increment.ts`.
   - `.env.local` was git-ignored, but hardcoded secrets in `api/` must be scrubbed immediately and moved to server environment variables.
2. **Missing Input Validation**: No Zod or schema validation on API routes.
3. **Session Spoofing**: `gitfc_session` cookie is unsigned plain JSON; `localStorage` session is completely trusted by all client UI components.
4. **Client-Side Authoritative State**: Roster additions, match outcomes, and leaderboard rankings are calculated and saved client-side.

### 4.6 Performance & Accessibility Baseline
- **Build Output**: 706 kB main JavaScript chunk (exceeds 500 kB chunk warning). No dynamic imports or code-splitting for heavy modals (`ExportModal`, `DressingRoomView`, `PackOpenerModal`).
- **Accessibility**: Modals lack focus traps, proper ARIA labeling, and keyboard escape handling. Buttons often lack explicit accessible names.
- **Motion**: Missing `@media (prefers-reduced-motion)` fallbacks for heavy card 3D tilt and confetti effects.

---

## 5. Keep / Refactor / Remove Decisions

### Keep (with justification)
1. **React 19 + Vite 8 + Tailwind CSS 3.4**: Clean, modern, extremely fast build toolchain.
2. **Card Visual Foundation (`EAFCCard.tsx`)**: High aesthetic polish on card frames, typography, neon glows, and badge styling. Can be adapted into the 5-tier card system.
3. **Dynamic OG Generator (`api/og.ts`)**: Clean SVG-based social preview card generation. Needs update for new card stats and rarity tokens.
4. **Export Flow (`ExportModal.tsx` + `html-to-image`)**: Valuable feature for players saving high-res PNGs of their cards for Twitter/Discord.
5. **Upstash Redis setup**: Useful for high-throughput rate limiting, caching, and battle matchmaking queues.

### Refactor (with justification)
1. **GitHub OAuth Flow (`api/auth/*` & `authService.ts`)**:
   - *Why*: Scope must drop from `read:user,public_repo` to minimal `read:user`. Session must move from insecure `localStorage` to signed, HTTP-only, secure cookies.
2. **Card Calculator (`cardCalculator.ts`)**:
   - *Why*: Currently computes arbitrary football stats (ATT, PAS, DEF, PAC, DRI, SHO, VIS, STA) with fake estimated numbers. Must become pure, deterministic, versioned engine computing the 7 spec stats (Backend, Frontend, Open Source, Innovation, Consistency, Popularity, Language Mastery) from actual GitHub metrics.
3. **Card Types & Interfaces (`src/types/index.ts`)**:
   - *Why*: Redefine types to support Developer Cards, Repository Cards, Language Cards, 5 rarities, ability systems, and battle payloads.
4. **Vercel API Layer**:
   - *Why*: Add Zod input validation, standardized error handling, and server-side authentication guards.

### Remove (with justification)
1. **Client-side Match Simulator (`src/services/matchEngine.ts`)**:
   - *Why*: Flawed client-side random football simulation. Replaced by server-authoritative turn-based card battle engine.
2. **Toy Squad/Team System (`src/services/teamService.ts`)**:
   - *Why*: Implements 11-player football rosters stored in `localStorage`. Replaced by 5-card strategic deck builder.
3. **Fake CounterAPI Fallbacks (`counterService.ts`)**:
   - *Why*: Redundant, unreliable third-party counter service with multiple failing fallbacks.
4. **Hardcoded Secrets in Source Code (`api/stats/*.ts`)**:
   - *Why*: Severe security violation.

---

## 6. Top 5 Architectural & Product Risks

1. **GitHub API Rate Limits on Deep Metrics**:
   - *Risk*: Fetching full commit histories, PR counts, and repository metrics across 30+ repositories per user will quickly burn the 5,000 req/hr authenticated GitHub API quota if not strictly budgeted and cached.
   - *Mitigation*: Use single-query GraphQL v4 snapshots with pagination limits (cap at top 30 repos), cache snapshots in Postgres for 24 hours, and reject manual refresh spam.
2. **Asynchronous Battle Liveliness & Drop-Offs**:
   - *Risk*: If Player A challenges Player B asynchronously, Player B may not respond for days, clogging battle queues and frustrating challengers.
   - *Mitigation*: 48-hour challenge expiration, 24-hour turn timers with automatic forfeit, plus instant unranked battles against the "GitFC Training Bot".
3. **Game Balance & Stat Dominance (The "Torvalds Problem")**:
   - *Risk*: Mega-accounts with 200,000+ stars will generate unbeatable 99-rated cards that break match balance.
   - *Mitigation*: Logarithmic scaling with diminishing returns, strict 5-card deck budget cap (e.g. maximum 410 total OVR across 5 cards), max 2 top-tier rarities per deck, and category-countering ability mechanics.
4. **Cold-Start Leaderboard Emptiness**:
   - *Risk*: Without fake data, initial leaderboards will have 0 users.
   - *Mitigation*: Well-crafted empty states, shareable challenge links that prompt signup and resolve the challenge, and unranked bot training.
5. **Database Hosting & Serverless Latency**:
   - *Risk*: Database connection pooling issues on Vercel Serverless Functions causing 504 timeouts.
   - *Mitigation*: Use Neon Serverless Postgres via `@neondatabase/serverless` (HTTP driver or connection pooler) with Drizzle ORM for sub-50ms query overhead.

---

## 7. Blocking Questions for Approval

*(Batched for Phase 1 sign-off)*

1. **Database Selection**: We recommend **Neon Serverless Postgres** paired with **Drizzle ORM** (lightweight, zero-cold-start HTTP queries, full TypeScript inference, seamless Vercel integration). Do you approve using Neon Postgres + Drizzle ORM?
2. **GitHub OAuth App Setup**: The current client ID in `.env.local` is configured for production callback `https://gitfc.vercel.app/api/auth/callback`. For local development battles and testing, do you have a secondary GitHub OAuth App registered for `http://localhost:5173/api/auth/callback`, or should the callback route support dynamic redirection via validated state?
3. **Stat Weighting & Archetypes**: In Phase 2, we will define the exact formula weights for the 7 core stats (Backend, Frontend, Open Source, Innovation, Consistency, Popularity, Language Mastery) and the overall rating blend. Are there any particular developer activities you want uniquely emphasized (e.g. PR reviews, release frequency, or documentation)?

