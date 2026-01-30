# Phase 1: Foundation & Asset Selection - Research

**Researched:** 2026-01-30
**Domain:** Sprite asset sourcing, CC licensing, development environment
**Confidence:** HIGH

## Summary

Phase 1 establishes the visual foundation and development environment for the dual-mode academic portfolio. Research confirms LPC (Liberated Pixel Cup) as the primary sprite ecosystem, with extensive assets available on OpenGameArt.org under CC-BY-SA 3.0 licensing. The Universal LPC Character Generator enables creating a customized player avatar with blonde hair and various clothing options.

A critical finding: **LPC uses 32x32 pixel tiles, not 16x16**. The existing codebase uses 16x16 tiles at 3x scale. The tile size needs updating to 32x32 (at 1.5x or 2x scale) to use LPC assets natively, or LPC assets need downscaling (not recommended due to quality loss).

For Cambridge-specific aesthetics, the [LPC Castle Mega-Pack](https://opengameart.org/content/lpc-castle-mega-pack) provides Gothic architectural elements including equilateral arches, rose windows, pinnacles, and flying buttresses. Multiple furniture packs exist for distinct building interiors. Theatre/stage assets are limited and may require design adjustments.

**Primary recommendation:** Use LPC ecosystem exclusively (avoid mixing with Kenney which uses different style/scale). Accept 32x32 tile size. Use OpenGameArt's auto-generated CREDITS.TXT format for attribution.

## Standard Stack

### Core Assets

| Source | License | Purpose | Why Standard |
|--------|---------|---------|--------------|
| [LPC Base Assets](https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles) | CC-BY-SA 3.0 / GPL 3.0 | Terrain, basic tiles | Official LPC competition assets, consistent style foundation |
| [Universal LPC Character Generator](https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/) | CC-BY-SA 3.0 | Player avatar | 1000+ combinations, exports attribution automatically |
| [LPC Castle Mega-Pack](https://opengameart.org/content/lpc-castle-mega-pack) | CC-BY-SA 3.0 | Gothic architecture | Rose windows, flying buttresses, arches for Cambridge feel |
| [LPC Animated Water](https://opengameart.org/content/lpc-animated-water-and-waterfalls) | CC-BY-SA 3.0 | River Cam | Translucent animated water tiles |

### Building-Specific Assets

| Building | Asset Pack | Key Items |
|----------|-----------|-----------|
| Library | [LPC Wooden Furniture](https://opengameart.org/content/lpc-wooden-furniture) + [LPC Shelves Rework](https://opengameart.org/content/lpc-shelves-rework) | Bookshelves, desks, reading tables |
| Laboratory | [LPC Alchemy](https://opengameart.org/content/lpc-alchemy) + [LPC Containers](https://opengameart.org/content/lpc-containers) | Flasks, beakers, test tubes, bunsen burners |
| Theatre | [LPC Tavern](https://opengameart.org/content/lpc-tavern) (partial) | Banners, rugs, lighting (stage curtains limited) |
| College | [LPC House Interior](https://opengameart.org/content/lpc-house-interior-and-decorations) | Beds, cabinets, decorations |
| TV/Radio | [LPC Simple Modern Furniture](https://opengameart.org/content/lpc-simple-modern-furniture) | Limited options, may need creative interpretation |

### Development Environment

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vite | 7.3.1 | Build tool & dev server | Instant hot-reload, official vanilla-ts template, modern standard |
| TypeScript | 5.x | Type-safe development | Better IDE support, catches errors at compile time |
| Canvas 2D API | Native | Rendering | Existing codebase uses Canvas, no framework needed |

### Supporting Tools

| Tool | Purpose | When to Use |
|------|---------|-------------|
| [Tiled Map Editor](https://thorbjorn.itch.io/tiled) | Map design (optional) | If hand-editing maps becomes cumbersome |
| ImageMagick/GIMP | Sprite sheet manipulation | Extracting specific tiles from large sheets |

## Architecture Patterns

### Recommended Asset Structure

```
assets/
├── sprites/
│   ├── characters/
│   │   └── player.png          # Generated from LPC Character Generator
│   ├── terrain/
│   │   ├── grass.png
│   │   ├── paths.png
│   │   └── water/              # Animated tiles
│   ├── buildings/
│   │   ├── exteriors/
│   │   │   ├── castle-pack/    # Gothic elements
│   │   │   └── base/           # Doors, windows
│   │   └── interiors/
│   │       ├── library/        # Furniture sets
│   │       ├── lab/
│   │       ├── theatre/
│   │       ├── college/
│   │       └── station/
│   └── objects/
│       ├── interactive/        # Objects player can interact with
│       └── decorative/
├── ATTRIBUTION.md              # Human-readable credits
└── CREDITS.txt                 # OpenGameArt format (auto-generated)
```

### Tile Size Resolution

**Current codebase:** 16x16 tiles at 3x scale = 48px rendered
**LPC standard:** 32x32 tiles

**Options:**
1. **Update to 32x32 at 1.5x scale** = 48px rendered (maintains same visual size)
2. **Update to 32x32 at 2x scale** = 64px rendered (larger, but common)
3. **Downscale LPC to 16x16** (NOT recommended - quality loss, loses detail)

**Recommendation:** Option 1 or 2. Update `Engine.tileSize` to 32 and adjust scale accordingly. This is a small change in engine.js lines 9-10.

### Character Sprite Specifications

LPC character sheets follow specific dimensions:
- **Base body:** 32x48 pixels (fits in 32x32 tile, extends above)
- **With clothing/weapons:** 48x64 pixels
- **Animation rows:** Back, Left, Front, Right (top to bottom)
- **Standard animations:** Walk (8 frames), Idle (1 frame), Hurt (6 frames)
- **Extended animations:** Spellcast, Slash, Thrust, Bow, Climb, Run, Jump

### Attribution Pattern

**OpenGameArt CREDITS.TXT format:**
```
----------------------------------------
Title: [Asset Title]
Author: [Author Name]
URL: [OpenGameArt URL]
License(s): * CC-BY-SA 3.0 ( https://creativecommons.org/licenses/by-sa/3.0/ )
Copyright/Attribution Notice: [If provided]
File(s): [List of files used]
----------------------------------------
```

**Simplified ATTRIBUTION.md for humans:**
```markdown
# Asset Attribution

## Character Sprites
Generated using [Universal LPC Spritesheet Character Generator](URL)
Contributors: [list from generator export]
License: CC-BY-SA 3.0

## Terrain and Buildings
[LPC Base Assets](URL) by various artists - CC-BY-SA 3.0
[LPC Castle Mega-Pack](URL) by [author] - CC-BY-SA 3.0
...
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Character sprite generation | Custom character art | [LPC Character Generator](https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/) | 1000+ combinations, auto-exports credits, consistent style |
| Gothic architecture tiles | Custom building tiles | [LPC Castle Mega-Pack](https://opengameart.org/content/lpc-castle-mega-pack) | Rose windows, arches, buttresses already made |
| Water animation | Custom water tiles | [LPC Animated Water](https://opengameart.org/content/lpc-animated-water-and-waterfalls) | 3 glistening effects, translucent overlays |
| Attribution tracking | Custom credits system | OpenGameArt collection CREDITS.TXT | Auto-generates from collections, standard format |
| Furniture sprites | Custom furniture | LPC Wooden Furniture + related packs | Extensive selection, LPC-compatible style |

**Key insight:** LPC ecosystem has been building compatible assets since 2012. Searching OpenGameArt for "[LPC] [item]" usually finds what you need.

## Common Pitfalls

### Pitfall 1: Mixing Incompatible Sprite Styles
**What goes wrong:** LPC (32x32, top-down, 170-color palette) mixed with Kenney (16x16, often side-view, different palette) creates visual inconsistency
**Why it happens:** Both are CC0/CC-BY, tempting to combine
**How to avoid:** Stick to LPC ecosystem exclusively. Search OpenGameArt for "[LPC]" prefix
**Warning signs:** Sprites look "off" next to each other, outlines don't match, color palettes clash

### Pitfall 2: Assuming 16x16 Tile Compatibility
**What goes wrong:** Trying to use LPC 32x32 assets with 16x16 engine settings
**Why it happens:** Requirements doc mentions "16x16 tiles" (from original programmatic sprites)
**How to avoid:** Update engine to 32x32 tiles FIRST, before importing any LPC assets
**Warning signs:** Sprites render at wrong size, clipping issues, collision misalignment

### Pitfall 3: Incomplete Attribution
**What goes wrong:** Missing credits for some assets, violating CC-BY-SA
**Why it happens:** Assets come from many contributors, easy to lose track
**How to avoid:**
  1. Use OpenGameArt collections to organize assets
  2. Download CREDITS.TXT from each collection
  3. Merge into single attribution file
  4. Add collection to OpenGameArt account BEFORE downloading
**Warning signs:** Can't find original source for an asset, no license documented

### Pitfall 4: Character Generator Credit Omission
**What goes wrong:** Using LPC Character Generator without crediting individual sprite contributors
**Why it happens:** Generator combines work from dozens of artists
**How to avoid:** Export credits from generator (it provides list of all contributors for selected options)
**Warning signs:** Attribution only credits "LPC" generically, not individual artists

### Pitfall 5: Missing Cambridge-Specific Assets
**What goes wrong:** Expecting punt boats, specific college buildings, or Cambridge landmarks to exist
**Why it happens:** LPC is generic medieval/fantasy, not Cambridge-specific
**How to avoid:** Accept limitations per CONTEXT.md - "If assets aren't available, skip it and adjust game design"
**Warning signs:** Spending hours searching for assets that don't exist

### Pitfall 6: Theatre/Stage Asset Gap
**What goes wrong:** Expecting full theatre stage with curtains
**Why it happens:** LPC has tavern/inn assets but limited theatre-specific content
**How to avoid:** Use [LPC Tavern](https://opengameart.org/content/lpc-tavern) banners, rugs, lighting creatively; interpret "theatre" as lecture hall with podium
**Warning signs:** No search results for "LPC theatre" or "LPC stage curtain"

## Code Examples

### Vite + TypeScript Setup

```bash
# Source: https://vite.dev/guide/
npm create vite@latest sam-portfolio -- --template vanilla-ts
cd sam-portfolio
npm install
npm run dev
```

### Tile Size Configuration Update

```typescript
// Source: Existing codebase engine.js, updated for LPC
const Engine = {
    // Updated for LPC 32x32 tiles
    scale: 2,        // Was 3, now 2 for similar visual size
    tileSize: 32,    // Was 16, now 32 for LPC compatibility
    // ... rest unchanged
};
```

### Sprite Sheet Loading

```typescript
// Source: Standard Canvas 2D pattern
async function loadSpriteSheet(path: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = path;
    });
}

// LPC character sprite extraction (32x48 per frame, 4 directions)
function getCharacterFrame(
    sheet: HTMLImageElement,
    direction: 'down' | 'left' | 'right' | 'up',
    frame: number
): { sx: number; sy: number; sw: number; sh: number } {
    const directionRow = { down: 2, left: 1, right: 3, up: 0 };
    const frameWidth = 64;  // LPC uses 64px wide frames for characters
    const frameHeight = 64;

    return {
        sx: frame * frameWidth,
        sy: directionRow[direction] * frameHeight,
        sw: frameWidth,
        sh: frameHeight
    };
}
```

### Attribution File Generation

```typescript
// Combine multiple CREDITS.TXT files
interface AssetCredit {
    title: string;
    author: string;
    url: string;
    license: string;
    files: string[];
}

function generateAttribution(credits: AssetCredit[]): string {
    const header = `# Asset Attribution

This project uses assets from the Liberated Pixel Cup (LPC) community.
All assets are licensed under CC-BY-SA 3.0 unless otherwise noted.

`;

    const entries = credits.map(c =>
        `## ${c.title}\n` +
        `- **Author:** ${c.author}\n` +
        `- **License:** ${c.license}\n` +
        `- **Source:** ${c.url}\n` +
        `- **Files:** ${c.files.join(', ')}\n`
    ).join('\n');

    return header + entries;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Single LPC base set | Multiple LPC-compatible packs | Ongoing since 2012 | 10,000+ tiles available |
| Manual attribution | OpenGameArt auto-credits | 2015+ | Collections generate CREDITS.TXT |
| Webpack for JS games | Vite | 2023+ | 20-30x faster dev server |
| Generic RPG interiors | Themed furniture packs | 2020+ | Library, tavern, alchemy sets exist |

**Current (2025-2026):**
- LPC Castle Mega-Pack (2020+) provides Gothic architectural elements
- Vite 7.x is standard for TypeScript projects
- LPC Character Generator actively maintained with new assets

**Deprecated/outdated:**
- Webpack for new projects (Vite is faster)
- 16x16 for LPC assets (LPC standard is 32x32)

## Asset Availability Assessment

### Available (HIGH confidence)

| Need | Asset | Confidence |
|------|-------|------------|
| Player avatar (blonde, academic) | LPC Character Generator | HIGH - hair colors including blonde, various shirts/robes |
| Gothic stone buildings | LPC Castle Mega-Pack | HIGH - arches, windows, buttresses |
| Library interior | LPC Wooden Furniture + Shelves | HIGH - desks, bookshelves |
| Laboratory interior | LPC Alchemy + Containers | HIGH - flasks, beakers, equipment |
| Water/river | LPC Animated Water | HIGH - animated tiles with effects |
| Grass, paths, terrain | LPC Base Assets | HIGH - comprehensive terrain |

### Limited (MEDIUM confidence)

| Need | Asset | Notes |
|------|-------|-------|
| Theatre/stage | LPC Tavern (partial) | Banners, rugs, lighting - no curtains. Interpret as lecture hall |
| TV/Radio station | LPC Modern Furniture (limited) | Minimal modern assets. May need creative interpretation |
| Punt boat | LPC Ship (large sailing ships) | No punt-style boats. Skip per CONTEXT.md |

### Not Available (LOW confidence)

| Need | Status | Mitigation |
|------|--------|------------|
| Cambridge-specific landmarks | Not LPC-compatible | Use generic Gothic architecture |
| Punt boats on River Cam | No LPC assets | Skip feature, use bridges/docks instead |
| Modern radio/TV equipment | Very limited | Abstract or skip |

## Open Questions

1. **Specific player appearance options**
   - What we know: Generator has blonde hair, various clothing
   - What's unclear: Exact sweater/blazer options need verification
   - Recommendation: Use generator directly, accept closest match

2. **TV/Radio station theming**
   - What we know: Modern furniture limited in LPC
   - What's unclear: Whether any "studio" assets exist
   - Recommendation: Interpret as "media room" with tables, chairs, perhaps a desk setup

3. **Theatre vs Lecture Hall**
   - What we know: No stage curtains in LPC
   - What's unclear: Best way to represent talks venue
   - Recommendation: Use lecture hall interpretation - podium, chairs, banners

## Sources

### Primary (HIGH confidence)
- [LPC Style Guide](https://lpc.opengameart.org/static/LPC-Style-Guide/build/styleguide.html) - Tile specifications (32x32), character dimensions
- [Vite Official Documentation](https://vite.dev/guide/) - Version 7.3.1, vanilla-ts template
- [OpenGameArt LPC Collection](https://opengameart.org/content/lpc-collection) - Asset index with auto-credits
- [LPC Castle Mega-Pack](https://opengameart.org/content/lpc-castle-mega-pack) - Gothic architecture details

### Secondary (MEDIUM confidence)
- [Universal LPC Character Generator GitHub](https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator) - Animation types, credit export
- [OpenGameArt Attribution Forum](https://opengameart.org/forumtopic/best-practices-on-crediting-a-large-amount-of-assets) - CREDITS.TXT format
- [Creative Commons Attribution Best Practices](https://wiki.creativecommons.org/wiki/Recommended_practices_for_attribution) - TASL framework

### Tertiary (LOW confidence)
- WebSearch results for specific asset packs - verified against OpenGameArt pages

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - LPC ecosystem well-documented, Vite official docs verified
- Architecture: HIGH - LPC style guide specifies dimensions, existing codebase patterns clear
- Pitfalls: MEDIUM - Based on common patterns, some from community discussions
- Asset availability: MEDIUM - Searched OpenGameArt but didn't download/verify every pack

**Research date:** 2026-01-30
**Valid until:** 60 days (LPC ecosystem stable, Vite updates minor)

---

*Phase: 01-foundation-asset-selection*
*Researcher: claude-opus-4-5-20251101*
