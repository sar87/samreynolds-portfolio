---
phase: 04-02
subsystem: game-engine
tags: [tilemap, collision, aabb, game-data]

dependency-graph:
  requires: [04-01]
  provides: [tile-storage, collision-detection, test-map]
  affects: [04-03, 04-04]

tech-stack:
  added: []
  patterns: [const-object-enum, flat-array-grid, separate-axis-collision]

key-files:
  created:
    - src/game/rendering/TileMap.ts
    - src/game/systems/Collision.ts
    - src/game/data/testMap.ts
  modified: []

decisions:
  - id: const-enum
    choice: "Use const object + type instead of enum"
    reason: "erasableSyntaxOnly in tsconfig requires erasable-only syntax"
    alternatives: ["TypeScript enum", "string union types"]
  - id: separate-axis
    choice: "Process X and Y movement separately in collision"
    reason: "Prevents sticky walls when moving diagonally into corners"
    alternatives: ["Combined axis movement", "Sliding collision"]

metrics:
  duration: 2 min
  completed: 2026-01-31
---

# Phase 04 Plan 02: Tile Map and Collision Summary

TileMap stores world data as flat array with isSolid queries; Collision processes X/Y separately for smooth wall sliding.

## Commits

| Hash | Type | Description |
|------|------|-------------|
| f001a45 | feat | Create TileMap data structure |
| e1c2552 | feat | Create Collision detection system |
| 7a3c8fd | feat | Create test map data (20x15) |

## What Was Built

### TileMap (src/game/rendering/TileMap.ts)

```typescript
export const TileType = {
    EMPTY: 0, GRASS: 1, WALL: 2, WATER: 3, PATH: 4
} as const;

export class TileMap {
    getTile(col, row): TileType    // Returns EMPTY for out-of-bounds
    isSolid(col, row): boolean     // WALL and WATER are solid
    getWidth(): number             // Map width in tiles
    getHeight(): number            // Map height in tiles
    getPixelWidth(): number        // width * renderedTileSize
    getPixelHeight(): number       // height * renderedTileSize
}
```

- Uses const object pattern for TileType (erasableSyntaxOnly compatible)
- SOLID_TILES Set contains WALL and WATER
- Out-of-bounds coordinates return EMPTY (passable)
- Pixel dimensions use EngineConfig.renderedTileSize (64px)

### Collision (src/game/systems/Collision.ts)

```typescript
export class Collision {
    isCollidingWithTiles(x, y, width, height): boolean
    moveWithCollision(currentX, currentY, deltaX, deltaY, width, height): { x, y }
}
```

- AABB collision against solid tiles
- Processes X axis first, then Y axis (prevents sticky walls)
- Uses renderedTileSize for tile coordinate conversion
- Returns resolved position after collision

### Test Map (src/game/data/testMap.ts)

```
WWWWWWWWWWWWWWWWWWWW
W..................W
W..................W
W...PPPP...........W  (P = path)
W...P..P...WWWW....W
W...P..P...W..W....W
W...PPPP...W..W....W
W..........WWWW....W
W..................W
W......~~~~........W  (~ = water)
W......~~~~........W
W......~~~~........W
W..................W
W..................W
WWWWWWWWWWWWWWWWWWWW
```

- 20x15 tiles (300 total)
- Border walls on all edges
- Path area in top-left
- Internal wall structure (building placeholder)
- Water feature (River Cam placeholder)
- Player spawn at tile (3, 3)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] TypeScript erasableSyntaxOnly compatibility**
- **Found during:** Task 1
- **Issue:** Plan specified `enum TileType`, but tsconfig has `erasableSyntaxOnly: true` which disallows enums and parameter properties
- **Fix:** Used const object pattern with type extraction instead of enum; explicit property assignments in constructor instead of parameter properties
- **Files modified:** src/game/rendering/TileMap.ts
- **Commit:** f001a45

## Decisions Made

1. **Const object enum pattern**: Used `as const` object + type extraction for TileType to satisfy erasableSyntaxOnly constraint while maintaining type safety and numeric values

2. **Separate axis collision**: X movement tested first, then Y movement tested using new X position - allows sliding along walls when moving diagonally

## Next Phase Readiness

### For 04-03 (Player Entity)
- TileMap ready for render layer
- Collision ready for player movement
- Test map provides spawn point

### For 04-04 (Renderer)
- TileMap provides tile types for rendering
- Pixel dimensions available via getPixelWidth/Height

### Verified Integration Points
- Collision.tileMap.isSolid() pattern confirmed
- EngineConfig.renderedTileSize used consistently
- testMapData.playerSpawn available for player initialization
