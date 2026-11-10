# GitFC: Technical Architecture & System Design (Phase 2)

**Version:** 1.0.0  
**Ruleset Version:** 1.0  
**Status:** Complete — Awaiting Approval  
**Authors:** Senior Product Designer, Game Designer & Full-Stack Engineer  

---

## 1. Stack Decisions & Justifications

To achieve a server-authoritative, competitive, real-time-capable web platform hosted on Vercel without high cold-start latencies, we select:

| Subsystem | Technology | Justification |
|---|---|---|
| **Database** | **Neon Serverless Postgres** | Full relational integrity, SQL constraints, foreign keys, row-level locking (`FOR UPDATE`) for battle turns. Fully serverless with zero compute when idle. |
| **Driver & ORM** | **`@neondatabase/serverless` + Drizzle ORM** | Zero cold-start overhead compared to heavy ORMs (like Prisma engine binaries). Executes over lightweight HTTP/WebSocket pools natively in Vercel Serverless Functions. Complete end-to-end TypeScript type inference. |
| **Caching & Rate Limiting** | **Upstash Redis** (`@upstash/redis`) | Serverless Redis over REST. Sub-15ms distributed token-bucket rate limiting per IP/user, live matchmaking queue, and ephemeral battle lobby caching. |
| **Authentication & Session** | **Iron-Session (or signed sealed JWT)** | Stateless, encrypted, HTTP-only, SameSite=Lax, Secure session cookies (`gitfc_session`). Zero database read required for basic auth checks; immune to `localStorage` tampering. |
| **Validation** | **Zod** | Runtime input validation on every API endpoint and server action. Guarantees TypeScript contract safety at all boundaries. |
| **Game Engine Core** | Pure, deterministic TypeScript module in `src/game/` | Independent of React/DOM, versioned (`RULESET_VERSION = "1.0.0"`), reproducible from random seed, 100% unit-tested. |

---

## 2. Complete Relational Data Model (Postgres / Drizzle Schema)

Every table strictly enforces relational constraints, non-null guarantees, and appropriate indexes.

```
+----------------------------------------------------------------------------------------------------+
|                                         RELATIONAL SCHEMA                                          |
+----------------------------------------------------------------------------------------------------+

 [ users ]
    id (UUID, PK)
    github_id (BIGINT, UNIQUE)
    username (VARCHAR(39), UNIQUE, INDEX)
    name (VARCHAR(255))
    avatar_url (TEXT)
    rating (INTEGER, DEFAULT 1000, INDEX)          -- Ranked ELO rating
    provisional_matches_remaining (INTEGER, DEF 10)
    level (INTEGER, DEFAULT 1)
    xp (BIGINT, DEFAULT 0)
    shards (INTEGER, DEFAULT 0)                    -- Soft currency from duplicates
    streak_days (INTEGER, DEFAULT 0)
    last_daily_pack_at (TIMESTAMPTZ)
    is_bot (BOOLEAN, DEFAULT FALSE)
    is_discoverable (BOOLEAN, DEFAULT TRUE)
    created_at (TIMESTAMPTZ, DEFAULT NOW())
    last_active_at (TIMESTAMPTZ, DEFAULT NOW())
         |
         | 1:N
         +---------------------------------------------------------------+
         |                               |                               |
 [ github_snapshots ]             [ cards ]                      [ decks ]
    id (UUID, PK)                    id (UUID, PK)                  id (UUID, PK)
    user_id (UUID, FK -> users)      owner_id (UUID, FK -> users)   owner_id (UUID, FK -> users)
    ruleset_version (VARCHAR(16))    snapshot_id (UUID, FK)         name (VARCHAR(64))
    raw_metrics (JSONB)              type (DEV, REPO, LANG)         card_ids (UUID[5])
    normalized_stats (JSONB)         source_entity_id (VARCHAR)     total_power (INTEGER)
    fetched_at (TIMESTAMPTZ)         rarity (COMMON..MYTHIC)        is_active (BOOLEAN)
    expires_at (TIMESTAMPTZ, IDX)    stat_block (JSONB)             locked_at (TIMESTAMPTZ)
                                     abilities (JSONB)              created_at (TIMESTAMPTZ)
                                     created_at (TIMESTAMPTZ)
                                           |
                                           | 1:N
                                  [ card_instances ]
                                     id (UUID, PK)
                                     card_id (UUID, FK -> cards)
                                     user_id (UUID, FK -> users)
                                     is_favorite (BOOLEAN)
                                     acquired_at (TIMESTAMPTZ)
                                     acquired_source (PACK, REWARD)

 [ battles ]
    id (UUID, PK)
    format (BO3, BO5)
    challenger_id (UUID, FK -> users)
    defender_id (UUID, FK -> users)
    challenger_deck_id (UUID, FK -> decks)
    defender_deck_id (UUID, FK -> decks)
    status (PENDING, ACTIVE, COMPLETED, EXPIRED, FORFEIT)
    random_seed (VARCHAR(64))                     -- PRNG seed for round categories
    ruleset_version (VARCHAR(16))
    current_round (INTEGER, DEFAULT 1)
    challenger_score (INTEGER, DEFAULT 0)
    defender_score (INTEGER, DEFAULT 0)
    winner_id (UUID, FK -> users, NULLABLE)
    turn_deadline (TIMESTAMPTZ)
    expires_at (TIMESTAMPTZ, INDEX)
    created_at (TIMESTAMPTZ, DEFAULT NOW())
         |
         | 1:N
 [ battle_rounds ]
    id (UUID, PK)
    battle_id (UUID, FK -> battles, INDEX)
    round_index (INTEGER)                         -- 1, 2, 3 (or up to 5)
    category (VARCHAR(32))                        -- e.g. 'BACKEND', 'INNOVATION'
    challenger_card_id (UUID, FK -> cards)
    defender_card_id (UUID, FK -> cards)
    challenger_raw_score (INTEGER)
    defender_raw_score (INTEGER)
    challenger_ability_mods (JSONB)
    defender_ability_mods (JSONB)
    challenger_final_score (INTEGER)
    defender_final_score (INTEGER)
    round_winner_id (UUID, FK -> users, NULLABLE)
    resolved_at (TIMESTAMPTZ)
    * UNIQUE(battle_id, round_index)              -- HARD INTEGRITY CONSTRAINT

 [ battle_submissions ] (For hidden-choice simultaneous commit)
    id (UUID, PK)
    battle_id (UUID, FK -> battles)
    round_index (INTEGER)
    player_id (UUID, FK -> users)
    card_id (UUID, FK -> cards)
    submitted_at (TIMESTAMPTZ)
    * UNIQUE(battle_id, round_index, player_id)   -- IDEMPOTENT SUBMISSION

 [ ratings_history ]
    id (UUID, PK)
    user_id (UUID, FK -> users, INDEX)
    battle_id (UUID, FK -> battles)
    old_rating (INTEGER)
    new_rating (INTEGER)
    delta (INTEGER)
    opponent_id (UUID, FK -> users)
    created_at (TIMESTAMPTZ, DEFAULT NOW())

 [ audit_logs ] (Append-only)
    id (BIGSERIAL, PK)
    user_id (UUID, NULLABLE)
    event_type (AUTH, PACK_OPEN, BATTLE_RESOLVE, RATING_UPDATE, CHEAT_FLAG)
    payload (JSONB)
    ip_address (VARCHAR(45))
    created_at (TIMESTAMPTZ, DEFAULT NOW())
```

---

## 3. API Contract & Security Design

Every endpoint is secured with Zod schemas, strict rate limits, and authentication middlewares.

| Endpoint | Method | Auth | Rate Limit | Purpose & Input / Output |
|---|---|---|---|---|
| `/api/auth/login` | GET | Public | 10 req/min | Generates cryptographically secure OAuth URL with CSRF state token. Scope: `read:user`. |
| `/api/auth/callback` | GET | Public | 10 req/min | Exchanges code with GitHub, syncs `users` record, creates encrypted HTTP-only session cookie. |
| `/api/auth/me` | GET | Required | 60 req/min | Returns authenticated user profile, active deck, shards, unread notifications. |
| `/api/auth/logout` | POST | Required | 30 req/min | Clears session cookie and invalidates session token. |
| `/api/cards/preview` | GET | Public | 30 req/min | Public preview of any GitHub username (no auth required). Query: `?username=...`. Cached 6h. |
| `/api/cards/my-collection`| GET | Required | 60 req/min | Returns all owned card instances, duplicates count, filters by type/rarity. |
| `/api/cards/refresh` | POST | Required | 1 req/6h | Triggers GitHub snapshot re-fetch & card evolution update. Enforces strict cooldown. |
| `/api/packs/daily` | POST | Required | 1 req/day | Claims daily pack. Resolves server-side deterministic odds, unlocks cards, converts dupes to shards. |
| `/api/decks` | GET/PUT | Required | 30 req/min | GET active decks; PUT validates 5-card deck budget, rarity limits, and updates locked deck. |
| `/api/battles/challenge`| POST | Required | 10 req/min | Creates new challenge against `targetUsername` or Bot with locked deck. Body: `{ defenderUsername, format }`. |
| `/api/battles/queue` | POST | Required | 10 req/min | Joins ranked matchmaking pool. Pairs with nearby ELO or times out to Bot after 30s. |
| `/api/battles/:id` | GET | Required | 60 req/min | Retrieves battle state. **Hides opponent's active round selection** until both are committed. |
| `/api/battles/:id/commit`| POST | Required | 30 req/min | Submits secret card for current round. Body: `{ roundIndex, cardId, idempotencyKey }`. Resolves round if both locked. |
| `/api/leaderboard` | GET | Public | 60 req/min | Paginated global, weekly, and friends leaderboard with rank change deltas. |

---

## 4. GitHub Data Strategy & Rate-Limit Budgeting

### 4.1 GraphQL over REST
We migrate from multiple unauthenticated REST requests to **GitHub GraphQL API v4** using a server token (or authenticated user token):
- Single request fetches: user bio, created date, followers/following, contribution calendar (total commits in last 12 months, streaks, active weeks), and the top 30 non-fork repositories with primary languages, disk usage, star count, and fork count.
- Budget: 1 GraphQL query consumes only **1 point** of GitHub's 5,000 points/hour budget per token.

### 4.2 Snapshot TTL & Graceful Degradation
- Snapshots are persisted in `github_snapshots` with a 24-hour expiration.
- If GitHub API is down or returns 403 (Rate Limit), GitFC automatically serves the most recent snapshot with an `X-GitFC-Stale: true` header.
- Users can manually request 1 refresh every 6 hours via `/api/cards/refresh`.

---

## 5. Game Design & Formulas Contract (RULESET 1.0.0)

All stats are normalized on a scale of **0 to 99**.

### 5.1 Stat Calculation Formulas

```typescript
// 1. BACKEND (0-99): Server languages (Go, Rust, Python, Java, C#, C++, PHP, Node.js)
Backend = min(99, max(25, round(log10(backendBytes + 1) * 9.5 + backendRepoCount * 3.5)));

// 2. FRONTEND (0-99): Web technologies (TypeScript, JavaScript, CSS, HTML, Vue, Svelte)
Frontend = min(99, max(25, round(log10(frontendBytes + 1) * 9.5 + frontendRepoCount * 3.5)));

// 3. OPEN SOURCE (0-99): External reach & collaboration
OpenSource = min(99, max(20, round(log10(starsReceived + 1) * 14 + log10(forks + 1) * 8 + min(15, externalPRsMerged * 1.5))));

// 4. INNOVATION (0-99): Polyglot diversity, original (non-fork) repos & distinct topics
Innovation = min(99, max(25, round(distinctLanguagesCount * 5.5 + originalRepoCount * 1.8 + distinctTopicsCount * 1.2)));

// 5. CONSISTENCY (0-99): Contribution cadence & active weeks
Consistency = min(99, max(30, round((activeWeeksPastYear / 52) * 55 + min(44, longestStreakDays * 0.8))));

// 6. POPULARITY (0-99): Logarithmic follower & community gravity
Popularity = min(99, max(20, round(log10(followers + 1) * 18 + log10(starsReceived + 1) * 10)));

// 7. LANGUAGE MASTERY (0-99): Depth in dominant primary language
LanguageMastery = min(99, max(30, round(log10(topLanguageBytes + 1) * 11 + topLanguageRepoShare * 20)));
```

### 5.2 Overall (OVR) Blend
```typescript
Overall = round(
  Backend * 0.16 +
  Frontend * 0.16 +
  OpenSource * 0.18 +
  Innovation * 0.14 +
  Consistency * 0.14 +
  Popularity * 0.12 +
  LanguageMastery * 0.10
);
```

### 5.3 Rarity Tiers & Distribution

| Rarity | OVR Threshold | Ability Slots | Visual Frame & Token |
|---|---|---|---|
| **Common** | OVR ≤ 69 | 0 Abilities | Muted Slate Steel, clean matte border |
| **Rare** | 70 ≤ OVR ≤ 79 | 1 Ability | Electric Cyan, subtle inner glow |
| **Epic** | 80 ≤ OVR ≤ 88 | 1-2 Abilities | Royal Amethyst Purple, holographic shimmer |
| **Legendary** | 89 ≤ OVR ≤ 94 | 2 Abilities | Golden Amber, animated corner flares |
| **Mythic** | OVR ≥ 95 | 2 Enhanced Abilities | Prismatic Obsidian, animated rainbow border foil |

### 5.4 Abilities Library & Resolution Order
Abilities trigger and apply strictly in this sequence:
1. **Phase 1: Environment & Immunity Shields** (e.g. *Shield* cancels opponent debuffs).
2. **Phase 2: Stat Debuffs & Counters** (e.g. *Counter: Backend* lowers opponent Backend by 8 points).
3. **Phase 3: Condition Boosts** (e.g. *Clutch* grants +10 in Round 3/5; *Underdog* grants +7 if opponent OVR > card OVR).
4. **Phase 4: Synergy Deck Bonuses** (e.g. *Polyglot Combo* grants +5 if deck contains 3+ distinct primary languages).
5. **Phase 5: Modifier Cap**: Total net modifiers applied to a card in a single round are strictly capped at **±18 points**, preventing abilities from completely overriding base card attributes.

### 5.5 Deck Building Guardrails
- Exactly 5 unique cards.
- **Deck Budget Cap**: Total combined OVR of all 5 cards ≤ **415 points** (Average 83 OVR).
- **Rarity Cap**: Maximum 2 cards of Legendary or Mythic tier.
- **Archetype Diversity**: At least 2 distinct primary stat archetypes (e.g. cannot run 5 Backend specialists).

### 5.6 Ranked ELO & Matchmaking
- Standard ELO formula with $K = 32$ ($K = 50$ for first 10 provisional matches).
- Rating floor: 100 points.
- Initial rating: 1,000 for all players regardless of GitHub profile stats.
- Diminishing returns for repeated matchups: subsequent matches between the same pair within 24h award 50%, 25%, and 0% ELO change to prevent collusive farming.

---

## 6. Cold-Start Strategy & Training Bot

1. **Zero Fake Users**: No fictitious profiles appear on global leaderboards.
2. **GitFC Training Bot**:
   - Distinctly labeled bot account (`@bot:gitfc-trainer`) with dynamic starter decks tuned to Bronze, Silver, and Gold tiers.
   - Used for immediate unranked practice matches and tutorial onboarding.
   - Explicitly excluded from all leaderboard queries (`WHERE is_bot = FALSE`).
3. **Viral Shareable Challenge Links**:
   - `gitfc.vercel.app/challenge/:battleId` allows sharing direct challenge links to Discord/X. If the invitee is not registered, they authenticate, receive their starter cards, and immediately enter the match.
