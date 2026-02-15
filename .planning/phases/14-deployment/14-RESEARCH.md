# Phase 14: Deployment - Research

**Researched:** 2026-02-15
**Domain:** Mobile responsiveness & GitHub Pages deployment for Vite static sites
**Confidence:** HIGH

## Summary

Phase 14 focuses on making the site fully responsive on mobile devices (320px minimum width, 44px touch targets) and deploying successfully to GitHub Pages. The site already has a hamburger menu implementation and basic responsive patterns at 768px breakpoint, but needs comprehensive mobile optimization across all components.

The standard approach in 2026 combines:
1. **Mobile-first CSS** with fluid typography (clamp()), CSS Grid auto-fit/minmax, and container queries
2. **Progressive enhancement** starting from 320px base, adding complexity at larger breakpoints
3. **GitHub Actions deployment** with proper base path configuration for GitHub Pages
4. **Accessibility-first** with WCAG 2.2 touch targets (24px minimum, 44px recommended) and prefers-reduced-motion

**Current state:** Site has basic responsive structure (768px breakpoint, hamburger menu, prefers-reduced-motion support). Needs comprehensive mobile optimization, typography scaling, touch target verification, and GitHub Pages deployment configuration.

**Primary recommendation:** Use mobile-first CSS with fluid typography (CSS clamp), verify all touch targets meet WCAG 2.5.8 (minimum 24px, target 44px), implement CSS Grid auto-fit/minmax for card layouts, and deploy via GitHub Actions with proper base path configuration.

## Standard Stack

The established libraries/tools for mobile responsiveness and Vite deployment in 2026:

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| CSS clamp() | Native | Fluid typography without media queries | Eliminates breakpoint-specific font sizes, automatic scaling between min/max values |
| CSS Grid auto-fit/minmax | Native | Responsive card layouts without media queries | Single declaration handles all screen sizes, better than float/flexbox patterns |
| CSS Container Queries | Native (90%+ support) | Component-level responsiveness | Allows components to adapt based on container size vs viewport |
| GitHub Actions | Native | CI/CD for GitHub Pages | Official GitHub integration, no third-party services needed |
| Vite build | 5.4+ | Static site compilation | Fast builds, tree-shaking, optimized production output |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| dvh/svh/lvh units | Native | Mobile viewport height | Replace 100vh on mobile to handle browser chrome UI |
| prefers-reduced-motion | Native | Accessibility for animations | Required for WCAG 2.3.3 compliance |
| env(safe-area-inset-*) | Native | iOS notch/home indicator | Ensure content doesn't overlap device UI |
| rollup-plugin-visualizer | Latest | Bundle size analysis | Identify large dependencies before deployment |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| GitHub Actions | gh-pages npm package | Manual workflow vs automated CI/CD |
| CSS clamp() | Media query breakpoints | More code, less fluid scaling |
| Native Grid | CSS framework (Tailwind, Bootstrap) | Adds ~50KB+ for features already native |
| Container queries | Media queries only | Global breakpoints less flexible than component-level |

**Installation:**
```bash
# No new dependencies required - using native CSS features
# Optional: bundle analyzer for optimization
npm install -D rollup-plugin-visualizer
```

## Architecture Patterns

### Recommended Responsive Approach

**Mobile-First CSS Structure:**
```
1. Base styles (320px+) - mobile defaults
2. Fluid values (clamp, auto-fit) - scale automatically
3. Medium breakpoint (~640px) - tablet adjustments
4. Large breakpoint (~1024px) - desktop features
```

**Key principle:** Start with mobile, add complexity for larger screens.

### Pattern 1: Fluid Typography with CSS clamp()

**What:** Typography scales smoothly between minimum and maximum sizes based on viewport width.

**When to use:** All text that should scale responsively without discrete breakpoint jumps.

**Example:**
```css
/* Source: https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/ */

:root {
  /* Scale from 16px at 320px viewport to 18px at 1200px viewport */
  --font-size-base: clamp(1rem, 0.91rem + 0.43vw, 1.125rem);

  /* Scale from 36px to 48px */
  --font-size-4xl: clamp(2.25rem, 1.91rem + 1.36vw, 3rem);
}

body {
  font-size: var(--font-size-base);
}

h1 {
  font-size: var(--font-size-4xl);
}
```

**Why it works:** Eliminates need for multiple media queries per font size. Accessible because em/rem units respect user zoom preferences, while vw component stays minimal.

**Calculator tools:**
- https://www.fluid-type-scale.com/
- https://utopia.fyi/type/calculator/

### Pattern 2: Responsive Grid with auto-fit/minmax

**What:** CSS Grid automatically adjusts column count based on available space without media queries.

**When to use:** Card grids, image galleries, any repeating elements that should wrap responsively.

**Example:**
```css
/* Source: https://harshal-ladhe.netlify.app/post/responsive-css-grid-layouts */

.card-grid {
  display: grid;
  /* Use min(100%, 250px) to prevent overflow on narrow screens */
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
  gap: 1.5rem;
}

/* No media queries needed - grid automatically wraps */
```

**Why it works:** `auto-fit` collapses empty tracks and distributes space. `minmax(min(100%, 250px), 1fr)` ensures cards shrink to container width when < 250px, preventing horizontal scroll.

**auto-fit vs auto-fill:** Use `auto-fit` for 95% of cases (cards, images). Use `auto-fill` only when you need to preserve empty column space.

### Pattern 3: Mobile Viewport Height (dvh)

**What:** Dynamic viewport height units that account for mobile browser chrome (address bar, toolbar).

**When to use:** Full-height sections, modals, overlays on mobile.

**Example:**
```css
/* Source: https://medium.com/@tharunbalaji110/understanding-mobile-viewport-units-svh-lvh-dvh */

/* OLD WAY - breaks on mobile Safari */
.hero {
  height: 100vh; /* Doesn't account for browser UI */
}

/* NEW WAY - respects mobile browser chrome */
.hero {
  height: 100dvh; /* Dynamic viewport height */
}

/* Fallback for older browsers */
.hero {
  height: 100vh;
  height: 100dvh;
}
```

**Other viewport units:**
- `svh` (small viewport height) - browser UI expanded (initial load)
- `lvh` (large viewport height) - browser UI collapsed (scrolling)
- `dvh` (dynamic viewport height) - adapts to current state

### Pattern 4: Touch Target Sizing

**What:** Ensure interactive elements meet minimum touch target sizes for accessibility and usability.

**When to use:** All buttons, links, form inputs, interactive cards.

**Example:**
```css
/* Source: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html */

/* WCAG 2.5.8 Level AA: Minimum 24x24px */
button, a {
  min-height: 44px; /* Apple HIG / best practice */
  min-width: 44px;
  padding: 12px 16px;
}

/* Cards as interactive targets */
.card {
  min-height: 44px;
  /* Add padding to increase touch area without visual changes */
  position: relative;
}

.card::after {
  content: '';
  position: absolute;
  inset: -8px; /* Extend touch area 8px in all directions */
}
```

**Standards:**
- WCAG 2.5.8 (Level AA): 24×24px minimum
- Apple HIG: 44×44px recommended
- Android Material: 48×48dp recommended

**Exception:** Inline text links can be smaller if they have adequate spacing (24px between centers).

### Pattern 5: Mobile Navigation

**What:** Hamburger menu pattern with accessible keyboard navigation and focus management.

**When to use:** Sites with 4+ navigation items on mobile screens < 768px.

**Example:**
```typescript
// Source: Current implementation in Header.ts (already well-implemented)

export function initMobileNav(): void {
  const menuButton = document.querySelector<HTMLButtonElement>('.menuButton');
  const mobileNav = document.querySelector<HTMLElement>('#mobile-nav');

  menuButton.addEventListener('click', () => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isExpanded));
    mobileNav.hidden = isExpanded;

    // Focus management - move focus to first link when opening
    if (!isExpanded) {
      mobileNav.querySelector<HTMLAnchorElement>('a')?.focus();
    }
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
    });
  });

  // Escape key closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileNav.hidden) {
      menuButton.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
      menuButton.focus(); // Return focus to trigger
    }
  });
}
```

**Accessibility requirements:**
- Use `aria-expanded` to indicate menu state
- Manage focus: move to first item on open, return to button on close
- Support Escape key to close
- Use semantic HTML (`<nav>`, `<button>`, `<ul>`, `<li>`)
- 44×44px minimum touch target for hamburger button

**Alternative patterns:**
- **Bottom tab bar**: 40% faster task completion in testing, better for one-handed use
- **Drawer/slide-out**: Common on mobile apps, requires focus trap
- **Priority+**: Show items that fit, hide overflow in "More" menu

For this academic portfolio with 5 navigation items, current hamburger implementation is appropriate.

### Pattern 6: Responsive Breakpoint Strategy

**What:** Mobile-first breakpoint system starting from 320px.

**When to use:** All responsive layouts.

**Recommended breakpoints for 2026:**
```css
/* Source: https://www.browserstack.com/guide/responsive-design-breakpoints */

/* Base: 320px+ (mobile default - no media query needed) */

/* Small mobile */
@media (min-width: 375px) {
  /* Minor adjustments for larger phones (iPhone SE+) */
}

/* Large mobile / small tablet */
@media (min-width: 640px) {
  /* Landscape phones, small tablets */
  /* Begin introducing multi-column layouts */
}

/* Tablet */
@media (min-width: 768px) {
  /* iPad portrait, larger tablets */
  /* Show desktop navigation */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Laptops, desktops */
  /* Multi-column layouts, larger typography */
}

/* Large desktop */
@media (min-width: 1280px) {
  /* Large screens - max out content width */
}
```

**Current state analysis:**
Site uses single breakpoint at 768px. This is minimal but functional. Consider adding 640px for tablet optimization.

**Content-first approach:** Set breakpoints where content breaks, not at device widths. Test by resizing browser continuously—add breakpoint where layout looks cramped.

### Pattern 7: GitHub Pages Deployment

**What:** Automated deployment to GitHub Pages using GitHub Actions.

**When to use:** All static sites hosted on GitHub Pages.

**Vite Configuration:**
```typescript
// vite.config.ts
// Source: https://vite.dev/guide/static-deploy

import { defineConfig } from 'vite';

export default defineConfig({
  // Set base path for GitHub Project Pages
  // For user/org site (username.github.io): use base: '/'
  // For project site (username.github.io/repo): use base: '/repo/'
  base: process.env.GITHUB_PAGES ? '/Website/' : '/',

  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2022',

    // Optimize for production
    minify: 'esbuild',
    cssMinify: true,

    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          vendor: ['lit-html'], // If using external libs
        },
      },
    },
  },
});
```

**GitHub Actions Workflow:**
```yaml
# .github/workflows/deploy.yml
# Source: https://github.com/sitek94/vite-deploy-demo

name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          GITHUB_PAGES: true

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Repository Settings:**
1. Navigate to Settings → Pages
2. Set Source to "GitHub Actions"
3. Workflow will run on every push to `main`

**Testing locally before deployment:**
```bash
# Build for production
npm run build

# Preview production build
npm run preview
# Opens http://localhost:4173

# Test with base path
vite preview --base=/Website/
```

### Anti-Patterns to Avoid

- **Fixed viewport meta tag:** `<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">` — Never disable user scaling. Remove `user-scalable=no` and `maximum-scale=1`.

- **100vh on mobile without fallback:** Mobile Safari's UI chrome causes overflow. Use `dvh` units or JavaScript calculation.

- **px-only font sizes:** Doesn't respect user zoom preferences. Always use rem/em for font sizes.

- **Desktop-first CSS:** Sends unnecessary code to mobile. Start mobile, add desktop features.

- **Hover-only interactions:** Touch devices can't hover. Ensure tap/click alternatives.

- **Tiny touch targets:** Links/buttons < 24px violate WCAG 2.5.8. Aim for 44px minimum.

- **Forgetting base path:** Vite apps on GitHub Project Pages need `base: '/repo/'` or assets 404.

- **Committing dist folder:** GitHub Actions builds on deploy. Add `dist/` to .gitignore.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Focus trap for modals | Custom Tab key handler | Browser's native `<dialog>` element or focus-trap library | Edge cases: Shift+Tab, hidden elements, dynamic content, screen readers |
| Responsive images | Manual srcset calculations | Build tool image optimization (Vite plugin) | Generates srcset automatically, converts to WebP/AVIF, handles pixel density |
| Fluid type scale calculator | Manual clamp() math | https://www.fluid-type-scale.com/ or https://utopia.fyi/type/calculator/ | Calculates vw values correctly, maintains aspect ratio across viewports |
| Bundle size analysis | Manual webpack stats parsing | rollup-plugin-visualizer | Visual charts, identifies large deps, tracks over time |
| Device testing | Local browser DevTools only | BrowserStack or real device lab | DevTools simulate layout but not actual rendering, touch, or performance |

**Key insight:** Mobile responsiveness has many edge cases (viewport units, touch vs hover, browser chrome, notches). Use battle-tested native features (clamp, grid, container queries) instead of custom JavaScript solutions.

## Common Pitfalls

### Pitfall 1: Testing Only in Desktop DevTools

**What goes wrong:** Site looks perfect in Chrome DevTools mobile simulator but breaks on actual phones.

**Why it happens:** DevTools simulates dimensions but not:
- Actual mobile browser rendering engine differences
- Touch input nuances (tap delay, touch precision)
- Real-world constraints (slower CPU, network)
- OS-specific UI (iOS Safari chrome, Android nav bar)

**How to avoid:**
1. Test in DevTools for initial layout verification
2. Use `vite preview` to test production build locally
3. Deploy to staging environment (GitHub Pages branch)
4. Test on actual devices or BrowserStack/Sauce Labs

**Warning signs:**
- Viewport height issues (100vh)
- Touch targets feel too small
- Hover effects don't work
- Performance issues not visible in DevTools

**Sources:**
- [Chrome DevTools Device Mode](https://developer.chrome.com/docs/devtools/device-mode)
- [DebugBear DevTools Guide](https://www.debugbear.com/docs/chrome-devtools-device-mode)

### Pitfall 2: Forgetting Base Path for GitHub Project Pages

**What goes wrong:** Site deploys successfully but all assets (CSS, JS, images) return 404 errors. Page loads but appears unstyled.

**Why it happens:** GitHub Project Pages serve from `username.github.io/repo/` subdirectory. Vite's default `base: '/'` generates absolute paths like `/assets/main.js`, which resolves to `username.github.io/assets/main.js` (wrong) instead of `username.github.io/repo/assets/main.js` (correct).

**How to avoid:**
```typescript
// vite.config.ts
export default defineConfig({
  // For username.github.io (User/Org site): base: '/'
  // For username.github.io/repo (Project site): base: '/repo/'
  base: process.env.GITHUB_PAGES ? '/Website/' : '/',
});
```

Set `GITHUB_PAGES=true` in GitHub Actions workflow:
```yaml
- name: Build
  run: npm run build
  env:
    GITHUB_PAGES: true
```

**Testing locally with base path:**
```bash
vite preview --base=/Website/
```

**Warning signs:**
- Deploy succeeds but page is unstyled
- Browser console shows 404 for all assets
- HTML loads but CSS/JS missing

**Sources:**
- [Vite Static Deploy Docs](https://vite.dev/guide/static-deploy)
- [Medium: Deploying Vite to GitHub Pages](https://medium.com/@aishwaryaparab1/deploying-vite-deploying-vite-app-to-github-pages-166fff40ffd3)

### Pitfall 3: Touch Targets Too Small

**What goes wrong:** Users struggle to tap links and buttons on mobile. High "rage tap" rate (repeated rapid taps indicating frustration).

**Why it happens:**
- Desktop link sizes (16px text with minimal padding) are too small for fingers
- Inline text links without spacing
- Icon buttons without adequate hit area
- Forgotten to test with actual touch input

**How to avoid:**
```css
/* Minimum WCAG 2.5.8 AA standard: 24x24px */
/* Best practice: 44x44px (Apple HIG) or 48x48dp (Android Material) */

button, .button, a.button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}

/* Inline text links: ensure 24px spacing between centers */
.content a {
  padding: 12px 4px; /* Vertical padding for larger tap area */
  margin: 0 8px; /* Horizontal spacing */
}

/* Icon buttons: expand hit area invisibly */
.icon-button {
  position: relative;
  width: 24px; /* Visual size */
  height: 24px;
}

.icon-button::after {
  content: '';
  position: absolute;
  inset: -10px; /* 44px total hit area */
}
```

**Verification:**
1. Use browser DevTools "Show tap highlights" feature
2. Test on actual device with real finger input
3. Verify minimum 24px (WCAG AA) or 44px (best practice)

**Warning signs:**
- User testing shows repeated taps on same element
- Analytics show high bounce rate on mobile vs desktop
- Accessibility audit flags target size violations

**Sources:**
- [WCAG 2.5.8 Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [Smashing Magazine: Accessible Tap Target Sizes](https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/)
- [WebAbility: Target Size Guide](https://www.webability.io/glossary/target-size)

### Pitfall 4: Not Respecting prefers-reduced-motion

**What goes wrong:** Users with vestibular disorders, epilepsy, or motion sensitivity experience nausea, dizziness, or seizures from animations.

**Why it happens:** Animations added for visual polish without considering accessibility. Forgetting to check for `prefers-reduced-motion` media query.

**How to avoid:**
```css
/* Default: animations OFF (progressive enhancement) */
.card {
  transition: none;
}

/* Add animations only for users who can handle motion */
@media (prefers-reduced-motion: no-preference) {
  .card {
    transition: transform 250ms ease-out;
  }

  .card:hover {
    transform: translateY(-4px);
  }
}

/* OR: Global disable for reduced-motion users */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Current state:** Site has good `prefers-reduced-motion` support in global.css. Verify all new animations follow this pattern.

**Acceptable animations for reduced-motion:**
- Fade in/out (opacity changes)
- Color changes
- Dissolve effects

**Avoid for reduced-motion:**
- Scaling, rotating, tilting
- Parallax, wave effects
- Rapid flashing (epilepsy trigger)

**Warning signs:**
- User reports discomfort or nausea
- Accessibility audit flags missing reduced-motion support

**Sources:**
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [W3C WCAG 2.3.3: Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [CSS-Tricks: prefers-reduced-motion](https://css-tricks.com/almanac/rules/m/media/prefers-reduced-motion/)

### Pitfall 5: Single Breakpoint Thinking

**What goes wrong:** Site looks good on phone (375px) and desktop (1920px) but breaks on tablets (768px-1024px) or landscape phones (640px).

**Why it happens:** Testing only at extremes (mobile & desktop) without checking intermediate sizes. Single breakpoint (768px) assumes binary mobile/desktop world.

**How to avoid:**
1. **Use fluid values** (clamp, auto-fit/minmax) to handle most sizes automatically
2. **Add breakpoints where content breaks**, not at device widths
3. **Test continuously**: Resize browser from 320px to 1920px, add breakpoint where layout looks cramped

**Recommended breakpoint strategy:**
```css
/* Mobile-first: 320px+ is default (no media query) */

/* Landscape phones: 640px+ */
@media (min-width: 640px) {
  /* 2-column layouts, larger touch targets */
}

/* Tablets: 768px+ */
@media (min-width: 768px) {
  /* Desktop nav, 3-column layouts */
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  /* Full multi-column, larger typography */
}
```

**Tools for testing:**
- Chrome DevTools responsive mode (drag to resize)
- Firefox Responsive Design Mode
- Responsively App (shows multiple sizes simultaneously)

**Warning signs:**
- Content overlaps or overflows at specific widths
- Text becomes unreadable at certain sizes
- Navigation breaks between breakpoints

**Sources:**
- [Framer: Breakpoints Guide 2026](https://www.framer.com/blog/responsive-breakpoints/)
- [BrowserStack: Responsive Design Breakpoints](https://www.browserstack.com/guide/responsive-design-breakpoints)
- [CauseLabs: Determining Ideal Breakpoints](https://www.causelabs.com/post/digital-breakpoints-responsive-design/)

### Pitfall 6: GitHub Pages SPA Routing Issues

**What goes wrong:** Site works at root URL but returns 404 when user directly visits a subpage or refreshes on a client-side route.

**Why it happens:** GitHub Pages is a static file server. It doesn't understand client-side routing. Direct navigation to `/talks` looks for `/talks/index.html` which doesn't exist.

**How to avoid:**

**Option A: Hash routing** (recommended for simple sites)
```typescript
// Use hash-based URLs: /#/talks instead of /talks
// No server configuration needed
// Works out of the box on GitHub Pages
```

**Option B: 404.html redirect** (for history mode routing)
```html
<!-- 404.html -->
<!-- Source: https://github.com/rafgraph/spa-github-pages -->
<script>
  // Redirect to index.html with path in query string
  var pathSegmentsToKeep = 1; // For GitHub Pages project sites
  var l = window.location;
  l.replace(
    l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
    l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
    l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
    (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
    l.hash
  );
</script>
```

**Current state:** Site uses hash-based anchor navigation (`#about`, `#publications`). This works perfectly with GitHub Pages—no additional configuration needed.

**If implementing client-side routing later:** Use hash routing or 404.html redirect method.

**Warning signs:**
- 404 errors on page refresh
- Direct links to subpages don't work
- Browser back button breaks

**Sources:**
- [GitHub: SPA GitHub Pages](https://github.com/rafgraph/spa-github-pages)
- [Smashing Magazine: SPA Hack for GitHub Pages](https://www.smashingmagazine.com/2016/08/sghpa-single-page-app-hack-github-pages/)
- [GitHub Community: SPA Routing Discussion](https://github.com/orgs/community/discussions/64096)

## Code Examples

Verified patterns from official sources:

### Fluid Typography Setup

```css
/* Source: https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/ */

:root {
  /* Base font size: 16px @ 320px → 18px @ 1200px */
  --font-size-base: clamp(1rem, 0.91rem + 0.43vw, 1.125rem);

  /* Small: 14px @ 320px → 16px @ 1200px */
  --font-size-sm: clamp(0.875rem, 0.80rem + 0.34vw, 1rem);

  /* Large: 20px @ 320px → 24px @ 1200px */
  --font-size-lg: clamp(1.25rem, 1.14rem + 0.54vw, 1.5rem);

  /* Heading: 36px @ 320px → 48px @ 1200px */
  --font-size-4xl: clamp(2.25rem, 1.91rem + 1.36vw, 3rem);
}

body {
  font-size: var(--font-size-base);
}

/* No media queries needed - scales automatically */
```

**Generate values:** Use https://www.fluid-type-scale.com/ for precise calculations.

### Responsive Card Grid

```css
/* Source: https://harshal-ladhe.netlify.app/post/responsive-css-grid-layouts */

.publications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 1.5rem;
}

/* Wraps automatically:
   - 320px viewport: 1 column
   - 640px viewport: 2 columns
   - 960px viewport: 3 columns
   No media queries needed */
```

### Mobile Navigation with Focus Management

```typescript
// Source: Current Header.ts implementation (well-done)

export function initMobileNav(): void {
  const menuButton = document.querySelector<HTMLButtonElement>('.menuButton');
  const mobileNav = document.querySelector<HTMLElement>('#mobile-nav');

  if (!menuButton || !mobileNav) return;

  // Toggle menu
  menuButton.addEventListener('click', () => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isExpanded));
    mobileNav.hidden = isExpanded;

    // Focus management: move to first link when opening
    if (!isExpanded) {
      mobileNav.querySelector<HTMLAnchorElement>('a')?.focus();
    }
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileNav.hidden) {
      menuButton.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
      menuButton.focus(); // Return focus to trigger
    }
  });
}
```

### Touch Target Verification

```css
/* Source: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html */

/* Method 1: Direct sizing */
.button,
button,
a.card {
  min-height: 44px; /* Apple HIG recommendation */
  min-width: 44px;
  padding: 12px 16px;
}

/* Method 2: Invisible hit area expansion */
.icon-button {
  position: relative;
  /* Visual size can be smaller */
}

.icon-button::after {
  content: '';
  position: absolute;
  /* Expand touch area without visual change */
  inset: -10px; /* 44px total if icon is 24px */
  border-radius: inherit;
}
```

### Viewport Meta Tag

```html
<!-- Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag -->

<!-- CORRECT: Allows user scaling -->
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- WRONG: Disables accessibility feature -->
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
```

### Mobile Viewport Height

```css
/* Source: https://medium.com/@tharunbalaji110/understanding-mobile-viewport-units-svh-lvh-dvh */

.hero-section {
  /* Fallback for older browsers */
  height: 100vh;

  /* Modern: respects mobile browser chrome */
  height: 100dvh;
}

/* Safe area insets for iOS notch/home indicator */
.fixed-footer {
  padding-bottom: env(safe-area-inset-bottom);
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Media query breakpoints for typography | CSS clamp() for fluid type | 2020-2021 | Fewer media queries, smoother scaling |
| Flexbox with media queries for grids | CSS Grid auto-fit/minmax | 2019-2020 | Single declaration replaces complex breakpoint logic |
| 100vh on mobile | dvh/svh/lvh units | 2023-2024 (Chrome 108+) | Fixes mobile viewport height issues |
| Media queries only | Container queries | 2023-2024 (90%+ support) | Component-level responsiveness |
| Manual srcset generation | Build tool automation | 2021-2022 | Auto-generates responsive images |
| Travis CI / Circle CI | GitHub Actions | 2020-2021 | Native integration, no third-party service |
| gh-pages npm package | GitHub Actions deploy | 2022-2023 | Automated CI/CD vs manual publish |

**Deprecated/outdated:**
- **Viewport zoom disabling** (`user-scalable=no`): Violates WCAG 1.4.4, removed from accessibility guidelines
- **Fixed-width layouts**: Mobile-first fluid layouts are standard since 2015+
- **px-only font sizes**: Use rem/em for accessibility (zoom support)
- **Separate mobile subdomains** (m.example.com): Responsive design replaced separate mobile sites
- **jQuery for responsive features**: Native CSS and modern JS APIs handle all use cases

## Open Questions

Things that couldn't be fully resolved:

1. **Repository name for base path configuration**
   - What we know: Site needs `base: '/repo-name/'` in vite.config.ts for GitHub Project Pages
   - What's unclear: Current git remote shows "No remote" - repository not yet pushed to GitHub
   - Recommendation: When creating GitHub repository, note the repo name and update `vite.config.ts` accordingly. Test with `vite preview --base=/repo-name/` before deploying.

2. **Actual device testing availability**
   - What we know: DevTools simulation is insufficient for final verification
   - What's unclear: Whether user has access to physical devices or BrowserStack/Sauce Labs account
   - Recommendation: Prioritize testing on at least one physical mobile device. If unavailable, deploy to GitHub Pages staging and test on personal phone.

3. **Bundle size threshold for this project**
   - What we know: Vite provides tree-shaking and minification out of the box
   - What's unclear: What bundle size is acceptable for this academic portfolio (no hard requirement specified)
   - Recommendation: Measure baseline with `rollup-plugin-visualizer`, aim for < 100KB initial JS bundle for good mobile performance on 3G.

4. **Container queries adoption for this phase**
   - What we know: Container queries have 90%+ browser support and provide component-level responsiveness
   - What's unclear: Whether complexity is worth it for this site's component structure
   - Recommendation: Use media queries for initial implementation (simpler, well-understood). Consider container queries if components are reused in variable-width contexts.

## Sources

### Primary (HIGH confidence)

**Vite Deployment:**
- [Vite Official: Static Deploy Guide](https://vite.dev/guide/static-deploy) - GitHub Pages configuration
- [Vite Official: Build Options](https://vite.dev/config/build-options) - Build optimization

**WCAG Standards:**
- [W3C WCAG 2.5.8: Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) - 24px touch targets
- [W3C WCAG 2.3.3: Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html) - Reduced motion
- [W3C Technique C39: prefers-reduced-motion](https://www.w3.org/WAI/WCAG21/Techniques/css/C39) - Implementation guidance

**Browser Documentation:**
- [MDN: CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries) - Container query syntax
- [MDN: Viewport Meta Tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag) - Mobile viewport configuration
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) - Media query
- [Chrome DevTools: Device Mode](https://developer.chrome.com/docs/devtools/device-mode) - Testing tools

**Mobile Viewport:**
- [Apple: Configuring the Viewport](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/UsingtheViewport.html) - Safari viewport
- [Apple: Supported Meta Tags](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html) - Safari meta tags

### Secondary (MEDIUM confidence)

**Responsive Design Best Practices:**
- [BrowserStack: Responsive Design Breakpoints 2025](https://www.browserstack.com/guide/responsive-design-breakpoints) - Breakpoint strategy
- [Framer: Breakpoints Guide 2026](https://www.framer.com/blog/responsive-breakpoints/) - Modern breakpoint approach
- [CauseLabs: Determining Ideal Breakpoints](https://www.causelabs.com/post/digital-breakpoints-responsive-design/) - Content-first methodology

**Fluid Typography:**
- [Smashing Magazine: Modern Fluid Typography Using CSS Clamp](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/) - Comprehensive clamp() guide
- [Fluid Type Scale Calculator](https://www.fluid-type-scale.com/) - Calculator tool
- [Utopia Type Calculator](https://utopia.fyi/type/calculator/) - Alternative calculator

**CSS Grid Responsive Patterns:**
- [Harshal Ladhe: Responsive CSS Grid Layouts](https://harshal-ladhe.netlify.app/post/responsive-css-grid-layouts/) - auto-fit/minmax patterns
- [CSS-Tricks: Auto-Sizing Columns](https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/) - auto-fill vs auto-fit
- [Ahmad Shadeed: CSS Grid minmax](https://ishadeed.com/article/css-grid-minmax/) - Deep dive

**Touch & Accessibility:**
- [Smashing Magazine: Accessible Tap Target Sizes](https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/) - Touch target best practices
- [WebAbility: Target Size Guide](https://www.webability.io/glossary/target-size) - WCAG compliance
- [Accessibility Checker: Touch Target Size](https://www.accessibilitychecker.org/wcag-guides/ensure-touch-targets-have-sufficient-size-and-space/) - Guidelines

**Mobile Navigation:**
- [Phone Simulator: Mobile Navigation Patterns 2026](https://phone-simulator.com/blog/mobile-navigation-patterns-in-2026) - Pattern comparison
- [DesignStudioUIUX: Mobile Navigation UX Best Practices 2026](https://www.designstudiouiux.com/blog/mobile-navigation-ux/) - Best practices
- [NN/g: Basic Patterns for Mobile Navigation](https://www.nngroup.com/articles/mobile-navigation-patterns/) - UX research

**Viewport Units:**
- [Medium: Understanding Mobile Viewport Units (svh, lvh, dvh)](https://medium.com/@tharunbalaji110/understanding-mobile-viewport-units-svh-lvh-dvh) - New viewport units
- [CodeGenes: Fix CSS 100vh Mobile](https://www.codegenes.net/blog/css-100vh-is-too-tall-on-mobile-due-to-browser-ui/) - Mobile viewport issues

**GitHub Pages Deployment:**
- [Medium: Deploying Vite to GitHub Pages](https://medium.com/@aishwaryaparab1/deploying-vite-deploying-vite-app-to-github-pages-166fff40ffd3) - Deployment guide
- [Savas Labs: Deploying Vite with GitHub Actions](https://savaslabs.com/blog/deploying-vite-github-pages-single-github-action) - GitHub Actions workflow
- [GitHub: sitek94/vite-deploy-demo](https://github.com/sitek94/vite-deploy-demo) - Reference implementation

**SPA Routing on GitHub Pages:**
- [GitHub: rafgraph/spa-github-pages](https://github.com/rafgraph/spa-github-pages) - 404.html redirect solution
- [Smashing Magazine: SPA Hack for GitHub Pages](https://www.smashingmagazine.com/2016/08/sghpa-single-page-app-hack-github-pages/) - Workaround guide
- [GitHub Community: SPA Routing Discussion](https://github.com/orgs/community/discussions/64096) - Community solutions

**Container Queries:**
- [LogRocket: Container Queries 2026](https://blog.logrocket.com/container-queries-2026/) - Current state analysis
- [FreeCodeCamp: Media Queries vs Container Queries](https://www.freecodecamp.org/news/media-queries-vs-container-queries/) - Comparison guide
- [Josh W. Comeau: Container Queries Introduction](https://www.joshwcomeau.com/css/container-queries-introduction/) - Tutorial

**Testing & Optimization:**
- [DebugBear: Chrome DevTools Device Mode](https://www.debugbear.com/docs/chrome-devtools-device-mode) - Testing guide
- [BrowserStack: View Mobile Version on Chrome](https://www.browserstack.com/guide/view-mobile-version-of-website-on-chrome) - Testing methods
- [Markaicode: Vite 6.0 Build Optimization](https://markaicode.com/vite-6-build-optimization-guide/) - Build performance

### Tertiary (LOW confidence)

- Various blog posts on mobile-first design (general principles, not technically verified)
- Community GitHub discussions (anecdotal solutions, not official guidance)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Native CSS features, official Vite documentation, WCAG standards
- Architecture patterns: HIGH - Verified with official sources (MDN, W3C, Vite docs)
- Pitfalls: HIGH - Based on official documentation and well-documented issues
- GitHub Pages deployment: HIGH - Official Vite docs and verified GitHub Actions workflows
- Container queries: MEDIUM - Relatively new, adoption strategy project-specific

**Research date:** 2026-02-15
**Valid until:** ~60 days (CSS/browser features stable, deployment patterns established)

**Note:** This research represents current best practices as of February 2026. Mobile web standards (viewport units, container queries, WCAG guidelines) are relatively stable with good browser support. GitHub Actions and Vite are mature tools with established patterns.
