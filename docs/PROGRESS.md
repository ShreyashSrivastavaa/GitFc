# GitFC: Development Progress

Last Updated: November 2026

## Phase Status Summary

- [x] **Phase 1: Codebase Audit**
  - Explored frontend, backend API routes, authentication, services, dependencies, and build pipeline.
  - Produced `docs/AUDIT.md`.
  - Audited security flaws, hardcoded credentials, and missing persistence.
  - Approved by user.
- [x] **Phase 2: Architecture & Plan**
  - Produced `docs/ARCHITECTURE.md` (database schema, API routes, security design, GitHub GraphQL strategy, game formulas, and battle state machine).
  - Produced `docs/PLAN.md` (phased milestones, estimates, balance simulation strategy, and testing suite specifications).
  - Approved by user.
- [x] **Phase 3: Design System, UI Shell & Card System**
  - Produced `docs/DESIGN.md` defining color-blind safe rarity tokens, typography, radii, and `prefers-reduced-motion` standards.
  - Implemented `BattleCardView.tsx` supporting 5 distinct rarities (Common, Rare, Epic, Legendary, Mythic) and all card types with interactive stat derivation overlay.
  - Implemented responsive `NavigationShell.tsx` (desktop top bar, mobile bottom bar with 44px tap targets).
  - Implemented high-converting `LandingView.tsx` with instant unauthenticated username scouting.
- [x] **Phase 4: GitHub Integration & Deterministic Card Generation**
  - Implemented pure, versioned stat calculation engine (`src/game/cardGenerator.ts`) calculating the 7 battle stats from GitHub metrics.
  - Implemented anti-gaming guards: discounting young accounts, per-repo star capping, and logarithmic dampening.
  - Authored Vitest unit tests in `tests/cardGenerator.test.ts` (100% pass).
- [x] **Phase 5: Server-Authoritative Battles & Matchmaking**
  - Implemented 5-phase round resolution state machine (`src/game/battleEngine.ts`) with shield immunities, counters, conditional buffs, and $\pm18$ modifier caps.
  - Implemented 5-card deck legal validator (budget cap $\le 415$ OVR, max 2 Legendary/Mythic, archetype diversity).
  - Implemented interactive `BattleArenaView.tsx` with simultaneous secret commit, category clash, and victory screens.
  - Created and executed Monte Carlo simulation (`scripts/simulateBalance.ts`, 5,000 matches) proving tactical decks beat high-OVR brute decks at 61.08% win rate ($\ge 40\%$ target passed).
  - Authored anti-cheat attack test suite in `tests/cheatAttacks.test.ts`.
- [x] **Phase 6: Progression, Leaderboards, Achievements & Daily Loops**
  - Implemented ELO calculation engine with provisional K-factors and anti-farming dampening in `src/game/progression.ts`.
  - Implemented `CollectionView.tsx` (filters by rarity and search).
  - Implemented `LeaderboardView.tsx` with Global, Weekly, and Friends tabs, rank change deltas, and zero fake accounts.
  - Implemented `ProfileView.tsx` with showcased signature card and tier badges.
  - Implemented `DeckBuilderView.tsx` with live budget validation and empty slot indicators.
- [x] **Phase 7: Hardening, Integration & Verification**
  - Clean TypeScript compilation (`tsc -b && vite build`) with zero errors.
  - Main bundle reduced from 706 kB to 469 kB (passing Vite chunk size budget).
  - Oxlint passes with 0 errors.
  - All 18 automated unit and integration tests passing (`npx vitest run`).
- [ ] **Phase 4: GitHub Integration & Deterministic Card Generation**
- [ ] **Phase 5: Server-Authoritative Battles & Matchmaking**
- [ ] **Phase 6: Progression, Leaderboards, Achievements & Daily Loops**
- [ ] **Phase 7: Hardening & Launch Readiness**

---

## Known Issues Discovered During Audit
1. **Critical Secret Exposure**: Upstash REST credentials embedded in serverless files `api/stats/count.ts` and `api/stats/increment.ts`. MongoDB password exposed in `.env.local`.
2. **Insecure Auth Session**: Authentication currently relies on unsigning/unencrypted cookies and client-side `localStorage`.
3. **Fictitious / Estimated Metrics**: Commits, PRs, and streaks are currently fabricated via multiplier formulas (`publicRepos * 35`) rather than extracted from authentic GitHub contribution graphs.
4. **No Server-Side Game Validation**: Match simulation runs entirely inside client browser using `Math.random()`.
5. **No Database**: Entire application state (teams, custom cards, recent searches) resides in browser `localStorage`.

