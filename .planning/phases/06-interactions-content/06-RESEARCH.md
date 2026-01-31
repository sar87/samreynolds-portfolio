# Phase 6: Interactions & Content Integration - Research

**Researched:** 2026-01-31
**Domain:** HTML5 game interaction systems with modal overlays
**Confidence:** HIGH

## Summary

Phase 6 connects interactive objects (bookcases, lab equipment, TV/radio, podiums) to academic content from JSON data, displaying it in panel overlays when the player interacts. This is a classic "examine object → show modal content" pattern common in adventure and RPG games.

The existing codebase already has foundation elements:
- **Buildings.js** provides dialog/interaction infrastructure with prompt display
- **CampusGame.ts** creates DOM structure including dialog-box and game-hud
- **game.css** styles the dialog box and location indicator
- **content.json.js** contains all academic content (publications, talks, media, research)

The main work is expanding this system to:
1. Detect proximity to interactive objects in building interiors
2. Display appropriate prompts based on object type
3. Show formatted academic content in expanded panel overlays
4. Ensure accessibility (keyboard navigation, focus trapping, ARIA)

**Primary recommendation:** Use DOM-based modal overlays (not canvas-rendered UI) with vanilla JavaScript proximity detection. Implement accessible focus trapping for panel overlays. Display location indicator persistently in HUD with smooth transitions.

## Standard Stack

### Core (Already Present)
| Library/Tool | Version | Purpose | Why Standard |
|--------------|---------|---------|--------------|
| Vanilla JavaScript | ES6+ | Game logic and interaction system | Already used throughout `/js/game/`, no framework needed for simple modal overlays |
| HTML5 Canvas | Native | Game rendering | Core game engine, interiors already rendered |
| DOM/CSS | Native | UI overlays (dialogs, HUD) | Better accessibility than canvas-rendered UI, already used in Buildings.js |

### No Additional Libraries Required

The phase can be completed with existing technologies. No new dependencies needed.

**Installation:**
```bash
# No installation required - using vanilla JS and native APIs
```

## Architecture Patterns

### Recommended Project Structure
```
js/game/
├── world.js          # Map data + interaction points (expand interior maps)
├── buildings.js      # Dialog/interaction logic (expand panel display)
├── engine.js         # Game loop + proximity checks (add per-frame detection)
├── player.js         # Player position (already tracks tileX, tileY)
└── sprites.js        # Sprite rendering (no changes needed)

src/styles/
└── game.css          # Add panel overlay styles, expand HUD styles
```

### Pattern 1: Proximity-Based Interaction Detection

**What:** Check player's tile position against interactive object positions each frame to determine nearby interactions.

**When to use:** Every game loop frame when not in dialog mode.

**Example:**
```javascript
// In Engine.loop() - check proximity each frame
const nearbyInteraction = World.checkNearbyInteractions(Player.tileX, Player.tileY);
Buildings.updatePrompt(nearbyInteraction, Engine.isMobile);

// In World.js - detect objects within 1-tile radius
checkNearbyInteractions(playerX, playerY) {
    const interactions = this.currentMap.interactions || [];

    for (const interaction of interactions) {
        const dx = Math.abs(interaction.x - playerX);
        const dy = Math.abs(interaction.y - playerY);

        // Adjacent or same tile (1-tile proximity)
        if (dx <= 1 && dy <= 1) {
            return interaction;
        }
    }
    return null;
}
```

**Rationale:** 1-tile proximity (adjacent or same tile) is standard for RPG-style games. Larger ranges feel imprecise, smaller ranges require pixel-perfect positioning.

### Pattern 2: DOM-Based Modal Overlays

**What:** Use HTML/CSS modal overlays positioned over the canvas, not canvas-rendered UI.

**When to use:** For all text-heavy content displays (publications, talks, research).

**Example:**
```javascript
// Buildings.js - show panel overlay
showContentPanel(title, items, type) {
    const panel = document.getElementById('content-panel');
    const panelTitle = document.getElementById('panel-title');
    const panelBody = document.getElementById('panel-body');

    panelTitle.textContent = title;
    panelBody.innerHTML = this.formatContentList(items, type);

    panel.classList.remove('hidden');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');

    // Focus trap
    this.trapFocus(panel);
}

formatContentList(items, type) {
    return items.map(item => {
        switch(type) {
            case 'publications':
                return `
                    <div class="panel-item">
                        <h4>${item.title}</h4>
                        <p class="authors">${item.authors.map(a => a.name).join(', ')}</p>
                        <p class="venue"><em>${item.journal}</em> (${item.year})</p>
                        <p class="abstract">${item.abstract}</p>
                    </div>`;
            case 'talks':
                return `
                    <div class="panel-item">
                        <h4>${item.title}</h4>
                        <p class="venue">${item.venue}</p>
                        <p class="date">${item.date}</p>
                    </div>`;
            // ... other types
        }
    }).join('');
}
```

**Rationale:** DOM-based UI provides:
- Native scrolling for long lists
- Better accessibility (screen readers, keyboard navigation)
- Easier styling with CSS
- Better text rendering than canvas

Canvas-rendered UI is appropriate for in-game sprites/HUD elements, but text-heavy content belongs in DOM.

### Pattern 3: Location HUD with Contextual Updates

**What:** Persistent location indicator showing current building name, updated on building enter/exit.

**When to use:** Always visible in game HUD.

**Example:**
```javascript
// Engine.js - update location display
updateLocationDisplay() {
    const locationElement = document.getElementById('current-location');
    const currentLocation = World.currentLocation;

    if (currentLocation === 'campus') {
        locationElement.textContent = 'Cambridge Campus';
    } else {
        const building = World.buildings[currentLocation];
        if (building) {
            locationElement.textContent = building.name;
        }
    }
}

// Call on building enter/exit
onEnterBuilding(buildingId) {
    World.currentLocation = buildingId;
    this.updateLocationDisplay();
}

onExitBuilding() {
    World.currentLocation = 'campus';
    this.updateLocationDisplay();
}
```

**CSS for smooth transitions:**
```css
.location-indicator {
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 8px 16px;
    border-radius: 4px;
    transition: opacity 0.3s ease;
}

.location-indicator.updating {
    opacity: 0.5;
}
```

### Pattern 4: Focus Trapping for Accessibility

**What:** When modal panel opens, trap keyboard focus inside the panel until closed.

**When to use:** Any modal overlay (content panels, dialogs).

**Example:**
```javascript
// Buildings.js - focus trap implementation
trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    // Trap focus
    element.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement?.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
            }
        }
    });

    // ESC to close
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            this.closePanel();
        }
    });
}
```

**Rationale:** Focus trapping is essential for accessible modals. Users navigating with Tab key must stay within modal, and ESC key must close it.

### Anti-Patterns to Avoid

- **Canvas-rendered text UI for long content:** Poor accessibility, difficult scrolling, bad text rendering
- **Global proximity detection without location check:** Would detect objects through walls if checking all interiors
- **Fixed-height panels without scrolling:** Publications/talks lists are too long for fixed containers
- **Missing focus management:** Screen reader users get lost without proper focus handling
- **Blocking interactions during transitions:** Creates laggy feel, interactions should be instant

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Focus trapping | Custom tab key listener from scratch | Established pattern (trap first/last focusable) | Edge cases: dynamic content, no focusable elements, nested traps |
| Scrollable list performance | Render all items always | Native CSS overflow-y: auto | Browser-optimized scrolling with momentum, better than any custom solution |
| Proximity detection | Complex geometric collision | Simple Manhattan distance (tile-based) | Tile grid already exists, no need for pixel-perfect collision |
| Modal backdrop | Manual pointer-events blocking | CSS ::backdrop or background click handler | Native dialog element handles this, or simple event delegation |
| Accessibility attributes | Guess at ARIA roles | Follow MDN dialog pattern | WCAG compliance requires specific aria-modal, role, aria-labelledby |

**Key insight:** Accessibility is the biggest trap. ARIA attributes seem optional but are required for WCAG compliance. Use established modal patterns with role="dialog", aria-modal="true", aria-labelledby.

## Common Pitfalls

### Pitfall 1: Detecting Interactions in Wrong Location Context

**What goes wrong:** Checking interior interaction points while player is on campus, or vice versa. Player triggers interactions through walls.

**Why it happens:** World.checkNearbyInteractions() doesn't filter by current location.

**How to avoid:**
```javascript
// World.js - filter interactions by current location
checkNearbyInteractions(playerX, playerY) {
    const currentMap = this.getCurrentMap();
    const interactions = currentMap.interactions || [];

    // Only check interactions in current location (campus or specific interior)
    const validInteractions = interactions.filter(i =>
        i.location === this.currentLocation
    );

    for (const interaction of validInteractions) {
        const dx = Math.abs(interaction.x - playerX);
        const dy = Math.abs(interaction.y - playerY);
        if (dx <= 1 && dy <= 1) return interaction;
    }
    return null;
}
```

**Warning signs:** Interaction prompts appearing at random times, prompts showing when far from any visible objects.

### Pitfall 2: Missing Focus Return on Panel Close

**What goes wrong:** When panel closes, keyboard focus is lost. Screen reader users don't know where they are.

**Why it happens:** Opening modal captures focus, closing it doesn't restore focus to trigger element.

**How to avoid:**
```javascript
// Buildings.js - save and restore focus
showContentPanel(title, items, type) {
    // Save element that had focus
    this.previousFocus = document.activeElement;

    // ... show panel, trap focus
}

closePanel() {
    panel.classList.add('hidden');

    // Restore focus to element that opened the panel
    if (this.previousFocus) {
        this.previousFocus.focus();
        this.previousFocus = null;
    }
}
```

**Warning signs:** After closing panel, Tab key doesn't highlight anything or jumps to unexpected location.

### Pitfall 3: Scrollable Content Without Visual Indicators

**What goes wrong:** User doesn't realize content is scrollable. Misses publications/talks beyond the fold.

**Why it happens:** All content looks like it fits in the panel, no scroll indicator.

**How to avoid:**
```css
/* Panel body with scroll */
.panel-body {
    max-height: 400px;
    overflow-y: auto;
    padding: 16px;
}

/* Show scroll shadow at top/bottom when scrollable */
.panel-body {
    background:
        linear-gradient(white 30%, rgba(255,255,255,0)),
        linear-gradient(rgba(255,255,255,0), white 70%) 0 100%,
        radial-gradient(farthest-side at 50% 0, rgba(0,0,0,.2), rgba(0,0,0,0)),
        radial-gradient(farthest-side at 50% 100%, rgba(0,0,0,.2), rgba(0,0,0,0)) 0 100%;
    background-repeat: no-repeat;
    background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
    background-attachment: local, local, scroll, scroll;
}
```

**Warning signs:** User testing reveals people don't scroll, think they've seen all content when they haven't.

### Pitfall 4: Forgetting Mobile Scroll Momentum

**What goes wrong:** Scrolling on mobile feels sluggish and unresponsive.

**Why it happens:** Missing `-webkit-overflow-scrolling: touch;` for iOS momentum scrolling.

**How to avoid:**
```css
.panel-body {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch; /* iOS momentum scrolling */
}
```

**Warning signs:** Smooth scrolling on desktop, jerky/unresponsive scrolling on iOS devices.

### Pitfall 5: Dialog Open While Moving

**What goes wrong:** Player movement continues while dialog/panel is open, causing player to move behind the overlay.

**Why it happens:** Input system doesn't check if panel is open before processing movement.

**How to avoid:**
```javascript
// Input.js or Player.update() - check for open panels
update(dt) {
    // Don't process movement if panel/dialog is open
    if (Buildings.isPanelOpen() || Buildings.isDialogOpen()) {
        return;
    }

    // ... normal movement logic
}
```

**Warning signs:** Player appears to teleport when panel closes because they moved behind it.

## Code Examples

Verified patterns for implementing this phase:

### Proximity Detection Loop

```javascript
// Engine.js - add to game loop
loop(currentTime) {
    if (!this.running) return;

    // ... delta time calculation

    // Update game state
    Player.update(dt);

    // Check for nearby interactions (only if not in dialog)
    if (!Buildings.isDialogOpen() && !Buildings.isPanelOpen()) {
        const interaction = World.checkNearbyInteractions(
            Player.tileX,
            Player.tileY
        );
        Buildings.updatePrompt(interaction, this.isMobile);
    } else {
        Buildings.hidePrompt();
    }

    // Render
    this.render();

    requestAnimationFrame((time) => this.loop(time));
}
```

### Interior Interaction Point Definition

```javascript
// World.js - define interaction points for each building interior
interiors: {
    pembroke: {
        width: 14,
        height: 12,
        tiles: [...],  // existing tile data
        interactions: [
            { x: 3, y: 5, type: 'object', name: 'bookshelf', contentKey: 'about' },
            { x: 7, y: 3, type: 'object', name: 'desk', contentKey: 'about' },
            { x: 10, y: 8, type: 'exit' }
        ]
    },
    library: {
        width: 20,
        height: 14,
        tiles: [...],
        interactions: [
            { x: 4, y: 5, type: 'publications', section: 'machine-learning' },
            { x: 8, y: 5, type: 'publications', section: 'ecology' },
            { x: 12, y: 5, type: 'publications', section: 'conservation' },
            { x: 16, y: 5, type: 'publications', section: 'all' },
            { x: 10, y: 12, type: 'exit' }
        ]
    },
    // ... other interiors
}
```

### Content Panel HTML Structure

```html
<!-- Add to CampusGame.ts createGameDOM() -->
<div id="content-panel" class="content-panel hidden" role="dialog" aria-modal="true">
    <div class="panel-header">
        <h2 id="panel-title"></h2>
        <button id="panel-close" class="panel-close" aria-label="Close panel">×</button>
    </div>
    <div id="panel-body" class="panel-body">
        <!-- Content items populated dynamically -->
    </div>
    <div class="panel-footer">
        <span class="panel-hint">ESC or click × to close</span>
    </div>
</div>
```

### Content Panel CSS

```css
/* Content panel overlay - larger than dialog box */
.content-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 800px;
    max-height: 80vh;
    background: rgba(26, 26, 46, 0.98);
    border: 3px solid #4a4a6a;
    border-radius: 8px;
    color: #fff;
    font-family: system-ui, -apple-system, sans-serif;
    z-index: 30;
    display: flex;
    flex-direction: column;
}

.content-panel.hidden {
    display: none;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #4a4a6a;
}

.panel-header h2 {
    margin: 0;
    font-size: 20px;
    color: #87ceeb;
}

.panel-close {
    background: none;
    border: none;
    color: #aaa;
    font-size: 32px;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
}

.panel-close:hover {
    color: #fff;
}

.panel-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    -webkit-overflow-scrolling: touch;
}

.panel-item {
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #333;
}

.panel-item:last-child {
    border-bottom: none;
}

.panel-item h4 {
    margin: 0 0 8px 0;
    color: #87ceeb;
    font-size: 16px;
}

.panel-item .authors,
.panel-item .venue {
    margin: 4px 0;
    font-size: 14px;
    color: #bbb;
}

.panel-item .abstract {
    margin: 8px 0 0 0;
    font-size: 14px;
    line-height: 1.5;
    color: #ddd;
}

.panel-footer {
    padding: 12px 20px;
    border-top: 1px solid #4a4a6a;
    text-align: right;
}

.panel-hint {
    color: #888;
    font-size: 12px;
    font-style: italic;
}
```

### Interaction Prompt Styling

```css
/* Interaction prompt - position above HUD */
.interaction-prompt {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 12px 24px;
    border-radius: 8px;
    border: 2px solid #87ceeb;
    font-family: monospace;
    font-size: 16px;
    pointer-events: none;
    z-index: 15;
    animation: prompt-pulse 1.5s ease-in-out infinite;
}

@keyframes prompt-pulse {
    0%, 100% { opacity: 0.9; }
    50% { opacity: 1; }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Canvas-rendered UI text | DOM overlays for text content | ~2015 | Better accessibility, easier styling, native scrolling |
| Custom focus management | Native `<dialog>` element | 2022 | Browser handles focus trap, backdrop, ESC key automatically |
| Manual ARIA attributes | Use `<dialog>` with minimal ARIA | 2022 | Less code, better accessibility by default |
| onClick for interactions | Proximity + key press | Always | More immersive game feel, natural RPG pattern |

**Deprecated/outdated:**
- **Canvas text rendering for UI:** Use DOM overlays instead. Canvas is for game graphics, DOM is for text UI.
- **Custom modal backdrop:** Native `<dialog>` element handles this. Consider upgrading from `.dialog-box` div to `<dialog>` element.
- **image-rendering: -moz-crisp-edges:** Use `image-rendering: pixelated` (standardized since 2020).

**Native `<dialog>` element recommendation:**

The existing codebase uses `<div class="dialog-box">` for dialogs. Consider upgrading to native `<dialog>` element:

```javascript
// Modern approach with <dialog>
const panel = document.querySelector('#content-panel');
panel.showModal();  // Handles focus trap, backdrop, ESC key automatically

// Close
panel.close();
```

Benefits:
- Automatic focus trapping
- Automatic backdrop
- ESC key handling built-in
- Better accessibility with `role="dialog"` implicit

**Note:** Browser support for `<dialog>` is excellent (95%+ as of 2025). Safe to use without polyfill.

## Open Questions

Things that couldn't be fully resolved:

1. **Content Organization in Library**
   - What we know: Library has 15 publications across different topics
   - What's unclear: Should publications be organized by topic (ML, ecology, conservation) or chronologically? Or all in one list?
   - Recommendation: Start with single "Browse All" interaction showing all publications. If user feedback indicates organization is needed, add topic-based bookshelves in Phase 8 polish.

2. **Link Behavior in Panels**
   - What we know: Publications have DOI links, media has external links
   - What's unclear: Should links open in new tabs, or transition to website mode for details?
   - Recommendation: External links (DOI, media URLs) open in new tabs with `target="_blank" rel="noopener"`. Internal navigation to website mode deferred to Phase 7 (Landing & Transitions).

3. **Context-Aware Dialog (INT-06)**
   - What we know: Requirement says "Welcome back!" for returning visitors
   - What's unclear: How to track "returning" - per session, localStorage, or per building entry?
   - Recommendation: Simple per-building flag in session: first entry shows "Welcome to Library!", subsequent entries show "Welcome back to Library!" Flag resets on game restart. Persistent tracking with localStorage deferred to v2.

## Sources

### Primary (HIGH confidence)

- [MDN: ARIA aria-modal attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-modal) - ARIA best practices for modals
- [MDN: `<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) - Native dialog element documentation
- [A11Y Collective: Modal Accessibility](https://www.a11y-collective.com/blog/modal-accessibility/) - Focus trap implementation patterns
- [UXPin: Accessible Modals with Focus Traps](https://www.uxpin.com/studio/blog/how-to-build-accessible-modals-with-focus-traps/) - Code examples for focus management
- [MDN: Crisp Pixel Art with image-rendering](https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look) - CSS for pixel-perfect rendering

### Secondary (MEDIUM confidence)

- [Userpilot: Modal UX Design 2026](https://userpilot.com/blog/modal-ux-design/) - Best practices for modal headers, footers, mobile
- [Orangeable: 2D Tile-Based Game with JavaScript](https://orangeable.com/javascript/2d-tile-based-game) - Keyboard controls and viewport mechanics
- [Medium: UX and UI in Game Design (HUD)](https://medium.com/@brdelfino.work/ux-and-ui-in-game-design-exploring-hud-inventory-and-menus-5d8c189deb65) - HUD design principles
- [Blog: HTML5 Game Tutorial - Canvas vs DOM](https://blog.sklambert.com/html5-game-tutorial-game-ui-canvas-vs-dom/) - When to use DOM for UI

### Tertiary (LOW confidence)

- [Roblox: Proximity Prompts](https://create.roblox.com/docs/ui/proximity-prompts) - Proximity interaction patterns (Roblox-specific but conceptually relevant)
- [Smashing Magazine: Infinite Scroll UX](https://www.smashingmagazine.com/2022/03/designing-better-infinite-scroll/) - Scroll indicator patterns

## Metadata

**Confidence breakdown:**
- Proximity detection: HIGH - Standard tile-based pattern, well-established in 2D games
- Modal overlays: HIGH - DOM-based modals with ARIA are documented standards
- Focus trapping: HIGH - Established accessibility pattern with code examples from official sources
- Content display: MEDIUM - Design choices (how much to show, organization) require user testing
- Location HUD: HIGH - Simple text display with CSS transitions

**Research date:** 2026-01-31
**Valid until:** 2026-03-31 (30 days for stable technologies - HTML/CSS/accessibility patterns change slowly)
