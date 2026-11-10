# GitFC: Design System & Tokens (RULESET 1.0)

**Version:** 1.0.0  
**Status:** Living Design System Document  

---

## 1. Design Philosophy: Competitive, Dark, Tactile

GitFC adopts a dark, tactile, collectible aesthetic inspired by trading card games and tactical battlers. It avoids flat generic SaaS layouts in favor of glowing physical card materials, embossed badges, micro-animations, and high-contrast typography.

### Core Principles
1. **Rarity Without Color Dependency**: Rarity is communicated through multiple redundant sensory channels: distinct border geometry/thickness, corner brackets, particle effects, foil holograms, and explicit text tags, ensuring WCAG 2.2 AA accessibility for color-blind players.
2. **Deterministic Information Display**: Every stat (0-99) is displayed alongside an explanation of how it was derived. No mystery numbers.
3. **Motion with Fallbacks**: All interactive physics (3D tilt, holographic shine, walkout confetti) strictly observe the user's `prefers-reduced-motion` settings.

---

## 2. Color Palette & Rarity Design Tokens

| Rarity | Base Hues & Gradient | Accent Border & Ring | Foil Texture / Effect | Rarity Badge Icon |
|---|---|---|---|---|
| **Common** | Deep Slate (`#1e293b` to `#0f172a`) | Matte Graphite (`#64748b`) | Subtle brushed metal grain | 🛡️ Bronze Shield |
| **Rare** | Deep Azure (`#0c2a4d` to `#081225`) | Electric Cyan (`#06b6d4`, `#38bdf8`) | Soft diagonal light ray sweep | 💎 Sapphire Gem |
| **Epic** | Twilight Violet (`#2e1065` to `#0f0524`) | Amethyst Neon (`#a855f7`, `#c084fc`) | Holographic crystal shimmer | 🔮 Mystic Orb |
| **Legendary** | Golden Obsidian (`#3b2606` to `#170e02`) | Radiant Amber (`#eab308`, `#fde047`) | Flowing liquid gold & corner flare | 👑 Golden Crown |
| **Mythic** | Dark Prismatic Cosmic (`#180828` to `#04020a`) | Prismatic Iridescent (`#ec4899`, `#8b5cf6`, `#06b6d4`) | Animated chromatic dispersion foil | ⚡ Celestial Star |

---

## 3. Typography Scale

- **Display & Ratings**: Heavy geometric sans/tabular display font (`font-black`, `tracking-tighter`, e.g. Impact / Inter Display).
- **Body & UI**: High-legibility modern sans-serif (`Inter`, system-ui), with strong typographic hierarchy.
- **Numbers**: `tabular-nums` throughout all stat tables, scoreboards, countdown timers, and ratings to prevent layout shift.

---

## 4. Elevation, Radii & Motion Tokens

```css
/* Card Radii */
--radius-card: 1.25rem; /* 20px */
--radius-badge: 0.5rem;  /* 8px */

/* Shadows & Glows */
--glow-common: 0 4px 20px rgba(100, 116, 139, 0.15);
--glow-rare: 0 0 25px rgba(6, 182, 212, 0.35);
--glow-epic: 0 0 30px rgba(168, 85, 247, 0.4);
--glow-legendary: 0 0 35px rgba(234, 179, 8, 0.45);
--glow-mythic: 0 0 40px rgba(236, 72, 153, 0.5), 0 0 60px rgba(139, 92, 246, 0.3);

/* Transitions */
--duration-fast: 150ms;
--duration-base: 250ms;
--duration-slow: 400ms;
--ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## 5. Accessibility & Touch Standards
- Minimum tap target size: **44px × 44px** on all clickable buttons and card selection targets.
- High-contrast text on all card surfaces: Minimum **4.5:1** contrast ratio against card backgrounds.
- Keyboard navigation: Full tab index, keyboard space/enter triggers, and visible focus rings (`ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950`).
- Screen readers: Cards provide comprehensive ARIA labels describing Card Name, Overall Rating, Rarity, Primary Position, and Top Stats.
