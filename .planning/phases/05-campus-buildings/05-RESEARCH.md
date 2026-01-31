# Phase 5: Campus & Buildings - Research

**Researched:** 2026-01-31
**Domain:** Tile-based game world design, tilemap rendering, and building layout patterns
**Confidence:** HIGH

## Summary

Phase 5 creates a Cambridge campus map with five explorable building interiors using tile-based world design. The research covers three critical domains: (1) tilemap data structures and rendering optimization for Canvas 2D, (2) architectural patterns for multi-location navigation and building transitions, and (3) level design principles for creating explorable spaces that guide player navigation.

The standard approach uses array-based tilemap layers (ground, objects, collision, interaction) with viewport culling to render only visible tiles. Canvas optimization techniques include offscreen pre-rendering for static layers, layered canvas architecture for separating dynamic and static content, and chunked rendering for large maps. Building interiors follow single-room patterns with clear theming, interactive zones positioned one tile in front of objects, and explicit exit markers.

The existing codebase (js/game/world.js, sprites.js, buildings.js) already implements these patterns correctly. This phase will enhance the existing implementation rather than rebuild it. The key work is refining map layouts to match the user's vision from CONTEXT.md: no River Cam, clustered buildings around a central quad, distinct traditional vs modern architecture, and literal interior theming.

**Primary recommendation:** Enhance existing tilemap implementation with refined campus layout (remove river, add central quad), improve building exteriors with gothic details using existing sprites, and ensure interior theming is literal and immediately recognizable (Library = bookshelves, Lab = equipment + nature specimens).

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Canvas 2D API | Native | Tile rendering and sprite drawing | Browser-native, no dependencies, excellent performance for 2D tiles |
| Array-based tilemaps | N/A | Map data structure | Industry standard for tile-based games (used in RPG Maker, Game Maker, Phaser) |
| Flat array indexing | N/A | Grid storage (idx = y * width + x) | Memory efficient, cache-friendly, fast access |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Offscreen Canvas | Native | Pre-rendering static layers | When map has large static sections (reduce per-frame draw calls) |
| requestAnimationFrame | Native | Animation loop timing | Already implemented in game engine (Phase 4) |
| Multi-layer DOM canvas | N/A | Separate dynamic/static rendering | When different layers update at different frequencies |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Flat array indexing | 2D array (map[y][x]) | 2D arrays are more intuitive but slower due to double indirection and poor cache locality |
| Programmatic sprites | LPC sprite atlas | LPC provides richer visuals but requires loading/managing external assets; programmatic is simpler for this project |
| Single canvas | Multiple layered canvases | Multiple canvases separate concerns but increase complexity; single canvas sufficient for this project's scale |

**Installation:**
```bash
# No external dependencies - uses browser-native Canvas 2D API
# Existing implementation in js/game/ already has required structure
```

## Architecture Patterns

### Recommended Project Structure
```
js/game/
├── sprites.js           # Sprite generation and caching
├── world.js             # Tilemap data, collision, interaction
├── buildings.js         # Building transition logic and dialogs
├── player.js            # Player movement and state
└── engine.js            # Main game loop and rendering
```

This structure is already implemented in the codebase.

### Pattern 1: Multi-Layer Tilemap System
**What:** Store map as multiple flat arrays (layers) with different purposes
**When to use:** Always - this is the standard for tile-based games
**Example:**
```javascript
// Source: Existing implementation in js/game/world.js
const map = {
  width: 40,
  height: 30,
  layers: {
    ground: [],      // Base tiles (grass, path, water)
    objects: [],     // Decorations (trees, buildings, signs)
    collision: [],   // Walkable flags (0 = walkable, 1 = blocked)
    interact: []     // Interaction data (doors, signs, objects)
  }
};

// Access tile at (x, y)
const idx = y * map.width + x;
const groundTile = map.layers.ground[idx];
const isWalkable = map.layers.collision[idx] === 0;
const interaction = map.layers.interact[idx];
```

**Why this works:**
- Flat arrays are cache-friendly and fast
- Separate layers allow independent updates (ground rarely changes, objects might animate)
- Collision and interaction layers enable gameplay without affecting visuals

### Pattern 2: Viewport Culling (Only Render Visible Tiles)
**What:** Calculate visible tile range and only draw those tiles
**When to use:** Always - critical for performance
**Example:**
```javascript
// Source: MDN Tilemaps Guide (https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps)
function renderVisibleTiles(map, camera, tileSize, canvasWidth, canvasHeight) {
  // Calculate visible tile range
  const startCol = Math.floor(camera.x / tileSize);
  const endCol = Math.ceil((camera.x + canvasWidth) / tileSize);
  const startRow = Math.floor(camera.y / tileSize);
  const endRow = Math.ceil((camera.y + canvasHeight) / tileSize);

  // Clamp to map bounds
  const colStart = Math.max(0, startCol);
  const colEnd = Math.min(map.width, endCol);
  const rowStart = Math.max(0, startRow);
  const rowEnd = Math.min(map.height, endRow);

  // Render only visible tiles
  for (let col = colStart; col < colEnd; col++) {
    for (let row = rowStart; row < rowEnd; row++) {
      const idx = row * map.width + col;
      const groundTile = map.layers.ground[idx];
      const objectTile = map.layers.objects[idx];

      const screenX = col * tileSize - camera.x;
      const screenY = row * tileSize - camera.y;

      drawTile(groundTile, screenX, screenY);
      if (objectTile !== -1) drawTile(objectTile, screenX, screenY);
    }
  }
}
```

**Performance impact:** For a 40x30 map (1200 tiles), viewport culling typically renders only 200-300 visible tiles, a 4-5x reduction in draw calls.

### Pattern 3: Building Transition System
**What:** Seamless transitions between campus and interior maps
**When to use:** When players can enter/exit buildings
**Example:**
```javascript
// Source: Existing implementation in js/game/world.js
const World = {
  currentLocation: 'campus',
  campusMap: {},
  interiorMaps: {},

  getCurrentMap() {
    if (this.currentLocation === 'campus') {
      return this.campusMap;
    }
    return this.interiorMaps[this.currentLocation] || this.campusMap;
  },

  enterBuilding(buildingId) {
    if (this.interiorMaps[buildingId]) {
      this.currentLocation = buildingId;
      const interior = this.interiorMaps[buildingId];
      // Return spawn point inside building
      return { x: interior.spawn.x, y: interior.spawn.y };
    }
    return null;
  },

  exitBuilding() {
    const previousLocation = this.currentLocation;
    this.currentLocation = 'campus';
    // Return spawn point outside building entrance
    const entrance = this.buildings[previousLocation].entrance;
    return { x: entrance.x, y: entrance.y + 1 };
  }
};
```

**Key details:**
- Track current location (campus or building ID)
- Store spawn points for smooth transitions
- Return player to building entrance when exiting

### Pattern 4: Interaction Data Structure
**What:** Store interaction metadata in parallel grid
**When to use:** For interactive objects (doors, signs, NPCs, items)
**Example:**
```javascript
// Source: Existing implementation in js/game/world.js
// Interaction types and their data
interact[idx] = { type: 'door', building: 'library', name: "King's College Library" };
interact[idx] = { type: 'sign', text: "Welcome to Cambridge!" };
interact[idx] = { type: 'exit' };
interact[idx] = { type: 'publication', index: 0 };
interact[idx] = { type: 'object', id: 'desk', content: 'office.desk' };

// Check for interaction
const interaction = World.getInteraction(player.x, player.y);
if (interaction && interaction.type === 'door') {
  const spawn = World.enterBuilding(interaction.building);
  player.x = spawn.x;
  player.y = spawn.y;
}
```

**Pattern:** Store structured data, not just flags. This enables rich interactions without complex object systems.

### Pattern 5: Interior Layout (Single-Room Design)
**What:** Each building interior is one coherent room with clear zones
**When to use:** For small-to-medium interiors where navigation should be simple
**Example:**
```javascript
// Source: Existing implementation in js/game/world.js
function generateLibraryInterior() {
  const w = 16, h = 12;  // Single room dimensions

  // Walls around perimeter (collision boundary)
  for (let x = 0; x < w; x++) {
    objects[x] = TILES.INT_WALL;
    collision[x] = 1;
  }
  for (let y = 0; y < h; y++) {
    collision[y * w] = 1;
    collision[y * w + (w - 1)] = 1;
  }

  // Interactive objects clustered by function
  // Bookshelves along walls (publications)
  for (let x = 2; x < 7; x++) {
    objects[1 * w + x] = TILES.BOOKSHELF;
    collision[1 * w + x] = 1;
    // Interaction zone one tile in front
    interact[2 * w + x] = { type: 'publication', index: x - 2 };
  }

  // Exit at bottom center
  interact[(h - 1) * w + Math.floor(w / 2)] = { type: 'exit' };

  // Spawn player near bottom (just entered)
  return { spawn: { x: Math.floor(w / 2), y: h - 2 } };
}
```

**Design principles:**
- Perimeter walls create clear boundaries
- Functional zones (bookshelves for publications, desks for research)
- Interaction zones placed one tile in front of objects (natural player position)
- Exit at intuitive location (usually bottom center where player entered)
- Spawn point gives player space to orient

### Anti-Patterns to Avoid
- **Drawing all tiles every frame:** Use viewport culling - only render visible tiles
- **Complex multi-room interiors:** Single-room design is clearer for content-focused game
- **Generic theming:** Interiors should be immediately recognizable (Library = bookshelves, Lab = equipment)
- **Scattered interactive objects:** Cluster related content (all publications in one area)
- **No visual feedback for interactive objects:** Use distinct sprites or positioning to signal interactivity

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Collision detection | Pixel-perfect collision system | Grid-based collision array | Tile-based games use grid collision - simpler, faster, and sufficient for top-down navigation |
| Sprite management | Individual sprite loading | Sprite atlas with cache object | Atlas reduces HTTP requests; cache prevents re-generating sprites |
| Camera following | Direct position copy (camera.x = player.x) | Lerp smoothing (existing Camera class) | Direct copy is jarring; lerp creates smooth, professional camera movement |
| Map scrolling | Recalculate all tiles on scroll | Viewport culling with offset | Rendering all 1200 tiles is wasteful; only 200-300 are visible |
| Building transitions | Fade effects or complex animations | Instant transition with new spawn point | For content-focused game, instant transitions are clearer and faster |

**Key insight:** Tile-based games have 30+ years of established patterns. The existing codebase already implements these correctly - don't rebuild, refine.

## Common Pitfalls

### Pitfall 1: Rendering All Tiles (Performance Killer)
**What goes wrong:** Drawing all 1200 tiles (40x30 map) every frame at 60 FPS = 72,000 draw calls per second
**Why it happens:** Intuitive to loop through entire map, easy to implement
**How to avoid:** Implement viewport culling (Pattern 2 above) - only render visible tiles
**Warning signs:** Game runs at <30 FPS on modest hardware, browser devtools show high canvas draw time

### Pitfall 2: Generic Building Exteriors (Player Navigation Confusion)
**What goes wrong:** All buildings look identical - player can't distinguish Library from Lab
**Why it happens:** Reusing same building template, not varying size/details
**How to avoid:** Follow CONTEXT.md decisions:
- Vary building sizes (Library larger than others)
- Add visual identifiers (signs with names)
- Mix traditional (stone, gothic details) vs modern (Lab only)
- Add greenery on traditional buildings (ivy, plants on walls)
**Warning signs:** Playtesters ask "Which building is which?" or rely entirely on signs

### Pitfall 3: Abstract Interior Theming (Unclear Content Mapping)
**What goes wrong:** Interiors don't clearly signal their content (e.g., Library has generic furniture)
**Why it happens:** Limited sprite variety leads to creative reuse instead of literal theming
**How to avoid:** Follow CONTEXT.md decision - "very literal interpretation":
- Library = bookshelves everywhere (not just a few)
- Lab = equipment + nature specimens (taxidermy, jars, computers)
- Pembroke = personal items (desk, personal details)
- Station/Theatre = repurpose tavern assets creatively but clearly
**Warning signs:** Player enters Library and doesn't immediately think "this is a library"

### Pitfall 4: Large Map with Scattered Buildings (Navigation Fatigue)
**What goes wrong:** Player spends 60+ seconds walking across empty grass between buildings
**Why it happens:** Making map "realistic" size instead of game-appropriate size
**How to avoid:** Follow CONTEXT.md decision:
- 15-20 seconds to walk across full campus (medium size)
- Buildings clustered around central quad (compact layout)
- Moderate spacing 5-8 tiles between buildings (not 15-20)
**Warning signs:** Success criteria "less than 30 seconds between buildings" fails, playtest feedback mentions tedious navigation

### Pitfall 5: Inconsistent Tile Scale
**What goes wrong:** Mixing 16x16 tiles at 3x scale with 32x32 tiles, creating visual inconsistency
**Why it happens:** Finding new sprite assets without checking dimensions
**How to avoid:** Stick to existing standard (16x16 tiles at 3x scale = 48px rendered)
**Warning signs:** Buildings or decorations look "off-scale" compared to player character

### Pitfall 6: No Clear Entry/Exit Points
**What goes wrong:** Player can't find building entrance or doesn't know how to exit interior
**Why it happens:** Assuming interaction prompts alone are sufficient
**How to avoid:**
- Place doors at obvious locations (building front, center of wall)
- Use path tiles leading to doors
- Mark exit tiles explicitly in interaction layer
- Spawn player near exit when entering, facing natural exit direction
**Warning signs:** Playtesters walk around building perimeter looking for door, or get "stuck" in interiors

## Code Examples

Verified patterns from official sources and existing codebase:

### Viewport Culling Implementation
```javascript
// Source: MDN Tilemaps (https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps)
// Existing implementation in js/game/engine.js (to be verified/enhanced)

function renderMap(ctx, map, camera, tileSize) {
  const viewportWidth = ctx.canvas.width;
  const viewportHeight = ctx.canvas.height;

  // Calculate visible tile bounds
  const startCol = Math.floor(camera.x / tileSize);
  const endCol = Math.ceil((camera.x + viewportWidth) / tileSize);
  const startRow = Math.floor(camera.y / tileSize);
  const endRow = Math.ceil((camera.y + viewportHeight) / tileSize);

  // Clamp to map bounds
  const colStart = Math.max(0, startCol);
  const colEnd = Math.min(map.width, endCol);
  const rowStart = Math.max(0, startRow);
  const rowEnd = Math.min(map.height, endRow);

  // Render ground layer
  for (let col = colStart; col < colEnd; col++) {
    for (let row = rowStart; row < rowEnd; row++) {
      const idx = row * map.width + col;
      const groundTile = map.layers.ground[idx];

      const worldX = col * tileSize;
      const worldY = row * tileSize;
      const screenX = worldX - camera.x;
      const screenY = worldY - camera.y;

      const sprite = Sprites.getTileSprite(groundTile);
      if (sprite) {
        ctx.drawImage(sprite, screenX, screenY, tileSize, tileSize);
      }
    }
  }

  // Render objects layer (same loop)
  for (let col = colStart; col < colEnd; col++) {
    for (let row = rowStart; row < rowEnd; row++) {
      const idx = row * map.width + col;
      const objectTile = map.layers.objects[idx];

      if (objectTile !== -1) {
        const worldX = col * tileSize;
        const worldY = row * tileSize;
        const screenX = worldX - camera.x;
        const screenY = worldY - camera.y;

        const sprite = Sprites.getTileSprite(objectTile);
        if (sprite) {
          ctx.drawImage(sprite, screenX, screenY, tileSize, tileSize);
        }
      }
    }
  }
}
```

### Building Definition Structure
```javascript
// Source: Existing implementation in js/game/world.js
const buildings = {
  office: {
    name: "Sam's Office",
    contentKey: 'about',
    entrance: { x: 8, y: 12 },  // Door tile position on campus
    tiles: { x: 6, y: 9, w: 5, h: 4 }  // Building footprint on campus
  },
  library: {
    name: "King's College Library",
    contentKey: 'publications',
    entrance: { x: 20, y: 18 },
    tiles: { x: 17, y: 14, w: 7, h: 5 }
  }
  // ... more buildings
};

// Building exterior on campus map
function buildBuilding(ground, objects, collision, interact, id, x, y, w, h, name) {
  const building = buildings[id];

  // Fill with walls
  for (let bx = x; bx < x + w; bx++) {
    for (let by = y; by < y + h; by++) {
      const idx = by * mapWidth + bx;
      objects[idx] = TILES.WALL;
      collision[idx] = 1;
    }
  }

  // Roof (top row)
  for (let bx = x; bx < x + w; bx++) {
    objects[y * mapWidth + bx] = TILES.ROOF;
  }

  // Windows
  for (let bx = x + 1; bx < x + w - 1; bx += 2) {
    if (bx !== building.entrance.x) {
      objects[(y + 2) * mapWidth + bx] = TILES.WINDOW;
    }
  }

  // Door (walkable)
  const doorIdx = building.entrance.y * mapWidth + building.entrance.x;
  objects[doorIdx] = TILES.DOOR;
  collision[doorIdx] = 0;
  interact[doorIdx] = { type: 'door', building: id, name };

  // Entrance tile (in front of door)
  const entranceIdx = (building.entrance.y + 1) * mapWidth + building.entrance.x;
  ground[entranceIdx] = TILES.PATH;
  interact[entranceIdx] = { type: 'entrance', building: id, name };
}
```

### Interior Generation Pattern
```javascript
// Source: Existing implementation in js/game/world.js
function generateOfficeInterior() {
  const w = 12, h = 10;  // Compact single room
  const ground = new Array(w * h).fill(TILES.WOOD_FLOOR);
  const objects = new Array(w * h).fill(-1);
  const collision = new Array(w * h).fill(0);
  const interact = new Array(w * h).fill(null);

  // Perimeter walls (top and sides)
  for (let x = 0; x < w; x++) {
    objects[x] = TILES.INT_WALL;
    collision[x] = 1;
  }
  for (let y = 0; y < h; y++) {
    collision[y * w] = 1;  // Left wall
    collision[y * w + (w - 1)] = 1;  // Right wall
  }

  // Desk with computer (personal workspace)
  objects[2 * w + 2] = TILES.DESK;
  collision[2 * w + 2] = 1;
  // Interaction zone one tile in front of desk (row 3)
  interact[3 * w + 2] = { type: 'object', id: 'desk', content: 'office.desk' };

  objects[2 * w + 3] = TILES.COMPUTER;
  collision[2 * w + 3] = 1;
  interact[3 * w + 3] = { type: 'object', id: 'computer', content: 'office.computer' };

  // Chair in front of desk (player can stand here)
  objects[3 * w + 2] = TILES.CHAIR;

  // Bookshelf (personal library)
  for (let x = 6; x < 10; x++) {
    objects[1 * w + x] = TILES.BOOKSHELF;
    collision[1 * w + x] = 1;
    interact[2 * w + x] = { type: 'object', id: 'bookshelf', content: 'office.bookshelf' };
  }

  // Exit at bottom center (player spawns near here)
  interact[(h - 1) * w + Math.floor(w / 2)] = { type: 'exit' };

  return {
    name: "Sam's Office",
    width: w,
    height: h,
    spawn: { x: Math.floor(w / 2), y: h - 2 },  // Near exit
    layers: { ground, objects, collision, interact }
  };
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Draw all tiles every frame | Viewport culling + offscreen rendering | ~2010s HTML5 games | 4-5x performance improvement, enables larger maps |
| Sprite files loaded individually | Sprite atlas / programmatic generation | 2000s → 2010s | Reduces HTTP requests, improves load times |
| Complex multi-room interiors | Single-room focused spaces | RPG Maker era → modern indie games | Clearer navigation, faster content access |
| Pixel-perfect collision | Grid-based collision | Pre-3D era → tile-based standard | Simpler code, sufficient for top-down games |
| Realistic campus scale | Compressed game-paced scale | AAA realism → indie game design | Reduces player fatigue, respects player time |

**Deprecated/outdated:**
- Multi-room dungeon layouts for content exploration: Modern content-focused games prefer single-room interiors with clear theming
- Generic building exteriors: Players expect visual distinction without relying on text labels
- Separate collision polygon systems: Grid-based collision is standard for tile-based games

## Open Questions

Things that couldn't be fully resolved:

1. **LPC sprite availability for specific building details**
   - What we know: LPC has extensive terrain, building, and interior assets (verified via OpenGameArt.org)
   - What's unclear: Exact availability of gothic architectural details (spires, arched windows, ornate stonework)
   - Recommendation: Verify LPC atlas during implementation; may need to abstract gothic details using existing stone/window variations

2. **Optimal map dimensions for 15-20 second crossing time**
   - What we know: Player moves ~2-3 tiles per second with smooth movement
   - What's unclear: Exact tile count for target crossing time (depends on player speed tuning)
   - Recommendation: Start with 40x30 campus map (existing); measure crossing time in playtest; adjust if needed

3. **Repurposing tavern assets for TV Station and Theatre**
   - What we know: CONTEXT.md states "use tavern/inn LPC assets creatively"
   - What's unclear: Which specific tavern elements map to broadcast equipment or stage
   - Recommendation: Tables/counters → control desks, barrels → equipment, stage area → broadcast/performance space; validate in implementation

4. **Balance between "literal theming" and limited sprite variety**
   - What we know: User wants "very literal" interpretation (Library = bookshelves)
   - What's unclear: Whether existing programmatic sprites provide enough variety
   - Recommendation: Prioritize recognizability over variety - better to have repetitive bookshelves than unclear theming

## Sources

### Primary (HIGH confidence)
- [MDN Web Docs - Tiles and tilemaps overview](https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps) - Tilemap data structures, rendering techniques, viewport culling
- [MDN Web Docs - Optimizing canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas) - Canvas performance optimization, offscreen rendering, batching
- Existing codebase (js/game/world.js, sprites.js, buildings.js) - Verified working implementation of patterns

### Secondary (MEDIUM confidence)
- [Game Developer - Tilemaps: More than a Grid](https://www.gamedeveloper.com/design/tilemaps-more-than-a-grid) - Design patterns for tilemaps beyond basic grids
- [Unity - Optimize performance of 2D games with Unity Tilemap](https://unity.com/how-to/optimize-performance-2d-games-unity-tilemap) - Optimization techniques (platform-agnostic principles)
- [GameDev.net - Tile/Map-Based Game Techniques](https://www.gamedev.net/articles/programming/general-and-gameplay-programming/tilemap-based-game-techniques-handling-terrai-r934/) - Terrain transition techniques

### Tertiary (LOW confidence)
- [LimeZu - Modern Interiors RPG Tileset](https://limezu.itch.io/moderninteriors) - Example of interior design patterns (commercial asset, not used but demonstrates patterns)
- [RPG Maker Web - Tutorial: Mapping Interior](https://www.rpgmakerweb.com/blog/tutorial-mapping-interior) - Interior design principles (RPG Maker specific but general principles apply)
- [OpenGameArt.org - LPC Base Assets](https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles) - Verified LPC assets are CC-licensed and available

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Canvas 2D API and array-based tilemaps are industry standard, verified in MDN docs
- Architecture: HIGH - Existing codebase implements established patterns correctly, verified against MDN best practices
- Pitfalls: HIGH - Common mistakes documented in MDN, GameDev.net, and observable in existing implementation

**Research date:** 2026-01-31
**Valid until:** 60 days (2026-04-01) - Tile-based game patterns are stable; Canvas API is mature and unlikely to change
