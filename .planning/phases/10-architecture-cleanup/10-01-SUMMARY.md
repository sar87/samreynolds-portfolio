---
phase: 10-architecture-cleanup
plan: 01
subsystem: ui
tags: [typescript, vite, router, component]

# Dependency graph
requires:
  - phase: none
    provides: standalone cleanup operation
provides:
  - Clean entry point with direct homepage routing
  - Header component without game toggle
  - Simplified codebase ready for game file archival
affects: [10-02 game file archival, dark mode theming, animation phases]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Direct route handlers without mode switching
    - Header exports only renderHeader and initMobileNav

key-files:
  created: []
  modified:
    - src/main.ts
    - src/components/Header/Header.ts
    - src/components/Header/Header.module.css

key-decisions:
  - "Remove all game/landing imports before archiving files to prevent build errors"
  - "Keep homeScrollPosition for navigation UX on detail pages"

patterns-established:
  - "Entry point pattern: Direct routing without mode switching or landing logic"

# Metrics
duration: 5min
completed: 2026-02-02
---

# Phase 10 Plan 01: Remove Game/Landing Imports Summary

**Simplified main.ts from 304 to 103 lines by removing all game mode, landing page, and mode toggle functionality**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-02-02
- **Completed:** 2026-02-02
- **Tasks:** 3/3
- **Files modified:** 3

## Accomplishments
- Removed all game-related imports from main.ts (CampusGame, Landing components, LoadingScreen)
- Eliminated mode switching logic (transitionToMode, enterGameMode, exitGameMode, /game route)
- Removed GAME_ICON and modeToggle button from Header
- Site now loads directly to homepage without landing page choice
- Build size reduced (CSS from 14.37kB to 13.77kB, JS from 14.21kB to 13.63kB)

## Task Commits

Each task was committed atomically:

1. **Task 1: Simplify main.ts entry point** - `174c0d8` (feat)
2. **Task 2: Remove mode toggle from Header component** - `8c10e27` (feat)
3. **Task 3: Verify clean build and site functionality** - No commit (verification only)

## Files Created/Modified

- `src/main.ts` - Simplified entry point: removed game/landing imports, mode tracking, transition functions, /game route, G key handler, mode-switch listener
- `src/components/Header/Header.ts` - Removed GAME_ICON constant, modeToggle button markup, initModeToggle export
- `src/components/Header/Header.module.css` - Removed .modeToggle styles and mobile-specific rules

## Decisions Made

- Kept homeScrollPosition tracking as it's used for website navigation UX (scroll restoration when returning from detail pages)
- Removed entire initModeToggle function rather than making it a no-op for cleaner code

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all changes applied cleanly with successful builds.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Entry point and header are now clean of game references
- Ready for Plan 02: Archive game files to separate directory
- Game code still exists in codebase but is no longer imported or accessible

---
*Phase: 10-architecture-cleanup*
*Completed: 2026-02-02*
