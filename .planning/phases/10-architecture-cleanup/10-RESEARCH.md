# Phase 10: Architecture Cleanup - Research

**Researched:** 2026-02-02
**Domain:** Code archival, Vite build configuration, TypeScript project structure
**Confidence:** HIGH

## Summary

Phase 10 requires archiving game functionality while preserving the code for potential future use. The codebase uses Vite + TypeScript with a clear separation between website and game modules. The game functionality spans multiple locations: TypeScript game engine in `src/game/`, vanilla JS game scripts in `js/game/`, landing page component in `src/components/Landing/`, game-related CSS, and sprite assets.

The recommended approach is to move game-related code to an `_archived/` directory at project root (underscore prefix signals "excluded" by convention), update tsconfig.json to exclude this directory, remove game imports from `main.ts`, and simplify the router to load HomePage directly. This preserves all game code while completely removing it from the build.

**Primary recommendation:** Move game code to `_archived/` directory at project root, exclude from tsconfig, and update `main.ts` to render HomePage directly without landing page or mode switching logic.

## Standard Stack

This phase requires no new libraries - it's a refactoring of existing code.

### Core (Existing)
| Library | Version | Purpose | Relevant to Phase |
|---------|---------|---------|-------------------|
| Vite | ^5.4.21 | Build tool | Automatic tree-shaking removes unused imports |
| TypeScript | ~5.9.3 | Type checking | tsconfig.json exclude option |

### Archive Directory Convention
| Pattern | Purpose | Why Standard |
|---------|---------|--------------|
| `_archived/` | Prefix underscore signals "special/excluded" | Common convention (like `_templates`, `__tests__`) |
| Root-level placement | Outside `src/` = outside default tsconfig include | Cleaner than nested exclusion |

**No installation needed** - this is a code reorganization phase.

## Architecture Patterns

### Current Project Structure (Before)
```
src/
├── main.ts                    # Entry point with landing/mode logic
├── game/                      # TypeScript game engine (TO ARCHIVE)
│   ├── CampusGame.ts
│   ├── Game.ts
│   ├── core/
│   ├── data/
│   ├── entities/
│   ├── rendering/
│   └── systems/
├── components/
│   ├── Landing/               # Landing page (TO ARCHIVE)
│   │   ├── Landing.ts
│   │   ├── Landing.css
│   │   ├── GamePreview.ts
│   │   ├── LoadingScreen.ts
│   │   └── LoadingScreen.css
│   └── Header/
│       └── Header.ts          # Contains modeToggle (TO MODIFY)
├── styles/
│   └── game.css               # Game-specific styles (TO ARCHIVE)
└── ...

js/
└── game/                      # Vanilla JS game scripts (TO ARCHIVE)
    ├── sprites.js
    ├── player.js
    ├── world.js
    ├── buildings.js
    └── engine.js

data/
└── content.json.js            # Game content data (TO ARCHIVE)

assets/
└── sprites/                   # Game sprites (TO ARCHIVE)
```

### Recommended Project Structure (After)
```
_archived/                     # All game code preserved here
├── README.md                  # Documents what's archived and why
├── src-game/                  # Former src/game/
├── src-landing/               # Former src/components/Landing/
├── src-styles-game/           # Former game.css
├── js-game/                   # Former js/game/
├── data-game/                 # Former data/content.json.js
└── assets-sprites/            # Former assets/sprites/ (optional)

src/
├── main.ts                    # Simplified - direct HomePage render
├── components/
│   └── Header/
│       └── Header.ts          # modeToggle removed
└── styles/
    └── (game.css removed)
```

### Pattern 1: Archive Directory with README
**What:** All archived code in one root-level directory with documentation
**When to use:** Preserving significant feature code for future reuse
**Why:**
- Single location for all archived code
- README explains context for future developers
- Outside `src/` means automatic exclusion from tsconfig's `include: ["src"]`
- Underscore prefix signals "excluded/special" by convention

**Example README content:**
```markdown
# Archived Game Mode

This directory contains the pixel-art game mode from v0.9.
Archived on 2026-02-02 for potential future reuse.

## Contents
- src-game/: TypeScript game engine
- src-landing/: Landing page component
- js-game/: Vanilla JS game scripts
- assets-sprites/: Sprite sheets

## To Restore
1. Move directories back to original locations
2. Add imports back to main.ts
3. Restore Header modeToggle button
4. Re-add game.css import
```

### Pattern 2: Clean Entry Point Simplification
**What:** Remove conditional logic, go straight to main content
**When to use:** Bypassing optional features/modes

**Current main.ts pattern (complex):**
```typescript
const landingShown = sessionStorage.getItem('landing-shown') === 'true';
let currentMode: 'landing' | 'website' | 'game' = landingShown ? 'website' : 'landing';

router.add('/', async () => {
  if (currentMode === 'landing') {
    await renderLandingPage();
    return;
  }
  await render(renderHomePage());
});
```

**Simplified main.ts pattern (after):**
```typescript
// Direct to website - no landing page or mode logic
router.add('/', async () => {
  await render(renderHomePage());
});
```

### Anti-Patterns to Avoid

- **Commenting out code:** Creates clutter, hard to restore, unclear boundaries
- **Conditional compilation flags:** Adds complexity, easy to get wrong
- **Leaving unused imports:** Build may still include code via tree-shaking failures
- **Partial archival:** Archive complete feature, not scattered pieces

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Detecting unused imports | Manual code review | Vite's tree-shaking | Automatic, reliable |
| Build exclusion | Complex rollup config | tsconfig exclude + directory structure | Simpler, standard |
| Code preservation | Git branches | Archive directory | Visible, documented, easy to restore |

**Key insight:** Vite with TypeScript already handles unused code elimination through tree-shaking. The main task is ensuring imports are removed from `main.ts` so the archived code becomes "dead" to the bundler.

## Common Pitfalls

### Pitfall 1: Excluding Files That Are Still Imported
**What goes wrong:** Adding directory to tsconfig exclude but still importing from it
**Why it happens:** tsconfig exclude only affects type-checking auto-discovery, not imports
**How to avoid:** Remove ALL imports from archived code BEFORE moving to archive directory
**Warning signs:** TypeScript errors after moving code, or code still appearing in bundle

### Pitfall 2: Missing Transitive Dependencies
**What goes wrong:** Archived code imports shared utilities, those get accidentally removed
**Why it happens:** Not tracing full dependency tree
**How to avoid:** Identify shared code (content.ts, router.ts) - these stay in src/
**Warning signs:** Build errors about missing modules

### Pitfall 3: Broken CSS from Shared Styles
**What goes wrong:** Game CSS had rules affecting website elements
**Why it happens:** CSS doesn't have TypeScript's import tracking
**How to avoid:** Review game.css for any rules that website components depend on
**Warning signs:** Visual regression after removing game.css import

### Pitfall 4: Event Listener Leaks
**What goes wrong:** main.ts has global event listeners for game mode
**Why it happens:** Forgetting to remove keyboard shortcuts, custom events
**How to avoid:** Search main.ts for: 'keydown' (G key), 'mode-switch' event
**Warning signs:** Console warnings about unhandled events, dead code paths

### Pitfall 5: Session Storage Artifacts
**What goes wrong:** Old session storage keys checked but never set
**Why it happens:** Landing page set sessionStorage, code checks for it
**How to avoid:** Remove sessionStorage.getItem('landing-shown') checks
**Warning signs:** Confusing conditional logic, unused variables

## Code Examples

### Example 1: Simplified main.ts Entry Point
```typescript
// After cleanup - direct website rendering

// Import styles (game.css removed)
import './styles/variables.css';
import './styles/global.css';
import './styles/utilities.css';

// Import router and pages (no game/landing imports)
import { router } from './lib/router';
import { renderHeader, initMobileNav } from './components/Header/Header';
import { renderHomePage } from './pages/HomePage';
import { renderPublicationDetail } from './pages/PublicationDetail';
import { renderTalkDetail } from './pages/TalkDetail';
import { renderMediaDetail } from './pages/MediaDetail';

const app = document.getElementById('app');
if (!app) throw new Error('App container not found');

// Simple render function - no mode logic
async function render(content: string | Promise<string>): Promise<void> {
  const html = await content;
  const headerHtml = renderHeader();
  app!.innerHTML = `${headerHtml}<div id="content">${html}</div>`;
  initMobileNav();

  if (!window.location.hash.includes('#/') || window.location.hash === '#/') {
    window.scrollTo(0, 0);
  }
}

// Routes - no /game route, no landing logic
router.add('/', async () => {
  await render(renderHomePage());
});

router.add('/publication/:id', async (params) => {
  await render(renderPublicationDetail(params.id));
});

router.add('/talk/:id', async (params) => {
  await render(renderTalkDetail(params.id));
});

router.add('/media/:id', async (params) => {
  await render(renderMediaDetail(params.id));
});

// Initialize router (no game event listeners)
router.init();
```

### Example 2: Header Component Without Mode Toggle
```typescript
// Header.ts - modeToggle removed

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Research', href: '#research' },
  { label: 'Publications', href: '#publications' },
  { label: 'Talks', href: '#talks' },
  { label: 'Media', href: '#media' },
];

// Remove: const GAME_ICON = `<svg>...</svg>`;

export function renderHeader(): string {
  const navLinks = NAV_ITEMS.map(
    (item) => `<a href="${item.href}" class="${styles.navLink}">${item.label}</a>`
  ).join('');

  const mobileNavLinks = NAV_ITEMS.map(
    (item) => `<li><a href="${item.href}" class="${styles.mobileNavLink}">${item.label}</a></li>`
  ).join('');

  return `
    <header class="${styles.header}">
      <div class="${styles.headerInner}">
        <a href="#/" class="${styles.logo}">Sam Reynolds</a>
        <nav class="${styles.nav}" aria-label="Main navigation">
          ${navLinks}
        </nav>
        <!-- modeToggle button removed -->
        <button class="${styles.menuButton}" ...>
          <span class="${styles.menuIcon}"></span>
        </button>
      </div>
      <nav id="mobile-nav" class="${styles.mobileNav}" hidden>
        <ul class="${styles.mobileNavList}">
          ${mobileNavLinks}
        </ul>
      </nav>
    </header>
  `;
}

// Remove: export function initModeToggle() { ... }
```

### Example 3: Files to Archive (Checklist)
```
Files to move to _archived/:

FROM src/game/ (entire directory):
  - CampusGame.ts
  - Game.ts
  - core/GameLoop.ts
  - core/Input.ts
  - core/Camera.ts
  - rendering/TileMap.ts
  - rendering/Renderer.ts
  - entities/Player.ts
  - systems/Collision.ts
  - data/testMap.ts

FROM src/components/Landing/:
  - Landing.ts
  - Landing.css
  - GamePreview.ts
  - LoadingScreen.ts
  - LoadingScreen.css

FROM src/styles/:
  - game.css

FROM js/game/:
  - sprites.js
  - player.js
  - world.js
  - buildings.js
  - engine.js

FROM data/:
  - content.json.js (game content only)

FROM assets/sprites/ (optional - large):
  - Entire sprites directory
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Feature flags/toggles | Archive directory | Always preferred for full features | Cleaner, easier to restore |
| Git branches for archival | In-repo archive folder | Project preference | Code visible, searchable |
| Complex build exclusions | Move outside src/ | TypeScript best practice | Uses default tsconfig behavior |

**Deprecated/outdated:**
- Using `// @ts-ignore` to disable game code: Leaves broken code in build
- Conditional dynamic imports for "archived" code: Adds complexity, may still bundle

## Open Questions

1. **Sprite assets - archive or keep?**
   - What we know: `assets/sprites/` is ~1MB of PNG files used only by game
   - What's unclear: Whether to archive sprites or leave them (they don't affect build)
   - Recommendation: Archive to `_archived/assets-sprites/` for completeness; can restore later

2. **data/content.json.js - separate game content?**
   - What we know: This file provides `SITE_CONTENT` for vanilla JS game
   - What's unclear: Whether website uses this or only JSON files in data/
   - Recommendation: Check if website imports this; if game-only, archive it

3. **Header.module.css modeToggle styles**
   - What we know: CSS has `.modeToggle` styles that will become unused
   - What's unclear: Whether to remove or leave (no bundle impact if unused)
   - Recommendation: Remove for cleanliness; CSS modules won't complain

## Sources

### Primary (HIGH confidence)
- Codebase analysis: Direct examination of `main.ts`, `Header.ts`, `CampusGame.ts`
- [TypeScript tsconfig exclude](https://www.typescriptlang.org/tsconfig/exclude.html) - Official documentation
- [Vite Build Options](https://vite.dev/config/build-options) - Official Vite documentation

### Secondary (MEDIUM confidence)
- [Rollup external option](https://rollupjs.org/configuration-options/) - Bundler configuration
- [Excluding folders from TypeScript](https://bobbyhadz.com/blog/typescript-exclude-folder-tsconfig) - Tutorial with examples
- [Vite exclude files discussion](https://github.com/vitejs/vite/discussions/19284) - GitHub community

### Tertiary (LOW confidence)
- [TypeScript directory structure patterns](https://plainenglish.io/blog/typescript-project-directory-structure-module-resolution-and-related-configuration-options) - Blog article
- [Knip for dead code detection](https://knip.dev) - Tool recommendation (not needed for this phase)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - No new libraries needed, standard TS/Vite features
- Architecture: HIGH - Direct codebase analysis, clear patterns
- Pitfalls: HIGH - Based on TypeScript documentation about exclude behavior

**Research date:** 2026-02-02
**Valid until:** Indefinite (archival patterns are stable)

---

## Files Requiring Modification (Summary)

| File | Action | Complexity |
|------|--------|------------|
| `src/main.ts` | Remove game/landing imports, simplify render logic | Medium |
| `src/components/Header/Header.ts` | Remove modeToggle button and function | Low |
| `src/components/Header/Header.module.css` | Remove modeToggle styles (optional) | Low |
| `tsconfig.json` | No change needed (src-only include already excludes _archived/) | None |
| `vite.config.ts` | No change needed | None |

## Files to Archive (Complete List)

| Source | Archive Destination |
|--------|---------------------|
| `src/game/` | `_archived/src-game/` |
| `src/components/Landing/` | `_archived/src-landing/` |
| `src/styles/game.css` | `_archived/src-styles/game.css` |
| `js/game/` | `_archived/js-game/` |
| `data/content.json.js` | `_archived/data-game/content.json.js` |
| `assets/sprites/` | `_archived/assets-sprites/` (optional) |
