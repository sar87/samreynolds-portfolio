# Technology Stack

**Project:** Pixel-Art Academic Portfolio Game Website
**Researched:** 2026-01-30
**Confidence:** HIGH

## Recommended Stack

### Core Game Engine
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Phaser 3 | 3.90.0 "Tsugumi" | 2D pixel-art game framework | Industry standard for HTML5 pixel-art games. Native pixel-art rendering mode (`pixelArt: true`), built-in Aseprite support, comprehensive documentation, active community. Supports WebGL and Canvas rendering. |
| TypeScript | 5.x | Type-safe development | Enhanced developer experience, better IDE support, catches errors at compile time. Official Phaser 3 templates use TypeScript. |
| Vite | Latest | Build tool & dev server | Fast hot-reloading (instant feedback), optimized production builds, official Phaser 3 template uses Vite. Dramatically faster than Webpack for development. |

### Sprite Assets & Art Tools
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| LPC (Liberated Pixel Cup) Sprites | Latest | Character sprites & tilesets | CC-BY-SA 3.0 licensed, legally usable for all projects. Top-down RPG style (not GBA Pokemon style, but legally safe alternative). Extensive character generator with 1000+ sprite combinations. |
| Kenney Game Assets | Latest | UI elements, items, tilesets | CC0 (public domain), zero attribution required. Professional quality, consistent pixel art style. 60,000+ free assets available. |
| itch.io CC0 Collections | Various | Supplementary sprites & tiles | Curated free assets under CC0 license. Includes "fakemon" packs (Pokemon-style creatures that are legally original). |
| Aseprite | 1.2.25+ | Sprite creation & animation | Phaser 3 has native Aseprite JSON import. Export animations directly to Phaser-compatible format. Industry standard for pixel art animation. |
| Tiled Map Editor | Latest | Level/map design | Free, open-source tilemap editor. Phaser 3 has built-in Tiled integration (JSON export). Supports orthogonal, isometric, and hexagonal maps. |

### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| phaser3-rex-plugins | Latest | Virtual joystick & UI | Mobile touch controls. Rex's virtual joystick is the standard for Phaser 3 mobile games. |
| Phaser Editor 2D | 4.6.0+ | Visual scene editor (optional) | If you want visual scene composition instead of pure code. Has built-in tilemap editor. |

### Website Integration
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vanilla HTML/CSS/JS | - | Traditional website mode | No framework needed for GitHub Pages. Simple routing with hash URLs (`/#/game`, `/#/research`). |
| OR Astro | 5.x | Static site generator (alternative) | If you want modern DX, component-based architecture, and content management. Better than Jekyll for interactive components. Supports "islands architecture" for embedding Phaser game. |

### Hosting & Deployment
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| GitHub Pages | - | Static hosting | Free, reliable, integrates with GitHub repos. Supports custom domains. Perfect for academic portfolios. |
| GitHub Actions | - | CI/CD for deployment | Automated builds on push. Official workflow templates available for Vite + Phaser projects. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Game Engine | Phaser 3 | PixiJS | PixiJS is a lower-level rendering engine. Lacks built-in game features (physics, animations, input). Would require building game logic from scratch. Phaser is built on PixiJS but adds game-specific features. |
| Game Engine | Phaser 3 | Godot (web export) | Godot excels at native games but web export is larger bundle size. Phaser is purpose-built for web. Godot better for desktop/mobile native. |
| Build Tool | Vite | Webpack | Webpack is slower dev server (10+ seconds vs instant with Vite). Vite is modern standard for Phaser 3 in 2025-2026. |
| Sprites | LPC / Kenney / itch.io CC0 | Pokemon official sprites | **CRITICAL:** Official Pokemon sprites are copyrighted by The Pokemon Company / Nintendo / Game Freak. Using them violates copyright even if found on GitHub. PokeAPI sprites include copyright notice. Not legally usable. |
| Sprites | LPC / Kenney | Custom pixel art from scratch | Custom art is ideal but time-intensive. LPC/Kenney provide high-quality starting point. Can mix custom + CC-licensed assets. |
| Static Site | Vanilla HTML or Astro | Jekyll | Jekyll is slower builds, limited interactivity. Astro is faster, supports modern JS frameworks, better for interactive components. Jekyll advantage: seamless GitHub Pages integration (but Astro works too). |
| Mobile Controls | Rex Virtual Joystick | Custom touch handlers | Rex plugin is battle-tested, well-documented, handles edge cases. Building custom touch controls is reinventing the wheel. |

## Critical License Considerations

### DO NOT USE (Copyright Issues)
- Official Pokemon sprites from any source (including PokeAPI, Pokemon Database, The Spriters Resource)
- Fire Red / Leaf Green ripped sprites
- Any Nintendo / Game Freak copyrighted assets
- "Fan sprite" edits of official Pokemon

### SAFE TO USE (Legally Clear)
- **CC0 (Public Domain):** Kenney assets, itch.io CC0 collections. Zero restrictions, no attribution required.
- **CC-BY-SA 3.0:** LPC sprites. Requires attribution (list artists + URLs) and share-alike (derivative sprites must also be CC-BY-SA).
- **"Fakemon" packs:** Original creature designs inspired by Pokemon style but legally distinct.

### Attribution Requirements for CC-BY-SA
For LPC sprites, you MUST include credits file listing:
- Artist name(s)
- License (CC-BY-SA 3.0)
- Original source URL
- Asset title (if available)

Example: "Character sprites by [Artist Name] under CC-BY-SA 3.0, available at [URL]"

LPC generator on GitHub can auto-generate credits files.

## Style Mismatch: Pokemon GBA vs LPC

**Important Note:** LPC sprites are NOT Pokemon Fire Red/Leaf Green style. LPC is:
- Top-down perspective (Pokemon FRLG is 3/4 perspective)
- 64x64 character sprites (Pokemon uses 16x16 to 32x32)
- Western RPG aesthetic (Pokemon is Japanese RPG aesthetic)

**For true GBA Pokemon aesthetic with legal sprites:**
1. Commission custom pixel art in Pokemon FRLG style
2. Use "fakemon" packs on itch.io (Pokemon-inspired but original)
3. Create your own sprites with Aseprite
4. Accept LPC style as close-enough alternative

**No free, legally-usable sprite library perfectly matches Pokemon FRLG aesthetic.** This is the domain's biggest constraint.

## Installation

```bash
# Initialize project with official Phaser template
git clone https://github.com/phaserjs/template-vite-ts pixel-portfolio-game
cd pixel-portfolio-game

# Install dependencies
npm install

# Add Rex plugins for mobile controls
npm install phaser3-rex-plugins

# Development server (instant hot-reload)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

## GitHub Pages Deployment

### Option 1: GitHub Actions (Recommended)
1. Enable GitHub Pages in repo settings
2. Set source to "GitHub Actions"
3. Use workflow from `template-vite-ts` (auto-deploys on push to main)

### Option 2: Manual Build
```bash
# Build for production
npm run build

# dist/ folder contains static files
# Push dist/ to gh-pages branch or configure as GitHub Pages source
```

### SPA Routing Caveat
GitHub Pages doesn't support SPA routing natively. Solutions:
- **Hash-based routing:** Use `/#/game`, `/#/about` URLs (works without hacks)
- **404.html redirect hack:** Redirect all 404s to index.html (hacky but works)
- **Cloudflare Pages alternative:** Better SPA support if GitHub Pages proves limiting

## Sources

**Game Engine Research:**
- [Phaser 3 Official Site](https://phaser.io/) - Version 3.90 "Tsugumi" released May 2025
- [Phaser vs PixiJS Comparison (Slant.co)](https://www.slant.co/versus/1965/1966/~pixi-js_vs_phaser)
- [Phaser vs PixiJS Article (Aircada)](https://aircada.com/blog/pixijs-vs-phaser)
- [Phaser 3 TypeScript Vite Template (GitHub)](https://github.com/phaserjs/template-vite-ts)
- [Phaser News - Vite TypeScript Template](https://phaser.io/news/2024/01/phaser-vite-typescript-template)

**Sprite Assets:**
- [LPC Universal Character Generator (GitHub)](https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator)
- [LPC Base Assets (OpenGameArt)](https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles)
- [Kenney Game Assets](https://kenney.nl/assets)
- [itch.io CC0 Game Assets](https://itch.io/game-assets/assets-cc0)
- [itch.io Pokemon-tagged Assets](https://itch.io/game-assets/free/tag-pokemon)
- [OpenGameArt CC0 Resources](https://opengameart.org/content/cc0-resources)

**Copyright / Legal:**
- [PokeAPI Sprites License Notice](https://github.com/PokeAPI/sprites/blob/master/LICENCE.txt)
- [CC-BY-SA Attribution Guide (OpenGameArt)](https://opengameart.org/forumtopic/need-help-to-understad-lpc-license)

**Tools & Integration:**
- [Tiled Map Editor](https://thorbjorn.itch.io/tiled)
- [Phaser + Tiled Integration Guide (GitHub Wiki)](https://github.com/mapeditor/tiled/wiki/Phaser)
- [Phaser Aseprite Integration Docs](https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Loader.LoaderPlugin-aseprite)
- [Rex Virtual Joystick Plugin](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/virtualjoystick/)

**Deployment:**
- [Phaser Editor GitHub Pages Deployment](https://github.com/arianfornaris/demo-deploy-game-to-github-pages-with-phasereditor2d-template)
- [SPA on GitHub Pages Hack](https://github.com/rafgraph/spa-github-pages)
- [Astro Official Docs](https://docs.astro.build/)
- [Jekyll vs Astro Comparison](https://www.kooslooijesteijn.net/blog/jekyll-or-astro-which-is-better-static-site-generator)

**Confidence:** HIGH for game engine stack, MEDIUM for sprite aesthetic match, HIGH for legal considerations
