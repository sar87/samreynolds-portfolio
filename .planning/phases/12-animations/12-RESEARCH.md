# Phase 12: Animations - Research

**Researched:** 2026-02-04
**Domain:** Vanilla JavaScript scroll animations, CSS gradient text, and CSS hover micro-interactions
**Confidence:** HIGH

## Summary

This research covers implementing Linear-style animations for a vanilla JavaScript + Vite static site: scroll reveals using Intersection Observer API, animated gradient text effects, and hover micro-interactions. All techniques are modern, performant (60fps capable), and vanilla CSS/JS with no external libraries required.

The standard approach is **Intersection Observer API** for scroll reveals (native browser API with 95%+ support), **CSS gradient text with background-clip** for gradient effects, and **CSS transforms + opacity** for hover interactions. Performance is achieved by animating only GPU-accelerated properties (transform, opacity) and respecting `prefers-reduced-motion`.

Key finding: The project's existing TypeScript rendering system (string-based component templates) requires JavaScript initialization after DOM rendering to attach Intersection Observer and apply animation classes/delays.

**Primary recommendation:** Use Intersection Observer API for scroll reveals, CSS custom properties for stagger timing, and strict adherence to transform/opacity for all animations to maintain 60fps.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Intersection Observer API | Native (baseline since 2019) | Scroll reveal detection | Native browser API, 95%+ support, no library needed |
| CSS Transitions/Animations | Native | Gradient text, hover effects | GPU-accelerated, no dependencies |
| CSS Custom Properties | Native | Stagger delay calculation | Flexible, maintainable stagger timing |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| TypeScript | Existing | Type-safe animation initialization | Already in project stack |
| CSS Modules | Existing | Scoped animation styles | Already in use for components |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Intersection Observer | Scroll event listeners | Scroll events cause layout thrashing, poor performance |
| Vanilla CSS | GSAP, Framer Motion | Libraries add 30-100KB, overkill for simple animations |
| CSS custom properties | JavaScript delay calculation | JS approach works but less maintainable |
| transform/opacity | width/height/top/left | Non-GPU properties cause jank at 60fps |

**Installation:**
```bash
# No installation needed - all native browser APIs
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── animations/
│   ├── scrollReveal.ts      # Intersection Observer logic
│   ├── gradientText.ts      # Gradient text initialization (if needed)
│   └── index.ts             # Export all animation initializers
├── styles/
│   ├── animations.css       # @keyframes, animation utilities
│   └── variables.css        # Animation timing tokens (already exists)
```

### Pattern 1: Intersection Observer Scroll Reveals
**What:** Detect when elements enter viewport and add CSS class to trigger animations
**When to use:** Any scroll-triggered reveal (sections, cards, headings)

**Example:**
```javascript
// Source: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
const observerOptions = {
  root: null,           // Use viewport
  rootMargin: '0px',    // Trigger exactly at viewport edge
  threshold: 0.1        // Trigger when 10% visible
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal');
      observer.unobserve(entry.target);  // Only animate once
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});
```

**CSS:**
```css
/* Initial state - hidden */
section {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

/* Revealed state */
section.reveal {
  opacity: 1;
  transform: translateY(0);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  section {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

### Pattern 2: Staggered Card Animations with CSS Custom Properties
**What:** Multiple cards animate in sequence with incremental delays
**When to use:** Card grids (publications, talks, media)

**Example:**
```javascript
// Source: https://cloudfour.com/thinks/staggered-animations-with-css-custom-properties/
const cards = document.querySelectorAll('.card');
cards.forEach((card, index) => {
  card.style.setProperty('--animation-order', index.toString());
});
```

**CSS:**
```css
.card {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
  transition-delay: calc(var(--animation-order) * 50ms);
}

.card.reveal {
  opacity: 1;
  transform: translateY(0);
}
```

### Pattern 3: Animated Gradient Text
**What:** Gradient background clipped to text with animated background-position
**When to use:** Hero heading, section headings

**Example:**
```css
/* Source: https://web.dev/articles/speedy-css-tip-animated-gradient-text */
.gradient-heading {
  background: linear-gradient(
    90deg,
    var(--color-gray-900),
    var(--color-accent),
    var(--color-gray-900)
  ) 0 0 / 200% 100%;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
}

@media (prefers-reduced-motion: no-preference) {
  .gradient-heading {
    animation: move-gradient 6s linear infinite;
  }
}

@keyframes move-gradient {
  to {
    background-position: 200% 0;
  }
}
```

### Pattern 4: GPU-Accelerated Hover Effects
**What:** Card lift and shadow enhancement on hover
**When to use:** Cards, buttons, interactive elements

**Example:**
```css
/* Source: https://www.joshwcomeau.com/animation/css-transitions/ */
.card {
  transition: transform 150ms ease-out, box-shadow 150ms ease-out;
  will-change: transform; /* Hint to browser for GPU optimization */
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
    will-change: auto;
  }

  .card:hover {
    transform: none;
  }
}
```

### Pattern 5: Link Hover with Color Shift and Underline
**What:** Smooth color transition with animated underline appearance
**When to use:** Text links, navigation links

**Example:**
```css
.link {
  position: relative;
  color: var(--color-link);
  transition: color 150ms ease-out;
}

.link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-accent);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 200ms ease-out;
}

.link:hover {
  color: var(--color-link-hover);
}

.link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
```

### Anti-Patterns to Avoid
- **Animating width, height, top, left, margin, padding:** These trigger layout recalculation (expensive). Use transform instead.
- **Using `transition: all`:** Overly broad, can cause unexpected animations when properties change.
- **Forgetting to unobserve elements:** Intersection Observer continues watching, wasting resources.
- **Setting threshold: 1.0 without testing:** Requires 100% visibility, fails on varying screen sizes.
- **Applying will-change to everything:** Consumes GPU memory, limit to 2-3 animated elements per viewport.
- **Not wrapping animations in prefers-reduced-motion:** Accessibility violation.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll position detection | Custom scroll event listeners with getBoundingClientRect() | Intersection Observer API | Native API is async, non-blocking, avoids layout thrashing |
| Stagger timing | Manual nth-child CSS rules | CSS custom properties set via JS | Scales infinitely, works with dynamic content |
| GPU acceleration hints | Manual layer promotion hacks | will-change property | Browser-standard way to optimize animations |
| Gradient animation | JavaScript-based color interpolation | CSS background-position animation | CSS animations are GPU-accelerated, smoother |
| Motion accessibility | JavaScript to disable animations | @media (prefers-reduced-motion) | OS-level preference, respects user choice |

**Key insight:** Modern CSS and browser APIs handle 95% of animation needs without libraries. Hand-rolling scroll detection or animation timing wastes effort and hurts performance.

## Common Pitfalls

### Pitfall 1: Layout Thrashing from Animating Wrong Properties
**What goes wrong:** Animating width, height, margin, padding, or position (top/left) causes browser to recalculate layout on every frame, dropping to 15-30fps.
**Why it happens:** These properties affect document flow, requiring expensive reflows.
**How to avoid:** Only animate `transform` and `opacity`. Use `transform: scale()` instead of width/height, `transform: translate()` instead of top/left.
**Warning signs:** Janky animations, DevTools Performance tab shows red bars (forced reflows), frame rate below 60fps.

### Pitfall 2: Intersection Observer Threshold Confusion
**What goes wrong:** Setting `threshold: 1.0` (100% visibility) causes animations to never trigger on small viewports or wide elements.
**Why it happens:** Misunderstanding that threshold 1.0 requires entire element visible within root simultaneously.
**How to avoid:** Use `threshold: 0.1` (10%) for most scroll reveals. Use `rootMargin: '-50px'` to delay trigger instead of high threshold.
**Warning signs:** Animations not firing on mobile, elements at bottom of page never animating.

### Pitfall 3: Forgetting to Unobserve After Animation
**What goes wrong:** Intersection Observer keeps firing callbacks for elements already animated, wasting CPU cycles.
**Why it happens:** Observer.observe() is called but observer.unobserve() is forgotten.
**How to avoid:** Call `observer.unobserve(entry.target)` after adding reveal class (for one-time animations).
**Warning signs:** Performance degradation as user scrolls, DevTools shows repeated IO callbacks.

### Pitfall 4: Overusing will-change
**What goes wrong:** Applying `will-change: transform` to many elements consumes GPU memory, causing other animations to jank.
**Why it happens:** Misunderstanding that will-change forces layer promotion, using GPU resources.
**How to avoid:** Limit will-change to 2-3 actively animating elements. Remove will-change after animation completes (for one-off animations).
**Warning signs:** Smooth animations on desktop, jank on mobile; GPU memory warnings in DevTools.

### Pitfall 5: Stagger Delay Calculation Errors
**What goes wrong:** Setting delays manually (nth-child) becomes unmaintainable, breaks with dynamic content.
**Why it happens:** Using Sass loops or manual CSS instead of CSS custom properties.
**How to avoid:** Use `--animation-order` custom property set via JavaScript, calculate delay with `calc()`.
**Warning signs:** Animations work in static HTML, break when content loads dynamically; CSS bloat from nth-child rules.

### Pitfall 6: Not Testing with prefers-reduced-motion
**What goes wrong:** Users with vestibular disorders experience motion sickness from animations, accessibility violation.
**Why it happens:** Forgetting to wrap animations in `@media (prefers-reduced-motion: no-preference)` or disable in reduce mode.
**How to avoid:** Set transitions/animations inside no-preference media query, or disable them in reduce query.
**Warning signs:** Accessibility audit failures, user complaints about motion sickness.

### Pitfall 7: Animation Initialization Timing in SPA
**What goes wrong:** Intersection Observer initialized before DOM elements exist, or not re-initialized on route change.
**Why it happens:** In vanilla JS SPA (like this project), content is rendered dynamically after navigation.
**How to avoid:** Initialize animations in render callback after innerHTML update, create init function called on every route.
**Warning signs:** Animations work on initial page load, break after navigation; sections never reveal on route change.

## Code Examples

Verified patterns from official sources:

### Scroll Reveal with Intersection Observer
```javascript
// Source: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

export function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });

  revealElements.forEach(el => observer.observe(el));
}
```

### Staggered Card Grid Animation
```javascript
// Source: https://cloudfour.com/thinks/staggered-animations-with-css-custom-properties/

export function initStaggeredCards() {
  const cardGrids = document.querySelectorAll('[data-stagger]');

  cardGrids.forEach(grid => {
    const cards = grid.querySelectorAll('.card');
    cards.forEach((card, index) => {
      card.style.setProperty('--animation-order', index.toString());
    });
  });
}
```

```css
.card {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
  transition-delay: calc(var(--animation-order, 0) * 50ms);
}

.card.revealed {
  opacity: 1;
  transform: translateY(0);
}
```

### Gradient Text Animation
```css
/* Source: https://web.dev/articles/speedy-css-tip-animated-gradient-text */

.gradient-text {
  /* Set up gradient background */
  background: linear-gradient(
    90deg,
    var(--gradient-start),
    var(--gradient-mid),
    var(--gradient-end),
    var(--gradient-mid),
    var(--gradient-start)
  ) 0 0 / 300% 100%;

  /* Clip to text */
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
}

@media (prefers-reduced-motion: no-preference) {
  .gradient-text {
    animation: gradient-shift 6s ease-in-out infinite;
  }
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 0;
  }
  50% {
    background-position: 100% 0;
  }
}
```

### GPU-Accelerated Card Hover
```css
/* Source: https://www.joshwcomeau.com/animation/css-transitions/ */

.card {
  /* Prepare for GPU acceleration */
  will-change: transform;

  /* Fast transitions */
  transition:
    transform 150ms ease-out,
    box-shadow 150ms ease-out;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.04),
    0 16px 32px rgba(0, 0, 0, 0.04),
    0 32px 64px rgba(0, 0, 0, 0.02);
}

@media (prefers-reduced-motion: reduce) {
  .card {
    will-change: auto;
    transition: none;
  }

  .card:hover {
    transform: none;
  }
}
```

### Alternating Slide Direction Pattern
```javascript
// For sections that alternate slide-in from left/right

export function initAlternatingSlideReveal() {
  const sections = document.querySelectorAll('section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  sections.forEach((section, index) => {
    // Alternate left/right
    const direction = index % 2 === 0 ? 'left' : 'right';
    section.setAttribute('data-slide-from', direction);
    observer.observe(section);
  });
}
```

```css
section {
  opacity: 0;
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

section[data-slide-from="left"] {
  transform: translateX(-40px);
}

section[data-slide-from="right"] {
  transform: translateX(40px);
}

section.revealed {
  opacity: 1;
  transform: translateX(0);
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| jQuery animate() | CSS transitions + Intersection Observer | ~2017-2019 | Native browser APIs eliminated 30KB+ dependencies |
| Scroll event listeners | Intersection Observer API | March 2019 | Baseline support achieved, performance 10x better |
| JavaScript for gradient animation | CSS background-position animation | Always available | GPU-accelerated vs CPU, smoother |
| Manual nth-child for stagger | CSS custom properties | ~2016 (Chrome 49) | Scales to dynamic content, maintainable |
| JavaScript-based motion detection | prefers-reduced-motion media query | 2018-2019 | Respects OS-level accessibility setting |
| Sass loops for animation delays | CSS calc() + custom properties | 2016+ | Works with dynamic content, no build step needed |

**Deprecated/outdated:**
- **Scroll event throttling/debouncing:** Intersection Observer eliminates need entirely, is more performant.
- **Animation libraries for simple effects:** GSAP, Anime.js are overkill for scroll reveals and hover states.
- **JavaScript for accessibility motion control:** CSS `prefers-reduced-motion` is the standard, respects user preference.
- **requestAnimationFrame for scroll animations:** IO API handles this internally, more efficient.

**Emerging in 2025-2026:**
- **CSS sibling-index() and sibling-count() functions:** Pure CSS stagger animations without JavaScript (Chrome shipped March 2025), but browser support still limited.
- **CSS @property for typed custom properties:** Enables smooth gradient interpolation, but not essential for this project.

## Open Questions

Things that couldn't be fully resolved:

1. **Viewport trigger point precision**
   - What we know: `threshold: 0.1` (10% visible) is common, `rootMargin` can adjust trigger point
   - What's unclear: Optimal trigger point for sections vs cards vs headings varies by design preference
   - Recommendation: Start with threshold 0.1 for sections, 0.15 for cards. Test on mobile, adjust rootMargin if needed.

2. **Animation replay on scroll back**
   - What we know: Calling `observer.unobserve()` makes animation one-time only
   - What's unclear: User preference—should sections re-animate when scrolling back up?
   - Recommendation: Context marks this as Claude's discretion. Recommend one-time (unobserve) for sections, replay for cards (don't unobserve) for visual interest.

3. **Exact gradient color palette**
   - What we know: User specified "dark (charcoal/navy) to brand blue (#0066cc)"
   - What's unclear: Exact starting color hex value for charcoal/navy
   - Recommendation: Use existing design tokens (`--color-gray-900` #171717 or `--color-gray-800` #262626 as start, transition to `--color-accent` #0066cc).

4. **Button hover emphasis vs links**
   - What we know: Buttons should have "more emphasis than links—additional effects like slight scale or glow"
   - What's unclear: Exact treatment (scale to 1.05? Add box-shadow glow?)
   - Recommendation: Context marks as Claude's discretion. Suggest `transform: scale(1.02)` + subtle `box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1)` glow.

## Sources

### Primary (HIGH confidence)
- MDN Web Docs: Intersection Observer API - https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- web.dev: Speedy CSS Tip - Animated Gradient Text - https://web.dev/articles/speedy-css-tip-animated-gradient-text
- Josh W Comeau: Interactive Guide to CSS Transitions - https://www.joshwcomeau.com/animation/css-transitions/

### Secondary (MEDIUM confidence)
- CSS-Tricks: Different Approaches for Creating a Staggered Animation - https://css-tricks.com/different-approaches-for-creating-a-staggered-animation/
- Cloud Four: Staggered Animations with CSS Custom Properties - https://cloudfour.com/thinks/staggered-animations-with-css-custom-properties/
- Blog Pixel Free Studio: Complex Animations Causing Jank? Optimize Your CSS Animations - https://blog.pixelfreestudio.com/complex-animations-causing-jank-optimize-your-css-animations/
- DEV Community: Smooth, Jank-Free Animations with CSS and JavaScript - https://dev.to/anisubhra_sarkar/smooth-jank-free-animations-with-css-and-javascript-performance-best-practices-46ff
- WebPeak: CSS/JS Animation Trends 2026 - https://webpeak.org/blog/css-js-animation-trends/

### Tertiary (LOW confidence)
- Linear.app design system search results (visual reference only, no technical implementation details extracted)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Intersection Observer is baseline since 2019, CSS animations native
- Architecture: HIGH - Patterns verified from MDN, web.dev, and respected CSS experts (Josh Comeau, CSS-Tricks)
- Pitfalls: HIGH - Common mistakes documented in multiple authoritative sources, verified with MDN best practices
- Code examples: HIGH - All examples from MDN, web.dev, or established CSS educators
- Performance guidance: HIGH - GPU acceleration patterns verified across multiple official sources
- Stagger techniques: MEDIUM - Multiple approaches exist, CSS custom properties approach is well-documented but implementation varies
- Linear.app specific patterns: LOW - Reference mentioned by user but no technical implementation details found, general "clean, professional, subtle" guidance only

**Research date:** 2026-02-04
**Valid until:** 2026-03-04 (30 days - stable web platform features, slow-moving domain)

## Implementation Notes for Planner

**TypeScript rendering architecture considerations:**

The project uses string-based component rendering (`.ts` files return HTML strings, set via `innerHTML`). Animation initialization must:

1. **Run after DOM rendering:** Call animation init functions in `render()` callback after `app.innerHTML` is set
2. **Re-initialize on route changes:** Each route navigation re-renders content, requires re-attaching Intersection Observer
3. **Handle async rendering:** HomePage uses `async/await` to load content, animations init after Promise resolves

**Recommended integration point:**

```typescript
// In src/main.ts render function
async function render(content: string | Promise<string>): Promise<void> {
  const html = await content;
  app!.innerHTML = `${headerHtml}<div id="content">${html}</div>`;
  initMobileNav();

  // ADD ANIMATION INITIALIZATION HERE
  initAnimations(); // New function from src/animations/index.ts

  // ... rest of render function
}
```

**CSS organization:**

- Add `src/styles/animations.css` with @keyframes and animation utility classes
- Update `src/styles/variables.css` with animation timing tokens (some already exist)
- Ensure all component CSS modules can reference animation utilities

**Performance requirements from context:**
- 60fps on desktop (already achievable with transform/opacity)
- Smooth on mobile (will-change should be limited, test on low-end devices)
- Reduced-motion support (already established in Phase 11, extend to new animations)
