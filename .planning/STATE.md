# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-30)

**Core value:** Visitors discover academic work through engaging pixel-art Cambridge exploration, with traditional website as alternative
**Current focus:** Phase 2 - Content Data Layer

## Current Position

Phase: 2 of 8 (Content Data Layer)
Plan: 2 of 4 in current phase
Status: In progress - completed 02-01, 02-03
Last activity: 2026-01-30 - Completed 02-03-PLAN.md (Media and About Data)

Progress: [███░░░░░░░] 25%

## Performance Metrics

**Velocity:**
- Total plans completed: 4
- Average duration: 4.5 min
- Total execution time: 0.30 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 2 | 15 min | 7.5 min |
| 02-content-data-layer | 2 | 3 min | 1.5 min |

**Recent Trend:**
- Last 5 plans: 01-01 (7 min), 01-02 (8 min), 02-01 (1 min), 02-03 (2 min)
- Trend: Improving

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

Last session: 2026-01-31 00:00 UTC
Stopped at: Completed 02-03-PLAN.md (Media and About Data)
Resume file: None - ready for next plan
