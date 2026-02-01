---
phase: 09-change-game
plan: 06
subsystem: verification
tags: [pokemon, sprites, visual-check, partial]

# Dependency graph
requires:
  - phase: 09-01 through 09-05
    provides: Sprite sheet system, map generation, interiors, content handlers
provides:
  - Partial visual verification
  - Known issues documented for follow-up phase
affects: [future-phase-sprite-fix]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pre-rendered map approach (render entire map image vs tile-by-tile)"

key-files:
  modified:
    - js/game/sprites.js (added MAPS section for pre-rendered maps)
    - js/game/engine.js (added renderPreRenderedMap method)
    - js/game/world.js (collision-only campus map generation)

key-decisions:
  - "Switch from tile-by-tile rendering to pre-rendered map rendering for outdoor"
  - "Pallet Town sprite sheet contains complete maps, not individual tiles"

# Metrics
duration: ~30min
completed: 2026-02-01
status: partial
---

# Phase 09 Plan 06: Visual Verification Summary

**Partial completion - outdoor map rendering needs follow-up phase**

## What Works

- ✅ Sprite sheet loading system (09-01)
- ✅ Player character renders correctly (16x32, animates when walking)
- ✅ Trees render correctly
- ✅ Grass renders correctly
- ✅ Basic pre-rendered map approach implemented
- ✅ Interior tile system structure in place
- ✅ Location display shows "Pallet Town"

## Known Issues (Requires Follow-up Phase)

1. **Map rendering offset** - "Pallet Town" label still visible, map not fully aligned
2. **Collision detection** - Not matching the actual building/obstacle positions
3. **Building entrance positions** - Need to be calibrated to actual door locations
4. **Map boundaries** - Bottom of map may be cut off

## Root Cause Analysis

The Pallet Town sprite sheet contains **pre-rendered complete maps**, not individual tileable sprites. This required a fundamental approach change mid-phase:

- **Original approach**: Extract 16x16 tiles, reconstruct map programmatically
- **New approach**: Render entire pre-rendered map section, overlay collision data

The new approach is correct but needs careful calibration of:
1. Exact pixel offsets in the sprite sheet (sx, sy)
2. Collision rectangles matching visual building positions
3. Door/interaction positions matching visual door locations

## Recommendation for Follow-up Phase

Create a dedicated phase to:
1. Precisely measure sprite sheet coordinates using an image editor
2. Map collision zones pixel-by-pixel to match the pre-rendered map
3. Test and verify each building entrance
4. Consider using the interior map sections for when player enters buildings

## Files Modified in This Plan

- `js/game/sprites.js` - Added MAPS object for pre-rendered map sections
- `js/game/engine.js` - Added renderPreRenderedMap() method, separated outdoor/interior rendering
- `js/game/world.js` - Changed generateCampusMap() to collision-only (no tile placement)

## Commits

Changes not committed - recommend reverting or committing as WIP for follow-up phase.

---
*Phase: 09-change-game*
*Status: Partial - needs follow-up phase*
*Completed: 2026-02-01*
