# Phase 9: Change Game - Research

**Researched:** 2026-02-01
**Domain:** Sprite asset replacement, Pokemon GBA sprite extraction, HTML5 Canvas tilemap rendering
**Confidence:** HIGH

## Summary

This phase involves replacing LPC sprite assets with Pokemon FireRed/LeafGreen sprites while maintaining the existing gameplay concept. The research reveals critical technical differences between the current system and Pokemon GBA sprites that must be addressed.

**Key technical findings:**
- Pokemon GBA overworld sprites are 16x32 pixels (16 wide, 32 tall) for characters, not 16x16 tiles
- Map tiles are 16x16 pixels in GBA Pokemon games
- Current system uses programmatically generated 16x16 tiles at 3x scale (48px rendered)
- Pokemon sprites are pre-rendered pixel art from sprite sheets that need extraction
- Pallet Town has exactly 3 buildings: Player House, Rival House, Oak's Lab
- Current system has 5 buildings with content that needs consolidation to 3

**Primary recommendation:** Replace the programmatic sprite generation system (sprites.js) with an image-based sprite sheet system using HTML5 Canvas drawImage() with source coordinates. Maintain 16x16 base tile size but handle 16x32 character sprites. Scale factor may need adjustment from 3x to 2x or 4x for optimal rendering.

## Standard Stack

The established approach for sprite sheet management in HTML5 canvas games:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| HTML5 Canvas API | Native | Sprite rendering via drawImage() | Standard for 2D browser games, no dependencies needed |
| Native Image API | Native | Loading sprite sheet PNGs | Built-in, async image loading |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| N/A | N/A | No additional libraries needed | Canvas API sufficient for sprite extraction |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Canvas drawImage | CSS sprites | Canvas allows pixel-perfect scaling control and dynamic rendering |
| Manual extraction | Sprite packing tool | Manual extraction simpler for fixed sprite sheets, tools add build complexity |

**Installation:**
```bash
# No npm packages needed - using native Web APIs
```

## Architecture Patterns

### Current vs Target Architecture

**Current System (Programmatic):**
```
sprites.js
├── createAllSprites()
│   ├── createCharacterSprites() - draws pixels programmatically
│   ├── createTileSprites() - draws terrain programmatically
│   ├── createBuildingSprites() - draws structures programmatically
│   └── cache[] - stores generated canvas elements
└── get(spriteName) - returns cached canvas
```

**Target System (Sprite Sheet):**
```
sprites.js
├── loadSpriteSheets()
│   ├── loadImage('pallet-town.png')
│   ├── loadImage('npc-overworld.png')
│   └── Promise.all() - wait for all loads
├── spriteCoordinates{} - maps sprite names to (sx, sy, sw, sh)
└── get(spriteName) - returns {image, sx, sy, sw, sh}
```

### Pattern 1: Sprite Sheet Coordinate Mapping

**What:** Store sprite sheet coordinates in a lookup object that maps logical sprite names to their position in the source image.

**When to use:** Always when working with pre-made sprite sheets (like Pokemon assets).

**Example:**
```javascript
// Sprite coordinate definitions
const SPRITE_COORDS = {
  // Character sprites (16x32 each, 4 frames per direction)
  'player_down_0': { sx: 0, sy: 0, sw: 16, sh: 32 },
  'player_down_1': { sx: 16, sy: 0, sw: 16, sh: 32 },
  'player_down_2': { sx: 32, sy: 0, sw: 16, sh: 32 },
  'player_down_3': { sx: 48, sy: 0, sw: 16, sh: 32 },

  // Map tiles (16x16 each)
  'grass': { sx: 0, sy: 64, sw: 16, sh: 16 },
  'path': { sx: 16, sy: 64, sw: 16, sh: 16 },
};

// Usage in rendering
ctx.drawImage(
  spriteSheet,           // source image
  coords.sx, coords.sy,  // source x, y
  coords.sw, coords.sh,  // source width, height
  destX, destY,          // destination x, y
  destW, destH           // destination width, height (scaled)
);
```

### Pattern 2: Async Sprite Sheet Loading

**What:** Load sprite sheets asynchronously before game starts, using Promise-based image loading.

**When to use:** Always for external sprite assets.

**Example:**
```javascript
// Source: MDN Web Docs, common game dev pattern
const Sprites = {
  sheets: {},

  async loadSpriteSheet(name, path) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.sheets[name] = img;
        resolve(img);
      };
      img.onerror = reject;
      img.src = path;
    });
  },

  async init() {
    await Promise.all([
      this.loadSpriteSheet('town', '/Pokemon Sprites/pallet-town.png'),
      this.loadSpriteSheet('npcs', '/Pokemon Sprites/npc-overworld.png')
    ]);
  }
};
```

### Pattern 3: Character Sprite Animation (4-frame walk cycle)

**What:** Pokemon GBA characters use 4-frame walk cycles in 4 directions (16 frames total: down, left, right, up).

**When to use:** For player character animation matching Pokemon style.

**Example:**
```javascript
// Frame calculation based on current direction and animation frame
getCharacterFrame(direction, frame) {
  const directionOffsets = {
    'down': 0,
    'left': 1,
    'right': 2,
    'up': 3
  };

  const row = directionOffsets[direction];
  const col = frame % 4; // 0-3 frame cycle

  return {
    image: this.sheets.npcs,
    sx: col * 16,      // Character width is 16px
    sy: row * 32,      // Character height is 32px (row offset)
    sw: 16,
    sh: 32
  };
}
```

### Pattern 4: Tile Rendering with Sprite Sheet

**What:** Extract individual tiles from a tileset sprite sheet for map rendering.

**When to use:** For all terrain, building, and object tiles.

**Example:**
```javascript
// Render a tile from sprite sheet
renderTile(tileType, tileX, tileY) {
  const coords = this.getTileCoords(tileType);
  if (!coords) return;

  const screenX = (tileX * this.tileSize - this.camera.x) * this.scale;
  const screenY = (tileY * this.tileSize - this.camera.y) * this.scale;

  this.ctx.drawImage(
    this.sheets.town,           // Sprite sheet image
    coords.sx, coords.sy,        // Source position in sheet
    coords.sw, coords.sh,        // Source size (usually 16x16)
    Math.floor(screenX),         // Destination X
    Math.floor(screenY),         // Destination Y
    this.tileSize * this.scale,  // Destination width (scaled)
    this.tileSize * this.scale   // Destination height (scaled)
  );
}
```

### Anti-Patterns to Avoid

- **Loading sprite sheets synchronously:** Will block rendering and cause visible delay. Always use async/await or Promises.
- **Not caching sprite coordinates:** Recalculating coordinates every frame wastes CPU. Define them once in a lookup object.
- **Hardcoding pixel coordinates in rendering code:** Makes the code brittle and hard to modify. Use named constants or lookup objects.
- **Mixing tile sizes inconsistently:** GBA Pokemon uses 16x16 tiles and 16x32 characters. Keep these consistent throughout the codebase.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sprite sheet packing/atlas generation | Custom sprite combiner | Manual sprite sheets from Spriters Resource | Pokemon sprites already organized in optimal sheets, repacking adds complexity |
| Image scaling/smoothing | Manual pixel interpolation | CSS `image-rendering: pixelated` + ctx.imageSmoothingEnabled = false | Browser handles pixel-perfect scaling efficiently |
| Sprite animation timing | Custom frame counter | Existing frameTimer/frameDelay pattern in Player.js | Already implemented and working well |
| Coordinate calculation for tiles | Manual math each frame | Pre-calculated lookup object | O(1) lookup vs O(n) calculation |

**Key insight:** The current system's programmatic sprite generation is clever for avoiding assets, but Pokemon sprites are professionally crafted pixel art. Trying to recreate them programmatically would be far more complex than using the original assets with coordinate mapping.

## Common Pitfalls

### Pitfall 1: Character Sprite Height Mismatch
**What goes wrong:** Pokemon GBA characters are 16x32 (twice as tall as tiles), but current system assumes 16x16 sprites. This causes clipping or positioning errors.

**Why it happens:** The current code in player.js and engine.js assumes character sprites are the same size as tiles (16x16).

**How to avoid:**
- Update rendering to handle 16x32 character sprites
- Adjust Y-position calculation to account for 32px height
- Character should render with bottom-center aligned to tile position, not top-left

**Warning signs:**
- Player sprite clipped at top or bottom
- Player appears to "float" above ground
- Collision detection feels off

**Code fix needed:**
```javascript
// Current (assumes 16x16):
const screenY = (Player.pixelY - this.camera.y) * this.scale;

// Fixed (for 16x32 character):
const screenY = (Player.pixelY - this.camera.y - 16) * this.scale; // Offset by 16px (one tile)
```

### Pitfall 2: Scale Factor Mismatch
**What goes wrong:** Current system uses 3x scale (16px → 48px). Pokemon GBA sprites may look better at 2x (32px) or 4x (64px). Wrong scale makes sprites blurry or too pixelated.

**Why it happens:** 3x was chosen for programmatic sprites, but Pokemon sprites have different visual density.

**How to avoid:**
- Test at 2x, 3x, and 4x scales
- Check on different screen sizes (desktop vs mobile)
- Ensure ctx.imageSmoothingEnabled = false for crisp pixels
- Use CSS `image-rendering: pixelated` on canvas

**Warning signs:**
- Sprites look blurry even with smoothing disabled
- UI elements too small or too large on mobile
- Inconsistent visual quality between sprites

### Pitfall 3: Sprite Sheet Coordinate Errors
**What goes wrong:** Off-by-one errors in sx/sy coordinates cause wrong tiles to render or tile bleeding (showing parts of adjacent tiles).

**Why it happens:** Sprite sheets have tightly packed sprites with no padding. A 1px offset shows the wrong sprite.

**How to avoid:**
- Measure coordinates carefully using image editor (GIMP, Photoshop)
- Create coordinate map incrementally, testing each sprite
- Use grid overlay in image editor to verify alignment
- Check for sprite bleeding at different scales

**Warning signs:**
- Thin lines appearing on sprite edges (bleeding from adjacent sprite)
- Completely wrong sprite rendering
- Animation showing wrong frames

### Pitfall 4: Building Content Consolidation
**What goes wrong:** Current system has 5 buildings (Pembroke, Library, Lab, Station, Theatre) but Pallet Town only has 3 (Player House, Rival House, Oak's Lab). Content gets lost or mapping becomes unclear.

**Why it happens:** Not planning content reorganization before deleting buildings.

**How to avoid:**
- Map content before changing code:
  - Player House 1F + 2F: About Me (currently Pembroke) ✓
  - Rival House: Talks + Media (currently Station + Theatre) ✓
  - Oak's Lab: Research (currently Lab) ✓
  - Publications: **NEEDS NEW HOME** - options: Oak's Lab bookshelves, Player House 2F desk, or combine with Research
- Update World.buildings{} object with new structure
- Update Buildings.js interaction handlers for new content locations
- Test that all content remains accessible

**Warning signs:**
- Content from 5 buildings doesn't fit naturally in 3
- Publications content has no logical home
- Interior maps need complete redesign

### Pitfall 5: Tile Type Enumeration Overhaul
**What goes wrong:** Current World.TILES enum has 70+ entries for LPC sprites. Pokemon tiles are completely different. Keeping old enum causes confusion and bugs.

**Why it happens:** Incremental changes without clearing old definitions.

**How to avoid:**
- Create new TILES enum from scratch based on Pallet Town sprite sheet
- Remove all LPC-specific tiles (GOTHIC_WINDOW, MODERN_WALL, etc.)
- Add Pokemon-specific tiles (POKEMON_GRASS, POKEMON_PATH, POKEMON_ROOF, etc.)
- Update all map generation code to use new tile IDs
- Clear old sprite cache

**Warning signs:**
- Code references tile types that don't exist in new sprite sheet
- getTileSprite() returns null for many tiles
- Map renders with missing tiles (black squares)

## Code Examples

Verified patterns from research and official sources:

### Sprite Sheet Loading
```javascript
// Based on: https://spicyyoghurt.com/tutorials/html5-javascript-game-development/images-and-sprite-animations
const Sprites = {
  sheets: {},
  loaded: false,

  async loadImage(name, path) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.sheets[name] = img;
        console.log(`Loaded sprite sheet: ${name}`);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load: ${path}`));
      img.src = path;
    });
  },

  async init() {
    try {
      await Promise.all([
        this.loadImage('palletTown', 'Pokemon Sprites/Game Boy Advance - Pokemon FireRed _ LeafGreen - Maps (Towns, Buildings, Etc.) - Pallet Town.png'),
        this.loadImage('npcs', 'Pokemon Sprites/Game Boy Advance - Pokemon FireRed _ LeafGreen - Trainers & Non-Playable Characters - Overworld NPCs.png')
      ]);
      this.loaded = true;
    } catch (error) {
      console.error('Failed to load sprite sheets:', error);
      throw error;
    }
  }
};
```

### Character Sprite Extraction (16x32)
```javascript
// Based on Pokemon GBA sprite format: 16x32 characters, 4 frames, 4 directions
// Source: https://pokemondb.net/pokebase/339724/ (GBA sprite format)
getCharacterFrame(direction, frame) {
  const dirMap = { 'down': 0, 'left': 1, 'right': 2, 'up': 3 };
  const row = dirMap[direction];
  const col = frame % 4;

  return {
    image: this.sheets.npcs,
    sx: col * 16,        // Frames are 16px wide
    sy: row * 32,        // Rows are 32px tall (16x32 sprite)
    sw: 16,
    sh: 32
  };
}
```

### Tile Rendering with DrawImage
```javascript
// Based on: https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps/Square_tilemaps_implementation:_Static_maps
renderTile(coords, tileX, tileY) {
  if (!coords) return;

  const screenX = (tileX * this.tileSize - this.camera.x) * this.scale;
  const screenY = (tileY * this.tileSize - this.camera.y) * this.scale;

  // Draw from sprite sheet to canvas
  this.ctx.drawImage(
    coords.image,                    // Source sprite sheet
    coords.sx, coords.sy,            // Source position
    coords.sw, coords.sh,            // Source dimensions
    Math.floor(screenX),             // Dest X (floored for crisp rendering)
    Math.floor(screenY),             // Dest Y
    this.tileSize * this.scale,      // Dest width (scaled)
    this.tileSize * this.scale       // Dest height (scaled)
  );
}
```

### Pixel-Perfect Rendering Setup
```javascript
// Based on: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled
setupCanvas() {
  const ctx = this.canvas.getContext('2d');

  // Disable image smoothing for pixel-perfect sprites
  ctx.imageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;

  // CSS for pixel-perfect rendering
  this.canvas.style.imageRendering = 'pixelated';
  this.canvas.style.imageRendering = '-moz-crisp-edges';
  this.canvas.style.imageRendering = 'crisp-edges';
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Programmatic sprite generation | Pre-made sprite sheets with drawImage() | N/A (switching from old to current) | Replaces 500+ lines of sprite drawing code with coordinate lookups |
| 16x16 uniform sprites | 16x16 tiles + 16x32 characters | N/A | Requires separate rendering logic for characters vs tiles |
| LPC/Kenney CC sprites | Pokemon GBA official sprites | Phase 9 | Complete visual redesign, different tile structure |
| 5 buildings (campus theme) | 3 buildings (Pallet Town) | Phase 9 | Content consolidation required, Publications needs new home |

**Deprecated/outdated:**
- **Programmatic sprite generation in sprites.js:** createCharacterSprites(), createTileSprites(), createBuildingSprites() - all 500+ lines will be replaced with coordinate mapping
- **Current World.TILES enum:** Gothic, modern, and campus-specific tiles will be removed, replaced with Pokemon town tiles
- **5-building layout:** Pembroke, Library, Station, Theatre, Lab → replaced with Player House (1F+2F), Rival House, Oak's Lab

## Open Questions

Things that couldn't be fully resolved:

1. **Publications Content Location**
   - What we know: Current Publications in Library building. Pallet Town has no library. 3 buildings available: Player House (1F+2F), Rival House, Oak's Lab.
   - What's unclear: Best thematic fit for Publications content in Pokemon world. Options:
     - Oak's Lab bookshelves (research papers fit scientist theme)
     - Player House 2F desk (personal reading/study)
     - Combine with Research content in Oak's Lab
   - Recommendation: Oak's Lab bookshelves. Professor Oak is a researcher, so academic publications fit the theme. Use existing bookshelf interaction pattern from Library interior.

2. **Optimal Scale Factor**
   - What we know: Current system uses 3x scale (16px → 48px). Pokemon GBA native resolution is 240x160. Common scales for Pokemon sprites are 2x, 3x, or 4x.
   - What's unclear: Which scale looks best for Pokemon sprites on modern screens (desktop + mobile).
   - Recommendation: Test 2x, 3x, 4x during implementation. Start with 3x to minimize changes, then adjust if sprites look too small/large. Mobile may need different scale than desktop.

3. **Sprite Sheet Coordinate Extraction Method**
   - What we know: Pokemon sprite sheets are available. Coordinates must be measured manually or calculated.
   - What's unclear: Best method to extract exact coordinates without tedious manual measurement.
   - Recommendation: Use image editor (GIMP) with grid overlay set to 16x16. Record coordinates for each unique tile/sprite needed. Start with minimal set (grass, path, walls, doors, player sprites) then expand.

4. **Character Sprite Row Location**
   - What we know: User specified "first row under CHARACTERS in NPC sprite sheet" for player character.
   - What's unclear: Exact pixel coordinates of this row in the 238x2967 NPC sprite sheet.
   - Recommendation: Load sprite sheet in image editor during implementation. Locate "CHARACTERS" label, identify first row of sprites below it. Measure exact Y coordinate. Document in code comments.

5. **Map Dimensions**
   - What we know: Current map is 40x30 tiles. Pallet Town in Pokemon is smaller (roughly 20x18 tiles based on game maps).
   - What's unclear: Keep 40x30 for consistency, or resize to match Pallet Town proportions?
   - Recommendation: Resize to approximately 20x20 tiles to match Pallet Town scale. Smaller map is easier to navigate, loads faster. Update World.width and World.height constants.

## Sources

### Primary (HIGH confidence)
- [The Spriters Resource - Pokemon FireRed/LeafGreen Tileset](https://www.spriters-resource.com/game_boy_advance/pokemonfireredleafgreen/asset/3870/) - Official extracted sprite sheets
- [PokemonDB - GBA Sprite Dimensions](https://pokemondb.net/pokebase/339724/what-pixel-size-are-thi-sprites-battle-pokemon-fire-leaf-green) - Pokemon sprite format: 64x64 battle sprites
- [PokemonDB - Overworld Sprite Dimensions](https://pokemondb.net/pokebase/419804/what-are-the-dimensions-of-player-sprites-especially-gen-and) - 16x32 overworld sprites confirmed
- [MDN - Canvas Tilemaps](https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps/Square_tilemaps_implementation:_Static_maps) - Authoritative documentation on tilemap rendering
- [MDN - Image Smoothing](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled) - Pixel-perfect rendering setup
- [Bulbapedia - Pallet Town](https://bulbapedia.bulbagarden.net/wiki/Pallet_Town) - Authoritative Pokemon reference for Pallet Town layout

### Secondary (MEDIUM confidence)
- [Spicy Yoghurt - Canvas Sprite Tutorial](https://spicyyoghurt.com/tutorials/html5-javascript-game-development/images-and-sprite-animations) - Practical sprite sheet tutorial verified with MDN docs
- [James Long - Sprite-based Games with Canvas](https://archive.jlongster.com/Making-Sprite-based-Games-with-Canvas) - Architecture patterns for canvas sprite games
- [DEV Community - Animating Sprite Sheets](https://dev.to/martyhimmel/animating-sprite-sheets-with-javascript-ag3) - Animation frame calculation patterns
- [PokeCommunity - ROM Hacking Sprites Pack](https://www.pokecommunity.com/threads/rom-hacking-sprites-pack-overworlds-trainer-sprites-tilesets-and-more.527581/) - Pokemon sprite format details
- [Eevee Expo - FRLG NPC Sprites](https://eeveeexpo.com/resources/823/) - FireRed/LeafGreen sprite specifications

### Tertiary (LOW confidence)
- [GitHub - pokemon-gba-sprites](https://github.com/magical/pokemon-gba-sprites) - Sprite extraction tool (not verified if maintained)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Canvas API is well-documented, native, and proven for sprite games
- Architecture: HIGH - Sprite sheet patterns verified across multiple authoritative sources (MDN, game dev tutorials)
- Pitfalls: HIGH - Based on actual codebase analysis and known differences between systems
- Pokemon sprite format: HIGH - Multiple authoritative Pokemon sources confirm 16x16 tiles and 16x32 characters
- Pallet Town layout: HIGH - Bulbapedia and official game sources confirm 3-building structure

**Research date:** 2026-02-01
**Valid until:** 30 days (stable technology - Canvas API and Pokemon sprites don't change)
