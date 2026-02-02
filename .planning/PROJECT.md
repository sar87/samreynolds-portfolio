# Sam Reynolds Academic Website

## What This Is

An academic personal website with a unique dual-experience: a professional website view and an interactive Pokemon-style game mode where visitors explore a pixel-art Pallet Town to discover content. Built to be hosted on GitHub Pages.

## Core Value

Visitors can discover Sam's academic work (publications, talks, research) through an engaging, memorable pixel-art exploration - while professionals can access a traditional website view for quick navigation.

## Requirements

### Validated

- ✓ Landing splash screen offering choice: "Explore Campus" or "View Website" — v0.9
- ✓ Panel overlay system displaying content when interacting with objects — v0.9
- ✓ Polished normal website mode with imported content — v0.9
- ✓ Structured JSON data files for content (easy to update via Claude Code) — v0.9
- ✓ Three explorable buildings mapped to content (Player House, Rival House, Oak's Lab) — v0.9
- ✓ Building interiors with themed interactive objects — v0.9
- ✓ Mode switching between game and website from either interface — v0.9

### Active

- [ ] Mobile-friendly with touch controls for game mode
- [ ] GitHub Pages deployment tested and working
- [ ] Player character walk cycle animation
- [ ] Sprite calibration for Pallet Town map (coordinates, collision zones)
- [ ] Credits/attribution accessible from game menu

### Out of Scope

- Admin interface for content management — defer to v2, use JSON files + Claude Code for now
- Custom sprite creation — using Pokemon sprite sheets
- Real-time features / backend — static site only
- OAuth or user accounts — purely informational site
- Analytics dashboard — can add basic analytics later if needed

## Context

**Current codebase state (v0.9 shipped):**
- Full game engine: canvas rendering, 16x16 tiles at 3x scale, camera system, collision detection
- Player movement with 4-direction sprites (animation frames exist but not cycling)
- Pokemon Pallet Town sprites loaded from sprite sheet
- Three buildings: Player House (About), Rival House (Talks/Media), Oak's Lab (Research/Publications)
- Dialog/panel system for displaying content with focus trap
- Both normal and game mode with toggle button
- Landing splash with animated preview
- ~8,600 lines of TypeScript/JavaScript/CSS
- 157 commits over 3 days

**Known issues requiring v1.0 work:**
- Map rendering offset - "Pallet Town" label still visible in sprite
- Collision zones not matching visual building positions
- Building entrance positions need calibration
- Walk animation not cycling (frames exist)
- Touch D-pad not implemented

**Content:**
- 15 publications (2019-2025) including Nature, Trends in Ecology & Evolution
- 19 invited talks in 2025 (Cambridge, London, Bristol, Istanbul, Edinburgh, Oxford)
- Media: CIEEM podcast, Wildscreen panel, Cambridge features, COP30 video
- Research: AI-enabled evidence synthesis, LLMs in conservation, horizon scanning

## Constraints

- **Sprites**: Using Pokemon FireRed/LeafGreen sprite sheets (educational/portfolio use)
- **Hosting**: Must work on GitHub Pages (static files only, no server-side)
- **Data format**: JSON files for content to enable easy updates
- **Mobile**: Must be playable on touch devices
- **Performance**: Must run smoothly on modest hardware (simple sprites, efficient rendering)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dual-mode (game + normal) | Serves both curious visitors and professionals seeking quick access | ✓ Good |
| Landing splash screen | Let visitors choose their experience upfront | ✓ Good |
| JSON for content | Easy to update via Claude Code, simple structure, no CMS needed | ✓ Good |
| Three buildings (Pallet Town) | Maps cleanly to content categories in Pokemon style | ✓ Good |
| Pokemon sprites (user override) | User requested Pokemon aesthetic over original LPC plan | ✓ Good |
| Pre-rendered map approach | Pallet Town sprite sheet has complete maps, not tiles | ⚠️ Revisit |
| 16x16 tiles at 3x scale | Pokemon GBA standard, good visibility on modern displays | ✓ Good |
| Session-only visit tracking | Landing reappears on new browser session, appropriate for casual exploration | ✓ Good |

---
*Last updated: 2026-02-02 after v0.9 milestone*
