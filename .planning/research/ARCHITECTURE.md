# Architecture Patterns for Dual-Mode Interactive Portfolio

**Domain:** Dual-mode website (traditional + pixel-art game)
**Researched:** 2026-01-30
**Confidence:** HIGH

## Recommended Architecture

A dual-mode site requires **clean separation between presentation modes while sharing a unified content layer**. The architecture follows a layered approach with clear component boundaries:

```
┌─────────────────────────────────────────────────────────┐
│               USER INTERFACE LAYER                      │
│  ┌──────────────────┐      ┌──────────────────┐       │
│  │  Normal Mode UI  │◄────►│   Game Mode UI   │       │
│  │  (HTML/CSS DOM)  │ Toggle│  (Canvas + HUD)  │       │
│  └──────────────────┘      └──────────────────┘       │
└─────────────────────────────────────────────────────────┘
                        ▲         ▲
                        │         │
┌───────────────────────┴─────────┴───────────────────────┐
│            APPLICATION CONTROL LAYER                     │
│  • Mode switching logic                                  │
│  • Navigation routing                                    │
│  • State persistence (localStorage)                      │
└─────────────────────────────────────────────────────────┘
                        ▲
                        │
┌───────────────────────┴─────────────────────────────────┐
│              CONTENT DATA LAYER                          │
│  Single source of truth: content.json.js                 │
│  { research, publications, media, about, gameContent }   │
└─────────────────────────────────────────────────────────┘
         ▲                              ▲
         │                              │
┌────────┴────────┐          ┌─────────┴──────────┐
│  Content        │          │  Game Systems      │
│  Renderer       │          │  • World/Tilemap   │
│  (templates)    │          │  • Player/Input    │
│                 │          │  • Interactions    │
│                 │          │  • Sprite System   │
│                 │          │  • Game Loop       │
└─────────────────┘          └────────────────────┘
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **App Controller** | Mode toggle, navigation, initialization | Both UI modes, Content Renderer, Game Engine |
| **Content Data** | Single source of truth for all content | Content Renderer, Game Interactions |
| **Content Renderer** | Template portfolio data into HTML | Content Data, DOM |
| **Game Engine** | Main loop, rendering, camera, initialization | All game systems |
| **World/Tilemap** | Map data, collision, location transitions | Player, Engine, Interactions |
| **Player System** | Input handling, movement, animation | World (queries), Engine (updates) |
| **Interaction System** | Dialog, building entry, content display | World (metadata), Content Data, DOM |
| **Sprite System** | Programmatic asset generation | Engine (rendering), all visual systems |

### Data Flow

**Mode Switch Flow:**
```
User clicks toggle
  → App.toggleMode()
  → Save preference to localStorage
  → Hide current mode container
  → Show target mode container
  → If entering game: Engine.init() → Engine.start()
  → If leaving game: Engine.stop()
```

**Content Display Flow (Dual-Path):**
```
Content Data (single source)
  ├─→ Normal Mode: Content.render*() → HTML templates → DOM
  └─→ Game Mode: Interactions.show*Content() → Dialog boxes → Canvas overlay
```

**Game World Navigation:**
```
Player movement input
  → Player.update() processes keys
  → World.isWalkable(x, y) validates position
  → Player position updated
  → Engine.updateCamera() follows player
  → Engine.render() draws visible tiles
```

**Interaction Flow:**
```
Player near interactive tile
  → World.getInteraction(x, y) returns metadata
  → Interaction prompt appears
  → User presses action key
  → Interactions.handleInteraction(data)
  ├─→ Building entrance: World.enterBuilding() → teleport player
  ├─→ NPC/object: Display dialog from Content Data
  └─→ Exit door: World.exitBuilding() → return to campus
```

## Patterns to Follow

### Pattern 1: Tilemap as Multi-Layer Structure
**What:** Organize world data as parallel 2D arrays (layers) with different purposes.

**When:** Any tile-based game world with collision, interactions, or visual depth.

**Structure:**
```javascript
map = {
  width: 40,        // tiles across
  height: 30,       // tiles down
  layers: {
    ground: [],     // base visual tiles (grass, path, floor)
    objects: [],    // decorative/blocking objects (trees, furniture)
    collision: [],  // walkability (0 = walkable, 1 = blocked)
    interact: []    // interaction metadata (doors, NPCs, items)
  }
}
```

**Benefits:**
- Efficient spatial queries: `layers.collision[y * width + x]`
- Separation of concerns: rendering vs. logic
- Supports multiple visual layers for depth effects
- Metadata can be any structure (not just numbers)

**Implementation:**
```javascript
// Query walkability
isWalkable(x, y) {
  const idx = y * this.width + x;
  return this.layers.collision[idx] === 0;
}

// Get interaction data
getInteraction(x, y) {
  const idx = y * this.width + x;
  return this.layers.interact[idx]; // returns object or null
}
```

**Reference:** This pattern is used by Tiled Map Editor, Phaser, and most 2D game engines. [MDN Tilemaps](https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps) documents this as industry standard.

---

### Pattern 2: World-to-Screen Coordinate Transformation
**What:** Separate world coordinates (tile positions) from screen coordinates (pixel positions) with camera offset.

**When:** Any game with scrolling/camera movement.

**Structure:**
```javascript
// Camera tracks player position
camera = { x: 0, y: 0, width: 20, height: 15 }

// Transform functions
worldToScreen(worldX, worldY) {
  return {
    x: (worldX - camera.x) * tileSize * scale,
    y: (worldY - camera.y) * tileSize * scale
  };
}

screenToWorld(screenX, screenY) {
  return {
    x: Math.floor(screenX / (tileSize * scale)) + camera.x,
    y: Math.floor(screenY / (tileSize * scale)) + camera.y
  };
}
```

**Benefits:**
- Enables smooth camera following
- Simplifies visible tile culling (only render what's on screen)
- Decouples world size from viewport size
- Natural infinite world support

**Reference:** [MDN Tilemaps - Scrolling](https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps) describes this as essential for larger game worlds.

---

### Pattern 3: Fixed Timestep Game Loop
**What:** Separate update logic (fixed timestep) from rendering (variable frame rate).

**When:** Any game requiring consistent physics/movement across different devices.

**Structure:**
```javascript
loop(currentTime) {
  const deltaTime = currentTime - this.lastTime;
  this.lastTime = currentTime;
  this.accumulator += deltaTime;

  // Update at fixed 60 FPS
  while (this.accumulator >= this.fixedDelta) {
    this.update(this.fixedDelta);  // Always 16.67ms
    this.accumulator -= this.fixedDelta;
  }

  // Render as fast as possible
  this.render();
  requestAnimationFrame((t) => this.loop(t));
}
```

**Benefits:**
- Consistent gameplay across varying frame rates
- Prevents "speed up on faster machines" bugs
- Separates game logic from rendering performance
- Industry standard for smooth, predictable behavior

**Why critical:** Without this, a player moving at 5 pixels/frame will move faster on a 144Hz monitor than a 60Hz monitor.

**Reference:** This is the standard pattern used by Unity, Godot, and all professional game engines. [Game Programming Patterns](https://gameprogrammingpatterns.com/game-loop.html) dedicates a chapter to it.

---

### Pattern 4: Interaction Metadata over Hard-coded Behavior
**What:** Store interaction logic as data attached to tiles, not switch statements in code.

**When:** Any game with diverse interaction types (NPCs, items, doors, objects).

**Structure:**
```javascript
// Store rich metadata in interact layer
interact[doorTileIndex] = {
  type: 'entrance',
  building: 'library',
  spawnPoint: { x: 10, y: 8 }
};

interact[npcTileIndex] = {
  type: 'dialog',
  messages: ['Hello!', 'Welcome to Cambridge!']
};

interact[computerTileIndex] = {
  type: 'publication',
  contentKey: 'research',
  index: 2
};

// Single handler routes based on type
handleInteraction(data) {
  switch(data.type) {
    case 'entrance': this.enterBuilding(data.building);
    case 'dialog': this.showDialog(data.messages);
    case 'publication': this.showContent(data.contentKey, data.index);
  }
}
```

**Benefits:**
- Add new interaction types without modifying map generation
- Non-programmers can edit interaction data
- Easy to export/import from map editors (Tiled)
- Scales to hundreds of unique interactions

**Anti-pattern:** Hard-coding "if tile === DOOR then enterBuilding()" creates brittle, unmaintainable code.

---

### Pattern 5: Programmatic Sprite Generation
**What:** Generate sprites via Canvas API at initialization instead of loading image files.

**When:** GitHub Pages static hosting, pixel art aesthetic, no external dependencies requirement.

**Structure:**
```javascript
Sprites = {
  cache: {},

  init() {
    this.cache.grass = this.createGrassTile();
    this.cache.player_front = this.createPlayerSprite('front');
    // ... generate all sprites
  },

  createGrassTile() {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#6B8E23';
    ctx.fillRect(0, 0, 16, 16);
    // ... add noise/detail
    return canvas;
  },

  get(name) {
    return this.cache[name];
  }
};
```

**Benefits:**
- Zero external dependencies (no CORS, no 404s)
- Complete programmatic control (easy palette swaps)
- Faster than loading multiple image files
- Works with `file://` protocol (local development)
- Self-contained, deployable anywhere

**Trade-offs:**
- Initial load time (one-time cost)
- Code-based art (less artist-friendly than Photoshop)
- Limited to pixel art aesthetic

**When NOT to use:** Rich visual styles requiring detailed artwork or photographic textures.

**Reference:** Used successfully by [Bruno Simon's portfolio](https://bruno-simon.com/) for procedural 3D generation. Similar principles apply to 2D pixel sprites.

---

### Pattern 6: State Stack for Game Modes
**What:** Manage game states (menu, playing, paused, dialog) as a stack, where new states can push/pop.

**When:** Games with modal interactions (dialogs, menus) that pause main gameplay.

**Current Implementation:**
```javascript
// Simple boolean flags
Buildings.dialogOpen = true;  // Pauses player movement
```

**Recommended Evolution:**
```javascript
StateManager = {
  stack: ['playing'],

  push(state) {
    this.stack.push(state);
    this.onStateChange();
  },

  pop() {
    this.stack.pop();
    this.onStateChange();
  },

  current() {
    return this.stack[this.stack.length - 1];
  },

  onStateChange() {
    // Notify systems (pause player if dialog active)
    const state = this.current();
    Player.paused = (state !== 'playing');
  }
};

// Usage
StateManager.push('dialog');  // Opens dialog, auto-pauses player
StateManager.pop();           // Closes dialog, resumes player
```

**Benefits:**
- Scales to multiple nested states (menu → settings → controls)
- Clear state transitions
- Automatic pause/resume behavior
- Easy debugging (inspect stack)

**Reference:** [Creating a State Stack Engine](https://idiallo.com/blog/javascript-game-state-stack-engine) demonstrates this pattern for JavaScript games.

---

### Pattern 7: Shared Content, Dual Presentation
**What:** Store content once, render through multiple presenters based on current mode.

**When:** Any dual-mode application (game/traditional, mobile/desktop, etc.).

**Structure:**
```javascript
// Single source of truth
SITE_CONTENT = {
  research: [
    { title: '...', description: '...', link: '...' }
  ],
  publications: [ ... ]
};

// Presenter 1: HTML templates
Content.renderResearch() {
  SITE_CONTENT.research.forEach(item => {
    const html = `<article><h3>${item.title}</h3>...</article>`;
    document.querySelector('#research').innerHTML += html;
  });
}

// Presenter 2: Game dialogs
Buildings.showResearchContent(index) {
  const item = SITE_CONTENT.research[index];
  this.showDialog(item.title, item.description);
}
```

**Benefits:**
- Update content once, both modes stay synchronized
- No duplication bugs ("I updated the website but forgot the game")
- Content can be JSON (future CMS integration)
- Clear separation: data vs. presentation

**Anti-pattern:** Embedding content strings in HTML *and* game code separately.

---

### Pattern 8: Viewport-Aware Culling
**What:** Only render tiles visible within the camera viewport.

**When:** Large maps (>20x15 tiles) where rendering entire map every frame wastes CPU.

**Structure:**
```javascript
render() {
  // Calculate visible tile range
  const startCol = Math.floor(this.camera.x);
  const endCol = Math.ceil(this.camera.x + this.camera.width);
  const startRow = Math.floor(this.camera.y);
  const endRow = Math.ceil(this.camera.y + this.camera.height);

  // Clamp to map bounds
  const minCol = Math.max(0, startCol);
  const maxCol = Math.min(World.width, endCol);
  const minRow = Math.max(0, startRow);
  const maxRow = Math.min(World.height, endRow);

  // Only render visible tiles
  for (let y = minRow; y < maxRow; y++) {
    for (let x = minCol; x < maxCol; x++) {
      const tile = World.getTile(x, y);
      this.renderTile(tile, x, y);
    }
  }
}
```

**Benefits:**
- Scales to arbitrarily large maps
- Consistent frame rate regardless of map size
- Essential for smooth 60 FPS

**Performance impact:** A 40x30 map (1200 tiles) with no culling renders 1200 tiles/frame. With culling on a 1920x1080 screen (showing ~20x15 tiles), only 300 tiles/frame = 4x speedup.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Tight Coupling Between Modes
**What:** Game mode code directly manipulating DOM elements or normal mode code accessing game state.

**Why bad:**
- Makes mode switching fragile (missed cleanup)
- Prevents testing modes independently
- Hard to refactor either mode

**Instead:**
- Use App Controller as sole mode switcher
- Both modes read from shared Content Data
- Modes never directly call each other

**Example of bad coupling:**
```javascript
// BAD: Game code manipulating normal mode DOM
Player.update() {
  document.querySelector('.normal-mode h1').textContent = 'Player moved!';
}
```

**Correct approach:**
```javascript
// GOOD: Event-driven decoupling
Player.update() {
  if (this.positionChanged) {
    this.emit('playerMoved', { x: this.x, y: this.y });
  }
}

App.init() {
  Player.on('playerMoved', (pos) => {
    this.updateLocationDisplay(pos); // App decides how to show it
  });
}
```

---

### Anti-Pattern 2: Rendering During Update Pass
**What:** Drawing to canvas inside `update()` methods instead of dedicated `render()`.

**Why bad:**
- Breaks fixed timestep pattern (updates run N times, renders run once)
- Wastes CPU (drawing same frame multiple times)
- Makes debugging harder (where is rendering happening?)

**Instead:**
- `update()` only modifies state (positions, flags)
- `render()` only reads state and draws

**Reference:** [Game Programming Patterns - Update Method](https://gameprogrammingpatterns.com/update-method.html)

---

### Anti-Pattern 3: Absolute Coordinates Without Camera
**What:** Hardcoding screen positions like `ctx.drawImage(player, 320, 240)` instead of using world-to-screen transform.

**Why bad:**
- Player stuck at screen center forever
- Can't implement camera shake, zoom, or smooth following
- World size limited to viewport size

**Instead:** Always use `worldToScreen()` transformation.

---

### Anti-Pattern 4: God Object (Everything in Engine)
**What:** Engine module handling rendering, physics, input, AI, sound, etc.

**Why bad:**
- 1000+ line files impossible to navigate
- Changes risk breaking unrelated features
- Can't test systems independently

**Instead:**
- Engine coordinates systems but doesn't implement them
- Separate modules: Player (input), World (collision), Buildings (interactions)
- Engine calls `Player.update()`, `World.update()`, etc.

**Reference:** [Game Programming Patterns - Architecture](https://gameprogrammingpatterns.com/architecture-performance-and-games.html) warns against this explicitly.

---

### Anti-Pattern 5: Synchronous Asset Loading
**What:** Blocking initialization while loading images/data.

**Why bad:**
- Blank screen during load (bad UX)
- Hard to show loading progress
- Doesn't work with `file://` protocol (CORS)

**Instead (current approach is correct):**
- Show loading screen immediately
- Generate sprites programmatically (instant)
- If future: async load, show progress bar
- Hide loading screen when `loaded = true`

---

### Anti-Pattern 6: Pixel-Perfect Collision
**What:** Using exact sprite pixels for collision instead of simplified hitboxes.

**Why bad:**
- Expensive (iterate all pixels per collision check)
- Feels unfair (player gets stuck on tiny sprite edges)
- Doesn't work well at different scales

**Instead (current approach is correct):**
- Tile-based collision (binary: walkable/blocked)
- Simple rectangle hitboxes for non-tile collisions
- Generous hitboxes feel responsive

---

## Scalability Considerations

### Map Size

| Concern | Small (20x15) | Medium (100x100) | Large (500x500) |
|---------|---------------|------------------|-----------------|
| **Storage** | Arrays in JS | Arrays in JS | Chunked JSON files |
| **Rendering** | Full map | Viewport culling | Viewport culling + level streaming |
| **Collision** | Array lookup | Spatial hash | Spatial hash + chunking |
| **Memory** | <1MB | ~5MB | Lazy load chunks |

**Current codebase:** Medium-ready (40x30 maps with culling).

---

### Entity Count

| Concern | Few (<10) | Many (10-100) | Massive (100+) |
|---------|-----------|---------------|----------------|
| **Update loop** | Array iteration | Array iteration | Spatial partitioning |
| **Rendering** | Draw all | Viewport culling | Culling + object pooling |
| **AI/Pathfinding** | Per-frame | Time-sliced | Worker threads |

**Current codebase:** Optimized for "Few" (player + static world).

**To scale:** Add Entity Component System (ECS) when introducing NPCs, enemies, or dynamic objects.

---

### Content Volume

| Concern | Static (current) | Dynamic (50+ items) | CMS-driven (100s) |
|---------|------------------|---------------------|-------------------|
| **Content storage** | `content.json.js` | `content.json.js` | External API/CMS |
| **Loading** | Page load | Page load | Lazy fetch on demand |
| **Editing** | Edit JS file | Edit JSON | Web CMS interface |

**Current codebase:** Static approach works well for personal portfolio.

**Evolution path:** Extract to `content.json`, future: fetch from Contentful/Strapi.

---

### User Interactions

| Concern | Modal (current) | Simultaneous | Real-time multiplayer |
|---------|-----------------|--------------|----------------------|
| **State** | Boolean flags | State stack | Server authoritative |
| **Input** | Direct key checks | Input buffering | Client prediction |
| **Rendering** | Pause world | Overlay UI | Interpolation |

**Current codebase:** Modal interactions (dialog pauses movement).

**To scale:** Implement State Stack pattern when adding inventory, menus, settings.

---

## GitHub Pages Deployment Constraints

**Critical constraints for static hosting:**

1. **No server-side code:** Everything runs in browser
2. **No database:** Content must be static files or external APIs
3. **No dynamic routing:** Use hash-based routing (`#research`) or client-side router
4. **CORS restrictions:** Can't load local JSON with `file://` protocol

**Architecture decisions driven by these constraints:**

| Requirement | Solution |
|-------------|----------|
| Content storage | JavaScript file (`content.json.js`) not pure JSON |
| Asset loading | Programmatic sprite generation (no external images) |
| Navigation | Hash-based routing + SPA pattern |
| State persistence | LocalStorage for user preferences |
| Build process | None required (deploy raw HTML/CSS/JS) |

**Benefits of these constraints:**
- Ultra-simple deployment (push to GitHub, auto-publish)
- Works offline (`file://` protocol)
- Fast loading (no server round-trips)
- Free hosting forever

---

## Build Order Recommendations

When implementing features, follow this dependency order:

### Phase 1: Foundation
1. **Content Data Structure** - Define schema in `content.json.js`
2. **App Controller** - Mode switching, navigation
3. **Content Renderer** - HTML templates (normal mode works standalone)

**Why first:** Establishes contract between modes. Normal mode can be developed/tested without game.

---

### Phase 2: Game Core
4. **Sprite System** - Generate visual assets
5. **World/Tilemap** - Map data structures + collision
6. **Game Engine** - Loop, camera, rendering pipeline

**Why second:** Game can render static worlds. Useful for debugging map layouts visually.

---

### Phase 3: Interactivity
7. **Player System** - Input, movement, animation
8. **Interaction System** - Dialogs, building transitions

**Why third:** Requires both game foundation and content to be in place.

---

### Phase 4: Content Integration
9. **Connect interactions to content data**
10. **Build interior maps** for each content section
11. **Polish dialogs and messaging**

**Why fourth:** Both modes exist, now unify them around shared content.

---

### Phase 5: Polish
12. **Mobile controls** (touch input)
13. **Loading screens and transitions**
14. **Audio (optional)**
15. **Analytics (optional)**

**Why last:** Non-blocking enhancements. Game is functional without them.

---

## Component Communication Patterns

### Pattern: Pub/Sub for Cross-Cutting Events

**When to use:** Events that multiple unrelated components care about.

**Example:**
```javascript
// Event bus
Events = {
  listeners: {},
  on(event, callback) { ... },
  emit(event, data) { ... }
};

// Player emits location changes
Player.update() {
  if (this.tileChanged) {
    Events.emit('player:moved', { x: this.x, y: this.y });
  }
}

// Multiple systems listen
Engine.init() {
  Events.on('player:moved', (pos) => this.updateCamera(pos));
  Events.on('player:moved', (pos) => this.checkLocationTransition(pos));
  Events.on('player:moved', (pos) => this.updateHUD(pos));
}
```

**Benefits:** Decouples player from all dependent systems.

---

### Pattern: Direct Function Calls for Core Dependencies

**When to use:** Player needs World collision data every frame.

**Example:**
```javascript
// Direct dependency
Player.update() {
  const targetX = this.x + this.velocityX;
  const targetY = this.y + this.velocityY;

  if (World.isWalkable(targetX, targetY)) {
    this.x = targetX;
    this.y = targetY;
  }
}
```

**Benefits:** Simple, explicit, performant. No indirection needed for tight coupling.

---

### Pattern: Dependency Injection for Testability

**When to use:** Want to test component with mock dependencies.

**Example:**
```javascript
// Instead of:
Player.update() {
  World.isWalkable(...);  // Hard dependency
}

// Inject:
Player.init(worldProvider) {
  this.world = worldProvider;
}

Player.update() {
  this.world.isWalkable(...);  // Can inject mock
}

// Test with mock
const mockWorld = { isWalkable: () => true };
Player.init(mockWorld);
```

**Benefits:** Enables unit testing without full World initialization.

**Trade-off:** More complex setup. Only use where testing is critical.

---

## Migration Paths

### From Current Architecture to ECS (if needed)

**When:** Adding NPCs, enemies, items, particles (10+ dynamic entities).

**Migration steps:**
1. Extract player data to component objects: `{ position, sprite, input, physics }`
2. Create Entity manager: `entities = [player, npc1, npc2, ...]`
3. Create Systems: `InputSystem.update(entities)`, `PhysicsSystem.update(entities)`
4. Refactor update loop to iterate entities per system

**Don't do this unless actually needed.** Current architecture works fine for static world + 1 player.

---

### From Programmatic Sprites to Sprite Sheets (if needed)

**When:** Artist collaboration, complex animations, photo-realistic style.

**Migration steps:**
1. Create sprite sheet PNG with grid layout
2. Replace `Sprites.create*()` with `Sprites.load(url, tileWidth, tileHeight)`
3. Update `Sprites.get(name)` to return sub-rectangle of sheet
4. Add loading screen (async image loading)

**Keep current approach until visual complexity demands it.**

---

### From Hash Routing to History API (optional)

**When:** Want clean URLs (`/research` instead of `#research`).

**Migration steps:**
1. Replace `window.location.hash` with `history.pushState()`
2. Add server-side redirect config (GitHub Pages: 404.html trick)
3. Handle browser back/forward with `popstate` event

**Not critical for GitHub Pages.** Hash routing works fine.

---

## Sources

Architecture patterns verified from authoritative sources:

**Tilemap Architecture:**
- [Tiles and Tilemaps Overview - MDN](https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps)
- [Tiled JSON Map Format](https://doc.mapeditor.org/en/stable/reference/json-map-format/)
- [Data Structures for Tile Based Games - GameDev.net](https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/tilemap-based-game-techniques-base-data-struc-r837/)

**Game Architecture Principles:**
- [Game Programming Patterns - Architecture](https://gameprogrammingpatterns.com/architecture-performance-and-games.html)
- [Game Programming Patterns - Component Pattern](https://gameprogrammingpatterns.com/component.html)
- [Entity Component System - Wikipedia](https://en.wikipedia.org/wiki/Entity_component_system)

**State Management:**
- [Creating a State Stack Engine for Games](https://idiallo.com/blog/javascript-game-state-stack-engine)
- [Design Patterns for Games: State Pattern](https://betterprogramming.pub/design-patterns-for-games-state-pattern-97519e0b9165)
- [Building a Canvas Game Engine from Scratch](https://medium.com/@chang_yan/building-a-canvas-game-engine-framework-from-scratch-7ad9cabc420b)

**Progressive Enhancement & Modern Web:**
- [Islands Architecture](https://juniordev4life.com/posts/islands-architecture-the-future-of-performance-optimized-web-development/)
- [Rendering on the Web - web.dev](https://web.dev/articles/rendering-on-the-web)

**Interactive Portfolio Examples:**
- [Bruno Simon's Portfolio](https://bruno-simon.com/) - 3D game-based portfolio
- [Game Developer Portfolio Best Practices](https://www.sitebuilderreport.com/inspiration/game-developer-portfolios)

---

*Architecture research completed: 2026-01-30*
*Confidence: HIGH - Patterns verified against MDN docs, Game Programming Patterns book, and production examples*
