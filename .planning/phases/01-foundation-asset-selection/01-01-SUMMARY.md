---
phase: 01-foundation-asset-selection
plan: 01
subsystem: infra, assets
tags: [vite, typescript, lpc, sprites, opengameart, cc-by-sa]

# Dependency graph
requires: []
provides:
  - Vite + TypeScript development environment
  - LPC sprite assets organized by category
  - Attribution documentation for CC-BY-SA compliance
affects: [02-map-design, 03-engine-refactor, 04-typescript-migration]

# Tech tracking
tech-stack:
  added: [vite@7.3.1, typescript@5.9.3]
  patterns: [canvas-rendering, module-es-imports]

key-files:
  created:
    - package.json
    - tsconfig.json
    - vite.config.ts
    - src/main.ts
    - assets/ATTRIBUTION.md
    - assets/CREDITS.txt
  modified:
    - index.html

key-decisions:
  - "Used Node.js v20.19.5 (required by Vite 7.x) with .nvmrc file"
  - "Player sprite is placeholder - requires Character Generator for blonde academic appearance"
  - "Theatre interpreted as lecture hall due to limited LPC stage assets"
  - "All assets verified CC-BY-SA 3.0 licensed"

patterns-established:
  - "Asset organization: assets/sprites/{terrain,buildings,characters,objects}"
  - "Attribution: dual-file system (CREDITS.txt for OpenGameArt format, ATTRIBUTION.md for humans)"

# Metrics
duration: 7min
completed: 2026-01-30
---

# Phase 1 Plan 01: Environment & Asset Foundation Summary

**Vite 7 + TypeScript dev environment with LPC sprite assets from OpenGameArt, organized for Cambridge Gothic pixel-art game**

## Performance

- **Duration:** 7 min
- **Started:** 2026-01-30T23:09:31Z
- **Completed:** 2026-01-30T23:16:54Z
- **Tasks:** 3
- **Files modified:** 23

## Accomplishments
- Working Vite dev server with hot reload (`npm run dev` on localhost:5173)
- TypeScript compilation and production build (`npm run build`)
- LPC sprites downloaded: terrain tiles, Gothic castle architecture, 5 building interiors
- Complete attribution documentation for CC-BY-SA compliance

## Task Commits

Each task was committed atomically:

1. **Task 1: Initialize Vite + TypeScript Project** - `c6c3f74` (feat)
2. **Task 2: Download and Organize LPC Sprite Assets** - `c46eca8` (feat)
3. **Task 3: Create Attribution Files** - `e9b9b42` (docs)

## Files Created/Modified

### Development Environment
- `package.json` - Project config with Vite 7.3.1, TypeScript 5.9.3
- `tsconfig.json` - Strict TypeScript config targeting ES2022
- `vite.config.ts` - Vite configuration with asset handling
- `src/main.ts` - Entry point with canvas test rendering
- `index.html` - Updated to load TypeScript module
- `.nvmrc` - Pins Node.js to v20.19.5 (Vite requirement)
- `.gitignore` - Excludes node_modules, dist

### Sprite Assets
- `assets/sprites/terrain/grass.png` - LPC grass tileset
- `assets/sprites/terrain/paths.png` - LPC path/dirt tiles
- `assets/sprites/terrain/water/water.png` - Animated water tiles
- `assets/sprites/buildings/exteriors/castle-pack/*.png` - Gothic architecture
- `assets/sprites/buildings/interiors/library/*.png` - Furniture, bookshelves
- `assets/sprites/buildings/interiors/lab/*.png` - Alchemy equipment, containers
- `assets/sprites/buildings/interiors/theatre/*.png` - Tavern decorations (for lecture hall)
- `assets/sprites/buildings/interiors/college/*.png` - Interior furnishings
- `assets/sprites/buildings/interiors/station/*.png` - Modern furniture
- `assets/sprites/characters/player.png` - Placeholder character sprite

### Attribution
- `assets/CREDITS.txt` - OpenGameArt standard format credits
- `assets/ATTRIBUTION.md` - Human-readable attribution with license info

## Decisions Made

1. **Node.js version:** Vite 7.x requires Node.js ^20.19.0 or >=22.12.0. Used v20.19.5 with .nvmrc file for consistency.

2. **Player sprite placeholder:** The Universal LPC Character Generator requires browser interaction. Used base male walkcycle sprite as placeholder; user should generate final blonde/academic character via generator and update CREDITS.txt with exported credits.

3. **Theatre assets:** LPC lacks dedicated theatre/stage assets. Used LPC Tavern decorations (banners, rugs, lighting) - interpreting theatre building as lecture hall per CONTEXT.md guidance.

4. **Station (TV/Radio) assets:** Limited modern furniture in LPC ecosystem. Used fridge.png as placeholder; interpret building creatively as media room with available assets.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Node.js version incompatibility**
- **Found during:** Task 1 (Dev server test)
- **Issue:** System Node.js v21.0.0 incompatible with Vite 7.x (requires ^20.19.0 or >=22.12.0)
- **Fix:** Added .nvmrc file pinning v20.19.5, documented nvm usage requirement
- **Files modified:** .nvmrc, package.json (engines field)
- **Verification:** `nvm use 20.19.5 && npm run dev` starts successfully
- **Committed in:** c6c3f74 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Node version fix was necessary for Vite to run. No scope creep.

## Issues Encountered

1. **OpenGameArt download URLs:** Some direct download links from research didn't work. Scraped actual download URLs from asset pages.

2. **Character Generator:** Browser-based tool cannot be automated. Documented as user action needed for final player sprite customization.

## User Setup Required

**Player Character Customization Required:**

The placeholder player sprite needs to be replaced with a customized character. Visit:
https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/

1. Select: blonde hair, academic appearance (shirt/sweater option if available)
2. Export sprite sheet to `assets/sprites/characters/player.png`
3. Export credits from generator and append to `assets/CREDITS.txt`

**Node.js Version:**

This project requires Node.js v20.19+ or v22.12+. Run:
```bash
nvm use  # Uses version from .nvmrc
```

## Next Phase Readiness

- Dev environment ready for TypeScript game development
- LPC sprites organized and attributed - ready for map design
- 32x32 tile size (LPC standard) documented in RESEARCH.md - engine update needed in Phase 4
- All 5 building interiors have assets (some limited, but workable)

**Ready for:** Phase 2 (Map Design) or Phase 4 (TypeScript Migration)

---
*Phase: 01-foundation-asset-selection*
*Completed: 2026-01-30*
