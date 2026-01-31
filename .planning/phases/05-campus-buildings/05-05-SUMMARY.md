---
phase: 05-campus-buildings
plan: 05
subsystem: game
tags: [sprites, interiors, zoology, broadcast, theatre, tiles]

# Dependency graph
requires:
  - phase: 05-03
    provides: Building definitions, generateInteriorMaps() placeholder
provides:
  - Lab interior with zoology theme (specimens, microscopes, computers)
  - TV Station interior with broadcast studio theme
  - Lecture Theatre interior with stage and seating
  - 9 new interior sprites for themed rooms
  - talks interaction handler
affects: [06-interaction-dialogs, 07-polish-optimization]

# Tech tracking
tech-stack:
  added: []
  patterns: [themed interior generation, tavern-repurposed assets]

key-files:
  created: []
  modified:
    - js/game/sprites.js
    - js/game/world.js
    - js/game/buildings.js

key-decisions:
  - "Lab 18x12 tiles for zoology + computer hybrid theme"
  - "Station 14x10 tiles as compact broadcast studio"
  - "Theatre 16x12 tiles with 5 rows of audience seating"
  - "Separate 'talks' type handler from legacy 'talk' type"

patterns-established:
  - "Themed interior sprites: domain-specific sprites grouped by building purpose"
  - "Tile number ranges: 60-68 for interior decoration sprites"

# Metrics
duration: 4min
completed: 2026-01-31
---

# Phase 05 Plan 05: Lab, Station, Theatre Interiors Summary

**Zoology-themed Lab with specimens and computers, broadcast-themed TV Station with control desk and microphones, and lecture hall Theatre with stage curtain and audience seating**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-31T17:33:47Z
- **Completed:** 2026-01-31T17:37:35Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Created 9 new interior sprites: specimen, microscope, plant, animalPoster, controlDesk, microphone, screen, stageCurtain, spotlight
- Built zoology-themed Lab interior (18x12) with specimen jars, microscopes, computer workstations, and nature displays
- Built broadcast-themed TV Station interior (14x10) with control desk, screens, microphones, and spotlights
- Built lecture hall Theatre interior (16x12) with stage curtain, podium, screen, and 5 rows of audience seating
- Added 'talks' interaction handler to Buildings.js with showTalksContent() method

## Task Commits

Each task was committed atomically:

1. **Task 1: Add interior-specific sprites** - `3913e1f` (feat)
2. **Task 2: Create Research Lab interior** - `180e9f4` (feat)
3. **Task 3: Create TV Station and Theatre interiors with talks handler** - `51e8e11` (feat)

## Files Created/Modified
- `js/game/sprites.js` - Added 9 new interior sprites in createInteriorSprites()
- `js/game/world.js` - Added TILES 60-68, updated generateLabInterior(), generateStationInterior(), generateTheatreInterior()
- `js/game/buildings.js` - Added 'talks' type handling and showTalksContent() method

## Decisions Made
- Expanded Lab to 18x12 tiles to fit zoology theme with specimens, microscopes, AND computer workstations
- Kept Station compact (14x10) as broadcast studios are typically smaller
- Expanded Theatre to 16x12 to accommodate proper stage area with 5 rows of seating
- Used separate 'talks' type (plural) for Theatre to distinguish from legacy 'talk' type
- showTalksContent() falls back to SITE_CONTENT.media if talks data not available

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All 5 building interiors now complete with themed decorations
- Interior sprites provide visual distinction between buildings
- Interaction handlers wired for research, media, and talks content types
- Ready for 05-06 (if exists) or Phase 6 work

---
*Phase: 05-campus-buildings*
*Completed: 2026-01-31*
