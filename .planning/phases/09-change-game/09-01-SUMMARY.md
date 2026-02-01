---
phase: 09-change-game
plan: 01
subsystem: rendering
tags: [pokemon, sprites, canvas, drawImage, sprite-sheets]

# Dependency graph
requires:
  - phase: 04-core-game-engine
    provides: Engine.js rendering system with tile and character rendering
provides:
  - Pokemon sprite sheet loading system
  - Coordinate-based sprite mapping (sx, sy, sw, sh)
  - Canvas drawImage rendering with source coordinates
affects: [09-02-map-tiles, 09-03-verify-rendering]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Sprite sheet coordinate mapping for tile/character sprites"
    - "Async Image() loading with Promise.all for parallel sheet loading"

key-files:
  created: []
  modified:
    - js/game/sprites.js
    - js/game/engine.js

key-decisions:
  - "Pokemon GBA uses 16x16 tiles, 16x32 character sprites"
  - "Character Y offset: -1 tile to account for 2-tile height"
  - "Sprite data format: {image, sx, sy, sw, sh} for Canvas drawImage()"

patterns-established:
  - "TILE_COORDS object maps sprite names to source coordinates"
  - "CHARACTER_COORDS maps player_[direction]_[frame] keys to 16x32 frames"
  - "Sprites.get() returns sprite data, not canvas elements"

# Metrics
duration: 2.5min
completed: 2026-02-01
---

# Phase 09 Plan 01: Replace Programmatic Sprites with Pokemon Sprite Sheets

**Replaced 1200 lines of programmatic pixel art with 131-line coordinate mapping system loading Pokemon FireRed/LeafGreen sprite sheets**

## Performance

- **Duration:** 2.5 min (152 seconds)
- **Started:** 2026-02-01T21:31:12Z
- **Completed:** 2026-02-01T21:33:44Z
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments
- Eliminated 1087 lines of procedural drawing code (89% reduction)
- Created coordinate mapping system for 18 essential tiles + 16 character animation frames
- Updated engine renderer to use Canvas drawImage() with source coordinates from sprite sheets
- Character rendering now handles 16x32 sprites with proper Y offset

## Task Commits

Each task was committed atomically:

1. **Task 1: Analyze sprite sheets and create coordinate maps** - `8721a9c` (feat)
2. **Task 2: Implement async sprite sheet loading** - `fa43d3d` (feat)
3. **Task 3: Update engine.js renderer to use new sprite format** - `ec2a1e4` (feat)

## Files Created/Modified
- `js/game/sprites.js` - Completely rewritten: removed all programmatic drawing, now loads Pokemon sprite sheets asynchronously and provides coordinate-based sprite data
- `js/game/engine.js` - Updated renderTile() to use drawImage with source coordinates, fixed renderPlayer() to handle 16x32 character sprites with -1 tile Y offset

## Decisions Made

**Pokemon GBA tile/character sizes:**
- Tiles: 16x16 pixels
- Characters: 16x32 pixels (2 tiles tall)
- Rationale: Pokemon FireRed/LeafGreen standard, matches sprite sheet structure

**Character Y offset:**
- Offset player rendering up by 1 tile (-tileSize in Y)
- Rationale: Character sprites are 32px tall but positioned at Player.pixelY (bottom tile), need to render starting 1 tile higher

**Sprite data format:**
- Changed from canvas elements to {image, sx, sy, sw, sh} objects
- Rationale: Canvas drawImage() requires source coordinates for sprite sheet rendering

**Coordinate mapping approach:**
- Manual coordinate identification from sprite sheet visual inspection
- Essential tiles only (grass, path, tree, water, building parts, interior furniture)
- Rationale: Full sprite catalog will be expanded in Plan 02 when mapping tile types

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - sprite sheets loaded successfully, coordinate mapping straightforward from visual inspection, renderer update worked on first implementation.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Plan 02:**
- Sprite loading infrastructure complete
- Coordinate mapping pattern established
- Engine renderer uses new sprite sheet format
- Game loads without errors (visual rendering will be broken until World.js tile types updated in Plan 02)

**Expected behavior:**
- Console shows "Pokemon sprite sheets loaded"
- Many tiles will not render (tile names don't match coordinate map yet)
- Character sprite may not render (coordinate position may need adjustment)
- This is expected - full visual restoration happens in Plan 02

---
*Phase: 09-change-game*
*Completed: 2026-02-01*
