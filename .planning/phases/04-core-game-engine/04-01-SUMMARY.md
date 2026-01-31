---
phase: 04-core-game-engine
plan: 01
subsystem: game-engine
tags: [game-loop, input, camera, typescript, requestAnimationFrame, lerp]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: EngineConfig with tileSize and scale
provides:
  - GameLoop class with delta time calculation
  - Input class with keyboard state tracking
  - Camera class with lerp follow and clamping
affects: [04-02, 04-03, 04-04, 05-player-movement, 06-world-building]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Framerate-independent delta time (clamped to max 0.1s)"
    - "Exponential smoothing for lerp: 1 - Math.exp(-speed * dt)"
    - "event.code for keyboard layout independence"
    - "No constructor parameter properties (erasableSyntaxOnly)"

key-files:
  created:
    - src/game/core/GameLoop.ts
    - src/game/core/Input.ts
    - src/game/core/Camera.ts
  modified: []

key-decisions:
  - "Delta time clamped to 0.1s max to prevent spiral of death on tab switch"
  - "LERP_SPEED=12 gives approximately 0.2s catch-up time"
  - "Vertical movement priority over horizontal for 4-directional input"
  - "Camera stores top-left corner position, not center"

patterns-established:
  - "Game core classes: explicit property declarations (no constructor param properties)"
  - "Camera lerp: 1 - Math.exp(-speed * deltaTime) for framerate independence"
  - "Input tracking: Map<string, boolean> for key states"

# Metrics
duration: 2min
completed: 2026-01-31
---

# Phase 4 Plan 1: Core Systems Summary

**GameLoop with requestAnimationFrame delta time, Input with WASD/arrow keyboard tracking, Camera with exponential lerp follow and map edge clamping**

## Performance

- **Duration:** 2 minutes
- **Started:** 2026-01-31T12:33:39Z
- **Completed:** 2026-01-31T12:36:47Z
- **Tasks:** 3
- **Files created:** 3

## Accomplishments
- GameLoop using requestAnimationFrame with delta time in seconds, clamped to prevent spiral of death
- Input system tracking WASD and arrow keys using event.code for layout independence
- Camera with smooth lerp follow (~0.2s catch-up) and map boundary clamping

## Task Commits

Each task was committed atomically:

1. **Task 1: Create GameLoop with delta time** - `1e0f823` (feat)
2. **Task 2: Create Input system for keyboard state** - `e24331c` (feat)
3. **Task 3: Create Camera with lerp follow and clamping** - `298c5da` (feat)

## Files Created

- `src/game/core/GameLoop.ts` - requestAnimationFrame loop with delta time calculation and clamping (80 lines)
- `src/game/core/Input.ts` - Keyboard state tracking for WASD/arrows with layout independence (100 lines)
- `src/game/core/Camera.ts` - Viewport transform with lerp follow and edge clamping (139 lines)

## Decisions Made

- **Delta time clamping:** 0.1s max prevents large physics jumps when tab becomes visible after being backgrounded
- **Lerp speed 12:** Provides approximately 0.2s catch-up time - fast enough to feel responsive, slow enough to look smooth
- **Vertical priority:** When both vertical and horizontal keys pressed, vertical movement takes priority (simpler than last-key-pressed tracking)
- **Camera position:** Stores top-left corner coordinates, not center - simplifies worldToScreen coordinate conversion

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all three modules compiled and verified without issues.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Core systems ready for integration in Phase 4 Plan 2 (Player Entity and Movement)
- GameLoop provides the update/render cycle
- Input provides movement direction for player controller
- Camera provides viewport following for renderer

---
*Phase: 04-core-game-engine*
*Completed: 2026-01-31*
