---
phase: 09-change-game
plan: 02
subsystem: game-world
tags: [pokemon, map-generation, pallet-town, tile-system]

# Dependency graph
requires:
  - phase: 09-01
    provides: Pokemon sprite sheet loading system with TILE_COORDS mapping
provides:
  - Pallet Town 20x18 outdoor map with 3 buildings
  - Pokemon tile type system (24 tile types vs 70+ Cambridge tiles)
  - House and Lab building generation helpers
affects: [09-03-interiors, 09-04-gameplay]

# Tech tracking
tech-stack:
  added: []
  patterns: [pallet-town-layout, pokemon-building-styles]

key-files:
  created: []
  modified: [js/game/world.js, js/game/engine.js]

key-decisions:
  - "Map dimensions: 20x18 tiles (vs 40x30 Cambridge campus)"
  - "3 buildings: Player House (about), Rival House (talks/media), Oak's Lab (research/publications)"
  - "Player spawn at (10, 17) in bottom center"
  - "Tree border creates forest edge boundary"

patterns-established:
  - "buildHouse() and buildLab() methods for Pokemon-style exteriors"
  - "Tile naming matches sprites.js TILE_COORDS exactly"

# Metrics
duration: 3.7min
completed: 2026-02-01
---

# Phase 09 Plan 02: Pallet Town Map Summary

**20x18 Pallet Town outdoor map with 3 Pokemon-style buildings replacing 40x30 Cambridge campus**

## Performance

- **Duration:** 3.7 min (224 seconds)
- **Started:** 2026-02-01T21:37:08Z
- **Completed:** 2026-02-01T21:40:53Z
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments
- Replaced 70+ Cambridge tile types with 24 Pokemon-specific tiles
- Generated Pallet Town layout with tree borders, paths, pond, and 3 buildings
- Created buildHouse() and buildLab() helper methods for Pokemon building exteriors
- Updated player spawn to fit smaller map dimensions

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace TILES enum with Pokemon tile types** - `2a74e98` (feat)
2. **Task 2: Replace buildings with Pallet Town structures** - `1b8aded` (feat)
3. **Task 3: Generate Pallet Town outdoor map** - `cce88c4` (feat)

## Files Created/Modified
- `js/game/world.js` - Complete map overhaul from Cambridge to Pallet Town
  - TILES enum reduced from 70+ to 24 Pokemon-specific types
  - Buildings reduced from 5 to 3 (playerHouse, rivalHouse, oakLab)
  - generateCampusMap() rewritten for 20x18 Pallet Town layout
  - buildHouse() and buildLab() methods replace buildTraditionalBuilding/buildModernBuilding
  - getTileSprite() updated to map to sprites.js coordinate names
- `js/game/engine.js` - Player spawn position updated from (20, 26) to (10, 17)

## Decisions Made

**Map dimensions: 20x18 tiles**
- Pallet Town is smaller than Cambridge campus (was 40x30)
- Fits Pokemon GBA scale better
- All calculations based on new dimensions

**3 buildings with content mapping**
- Player House → About Me content
- Rival House → Talks + Media content
- Oak's Lab → Research + Publications content

**Tile naming convention**
- All TILES enum entries map to exact TILE_COORDS names in sprites.js
- snake_case naming (tree_trunk, house_wall, etc.)
- No orphaned tile types or missing mappings

**Layout design**
- Dense tree border creates "forest edge" boundary
- Central vertical path (x: 9-10) from bottom entrance
- Horizontal path (y: 8) connects houses
- Small pond in bottom-left corner for variety

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - straightforward map replacement.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for interior generation (Plan 03):**
- Pallet Town outdoor map complete and functional
- Building definitions have correct entrance positions
- Interior generation methods (generatePembrokeInterior, etc.) still reference old buildings
- Will need to create Pokemon-themed interiors for playerHouse, rivalHouse, oakLab

**Known issues:**
- Interior maps still generated for old buildings (pembroke, library, lab, station, theatre)
- Entering buildings will fail until Plan 03 creates new interiors
- Old Cambridge decorative tiles (lampposts, benches, signs) removed from TILES but not causing errors

**Validation:**
- Map dimensions: ✓ 20x18
- Player spawn: ✓ (10, 17)
- Building count: ✓ 3 buildings
- Collision: ✓ Trees, water, building walls block movement
- TILES mapping: ✓ All entries match sprites.js

---
*Phase: 09-change-game*
*Completed: 2026-02-01*
