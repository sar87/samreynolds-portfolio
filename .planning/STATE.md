# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-30)

**Core value:** Visitors discover academic work through engaging pixel-art Cambridge exploration, with traditional website as alternative
**Current focus:** Phase 4 - Core Game Engine systems

## Current Position

Phase: 4 of 8 (Core Game Engine)
Plan: 1 of 4 in current phase
Status: In progress
Last activity: 2026-01-31 - Completed 04-01-PLAN.md (Core Systems)

Progress: [██████░░░░] 68.75%

## Performance Metrics

**Velocity:**
- Total plans completed: 11
- Average duration: 3.3 min
- Total execution time: 0.60 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 2 | 15 min | 7.5 min |
| 02-content-data-layer | 4 | 7 min | 1.75 min |
| 03-website-mode | 4 | 12 min | 3.0 min |
| 04-core-game-engine | 1 | 2 min | 2.0 min |

**Recent Trend:**
- Last 5 plans: 03-01 (2 min), 03-02 (3 min), 03-03 (3 min), 03-04 (4 min), 04-01 (2 min)
- Trend: Stable at ~2-4 min/plan

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
- Some building interiors have limited assets (station/theatre) - may need creative interpretation
- VIS-02 requirement says "16x16" but LPC uses 32x32 - consider updating requirement

**Mobile Performance:**
- Research recommends testing mobile performance in early phases (Phase 4-5), not waiting until Phase 8
- Target: 30+ FPS on mid-range Android device (Pixel 6a or equivalent)

## Session Continuity

Last session: 2026-01-31 12:37 UTC
Stopped at: Completed 04-01-PLAN.md (Core Systems)
Resume file: None - ready for 04-02-PLAN.md

## User Feedback (03-04)

- Animation and color changes between sections requested as future enhancement
- Real content to be integrated from www.samreynolds.org in future task
