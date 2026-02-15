# Sam Reynolds Academic Website

## What This Is

A polished academic portfolio website showcasing Sam Reynolds' research at the intersection of AI and Conservation. Features a light theme with Playfair Display editorial typography, Linear-style animations (scroll reveals, gradient text, hover micro-interactions), and real content synced from samreynolds.org. Mobile-responsive with GitHub Pages deployment. The game mode from v0.9 is archived for potential future use.

## Core Value

Visitors immediately access Sam's academic work through a visually striking, professional interface that communicates cutting-edge research credibility through modern design.

## Requirements

### Validated

- ✓ Professional website mode with content sections — v0.9
- ✓ Structured JSON data files for content — v0.9
- ✓ Game mode with Pallet Town exploration — v0.9 (archived)
- ✓ Light theme design with Playfair Display typography — v1.0
- ✓ Scroll-triggered reveal animations — v1.0
- ✓ Gradient text effects on headings — v1.0
- ✓ Hover micro-interactions (card lift, link underline, button glow) — v1.0
- ✓ Reduced-motion accessibility support — v1.0
- ✓ Publications synced from samreynolds.org (14 papers) — v1.0
- ✓ Media/talks updated (CIEEM podcast, COP30, Wildscreen, Cambridge) — v1.0
- ✓ About/bio and research sections updated — v1.0
- ✓ Landing page bypassed, game code archived — v1.0
- ✓ Mobile-responsive design (320px-1200px) — v1.0
- ✓ GitHub Pages deployment configured — v1.0

### Active

(None — next milestone requirements to be defined via `/gsd:new-milestone`)

### Out of Scope

- Game mode improvements — archived for future milestone
- Touch controls for game — deferred with game mode
- Sprite calibration — deferred with game mode
- Admin interface — use JSON + Claude Code
- Real-time features / backend — static site only
- OAuth or user accounts — informational site only
- Offline mode — static site serves fine

## Context

**Current codebase state (v1.0):**
- 3,585 lines of TypeScript/CSS in src/
- Light theme with Playfair Display, blue accent (#0066cc)
- Scroll reveals, gradient text, hover micro-interactions
- 14 published papers, 4 media items, 18 talks
- Mobile responsive (320px-1200px, fluid typography)
- GitHub Pages CI/CD configured (awaiting push)

**Tech stack:** Vite, TypeScript, vanilla CSS (no framework)

**Design pivots during v1.0:**
- Dark mode → Light theme (user preference)
- Halftone texture → Clean editorial with Playfair Display

## Constraints

- **Hosting**: GitHub Pages (static files only)
- **Data format**: JSON files for content
- **Mobile**: Responsive down to 320px
- **Performance**: Smooth animations on modest hardware
- **Accessibility**: Respect prefers-reduced-motion, WCAG AA contrast

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Archive game mode for v1.0 | Focus on polished professional presence first | ✓ Good — clean separation |
| Light theme (pivoted from dark) | User preference for editorial aesthetic | ✓ Good — 17.18:1 contrast |
| Playfair Display font | NYT-style editorial credibility | ✓ Good — distinctive look |
| Linear-style animations | Communicates cutting-edge credibility | ✓ Good — smooth, accessible |
| Keep game code in _archived/ | May revisit in future milestone | ✓ Good — no dead imports |
| JSON for content | Easy to update via Claude Code | ✓ Good — working well |
| 14 papers (not 15) | 15th is "in preparation" | ✓ Good — accurate |
| Direct MP3 for CIEEM podcast | Better than Spotify iframe dependency | ✓ Good — works offline |
| Conditional base path | GITHUB_PAGES env var for local/deploy | ✓ Good — clean solution |
| CSS clamp() for fluid typography | Single rule scales 320px-1200px | ✓ Good — no breakpoint jumps |

---
*Last updated: 2026-02-15 after v1.0 milestone*
