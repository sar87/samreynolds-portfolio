# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-30)

**Core value:** Visitors discover academic work through engaging pixel-art Cambridge exploration, with traditional website as alternative
**Current focus:** Phase 7 complete - Ready for Phase 8

## Current Position

Phase: 9 of 9 (Change Game) - IN PROGRESS
Plan: 5 of 6 in phase
Status: Buildings content handlers complete, ready for world integration
Last activity: 2026-02-01 - Completed 09-05-PLAN.md (Buildings content handlers)

Progress: [███████████████████████████████] 100% (33/33 plans)

### Roadmap Evolution
- Phase 9 added: Change game (2026-02-01)

## Performance Metrics

**Velocity:**
- Total plans completed: 33
- Average duration: 4.0 min
- Total execution time: 2.3 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 2 | 15 min | 7.5 min |
| 02-content-data-layer | 4 | 7 min | 1.75 min |
| 03-website-mode | 4 | 12 min | 3.0 min |
| 04-core-game-engine | 4 | 10 min | 2.5 min |
| 05-campus-buildings | 6 | 63 min | 10.5 min |
| 06-interactions-content | 5 | 13 min | 2.6 min |
| 07-landing-mode-switching | 5 | 25 min | 5.0 min |
| 09-change-game | 3 | 8.3 min | 2.8 min |

**Recent Trend:**
- Last 5 plans: 09-01 (2.5 min), 09-02 (3.7 min), 09-05 (2.1 min)
- Note: Phase 9 running efficiently - sprite and map systems straightforward

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- **Sprite style decision (2026-01-30):** Using LPC/Kenney CC-licensed sprites instead of Pokemon-style to avoid copyright issues - impacts visual aesthetic but ensures legal safety for academic portfolio
- **Node.js version (2026-01-30):** Pinned to v20.19.5 via .nvmrc - Vite 7.x requires ^20.19.0 or >=22.12.0
- **Tile size (2026-01-30):** 32x32 tiles at 2x scale = 64px rendered (LPC standard)
- **Theatre interpretation (2026-01-30):** Using LPC Tavern decorations as lecture hall assets due to limited theatre sprites in LPC ecosystem
- **JSON Schema 2020-12 (2026-01-30):** Using latest spec for all content schemas with strict validation
- **DOI as identifier (2026-01-30):** Store DOI without URL prefix (10.xxxx/), construct URL at runtime
- **Media type enum (2026-01-30):** podcast, video, panel, interview - no "talk" type (converted from content.json.js)
- **Ajv 2020-12 import (2026-01-31):** Use `ajv/dist/2020.js` for JSON Schema draft 2020-12 compatibility
- **CSS-only hamburger (2026-01-31):** Using transform animation on ::before/::after pseudo-elements, no icon library needed
- **Card focus delegation (2026-01-31):** Using :has(.cardLink:focus-visible) on card container for cleaner outline
- **Optional field handling (2026-01-31):** Handle optional About.links and optional abstract/description gracefully with conditional rendering
- **Delta time clamping (2026-01-31):** GameLoop clamps delta to 0.1s max to prevent spiral of death on tab switch
- **Camera lerp speed (2026-01-31):** LERP_SPEED=12 gives ~0.2s catch-up time using exponential smoothing
- **Input direction priority (2026-01-31):** Vertical movement takes priority over horizontal for 4-directional input
- **Const object enum pattern (2026-01-31):** Use `as const` object + type extraction instead of enum for erasableSyntaxOnly compatibility
- **Separate axis collision (2026-01-31):** Process X and Y movement separately to prevent sticky walls when moving diagonally
- **Player speed (2026-01-31):** 256 pixels/second = 4 tiles/second at 64px rendered tiles
- **Snap speed (2026-01-31):** Lerp factor 10 for quick but visible grid snapping on key release
- **Viewport culling (2026-01-31):** Calculate visible tile range from camera position, render only those tiles
- **Camera initial centering (2026-01-31):** Center camera on player at Game initialization for smooth start
- **G key toggle (2026-01-31):** Skip toggle when focused on input/textarea elements
- **LAB_BENCH rename (2026-01-31):** Changed BENCH to LAB_BENCH in World.TILES to distinguish from park bench decorations
- **Player spawn at gate (2026-01-31):** Spawn point (20, 26) places player just inside entrance gate for "arriving" feel
- **Path hierarchy (2026-01-31):** COBBLE for main quad paths, PATH for secondary routes to building areas
- **Sign readability approach (2026-01-31):** Using letter/icon combinations instead of full text for 16x16 sprite readability
- **Tile type numbering (2026-01-31):** Gothic 30-35, Modern 40-43, Signs 50-54 for organized grouping with expansion gaps
- **Building style differentiation (2026-01-31):** Separate buildTraditionalBuilding() and buildModernBuilding() functions for distinct architectural styles
- **Library size prominence (2026-01-31):** Library has largest footprint (w:9) to indicate importance
- **Sign placement (2026-01-31):** Signs placed 2 tiles below entrance doors for visibility
- **Pembroke interior size (2026-01-31):** 14x12 tiles for personal office with comfortable space
- **Library interior size (2026-01-31):** 20x14 tiles for grand academic library feel
- **Publication zone distribution (2026-01-31):** 24+ interaction points spread across library sections for exploration
- **Lab interior size (2026-01-31):** 18x12 tiles for zoology + computer hybrid theme
- **Station interior size (2026-01-31):** 14x10 tiles as compact broadcast studio
- **Theatre interior size (2026-01-31):** 16x12 tiles with 5 rows of audience seating
- **Interior tile numbering (2026-01-31):** 60-68 for interior decoration sprites (specimen, microscope, etc.)
- **Content panel z-index (2026-02-01):** z-index 250 for panel (above dialog box at 200)
- **Panel focus trap handler (2026-02-01):** Store _trapHandler reference to prevent duplicate listeners on repeated opens
- **Proximity 3x3 scan (2026-02-01):** Use full 1-tile radius (3x3 area) for interaction detection, not just facing tile
- **currentInteraction tracking (2026-02-01):** Buildings.currentInteraction stores proximity-detected interaction for ENTER handling
- **Prompt pulse animation (2026-02-01):** Changed from bounce to subtle pulse for more professional appearance
- **Visit tracking session-only (2026-02-01):** visitedBuildings persists per session only (not localStorage) - appropriate for casual exploration
- **ISO date formatting (2026-02-01):** Keep dates in ISO format in data (YYYY-MM-DD), format to "Month Year" during display via formatDate() helper
- **Placeholder link filtering (2026-02-01):** Only render links when URL exists AND is not placeholder '#'
- **Landing intro extraction (2026-02-01):** Extract first sentence from bio[0] for concise intro without hardcoding
- **Landing button differentiation (2026-02-01):** Accent teal for website mode, dark gray for game mode for visual distinction
- **GamePreview canvas size (2026-02-01):** 320x240 for retro pixel aesthetic matching game feel
- **Preview animation speed (2026-02-01):** 8 FPS (125ms interval) for subtle, non-distracting effect
- **Loading spinner technique (2026-02-01):** clip-path animation with steps(4) for pixelated rotation
- **Runtime JSON fetch for Landing (2026-02-01):** Use runtime fetch instead of static import for about.json in Landing.ts to avoid Vite JSON plugin build issues
- **Session storage for landing gating (2026-02-01):** sessionStorage not localStorage - landing reappears on new browser session
- **Mode toggle events (2026-02-01):** CustomEvent('mode-switch') dispatch pattern for loose coupling between header/HUD and main.ts
- **Game toggle position (2026-02-01):** Top-right corner of game viewport, standard HUD position
- **Pokemon GBA tile sizes (2026-02-01):** 16x16 tiles, 16x32 character sprites (2 tiles tall)
- **Character Y offset (2026-02-01):** Render player -1 tile in Y to account for 32px height positioned at bottom tile
- **Sprite data format (2026-02-01):** {image, sx, sy, sw, sh} objects for Canvas drawImage(), not canvas elements
- **Scale factor 3x (2026-02-01):** 16px tiles → 48px rendered balances visibility and map coverage on modern displays
- **Foot-based positioning (2026-02-01):** Player.pixelX/pixelY represent bottom-center of sprite, rendering offsets upward for head
- **Map dimensions 20x18 (2026-02-01):** Pallet Town uses smaller dimensions than Cambridge campus (was 40x30)
- **3 buildings layout (2026-02-01):** Player House (about), Rival House (talks/media), Oak's Lab (research/publications)
- **Player spawn at (10, 17) (2026-02-01):** Bottom center of Pallet Town map, walkable grass area
- **Tile naming convention (2026-02-01):** All TILES enum entries match sprites.js TILE_COORDS exactly (snake_case)
- **Stairs direction labeling (2026-02-01):** Stairs show "(Up)" or "(Down)" based on interaction.floor === '2F' check for clear navigation feedback
- **Press A language (2026-02-01):** Changed prompts to "Press A" instead of "Press ENTER" for Pokemon authenticity (actual key binding remains ENTER)
- **showPanel flag pattern (2026-02-01):** Content types check interaction.showPanel to toggle between full panel display or individual content

### Pending Todos

- Generate custom player character via Universal LPC Character Generator (blonde hair, academic appearance)
- Update CREDITS.txt with Character Generator exported credits

### Blockers/Concerns

**Resolved:**
- ~~Sprite aesthetic trade-off~~ - Accepted LPC style, assets downloaded
- ~~Specific sprite pack selection~~ - LPC ecosystem selected exclusively
- ~~Attribution pattern for CC-BY assets~~ - Dual-file system established (CREDITS.txt + ATTRIBUTION.md)
- ~~Development environment~~ - Vite 7.3.1 + TypeScript working

**Remaining:**
- Player character sprite needs manual generation via browser tool (non-blocking)
- VIS-02 requirement says "16x16" but LPC uses 32x32 - consider updating requirement

**Mobile Performance:**
- Research recommends testing mobile performance in early phases (Phase 4-5), not waiting until Phase 8
- Target: 30+ FPS on mid-range Android device (Pixel 6a or equivalent)

## Session Continuity

Last session: 2026-02-01 21:47 UTC
Stopped at: Completed 09-05-PLAN.md (Buildings content handlers)
Resume file: None

### Key Context for Next Session

**Architecture discovered during Phase 5:**
- Two game systems exist: `/js/game/` (vanilla JS with all content) and `/src/game/` (TypeScript)
- CampusGame.ts wrapper bridges them - loads vanilla JS scripts dynamically
- Game entered via pressing G key or navigating to /#/game

**How to run:**
```bash
npm run dev  # Vite on localhost:5173
# First visit shows landing page
# Press G or click button to enter game mode
```

**Landing system (Phase 7 plan 4 complete):**
- Landing page shows on first visit in session only
- sessionStorage tracks landing-shown state
- Mode buttons trigger transitionToMode() with expand/fade animation
- Skip-to-content links in footer for direct section navigation
- GamePreview.ts renders animated 320x240 canvas with campus scene
- LoadingScreen.ts provides full-screen overlay during game load
- CSS imported in main.ts entry point
- Mode toggle buttons in header ("Play Game") and game HUD ("Website")
- CustomEvent('mode-switch') pattern for direct mode switching without returning to landing

**Current game state (Phase 9 in progress):**
- 20x18 tile Pallet Town map with 3 buildings
- Player spawns at bottom center (10, 17)
- Buildings: Player House (about), Rival House (talks/media), Oak's Lab (research/publications)
- Buildings.js updated with welcome messages for all 3 buildings (09-05 complete)
- showAboutContent() method handles bio, education, links interactions
- All content types support showPanel flag for panel vs individual display
- Interaction prompts use "Press A" language for Pokemon authenticity
- Stairs interactions show "(Up)" or "(Down)" based on floor direction
- Old Cambridge interiors still exist but won't be used
- Content panel overlay via Buildings.showContentPanel(title, htmlContent)
- Proximity detection via World.checkNearbyInteractions(playerX, playerY)
- Visit tracking: Buildings.recordVisit(id) returns true on first visit
- SITE_CONTENT.talks now has 19 invited talks with ISO dates

## User Feedback (05-06)

Polish items noted for future phases:
- Exit visibility - Hard to find building exits, need visual indicators
- Interior sizing - Interiors too large, should be smaller and centered
- Texture quality - Current procedural sprites are basic, need detailed pixel art overhaul

## User Feedback (03-04)

- Animation and color changes between sections requested as future enhancement
- Real content to be integrated from www.samreynolds.org in future task
