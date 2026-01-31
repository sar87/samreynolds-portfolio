# Phase 4: Core Game Engine - Research

**Researched:** 2026-01-31
**Domain:** 2D tile-based game engine (TypeScript + HTML5 Canvas)
**Confidence:** HIGH

## Summary

Phase 4 implements a custom 2D tile-based game engine using HTML5 Canvas and TypeScript, without adopting a full game framework. This approach is appropriate for this project because:

1. **Simplicity**: The requirements (keyboard movement, camera follow, tile rendering, basic collision) are straightforward and well-understood
2. **Learning value**: Building core systems provides better understanding for academic portfolio context
3. **Control**: Custom implementation avoids framework overhead and lock-in for a relatively simple game
4. **Vite integration**: Direct canvas approach integrates cleanly with existing Vite + TypeScript stack

Research reveals this is a "solved problem" domain with well-established patterns. The challenge is not discovering new approaches but correctly implementing proven techniques: viewport culling for rendering efficiency, delta-time for framerate independence, AABB collision detection for tiles, and lerp-based camera following.

**Primary recommendation:** Implement custom canvas-based engine using established patterns from MDN and game development community, organized into modular systems (Input, Renderer, Camera, Collision, GameLoop).

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | ~5.9.3 | Type safety | Already in project, essential for maintainable game code |
| Vite | ^7.2.4 | Dev server, asset loading | Already in project, handles image imports cleanly |
| HTML5 Canvas | Native | Rendering | Browser-native, no dependencies, excellent performance for 2D |

**No game framework needed.** Phaser (43 FPS benchmark), Excalibur.js, and melonJS are production-ready but add complexity unnecessary for this project's scope. For simple tile-based games (Tetris, Pong, basic RPGs), custom implementation is clearer and more educational.

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None recommended | - | - | This phase has no external dependencies beyond TypeScript + Vite |

**Rationale:** All required functionality (rendering, input, collision, camera) is implementable with browser APIs. Adding libraries would increase bundle size without meaningful benefit.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom engine | Phaser 3 | Phaser provides complete ecosystem (physics, animations, tilemap support) but adds ~800KB and learning curve. Only justified for complex games. |
| Custom engine | Excalibur.js | TypeScript-native, well-documented, but still framework overhead. Better for larger teams or longer projects. |
| Custom engine | melonJS | Tiled map integration built-in, but adds dependency for features we don't need yet (Phase 4 uses simple test map). |

**Decision:** Custom implementation. The phase requirements (movement, camera, collision, rendering) are foundational skills worth implementing directly rather than abstracting behind a framework.

**Installation:**
```bash
# No additional dependencies needed
# TypeScript and Vite already installed
```

## Architecture Patterns

### Recommended Project Structure

```
src/
├── game/
│   ├── core/
│   │   ├── GameLoop.ts       # requestAnimationFrame loop with delta time
│   │   ├── Input.ts          # Keyboard state tracking (keydown/keyup)
│   │   └── Camera.ts         # Viewport transform and lerp follow
│   ├── rendering/
│   │   ├── Renderer.ts       # Canvas drawing, viewport culling
│   │   └── TileMap.ts        # Tile data structure and rendering
│   ├── entities/
│   │   └── Player.ts         # Player position, movement, collision
│   ├── systems/
│   │   ├── Movement.ts       # Process input to update player position
│   │   └── Collision.ts      # AABB collision detection
│   └── Game.ts               # Main game class, system coordination
└── config/
    └── engine.ts             # Already exists (tileSize, scale)
```

**Note:** This structure favors simple classes over ECS (Entity-Component-System). Research shows ECS is overkill for simple games and adds unnecessary complexity. Use ECS when entity interactions become complex (not in Phase 4).

### Pattern 1: Fixed Timestep Game Loop

**What:** Use `requestAnimationFrame` with delta time for framerate-independent updates.

**When to use:** Always for game loops. Ensures consistent physics/movement regardless of device framerate.

**Example:**
```typescript
// Source: MDN Game Development, confirmed by multiple tutorials
class GameLoop {
  private lastTime = 0;
  private readonly targetFPS = 60;
  private readonly fixedDeltaTime = 1 / this.targetFPS;

  start() {
    requestAnimationFrame((time) => this.loop(time));
  }

  private loop(currentTime: number) {
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;

    // Clamp delta time to prevent spiral of death
    const clampedDelta = Math.min(deltaTime, 0.1);

    this.update(clampedDelta);
    this.render();

    requestAnimationFrame((time) => this.loop(time));
  }

  update(dt: number) {
    // Game logic here
  }

  render() {
    // Draw to canvas
  }
}
```

**Why delta time matters:** Moving objects at "100 pixels per frame" runs differently on 30 FPS vs 144 FPS devices. Moving at "100 pixels per second" (`position += 100 * deltaTime`) ensures consistent speed.

### Pattern 2: Keyboard Input State Tracking

**What:** Track key states (pressed/released) rather than event-based movement.

**When to use:** For continuous movement (WASD/arrow keys). Allows simultaneous key presses and smooth diagonal prevention.

**Example:**
```typescript
// Source: MDN Desktop Controls, game development community
class Input {
  private keys = new Map<string, boolean>();

  constructor() {
    window.addEventListener('keydown', (e) => {
      this.keys.set(e.code, true);
      e.preventDefault(); // Prevent arrow key scrolling
    });

    window.addEventListener('keyup', (e) => {
      this.keys.set(e.code, false);
    });
  }

  isKeyPressed(code: string): boolean {
    return this.keys.get(code) || false;
  }

  // Check WASD or arrow keys (both supported per requirements)
  getMovementDirection(): { x: number, y: number } {
    const dir = { x: 0, y: 0 };

    // Use event.code (not event.key) for layout-independence
    if (this.isKeyPressed('KeyW') || this.isKeyPressed('ArrowUp')) dir.y = -1;
    if (this.isKeyPressed('KeyS') || this.isKeyPressed('ArrowDown')) dir.y = 1;
    if (this.isKeyPressed('KeyA') || this.isKeyPressed('ArrowLeft')) dir.x = -1;
    if (this.isKeyPressed('KeyD') || this.isKeyPressed('ArrowRight')) dir.x = 1;

    return dir;
  }
}
```

**Critical detail:** Use `event.code` (physical key position) not `event.key` (character produced). This makes WASD work on non-QWERTY keyboards (AZERTY, QWERTZ, etc.).

### Pattern 3: Camera Lerp Follow with Edge Clamping

**What:** Camera smoothly follows player using linear interpolation, clamped to map boundaries.

**When to use:** Always for smooth camera movement. Creates professional feel vs instant camera snap.

**Example:**
```typescript
// Source: Community tutorials, framerate-independent lerp formula
class Camera {
  x = 0;
  y = 0;

  constructor(
    private readonly viewportWidth: number,
    private readonly viewportHeight: number,
    private readonly mapWidth: number,
    private readonly mapHeight: number
  ) {}

  follow(targetX: number, targetY: number, deltaTime: number) {
    // Lerp factor: higher = faster catch-up
    // Context decision: ~0.2s catch-up means lerp ~10-15
    const lerpSpeed = 10;

    // Framerate-independent lerp (not linear lerp)
    // Formula: a + (b - a) * (1 - exp(-speed * dt))
    const lerpFactor = 1 - Math.exp(-lerpSpeed * deltaTime);

    // Center camera on target
    const targetCamX = targetX - this.viewportWidth / 2;
    const targetCamY = targetY - this.viewportHeight / 2;

    // Smooth interpolation
    this.x += (targetCamX - this.x) * lerpFactor;
    this.y += (targetCamY - this.y) * lerpFactor;

    // Clamp to map edges (no void visible)
    this.x = Math.max(0, Math.min(this.x, this.mapWidth - this.viewportWidth));
    this.y = Math.max(0, Math.min(this.y, this.mapHeight - this.viewportHeight));
  }

  // Convert world coordinates to screen coordinates
  worldToScreen(worldX: number, worldY: number) {
    return {
      x: worldX - this.x,
      y: worldY - this.y
    };
  }
}
```

**Why framerate-independent lerp:** Standard `lerp(a, b, t)` formula produces different results at different framerates. Exponential smoothing (`1 - exp(-speed * dt)`) ensures consistent behavior.

### Pattern 4: AABB Tile-Based Collision

**What:** Axis-aligned bounding box collision with tile grid. Check player's intended position against tile map before moving.

**When to use:** For tile-based games with grid-aligned obstacles. Simpler and faster than pixel-perfect or polygon collision.

**Example:**
```typescript
// Source: MDN, community tutorials on tile collision
class Collision {
  constructor(private tileMap: TileMap) {}

  // Check if a rectangular area collides with solid tiles
  isCollidingWithTiles(x: number, y: number, width: number, height: number): boolean {
    const tileSize = 32;

    // Get tile coordinates for all corners of the bounding box
    const left = Math.floor(x / tileSize);
    const right = Math.floor((x + width - 1) / tileSize);
    const top = Math.floor(y / tileSize);
    const bottom = Math.floor((y + height - 1) / tileSize);

    // Check all tiles the player overlaps
    for (let row = top; row <= bottom; row++) {
      for (let col = left; col <= right; col++) {
        if (this.tileMap.isSolid(col, row)) {
          return true;
        }
      }
    }

    return false;
  }

  // Move player with collision prevention (hard stop)
  moveWithCollision(
    currentX: number,
    currentY: number,
    deltaX: number,
    deltaY: number,
    width: number,
    height: number
  ): { x: number, y: number } {
    // Test X axis separately (prevents sticky walls)
    let newX = currentX;
    if (!this.isCollidingWithTiles(currentX + deltaX, currentY, width, height)) {
      newX += deltaX;
    }

    // Test Y axis separately
    let newY = currentY;
    if (!this.isCollidingWithTiles(newX, currentY + deltaY, width, height)) {
      newY += deltaY;
    }

    return { x: newX, y: newY };
  }
}
```

**Critical technique:** Process X and Y movement separately. This prevents "sticky walls" where diagonal movement into corners gets stuck. If moving diagonally into a corner, at least one axis succeeds.

### Pattern 5: Viewport Culling for Tile Rendering

**What:** Only render tiles visible in the viewport, not the entire map.

**When to use:** Always for tile maps larger than viewport. Massive performance improvement.

**Example:**
```typescript
// Source: MDN Tilemap optimization, Love2D community
class Renderer {
  constructor(private ctx: CanvasRenderingContext2D) {}

  renderTiles(tileMap: TileMap, camera: Camera, tileSize: number, scale: number) {
    const renderedSize = tileSize * scale;

    // Calculate visible tile range
    const startCol = Math.floor(camera.x / renderedSize);
    const endCol = Math.ceil((camera.x + this.ctx.canvas.width) / renderedSize);
    const startRow = Math.floor(camera.y / renderedSize);
    const endRow = Math.ceil((camera.y + this.ctx.canvas.height) / renderedSize);

    // Only loop through visible tiles
    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        const tile = tileMap.getTile(col, row);
        if (!tile) continue;

        const screenPos = camera.worldToScreen(
          col * renderedSize,
          row * renderedSize
        );

        // Draw tile at screen position
        // Use integer coordinates to avoid sub-pixel rendering
        this.ctx.drawImage(
          tile.image,
          tile.sx, tile.sy, tileSize, tileSize, // Source rect
          Math.floor(screenPos.x), Math.floor(screenPos.y), // Dest position (integer!)
          renderedSize, renderedSize // Dest size
        );
      }
    }
  }
}
```

**Performance impact:** For a 100x100 tile map, viewport culling renders ~200 tiles instead of 10,000. That's a 50x performance improvement.

### Anti-Patterns to Avoid

- **Scaling images in drawImage:** Pre-scale tile images once at load time, not every frame. Scaling in `drawImage` is expensive.
- **Sub-pixel coordinates:** Always use `Math.floor()` on coordinates passed to `drawImage`. Sub-pixel rendering triggers anti-aliasing calculations on every frame, destroying performance.
- **Redrawing static content:** Use layered canvases or offscreen canvas for static backgrounds. Don't redraw unchanging tiles every frame.
- **Setting canvas size in CSS:** Set canvas width/height via the `width` and `height` attributes, not CSS. CSS stretches the canvas, causing blurry rendering.
- **Using `setInterval` for game loop:** Always use `requestAnimationFrame`. It syncs with browser refresh rate and pauses when tab is hidden.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Complex physics | Custom physics engine | Matter.js, Box2D | Edge cases: tunneling, rotation, friction, restitution. Physics engines handle these correctly. |
| Sprite animation | Manual frame tracking | Spritesheet class | Off-by-one errors, timing issues. Well-tested solutions exist. |
| Tilemap editor integration | Custom format parser | Tiled JSON loader | Tiled is industry standard, has complex features (layers, objects, properties). |
| Audio management | Raw Audio API | Howler.js, Tone.js | Cross-browser compatibility, sprite sheets, spatial audio. |

**Key insight for Phase 4:** Keep it simple. This phase uses basic primitives (render tiles, read keyboard, move player). Don't add complexity until needed.

**What TO hand-roll in Phase 4:**
- Game loop (25 lines of code, teaches core concept)
- Input handling (20 lines, simple key state map)
- AABB collision (30 lines, teaches spatial reasoning)
- Camera lerp (15 lines, framerate-independence lesson)
- Tile renderer with culling (40 lines, performance fundamentals)

These are educational and appropriately scoped for this phase.

## Common Pitfalls

### Pitfall 1: Framerate-Dependent Movement

**What goes wrong:** Player moves at different speeds on different devices. 60 FPS device moves 2x faster than 30 FPS device.

**Why it happens:** Developers write `position += speed` instead of `position += speed * deltaTime`.

**How to avoid:**
- Always multiply movement by delta time
- Delta time in seconds (divide by 1000 if using milliseconds)
- Think in "units per second" not "units per frame"

**Warning signs:** Movement feels different on different devices, animations speed up/slow down with frame rate changes.

### Pitfall 2: Sub-Pixel Rendering Performance Killer

**What goes wrong:** Game runs at 15 FPS on mid-range hardware despite simple graphics.

**Why it happens:** Passing floating-point coordinates to `drawImage` triggers anti-aliasing on every pixel, every frame.

**How to avoid:**
- Use `Math.floor()` on all X/Y coordinates before `drawImage`
- Store positions as floats (smooth sub-pixel movement) but render as integers
- Example: `ctx.drawImage(img, Math.floor(x), Math.floor(y))`

**Warning signs:** Performance profiler shows excessive time in rendering, game slower on integrated graphics.

**Detection:** Compare performance with/without `Math.floor()`. Should see 2-3x FPS improvement.

### Pitfall 3: Sticky Wall Collision

**What goes wrong:** Player gets stuck when moving diagonally into corners or along walls.

**Why it happens:** Processing X and Y movement together. If diagonal movement fails, player doesn't slide along wall.

**How to avoid:**
- Process X axis movement separately, check collision, apply
- Process Y axis movement separately, check collision, apply
- Never combine X/Y into single collision check

**Warning signs:** Player stops completely when hitting corner at angle, can't slide along walls.

### Pitfall 4: Canvas Size vs CSS Size Confusion

**What goes wrong:** Game renders blurry or pixelated despite correct assets.

**Why it happens:** Setting canvas size via CSS stretches the rendering buffer instead of changing buffer size.

**How to avoid:**
```typescript
// WRONG - stretches 300x150 default buffer
canvas.style.width = '800px';
canvas.style.height = '600px';

// RIGHT - sets buffer size
canvas.width = 800;
canvas.height = 600;
```

**Detection:** Canvas looks blurry or pixelated. Check if `canvas.width` matches `canvas.style.width`.

### Pitfall 5: Memory Leak from Image Loading

**What goes wrong:** Browser eventually crashes or slows down after playing for several minutes.

**Why it happens:** Creating new `Image()` objects in the render loop or update loop.

**How to avoid:**
- Load all images once at startup
- Store in a cache/registry (Map or object)
- Reuse same Image objects every frame

**Warning signs:** Memory usage grows continuously, DevTools shows thousands of Image objects.

### Pitfall 6: Event Listener Memory Leaks

**What goes wrong:** Multiple game instances add listeners but never remove them.

**Why it happens:** Adding `keydown`/`keyup` listeners without cleanup.

**How to avoid:**
```typescript
class Input {
  private keydownHandler = (e: KeyboardEvent) => { /* ... */ };
  private keyupHandler = (e: KeyboardEvent) => { /* ... */ };

  start() {
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);
  }

  destroy() {
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('keyup', this.keyupHandler);
  }
}
```

**Detection:** Multiple keypress events fire for single key press. Check DevTools Event Listeners panel.

### Pitfall 7: Lerp Camera Judder at Low Resolution

**What goes wrong:** Camera movement appears jerky or stuttery in pixel-art games.

**Why it happens:** Lerp produces sub-pixel camera positions. When rounded for rendering, camera appears to stutter.

**How to avoid:**
- For pixel-art games with low resolution, consider snap-to-pixel camera
- Or use higher lerp speed to reduce time spent at sub-pixel positions
- Or accept sub-pixel smoothness (player won't notice at 2x scale)

**Warning signs:** Camera movement looks choppy despite smooth FPS. Only visible in pixel-art games.

**Note for Phase 4:** At 2x scale (64px tiles), this is unlikely to be noticeable. Use standard lerp.

## Code Examples

Verified patterns from official sources:

### Asset Loading with Vite

```typescript
// Source: Vite official docs (vite.dev/guide/assets)
// Import tile images as URLs
import grassTile from '../assets/tiles/grass.png';
import waterTile from '../assets/tiles/water.png';

class AssetLoader {
  private images = new Map<string, HTMLImageElement>();

  async loadImage(name: string, url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images.set(name, img);
        resolve();
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  async loadAll() {
    await Promise.all([
      this.loadImage('grass', grassTile),
      this.loadImage('water', waterTile),
      // ... more tiles
    ]);
  }

  getImage(name: string): HTMLImageElement | undefined {
    return this.images.get(name);
  }
}
```

**Note:** Vite transforms `import image from './file.png'` into a URL string. In dev, absolute path; in production, hashed filename for cache-busting.

### Canvas Setup with Proper Sizing

```typescript
// Source: MDN Canvas API optimization guide
class CanvasManager {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');

    // CRITICAL: Disable alpha channel if not needed (10-30% performance boost)
    this.ctx = this.canvas.getContext('2d', { alpha: false })!;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize() {
    // Get display size (CSS pixels)
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    // Account for device pixel ratio (Retina displays)
    const dpr = window.devicePixelRatio || 1;

    // Set buffer size (actual pixels)
    this.canvas.width = displayWidth * dpr;
    this.canvas.height = displayHeight * dpr;

    // Set display size (CSS pixels)
    this.canvas.style.width = `${displayWidth}px`;
    this.canvas.style.height = `${displayHeight}px`;

    // Scale context to match DPI
    this.ctx.scale(dpr, dpr);
  }
}
```

**Important:** This handles high-DPI displays correctly. Without DPI scaling, game looks blurry on Retina/4K displays.

### Hybrid Movement (Context Requirement)

```typescript
// Context decision: smooth sub-tile while held, snap on release
class Player {
  x = 0;
  y = 0;
  private targetX = 0;
  private targetY = 0;
  private readonly speed = 128; // 4 tiles/second at 32px tiles
  private readonly snapSpeed = 8; // Lerp factor for grid snapping

  update(input: Input, collision: Collision, deltaTime: number) {
    const dir = input.getMovementDirection();
    const tileSize = 32;
    const scale = 2;
    const renderedSize = tileSize * scale;

    if (dir.x !== 0 || dir.y !== 0) {
      // Keys held: smooth movement
      const deltaX = dir.x * this.speed * deltaTime;
      const deltaY = dir.y * this.speed * deltaTime;

      // Apply collision (4-directional only, no diagonals per context)
      if (dir.x !== 0 && dir.y === 0) {
        const result = collision.moveWithCollision(this.x, this.y, deltaX, 0, renderedSize, renderedSize);
        this.x = result.x;
      } else if (dir.y !== 0 && dir.x === 0) {
        const result = collision.moveWithCollision(this.x, this.y, 0, deltaY, renderedSize, renderedSize);
        this.y = result.y;
      }

      // Update snap target to current position
      this.targetX = this.x;
      this.targetY = this.y;
    } else {
      // Keys released: snap to nearest tile center
      this.targetX = Math.round(this.x / renderedSize) * renderedSize;
      this.targetY = Math.round(this.y / renderedSize) * renderedSize;

      // Smooth lerp to target
      this.x += (this.targetX - this.x) * this.snapSpeed * deltaTime;
      this.y += (this.targetY - this.y) * this.snapSpeed * deltaTime;

      // Snap when close enough (avoid infinite lerp)
      if (Math.abs(this.x - this.targetX) < 0.5) this.x = this.targetX;
      if (Math.abs(this.y - this.targetY) < 0.5) this.y = this.targetY;
    }
  }
}
```

**Note:** This implements the context decision for hybrid movement. Other projects might use pure grid-based or pure smooth movement.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `setInterval` game loop | `requestAnimationFrame` | ~2012 (IE10) | Better performance, battery life, pauses when tab hidden |
| Linear lerp with fixed factor | Exponential smoothing | Ongoing | Framerate-independent interpolation |
| `event.keyCode` | `event.code` | 2017 (deprecated) | Keyboard layout independence |
| Pure JavaScript | TypeScript | Ongoing | Type safety, better IDE support, fewer runtime errors |
| jQuery for DOM | Vanilla JS | 2015+ | Modern browsers support everything, jQuery overhead unnecessary |
| Bower/Browserify | Vite/Rollup | 2020+ | Faster builds, native ESM, better tree-shaking |

**Deprecated/outdated:**
- **`keyCode`**: Use `code` or `key` instead. `keyCode` is non-standard and gives wrong values on non-US keyboards.
- **`setInterval` for animation**: Use `requestAnimationFrame`. It's hardware-accelerated and battery-friendly.
- **Canvas fallback content**: Modern browsers (99.9%+) support Canvas. No need for "Your browser doesn't support canvas" messages.
- **Vendor prefixes for `requestAnimationFrame`**: All browsers support unprefixed version since 2014.

## Open Questions

Things that couldn't be fully resolved:

1. **Optimal lerp speed for camera follow**
   - What we know: Context specifies ~0.2s catch-up, typical lerp speeds are 5-15
   - What's unclear: Exact feel depends on map size, movement speed, personal preference
   - Recommendation: Start with lerp speed 10, add dev UI to adjust in real-time, commit final value after playtesting

2. **Player sprite hitbox size**
   - What we know: LPC character sprites are 32x48px (32 width, 48 height including head)
   - What's unclear: Should collision use full 32x48 or smaller hitbox (like 32x32 for feet only)?
   - Recommendation: Start with 32x32 hitbox (matches tile size), feels more forgiving. Adjust if needed.

3. **Debug UI necessity**
   - What we know: Context lists "debug UI if useful" as Claude's discretion
   - What's unclear: Is it worth implementing in Phase 4 vs later?
   - Recommendation: Yes, minimal debug overlay (FPS, player tile coords) is ~20 lines and invaluable for testing camera, collision, and performance

4. **Canvas clear strategy**
   - What we know: Can use `clearRect()`, `fillRect()`, or not clear if redrawing everything
   - What's unclear: Which is fastest for tile-based game with full-screen redraw?
   - Recommendation: Use `ctx.fillRect(0, 0, width, height)` with background color. Faster than `clearRect` when redrawing entire viewport.

## Sources

### Primary (HIGH confidence)

- [MDN: Optimizing Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas) - Canvas performance best practices (2025)
- [MDN: Tilemaps Overview](https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps) - Tile rendering fundamentals (2025)
- [MDN: Desktop Controls](https://developer.mozilla.org/en-US/docs/Games/Techniques/Control_mechanisms/Desktop_with_mouse_and_keyboard) - Input handling patterns
- [MDN: KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) - Layout-independent key codes
- [Vite: Static Asset Handling](https://vite.dev/guide/assets) - Asset import patterns
- [Vite: Features](https://vite.dev/guide/features) - TypeScript integration

### Secondary (MEDIUM confidence)

- [GameFromScratch: JavaScript/TypeScript Game Engines 2025](https://gamefromscratch.com/javascript-typescript-game-engines-in-2025/) - Engine ecosystem overview
- [GitHub: JS Game Rendering Benchmark](https://github.com/Shirajuki/js-game-rendering-benchmark) - Performance comparisons
- [LogRocket: Best JavaScript Game Engines 2025](https://blog.logrocket.com/best-javascript-html5-game-engines-2025/) - Framework evaluation
- [Excalibur.js Official Site](https://excaliburjs.com/) - TypeScript game engine docs
- [melonJS Official Site](https://melonjs.org/) - Tile-based engine with Tiled support
- [Sandro Maglione: Game Rendering Loop](https://www.sandromaglione.com/articles/game-rendering-loop-in-typescript) - TypeScript game loop pattern
- [Spicy Yoghurt: Proper Game Loop](https://spicyyoghurt.com/tutorials/html5-javascript-game-development/create-a-proper-game-loop-with-requestanimationframe) - requestAnimationFrame tutorial
- [BitBull Blog: Lerp Smoothing Tutorial](https://blog.bitbull.com/2019/11/13/a-lerp-smoothing-tutorial-and-example-code/) - Framerate-independent lerp
- [GitHub: bump.ts](https://github.com/hood/bump.ts) - TypeScript AABB collision library
- [Jonathan Whiting: 2D Tilemap Collision](https://jonathanwhiting.com/tutorial/collision/) - Collision detection tutorial
- [AG Grid Blog: Optimising Canvas Rendering](https://blog.ag-grid.com/optimising-html5-canvas-rendering-best-practices-and-techniques/) - Canvas optimization techniques
- [web.dev: Canvas Performance](https://web.dev/canvas-performance/) - Google's canvas optimization guide
- [Medium: Understanding Delta Time](https://drewcampbell92.medium.com/understanding-delta-time-b53bf4781a03) - Delta time explanation
- [peerdh.com: Optimizing Tile-based Rendering](https://peerdh.com/blogs/programming-insights/optimizing-tile-based-rendering-performance-in-love2d-with-lua-1) - Viewport culling techniques

### Tertiary (LOW confidence)

- Various Stack Overflow discussions on canvas performance (no single authoritative source)
- Community blog posts on game development patterns (useful for validation but not primary references)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Established ecosystem, clear documentation, verified approaches
- Architecture: HIGH - Proven patterns from MDN and community, multiple sources agree
- Pitfalls: HIGH - Well-documented common mistakes, verified through official docs and community wisdom
- Code examples: HIGH - All examples derived from official docs or well-tested community patterns

**Research date:** 2026-01-31
**Valid until:** ~60 days (March 2026) - Canvas API and TypeScript game patterns are stable, unlikely to change rapidly. Vite asset handling is mature.

**Research notes:**
- No game framework needed for this phase - custom implementation is appropriate
- All required functionality achievable with browser APIs and TypeScript
- Performance optimization techniques are well-established and documented
- Community consensus: ECS overkill for simple games, use when complexity demands it
- LPC sprite assets (32x32 tiles) confirmed compatible with standard tile rendering patterns
