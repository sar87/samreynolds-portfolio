# Domain Pitfalls: Pixel-Art Browser Game Portfolio

**Domain:** Pixel-art browser game for academic portfolio website
**Researched:** 2026-01-30
**Confidence:** MEDIUM (WebSearch findings verified with official MDN documentation)

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Sprite Licensing Landmines
**What goes wrong:** Using sprites without proper licensing or attribution causes legal issues, takedown notices, or copyright strikes. Even modifying copyrighted sprites doesn't make them legal.

**Why it happens:**
- Developers assume "found on internet" = "free to use"
- Not understanding that derivative works (modified sprites) are still copyright violations
- GPL-licensed art can "infect" non-GPL projects with licensing requirements
- Ripped game sprites appearing on "free" sprite sites without proper licensing

**Consequences:**
- Forced to remove or replace all assets after launch
- Legal action from IP holders (especially game companies)
- Academic reputation damage (important for this use case)
- Cannot publish work in portfolio if legally questionable

**Prevention:**
- Use only CC0, CC-BY, or OGA-BY licensed sprites from verified sources like OpenGameArt.org
- **CRITICAL for academic site:** Verify license allows commercial-adjacent use (personal portfolio can be grey area)
- Download license text with each asset and store in `/assets/licenses/`
- Create `ATTRIBUTION.md` file listing every asset source with license type
- For CC-BY licenses, must include: title, creator name, license notice, link to source
- Test implementation: Add attribution screen accessible from game menu
- **NEVER** use Pokemon/Nintendo sprites even for "inspiration" - Nintendo actively pursues copyright violations

**Detection:**
- Can you trace every sprite to a specific license file?
- Does your site include visible attribution (required for CC-BY)?
- Search image on Google Images - if it appears on official game sites, it's probably copyrighted

**Phase impact:** Must resolve in Phase 1 (Asset Selection) - cannot defer

---

### Pitfall 2: Mobile Canvas Performance Collapse
**What goes wrong:** Game runs at 60fps on desktop but drops to 0.9-5fps on mobile devices, making the portfolio unusable for mobile visitors.

**Why it happens:**
- GPU rasterization disabled by default on Android browsers
- Mobile CPUs 10x weaker than desktop for canvas operations
- High-DPI mobile screens (3x, 4x) create huge canvases (e.g., 4500x3500 instead of 1500x1100)
- Drawing operations that are cheap on desktop (shadows, text, transforms) destroy mobile performance

**Consequences:**
- 50%+ of portfolio visitors (mobile users) get broken experience
- Academic credibility damaged by "doesn't work on my phone"
- Bounce rate skyrockets when game is unplayable
- Professional contacts give up before seeing content

**Prevention:**
- **CRITICAL:** Test on actual Android device in first sprint
- Use `{ alpha: false }` when creating canvas context (performance boost)
- Implement layered canvas approach (static background, dynamic sprites, UI) - render static layer once
- Batch draw calls - use sprite sheets, not individual images
- Avoid sub-pixel rendering: `Math.floor()` all coordinates
- Never use `shadowBlur` in render loop (extremely expensive)
- Limit canvas size on mobile: cap at 1920x1080 logical pixels even on 4K screens
- Use `requestAnimationFrame` not `setInterval`
- Consider WebGL fallback for older Android devices
- Add performance monitor during development: track FPS and warn if <30fps

**Detection:**
- Frame rate counter showing <30fps on mobile
- Touch controls laggy or unresponsive
- Battery draining rapidly during gameplay
- Device heating up
- Chrome DevTools Performance tab showing long paint times (>16ms)

**Phase impact:** Must address in Phase 2 (Core Engine) - performance characteristics locked in early

---

### Pitfall 3: GitHub Pages Size/Bandwidth Limits
**What goes wrong:** Site exceeds 1GB size limit, hits 100GB/month bandwidth cap, or gets rate-limited, causing deployment failures or service disruption.

**Why it happens:**
- Multiple sprite sheets for animations accumulate quickly
- High-resolution pixel art (scaling up 16x16 to 64x64 or 128x128) creates large PNGs
- Forgetting that tiles need to be loaded for both campus map + 5 interior maps
- Academic content (PDFs, high-res publication images) adds to size budget
- Each visitor download counts against bandwidth (game assets loaded per-session)

**Consequences:**
- Cannot deploy to GitHub Pages, forcing migration to paid hosting
- Site goes down mid-month when bandwidth exhausted
- Builds fail silently, deploy broken version of site
- Professional visitors see "bandwidth exceeded" errors

**Prevention:**
- Budget tracking: Create `size-budget.md` listing all assets with sizes
- **Hard limits:**
  - Total repo size: <500MB (50% safety margin under 1GB)
  - Individual files: <50MB (50% safety margin under 100MB)
  - Expected monthly bandwidth: <25GB (25% of limit)
- Sprite sheet optimization:
  - Use PNG compression (40-50% size reduction possible)
  - Convert to indexed color mode (46KB for 5x5 sheet vs 200KB+ RGB)
  - Combine all campus tiles into single sheet
  - Combine all building interior tiles into single sheet
  - Combine all character animations into single sheet
- Estimate bandwidth: `(total_assets_size) * (expected_monthly_visitors) * 1.5`
- Add build check that fails if any file >50MB
- Consider CDN for academic PDFs (host publications elsewhere, link to them)

**Detection:**
- Git rejects push with "file exceeds 100MB" error
- GitHub Pages build fails with timeout
- Build log shows "output size exceeds 1GB"
- Bandwidth usage dashboard approaching 80GB
- 429 HTTP status codes from Pages hosting

**Phase impact:** Must establish budget in Phase 1 (Planning) and enforce in Phase 3 (Asset Integration)

---

### Pitfall 4: Making Exploration Tedious Instead of Fun
**What goes wrong:** Visitors get frustrated navigating the game, give up before finding content, and leave with negative impression of portfolio.

**Why it happens:**
- Forced unskippable tutorials explaining how to use WASD keys
- Empty spaces visitors must walk through with no interactions
- Too many buildings/rooms creating "where was that paper again?" confusion
- No quick-access option for professionals who just want to see publications list
- Collision detection making movement feel sticky or imprecise
- Three-click rule violated: important content requires >3 interactions to reach

**Consequences:**
- Recruiters/academics leave site without seeing best work
- Negative word-of-mouth: "cute gimmick but annoying to use"
- Low engagement time despite high effort to create game
- Normal website mode gets 90% usage, making game development wasted effort
- Professional contacts think "more interested in games than research"

**Prevention:**
- **CRITICAL:** Always offer "View Website" option on splash screen - no forced game mode
- Apply one-click rule: Every building accessible from central campus in <10 seconds walk
- No tutorial: Movement is standard WASD/Arrow keys - gamers know it, others learn in 3 seconds
- Visual clarity: Each building must be visually distinct from 5 tiles away
- Interaction prompts: Show "[SPACE] Enter Building" when near door
- Mini-map in corner showing player location and building labels
- Quick-access menu (ESC key): Jump to any building or return to splash screen
- Campus design: Dense, small map (30x40 tiles) with buildings close together
- Test with non-gamer: Can they find a specific publication in <2 minutes?
- Avoid Pokemon-style random encounters or battles (delays content access)
- Never hide important content behind puzzles or challenges
- Mobile controls: Large, obvious D-pad + action button, always visible

**Detection:**
- Analytics showing high game mode entry, low building interaction rate
- Average session time <60 seconds (they gave up)
- Heat map showing players walking in circles
- Feedback: "couldn't find X" or "too much walking"
- A/B test: Do professionals engage more with normal mode?

**Phase impact:** Architecture decisions in Phase 2 (Map Design), validated in Phase 7 (User Testing)

---

## Moderate Pitfalls

Mistakes that cause delays or technical debt.

### Pitfall 5: Pixel Art Rendering Blur/Anti-aliasing
**What goes wrong:** Crisp 16x16 pixel sprites appear blurry, smeared, or have incorrect colors when scaled up for display.

**Why it happens:**
- Browser defaults to bilinear filtering when scaling images
- CSS doesn't set `image-rendering: pixelated`
- Canvas context filtering not disabled
- Sub-pixel positioning (drawing at x=10.5 instead of x=10)

**Prevention:**
- Set CSS on canvas: `image-rendering: crisp-edges; image-rendering: pixelated;`
- Set canvas context: `ctx.imageSmoothingEnabled = false;`
- Always `Math.floor()` sprite positions before drawing
- Test visual quality on Retina displays (scaling artifacts more visible)
- If using CSS transforms for scaling, ensure they operate on pixel boundaries

**Detection:**
- Sprites look fuzzy/blurry when zoomed
- Colors bleed between adjacent pixels
- Pixel grid not clearly visible

---

### Pitfall 6: Sprite Sheet Loading Race Conditions
**What goes wrong:** Game renders before sprites loaded, showing broken graphics or blank canvas. Visitor sees loading screen forever.

**Why it happens:**
- Not waiting for image.onload before starting game loop
- Assuming images load instantly (they don't on slow connections)
- Current codebase uses programmatic sprites (no loading) but will change with real sprites

**Prevention:**
- Implement Promise-based asset loader: wait for all sprite sheets before init
- Show loading progress bar: "Loading sprites... 3/5"
- Set timeout for load failure: show error message if assets don't load in 10 seconds
- Preload during splash screen (before user clicks "Explore Campus")
- Use sprite sheet instead of individual images: fewer network requests = faster load
- Test on throttled connection (Chrome DevTools → Network → Slow 3G)

**Detection:**
- Console errors about undefined sprites
- Canvas shows colored rectangles instead of sprites
- Loading screen never disappears
- Intermittent rendering bugs that disappear on refresh

---

### Pitfall 7: Tile Coordinate System Calculation Errors
**What goes wrong:** Collision detection fails, objects appear in wrong positions, or player can walk through walls due to off-by-one errors.

**Why it happens:**
- Confusion between pixel coordinates (x=320) vs tile coordinates (tileX=20)
- Array indexing: `y * width + x` vs `x * height + y` (easy to swap)
- Forgetting to clamp coordinates before array access (causes out-of-bounds)
- Screen position vs world position when camera follows player

**Prevention:**
- Create utility functions: `worldToTile(x, y)`, `tileToWorld(tileX, tileY)`, `tileToIndex(tileX, tileY, width)`
- Always validate: `if (tileX < 0 || tileX >= mapWidth) return null;`
- Add assertions in development: check that index < array.length
- Use descriptive variable names: `worldX` vs `tileX` vs `screenX`
- Write unit tests for coordinate conversion functions
- Visualize collision layer: add debug mode showing walkable/blocked tiles

**Detection:**
- Player walks through walls occasionally
- Interactions trigger at wrong positions
- Objects rendered offset from intended location
- Game crashes with "undefined" errors when accessing tiles

---

### Pitfall 8: Missing Attribution Implementation
**What goes wrong:** Using CC-BY licensed sprites without actually displaying attribution, violating license terms.

**Why it happens:**
- Developer focuses on technical implementation, forgets legal requirement
- Attribution seen as "nice to have" instead of license obligation
- No clear UX pattern for where to show credits in game

**Prevention:**
- Create "Credits" button in game menu showing all sprite attributions
- Add `/attributions.html` page linked from footer in normal mode
- Format: "Character sprites by [Author] (CC-BY 4.0) - [source link]"
- Include attribution file in repo: `/ATTRIBUTION.md`
- Make it prominent: Users should find credits without searching
- Test: Can someone using your site find the attribution for a specific sprite in <30 seconds?

**Detection:**
- Legal review finds license violations
- Asset creator contacts you requesting attribution
- No visible credits page or attribution information on site

---

## Minor Pitfalls

Mistakes that cause annoyance but are fixable.

### Pitfall 9: Keyboard Focus Management
**What goes wrong:** Game loses keyboard input focus when dialog opens, player needs to click canvas to regain control.

**Why it happens:**
- Dialog system uses DOM overlay, steals focus from canvas
- No focus management when dialog closes
- Tab navigation moves focus away from game

**Prevention:**
- After closing dialog: `canvas.focus()` to restore keyboard control
- Set canvas `tabindex="0"` to make it focusable
- Consider making dialogs render on canvas (not DOM) to avoid focus issues
- Trap focus within dialog while open (prevent tabbing to background)

**Detection:**
- Need to click screen after closing dialog before keys work
- Tab key moves focus outside game

---

### Pitfall 10: High-DPI Display Canvas Sizing
**What goes wrong:** Game appears blurry on Retina/4K displays, or canvas is sized incorrectly.

**Why it happens:**
- Not accounting for `window.devicePixelRatio`
- Canvas physical size (pixels) vs CSS size (logical pixels) mismatch
- Scaling applied incorrectly

**Prevention:**
- Current code handles this correctly in `engine.js:resize()`
- Double-check: `canvas.width = displayWidth * dpr; ctx.scale(dpr, dpr);`
- Test on multiple DPR values: 1x, 2x, 3x
- Avoid hardcoded canvas dimensions in CSS

**Detection:**
- Game looks blurry on MacBook/iPhone displays
- Canvas appears too large/small relative to viewport
- Sprites lose pixel-perfect appearance

---

### Pitfall 11: Touch Control Button Sticking
**What goes wrong:** Mobile D-pad buttons remain "pressed" after user lifts finger, player moves continuously.

**Why it happens:**
- Only handling `touchstart` and `touchend`, missing `touchcancel` and `touchmove`
- Finger dragging off button during touch doesn't trigger `touchend`
- Multiple simultaneous touches not handled correctly

**Prevention:**
- Current code has `touchcancel` handler (good!)
- Add safety: on `touchmove`, check if touch coordinates still within button bounds
- Clear all key states on `touchcancel`
- Test rapid tapping, dragging, multi-touch scenarios
- Add visual feedback: button appears pressed only while touched

**Detection:**
- Player continues moving after lifting finger from D-pad
- Must tap button twice to stop movement
- Controls unresponsive after rapid tapping

---

### Pitfall 12: Browser Back Button Breaking Game State
**What goes wrong:** Pressing browser back button while in game mode causes state corruption or returns to splash screen unexpectedly.

**Why it happens:**
- Hash-based routing (`#research`) conflicts with game state
- Mode stored in localStorage but URL state mismatches
- No history management for game interactions

**Prevention:**
- Decide: Should back button work in game mode?
  - Option A: Disable history manipulation in game mode
  - Option B: Back button = exit building/close dialog/return to campus (game-like)
- Current code: Uses hash routing in normal mode, needs game mode consideration
- Listen for `popstate` event, handle appropriately in game mode
- Consider: `history.pushState(null, '', location.href)` to prevent back navigation

**Detection:**
- Back button causes unexpected behavior
- Game state resets when navigating browser history
- Conflicts with site navigation in normal mode

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Asset Selection (Phase 1) | Choosing sprites with incompatible licenses (GPL with non-GPL project) | Create license compatibility matrix, verify every asset is CC0/CC-BY/OGA-BY |
| Asset Selection (Phase 1) | Sprite sets don't match stylistically (different pixel sizes, color palettes) | Choose all sprites from same artist/collection, create visual style guide |
| Core Engine (Phase 2) | Canvas rendering optimized for desktop, fails on mobile | Test on Android device by Sprint 2, implement layered canvas immediately |
| Core Engine (Phase 2) | Tile size/scale decisions locked in, painful to change later | Parameterize all dimensions via config file, test multiple scale factors early |
| Map Design (Phase 3) | Campus layout too spread out, tedious to navigate | Create paper prototype, time-test walking between buildings, aim for <10s between any two |
| Map Design (Phase 3) | Collision layer doesn't match visual layer, walking through walls | Implement debug visualization mode showing collision overlay |
| Asset Integration (Phase 4) | Exceeding GitHub Pages size budget with too many sprites | Track cumulative file size after each sprite sheet added, stay under 500MB |
| Asset Integration (Phase 4) | Sprite sheets not optimized, wasting bandwidth | Run through PNG optimizer (pngcrush, optipng), convert to indexed color |
| Content Integration (Phase 5) | Building interaction mapping becomes brittle as content changes | Create declarative config: `buildings = [{ id: 'library', contentKey: 'publications' }]` |
| Content Integration (Phase 5) | Academic content (publications) formatted inconsistently between modes | Write content once in JSON, render from same source in both modes |
| Polish (Phase 6) | Performance regressions introduced by visual effects | Re-test mobile performance after adding shadows/particles/transitions |
| Polish (Phase 6) | Attribution screen feels like afterthought, hidden in settings | Make Credits accessible from main menu, visually polished |
| User Testing (Phase 7) | Test subjects are gamers, miss issues non-gamers encounter | Include at least one non-gamer tester, ideally academic colleague |
| User Testing (Phase 7) | Testing only on desktop, mobile issues discovered post-launch | Mandatory mobile testing on Android and iOS before sign-off |

---

## Accessibility Pitfalls (Secondary Priority)

**Context:** This is a portfolio game, not a primary information delivery method. Normal website mode provides accessible alternative.

### Pitfall 13: Game Mode Not Keyboard Accessible
**What goes wrong:** Screen reader users or keyboard-only users cannot access game content.

**Why it happens:**
- Canvas games inherently visual, not exposed to accessibility tree
- Screen readers cannot parse canvas graphics
- No semantic HTML structure in game mode

**Prevention (acceptable approach for this project):**
- Ensure normal website mode is fully keyboard accessible (Tab navigation, skip links)
- Splash screen clearly offers both modes with keyboard navigation
- Don't hide any content exclusively in game mode
- Consider: Add text-only "site map" page listing all content with direct links
- Document in README: "Game mode is a visual enhancement; all content accessible via standard website view"
- Test: Can someone using only keyboard access all publications/talks/content via normal mode?

**Detection:**
- Screen reader testing finds content only in game mode
- Keyboard-only user cannot reach specific content
- WCAG AA compliance checker flags issues

**Acceptable mitigation:** Full content parity in normal mode + clear choice on splash screen

---

## Sources

### Sprite Licensing
- [FAQ | OpenGameArt.org](https://opengameart.org/content/faq) - MEDIUM confidence
- [Using Copyrighted Sprites as Base Legalities | OpenGameArt.org](https://opengameart.org/forumtopic/using-copyrighted-sprites-as-base-legalities) - MEDIUM confidence
- [About CC Licenses - Creative Commons](https://creativecommons.org/share-your-work/cclicenses/) - HIGH confidence
- [How To Correctly Attribute Creative Commons Images | Pixsy](https://www.pixsy.com/image-licensing/correctly-attribute-images) - MEDIUM confidence

### Canvas Performance
- [Optimizing canvas - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas) - HIGH confidence (official documentation)
- [Improving HTML5 Canvas performance | web.dev](https://web.dev/canvas-performance/) - HIGH confidence
- [Poor performance on Mobile browsers (HTML5 Canvas - Solved) | Adobe Community](https://community.adobe.com/t5/animate/poor-performance-on-mobile-browsers-html5-canvas-solved/m-p/9614021) - MEDIUM confidence

### GitHub Pages Limits
- [GitHub Pages limits - GitHub Docs](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) - HIGH confidence (official documentation)

### Sprite Sheets & Optimization
- [Sprite Sheets vs Individual Images: Performance Analysis](https://sosquishy.io/articles/sprite-sheets-vs-individual-images) - MEDIUM confidence

### UX/Game Design
- [Forced Tutorial - TV Tropes](https://tvtropes.org/pmwiki/pmwiki.php/Main/ForcedTutorial) - LOW confidence (community documentation)
- [Game UX: Best practices for video game onboarding 2024](https://inworld.ai/blog/game-ux-best-practices-for-video-game-onboarding) - MEDIUM confidence
- [How to Design Portfolio Homepages That Land You Job in 2026](https://uxplaybook.org/articles/6-ux-portfolio-homepage-mistakes-2026) - MEDIUM confidence

### Pixel Art Rendering
- [Crisp pixel art look with image-rendering - MDN](https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look) - HIGH confidence (official documentation)
- [Scaling a pixel art game for the browser](https://7tonshark.com/posts/pixel-art-canvas-resize/) - MEDIUM confidence

### Tile-Based Game Patterns
- [Tiles and tilemaps overview - Game development | MDN](https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps) - HIGH confidence (official documentation)
- [Tricks for 2D grid-based character collision | Oraqia](https://oraqia.wordpress.com/2014/07/05/tricks-for-2d-grid-based-character-collision-that-can-work-in-3d-too/) - MEDIUM confidence

### Accessibility
- [Keyboard accessible - Accessibility | MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Keyboard) - HIGH confidence (official documentation)
- [WebAIM: Keyboard Accessibility](https://webaim.org/techniques/keyboard/) - HIGH confidence

---

*Research completed: 2026-01-30*
*Confidence: MEDIUM - WebSearch findings verified with MDN official documentation and GitHub docs where possible*
*This document covers pixel-art browser game specific pitfalls, not generic web development advice*
