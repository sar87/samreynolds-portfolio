# Sam Reynolds Academic Website

## What This Is

An academic personal website with a unique dual-experience: a professional website view and an interactive Pokemon-style game mode where visitors explore a pixel-art University of Cambridge campus to discover content. Built to be hosted on GitHub Pages.

## Core Value

Visitors can discover Sam's academic work (publications, talks, research) through an engaging, memorable pixel-art exploration of Cambridge - while professionals can access a traditional website view for quick navigation.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Landing splash screen offering choice: "Explore Campus" or "View Website"
- [ ] Pokemon Fire Red/Leaf Green style pixel art using sourced free sprite libraries
- [ ] Pixel Cambridge campus with authentic, detailed old-college aesthetic
- [ ] Five explorable buildings mapped to content:
  - Pembroke College → About Me
  - University Library → Publications (15 papers)
  - Research Laboratory → Research Interests
  - TV/Radio Station → Media Appearances
  - Lecture Theatre → Talks (19 invited talks)
- [ ] Building interiors with themed interactive objects:
  - Bookcases for publications
  - Lab equipment for research
  - Radio/TV for media appearances
  - Stage/podium for talks
- [ ] Panel overlay system displaying content when interacting with objects
- [ ] Polished normal website mode with imported content
- [ ] Structured JSON data files for content (easy to update via Claude Code)
- [ ] Mobile-friendly with touch controls for game mode
- [ ] GitHub Pages compatible (static hosting)

### Out of Scope

- Admin interface for content management — defer to v2, use JSON files + Claude Code for now
- Custom sprite creation — will source free sprite libraries instead
- Real-time features / backend — static site only
- OAuth or user accounts — purely informational site
- Analytics dashboard — can add basic analytics later if needed

## Context

**Current codebase state:**
- Full game engine exists: canvas rendering, 16x16 tiles at 3x scale, camera system, collision detection
- Player movement with 4-direction sprites and walking animation
- Building system with interior maps and spawn points
- Dialog/panel system for displaying content
- Both normal and game mode with toggle button
- Mobile controls (D-pad, action button)
- All sprites currently generated programmatically (will be replaced)

**Content from samreynolds.org:**
- Bio: PhD Cambridge (invasive species), MSc/BSc Warwick, focus on AI + conservation
- 15 publications (2019-2025) including Nature, Trends in Ecology & Evolution
- 19 invited talks in 2025 (Cambridge, London, Bristol, Istanbul, Edinburgh, Oxford)
- Media: CIEEM podcast, Wildscreen panel, Cambridge features, COP30 video
- Research: AI-enabled evidence synthesis, LLMs in conservation, horizon scanning

**Visual direction:**
- Pokemon Fire Red/Leaf Green aesthetic (GBA-era pixel art)
- Cambridge old-college feel: grand stone buildings, Gothic/Tudor architecture
- Pembroke College inspiration: historic, prestigious, warm stone tones
- The River Cam, courtyards, gardens, academic atmosphere

## Constraints

- **Sprites**: Must use free, legally-usable sprite libraries (CC-licensed or similar) — no custom pixel art creation, no copyrighted Pokemon assets
- **Hosting**: Must work on GitHub Pages (static files only, no server-side)
- **Data format**: JSON files for content to enable easy updates
- **Mobile**: Must be playable on touch devices
- **Performance**: Must run smoothly on modest hardware (simple sprites, efficient rendering)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dual-mode (game + normal) | Serves both curious visitors and professionals seeking quick access | — Pending |
| Landing splash screen | Let visitors choose their experience upfront | — Pending |
| Source sprites vs create | Higher quality, faster development, avoid Pokemon copyright issues | — Pending |
| JSON for content | Easy to update via Claude Code, simple structure, no CMS needed | — Pending |
| Five buildings | Maps cleanly to content categories without overwhelming the campus | — Pending |

---
*Last updated: 2026-01-30 after initialization*
