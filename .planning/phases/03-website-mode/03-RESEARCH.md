# Phase 3: Website Mode - Research

**Researched:** 2026-01-31
**Domain:** Academic portfolio website with modern minimal aesthetic (Linear.app style)
**Confidence:** HIGH

## Summary

This phase builds a professional academic portfolio website with a modern minimal aesthetic inspired by Linear.app. The project uses Vite 7.x + TypeScript (already configured), JSON content data (Phase 2 complete), and needs to implement: Inter font, monochrome + teal/cyan color scheme, hybrid navigation (single scrollable page + detail pages), card-based layouts with 2-column grids, and mobile responsiveness.

The technical approach is straightforward given the locked decisions. The standard stack is vanilla TypeScript with CSS Modules (built-in Vite support), CSS custom properties for design tokens, and CSS Grid with container queries for responsive layouts. No framework is needed — this is a content-heavy static site that benefits from direct DOM manipulation and zero runtime overhead.

**Primary recommendation:** Build vanilla TypeScript components with CSS Modules, use CSS custom properties for the monochrome + teal design system, implement hash-based routing for detail pages, and leverage modern CSS (Grid, container queries, scroll-behavior) for layouts and interactions.

## Standard Stack

### Core (Already Configured)

| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| Vite | 7.x | Build tool | Already in project, excellent TypeScript + CSS Modules support |
| TypeScript | 5.9.x | Type safety | Already in project |
| CSS Modules | Built-in | Scoped styles | Vite has native `.module.css` support, no config needed |

### Typography

| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| Inter | Variable | Primary typeface | Locked decision, free, modern, excellent readability |

**Implementation (from rsms.me/inter):**

```html
<!-- In index.html head -->
<link rel="preconnect" href="https://rsms.me/">
<link rel="stylesheet" href="https://rsms.me/inter/inter.css">
```

```css
/* In global CSS */
:root {
  font-family: Inter, sans-serif;
  font-feature-settings: 'liga' 1, 'calt' 1; /* Chrome fix */
}

@supports (font-variation-settings: normal) {
  :root { font-family: InterVariable, sans-serif; }
}
```

Source: [Inter official documentation](https://rsms.me/inter/)

### Supporting (Optional)

| Library | Purpose | When to Use |
|---------|---------|-------------|
| typed-css-modules | Type-safe CSS module imports | If TypeScript errors on CSS imports become annoying |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS Modules | Tailwind CSS | More setup, overkill for this scope |
| Vanilla TS | React/Vue | Unnecessary complexity for static content site |
| Hash routing | History API | Hash needs no server config, simpler |

**Installation:**

```bash
# No additional packages needed — Vite + TypeScript already supports everything
```

## Architecture Patterns

### Recommended Project Structure

```
src/
├── index.html           # Main entry point
├── main.ts              # App initialization, routing
├── styles/
│   ├── global.css       # Reset, typography, CSS custom properties
│   ├── variables.css    # Design tokens (colors, spacing, typography)
│   └── utilities.css    # Utility classes (sr-only, etc.)
├── components/
│   ├── Header/
│   │   ├── Header.ts
│   │   └── Header.module.css
│   ├── Section/         # Reusable section wrapper
│   ├── Card/            # Publication/talk/media cards
│   ├── DetailPage/      # Detail page template
│   └── Navigation/      # Main nav (desktop + mobile)
├── pages/
│   ├── HomePage.ts      # Main scrollable page with all sections
│   ├── PublicationDetail.ts
│   ├── TalkDetail.ts
│   └── MediaDetail.ts
├── lib/
│   ├── router.ts        # Simple hash router
│   └── content.ts       # Content loading utilities
└── types/
    └── content.d.ts     # TypeScript types for JSON data
```

### Pattern 1: CSS Custom Properties Design System

**What:** Centralized design tokens as CSS custom properties
**When to use:** Always — defines the entire visual language

```css
/* src/styles/variables.css */
:root {
  /* Monochrome palette */
  --color-white: #ffffff;
  --color-gray-50: #fafafa;
  --color-gray-100: #f5f5f5;
  --color-gray-200: #e5e5e5;
  --color-gray-300: #d4d4d4;
  --color-gray-400: #a3a3a3;
  --color-gray-500: #737373;
  --color-gray-600: #525252;
  --color-gray-700: #404040;
  --color-gray-800: #262626;
  --color-gray-900: #171717;
  --color-black: #000000;

  /* Accent: Teal/Cyan */
  --color-accent: #0d9488;        /* teal-600 */
  --color-accent-light: #14b8a6;  /* teal-500 */
  --color-accent-dark: #0f766e;   /* teal-700 */

  /* Semantic colors */
  --color-bg: var(--color-white);
  --color-bg-secondary: var(--color-gray-50);
  --color-text-primary: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-600);
  --color-text-tertiary: var(--color-gray-400);
  --color-border: var(--color-gray-200);
  --color-link: var(--color-accent);
  --color-link-hover: var(--color-accent-dark);

  /* Typography scale */
  --font-family: InterVariable, Inter, system-ui, sans-serif;
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */

  /* Spacing scale */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */

  /* Layout */
  --max-width: 1200px;
  --content-padding: var(--space-6);
  --section-gap: var(--space-16);
  --card-gap: var(--space-6);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;

  /* Borders */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}
```

Source: Derived from [Smashing Magazine CSS custom properties guide](https://www.smashingmagazine.com/2020/08/application-color-schemes-css-custom-properties/) and [Linear.app aesthetic analysis](https://linear.app)

### Pattern 2: Responsive Card Grid with CSS Grid

**What:** Auto-responsive card layout that flows from 1 to 2 columns
**When to use:** Publications, talks, media sections

```css
/* Card grid container */
.cardGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 350px), 1fr));
  gap: var(--card-gap);
}

/* Individual card */
.card {
  display: flex;
  flex-direction: column;
  padding: var(--space-6);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast);
}

.card:hover {
  border-color: var(--color-accent);
}
```

Source: [MDN Grid layout guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Common_grid_layouts), [CSS-Tricks grid guide](https://css-tricks.com/css-grid-layout-guide/)

### Pattern 3: Simple Hash Router

**What:** Client-side routing using URL hash
**When to use:** Navigation between main page and detail pages

```typescript
// src/lib/router.ts
type Route = {
  pattern: RegExp;
  handler: (params: Record<string, string>) => void;
};

class Router {
  private routes: Route[] = [];

  add(pattern: string, handler: (params: Record<string, string>) => void) {
    // Convert /publication/:id to regex
    const regexPattern = pattern.replace(/:(\w+)/g, '(?<$1>[^/]+)');
    this.routes.push({
      pattern: new RegExp(`^${regexPattern}$`),
      handler,
    });
  }

  init() {
    window.addEventListener('hashchange', () => this.route());
    this.route();
  }

  private route() {
    const hash = window.location.hash.slice(1) || '/';
    for (const { pattern, handler } of this.routes) {
      const match = hash.match(pattern);
      if (match) {
        handler(match.groups || {});
        return;
      }
    }
    // 404 fallback
    this.navigate('/');
  }

  navigate(path: string) {
    window.location.hash = path;
  }
}

export const router = new Router();
```

Source: [Dev.to SPA routing guide](https://dev.to/thedevdrawer/single-page-application-routing-using-hash-or-url-9jh), [Will Taylor blog on client-side routing](https://www.willtaylor.blog/client-side-routing-in-vanilla-js/)

### Pattern 4: Accessible Hamburger Menu

**What:** Mobile navigation toggle with proper ARIA
**When to use:** Mobile viewport navigation

```typescript
// Accessibility requirements for hamburger menu
const menuButton = document.querySelector<HTMLButtonElement>('.menuButton');
const menuNav = document.querySelector<HTMLElement>('.mobileNav');

if (menuButton && menuNav) {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-controls', 'mobile-nav');
  menuNav.id = 'mobile-nav';

  menuButton.addEventListener('click', () => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isExpanded));
    menuNav.hidden = isExpanded;

    // Focus first menu item when opening
    if (!isExpanded) {
      menuNav.querySelector<HTMLElement>('a')?.focus();
    }
  });
}
```

```html
<!-- Proper HTML structure -->
<nav aria-label="Main navigation">
  <button
    class="menuButton"
    aria-expanded="false"
    aria-controls="mobile-nav"
    aria-label="Menu"
  >
    <span class="sr-only">Menu</span>
    <!-- Hamburger icon -->
  </button>
  <ul id="mobile-nav" hidden>
    <!-- Navigation items -->
  </ul>
</nav>
```

Source: [a11ymatters.com mobile nav pattern](https://a11ymatters.com/pattern/mobile-nav/), [BOIA hamburger menu accessibility](https://www.boia.org/blog/are-hamburger-menus-bad-for-accessibility)

### Pattern 5: Smooth Scroll with Accessibility

**What:** CSS smooth scrolling that respects user preferences
**When to use:** Anchor link navigation on main page

```css
/* Global smooth scroll */
html {
  scroll-behavior: smooth;
}

/* Respect user preference for reduced motion */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

/* Account for sticky header */
section[id] {
  scroll-margin-top: 5rem; /* Height of sticky header */
}
```

Source: [W3Schools smooth scroll](https://www.w3schools.com/howto/howto_css_smooth_scroll.asp), [Go Make Things CSS smooth scroll](https://gomakethings.com/smooth-scrolling-links-with-only-css/)

### Anti-Patterns to Avoid

- **Over-engineering components:** Don't build a component library. Simple functions that return HTML strings are sufficient.
- **Premature abstraction:** Don't abstract until you see repetition. Start with inline code, extract when patterns emerge.
- **Framework thinking:** Don't try to build React-like virtual DOM or state management. Direct DOM manipulation is fine for this scope.
- **Animation overload:** Linear.app is subtle. Don't add animations everywhere — focus on hover states and transitions only.
- **Fixed px values:** Use CSS custom properties and relative units for consistent scaling.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Design tokens | Custom JS variables | CSS custom properties | Browser-native, no runtime cost |
| Responsive grid | JS-based breakpoints | CSS Grid + minmax() | Declarative, no JS, auto-responsive |
| Smooth scrolling | JavaScript scroll library | `scroll-behavior: smooth` | Built-in, respects prefers-reduced-motion |
| Focus visibility | Custom focus handling | `:focus-visible` | Browser handles keyboard vs mouse |
| Font loading | JS font loader | `<link rel="preconnect">` + CSS | Browser-optimized |
| Type-safe CSS imports | Manual types | typed-css-modules (if needed) | Auto-generates .d.ts files |

**Key insight:** Modern CSS handles most of what required JavaScript 5 years ago. The browser is the framework.

## Common Pitfalls

### Pitfall 1: Hiding Focus Indicators

**What goes wrong:** Using `outline: none` on buttons/links without replacement
**Why it happens:** Focus rings look "ugly" to designers unfamiliar with accessibility
**How to avoid:** Use `:focus-visible` instead of hiding all focus states

```css
/* BAD */
a:focus { outline: none; }

/* GOOD */
a:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

**Warning signs:** Can't see where keyboard focus is when tabbing

Source: [WebAIM keyboard accessibility](https://webaim.org/techniques/keyboard/), [MDN :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)

### Pitfall 2: Mobile Navigation Not Truly Accessible

**What goes wrong:** Hamburger menu icon has no text label, focus doesn't trap
**Why it happens:** Visual design prioritized over screen reader experience
**How to avoid:** Always include `aria-label="Menu"` and screen-reader-only text

**Warning signs:** Can't navigate site using only keyboard, VoiceOver announces nothing useful

### Pitfall 3: Scroll Position Lost on Route Change

**What goes wrong:** User clicks detail page, presses back, ends up at top of page
**Why it happens:** Hash routing doesn't preserve scroll position automatically
**How to avoid:** Store scroll position before navigation, restore on back

```typescript
// Before navigating to detail
const scrollPos = window.scrollY;
sessionStorage.setItem('homeScrollPos', String(scrollPos));

// On back navigation to home
const savedPos = sessionStorage.getItem('homeScrollPos');
if (savedPos) {
  window.scrollTo(0, parseInt(savedPos, 10));
  sessionStorage.removeItem('homeScrollPos');
}
```

### Pitfall 4: Card Content Overflow

**What goes wrong:** Long titles/abstracts break card layouts
**Why it happens:** Real content varies; placeholder text during dev was short
**How to avoid:** Use CSS line clamping and test with actual content

```css
.cardTitle {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

**Warning signs:** Publications data has 15 items with varying title lengths — test all of them

### Pitfall 5: Performance on Mobile with Many Cards

**What goes wrong:** Scroll jank when rendering 15 publications + 19 talks
**Why it happens:** Too many DOM nodes, complex CSS
**How to avoid:** Keep card HTML simple, avoid nested flexbox, test on real device

**Warning signs:** >30 DOM elements per card, animation on scroll

### Pitfall 6: Content Not Semantic

**What goes wrong:** Screen readers can't navigate sections, SEO suffers
**Why it happens:** Using `<div>` for everything
**How to avoid:** Use semantic HTML: `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`

```html
<main>
  <section id="about" aria-labelledby="about-heading">
    <h2 id="about-heading">About</h2>
    <!-- content -->
  </section>
  <section id="publications" aria-labelledby="publications-heading">
    <h2 id="publications-heading">Publications</h2>
    <article class="card">
      <h3>Paper Title</h3>
      <!-- card content -->
    </article>
  </section>
</main>
```

## Code Examples

### Complete Card Component

```typescript
// src/components/Card/Card.ts
import styles from './Card.module.css';

interface Publication {
  id: string;
  title: string;
  authors: { name: string; isSamReynolds: boolean }[];
  journal: string;
  year: number;
}

export function renderPublicationCard(pub: Publication): string {
  const authorStr = pub.authors.map(a => a.name).join(', ');

  return `
    <article class="${styles.card}">
      <a href="#/publication/${pub.id}" class="${styles.cardLink}">
        <h3 class="${styles.title}">${pub.title}</h3>
        <p class="${styles.authors}">${authorStr}</p>
        <p class="${styles.meta}">${pub.journal} &middot; ${pub.year}</p>
      </a>
    </article>
  `;
}
```

```css
/* src/components/Card/Card.module.css */
.card {
  padding: var(--space-6);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.card:hover {
  border-color: var(--color-accent);
}

.cardLink {
  display: block;
  text-decoration: none;
  color: inherit;
}

.cardLink:focus-visible {
  outline: none;
}

.card:has(.cardLink:focus-visible) {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.authors {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-1);
}

.meta {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin: 0;
}
```

### Section Layout

```typescript
// src/components/Section/Section.ts
import styles from './Section.module.css';

interface SectionProps {
  id: string;
  title: string;
  children: string;
}

export function renderSection({ id, title, children }: SectionProps): string {
  return `
    <section id="${id}" class="${styles.section}" aria-labelledby="${id}-heading">
      <h2 id="${id}-heading" class="${styles.heading}">${title}</h2>
      ${children}
    </section>
  `;
}
```

```css
/* src/components/Section/Section.module.css */
.section {
  padding: var(--section-gap) 0;
  scroll-margin-top: 5rem;
}

.section + .section {
  border-top: 1px solid var(--color-border);
}

.heading {
  font-size: var(--font-size-3xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-8);
}
```

### Main Layout Container

```css
/* src/styles/global.css */
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--content-padding);
}

@media (max-width: 768px) {
  :root {
    --content-padding: var(--space-4);
    --section-gap: var(--space-12);
  }
}
```

### Responsive Header

```css
/* src/components/Header/Header.module.css */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.headerInner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--content-padding);
}

.nav {
  display: flex;
  gap: var(--space-6);
}

.navLink {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: color var(--transition-fast);
}

.navLink:hover,
.navLink.active {
  color: var(--color-accent);
}

/* Mobile: hide desktop nav, show hamburger */
@media (max-width: 768px) {
  .nav {
    display: none;
  }

  .menuButton {
    display: flex;
  }
}

/* Desktop: hide hamburger */
@media (min-width: 769px) {
  .menuButton {
    display: none;
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JS scroll libraries | `scroll-behavior: smooth` | 2020+ baseline | No JS needed for smooth scroll |
| Media queries only | Container queries | 2023 baseline | Component-level responsiveness |
| `:focus` only | `:focus-visible` | 2022 baseline | Better UX for mouse users |
| JavaScript scroll spy | Intersection Observer | 2019+ | Native API, better performance |
| Static font files | Variable fonts | 2020+ | Smaller files, infinite weights |
| px-based typography | CSS clamp() + rem | 2020+ | Fluid responsive sizing |

**Deprecated/outdated:**
- **jQuery scroll plugins:** Native CSS/JS handles all scroll effects
- **Font Awesome icons:** SVG icons are lighter and more customizable
- **Float-based layouts:** CSS Grid/Flexbox handle all layout needs

## Open Questions

1. **Intersection Observer vs scroll event for active nav highlighting**
   - What we know: Intersection Observer is more performant, scroll event is simpler
   - What's unclear: Whether the complexity is worth it for ~5 sections
   - Recommendation: Start with scroll event, optimize if needed

2. **Container queries adoption**
   - What we know: Baseline support since 2023
   - What's unclear: Whether to use for cards or stick with grid auto-fill
   - Recommendation: Use CSS Grid minmax() for now — simpler, wider support

3. **Detail page routing pattern**
   - What we know: Hash routing works without server config
   - What's unclear: Whether to use separate HTML files or SPA pattern
   - Recommendation: SPA pattern with hash routing — keeps content loading consistent

## Sources

### Primary (HIGH confidence)

- [Vite features documentation](https://vite.dev/guide/features) - CSS modules, TypeScript, static assets
- [Inter font official](https://rsms.me/inter/) - Implementation guide
- [Linear.app](https://linear.app) - Design aesthetic reference
- [MDN CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Common_grid_layouts) - Grid patterns
- [MDN :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible) - Focus handling

### Secondary (MEDIUM confidence)

- [CSS-Tricks grid guide](https://css-tricks.com/css-grid-layout-guide/) - Card grid patterns
- [a11ymatters.com mobile nav](https://a11ymatters.com/pattern/mobile-nav/) - Hamburger menu accessibility
- [WebAIM keyboard accessibility](https://webaim.org/techniques/keyboard/) - Focus management
- [W3Schools smooth scroll](https://www.w3schools.com/howto/howto_css_smooth_scroll.asp) - Scroll behavior
- [Smashing Magazine design tokens](https://www.smashingmagazine.com/2020/08/application-color-schemes-css-custom-properties/) - CSS custom properties

### Tertiary (LOW confidence)

- [Dev.to SPA routing](https://dev.to/thedevdrawer/single-page-application-routing-using-hash-or-url-9jh) - Hash router pattern
- [CodePen scroll spy](https://codepen.io/dbilanoski/pen/LabpzG) - Active nav highlighting

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Vite + CSS Modules is well-documented, verified with official docs
- Architecture: HIGH - Standard patterns from MDN, CSS-Tricks, established sources
- Design system: HIGH - CSS custom properties are browser-native, well-documented
- Accessibility: HIGH - WCAG patterns verified with WebAIM, a11ymatters
- Pitfalls: MEDIUM - Combination of official docs and community experience

**Research date:** 2026-01-31
**Valid until:** 2026-03-31 (stable domain, patterns unlikely to change)

---

*Phase: 03-website-mode*
*Research completed: 2026-01-31*
