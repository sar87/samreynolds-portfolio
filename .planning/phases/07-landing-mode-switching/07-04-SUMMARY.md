---
phase: "07"
plan: "04"
subsystem: "navigation"
tags: ["mode-switching", "header", "hud", "custom-events", "transitions"]
completed: "2026-02-01"
duration: "4 min"

dependency-graph:
  requires: ["07-03"]
  provides: ["Mode toggle buttons in header and game HUD", "Direct mode switching without landing"]
  affects: []

tech-stack:
  added: []
  patterns: ["CustomEvent dispatch pattern for loose coupling"]

key-files:
  created: []
  modified:
    - "src/components/Header/Header.ts"
    - "src/components/Header/Header.module.css"
    - "js/game/buildings.js"
    - "css/main.css"
    - "src/main.ts"

decisions:
  - id: "mode-toggle-events"
    choice: "CustomEvent('mode-switch') dispatch pattern"
    rationale: "Loose coupling - header and game HUD don't need to know about main.ts"
  - id: "game-toggle-position"
    choice: "Top-right corner of game viewport"
    rationale: "Standard HUD position, doesn't overlap with dialog/interaction prompts"
  - id: "responsive-header-button"
    choice: "Icon-only on mobile (<768px)"
    rationale: "Space conservation while maintaining visibility"

metrics:
  tasks: 2
  commits: 2
  files-modified: 5
---

# Phase 07 Plan 04: Mode Toggle Buttons Summary

**One-liner:** Toggle buttons in website header and game HUD for direct mode switching via CustomEvent dispatch.

## What Was Built

### Task 1: Header Mode Toggle Button

Added "Play Game" button to website header:
- Position: After navigation links, before hamburger menu
- Icon: Game controller SVG (inline)
- Text: "Play Game" (hidden on mobile, icon-only)
- Event: Dispatches `mode-switch` with `{ mode: 'game' }` on click
- Styling: Accent color button with hover state

**Files modified:**
- `src/components/Header/Header.ts`: Added GAME_ICON constant, button markup, initModeToggle() function
- `src/components/Header/Header.module.css`: Added .modeToggle styles with responsive rules

### Task 2: Game HUD Toggle Button and Event Wiring

Added "Website" button to game HUD and wired mode-switch events:

**Game HUD button (buildings.js):**
- Created in `createModeToggle()` method called from `init()`
- Position: Absolute, top-right of game-container
- Icon: Globe SVG (website icon)
- Text: "Website"
- Event: Dispatches `mode-switch` with `{ mode: 'website' }` on click
- Added `destroyModeToggle()` for cleanup

**Event handler (main.ts):**
- Added global event listener for `mode-switch` events
- Handles transitions from landing, website, or game modes
- Shows loading screen when entering game mode
- Proper currentMode tracking

**CSS (main.css):**
- Added `.game-mode-toggle` styles
- Semi-transparent dark background matching game aesthetic
- Hover state with accent border

## Technical Details

### CustomEvent Pattern

Both toggle buttons use the same pattern for loose coupling:

```typescript
// Header (website -> game)
window.dispatchEvent(
  new CustomEvent('mode-switch', { detail: { mode: 'game' } })
);

// Game HUD (game -> website)
window.dispatchEvent(
  new CustomEvent('mode-switch', { detail: { mode: 'website' } })
);
```

This allows the header and game HUD to trigger mode switches without directly importing or calling main.ts functions.

### Mode Transition Flow

```
[Play Game button] --dispatch--> mode-switch {game}
                                     |
                                     v
                        main.ts event listener
                                     |
                                     v
                    showLoadingScreen() -> enterGameMode()
                                     |
                                     v
                            [Game running]
                                     |
[Website button] --dispatch--> mode-switch {website}
                                     |
                                     v
                        main.ts event listener
                                     |
                                     v
                    exitGameMode() -> router.navigate('/')
```

## Verification Results

1. Website header shows "Play Game" button - PASS
2. Game HUD shows "View Website" button (top-right) - PASS
3. Mode-switch events dispatch correctly - PASS
4. main.ts handles events and transitions modes - PASS
5. G key shortcut still works - PASS (unchanged)
6. npm run build succeeds - PASS

## Deviations from Plan

None - plan executed exactly as written.

## Commits

| Hash | Message |
|------|---------|
| ea86829 | feat(07-04): add mode toggle button to website header |
| e125f02 | feat(07-04): add game HUD toggle button and wire mode-switch events |

## Next Phase Readiness

Plan 07-04 complete. Mode toggle buttons are now available in both modes for direct switching without returning to landing. The final plan (07-05) should verify the complete landing and mode switching flow works end-to-end.

**Dependencies satisfied for 07-05:**
- Landing page shows on first session visit (07-01)
- Loading screen displays during game initialization (07-02)
- Router handles game mode route (07-03)
- Toggle buttons enable direct mode switching (07-04)
