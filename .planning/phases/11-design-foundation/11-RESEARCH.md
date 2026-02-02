# Phase 11: Design Foundation - Research

**Researched:** 2026-02-02
**Domain:** CSS Design System, Halftone Textures, Accessibility
**Confidence:** HIGH

## Summary

This phase establishes a cohesive light theme design system with a distinctive halftone texture effect. Research focused on five key areas: halftone texture implementation in CSS, WCAG AA compliance with textured backgrounds, CSS custom properties organization, prefers-reduced-motion implementation, and card/elevation styling patterns.

The primary technical challenge is applying a halftone dot texture overlay to achieve a newspaper/print aesthetic while maintaining WCAG AA contrast (4.5:1). The user has decided to source textures from texturelabs.org (which provides high-resolution PNG textures for free commercial use) and apply them using CSS blend modes.

The existing codebase already has a well-structured design token system in `variables.css` that follows good naming conventions. This phase will extend those tokens with the new color palette (off-white background, blue accent) and add shadow elevation tokens.

**Primary recommendation:** Use a full-page pseudo-element overlay with `mix-blend-mode: multiply` for the halftone texture, scaled via `background-size` to control dot density, with `pointer-events: none` to maintain interactivity.

## Standard Stack

### Core
| Library/Tool | Version | Purpose | Why Standard |
|--------------|---------|---------|--------------|
| CSS Custom Properties | Native | Design tokens | Built-in, no build step, wide support |
| CSS Blend Modes | Native | Texture overlay effect | `mix-blend-mode` widely supported since 2020 |
| CSS Media Queries | Native | Reduced motion detection | `prefers-reduced-motion` widely supported since 2020 |
| texturelabs.org textures | N/A | Halftone dot pattern | Free commercial use, high-res PNGs, proper newspaper aesthetic |

### Supporting
| Tool | Purpose | When to Use |
|------|---------|-------------|
| WebAIM Contrast Checker | Validate color contrast | Testing base colors before texture |
| Chrome DevTools | Emulate reduced motion | Testing prefers-reduced-motion |
| WAVE | Full page accessibility audit | Final verification |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| PNG texture file | Pure CSS halftone (radial-gradient) | CSS halftone is heavier on performance, harder to achieve authentic newspaper look |
| mix-blend-mode: multiply | mask-image | Mask-image has less browser support, different visual effect |
| Full-page overlay | Per-element texture | Per-element is more CSS, harder to maintain consistency |

**No installation required:** This phase uses only native CSS features and static assets.

## Architecture Patterns

### Recommended CSS Structure
```
src/styles/
├── variables.css      # Design tokens (colors, spacing, shadows)
├── global.css         # Base styles, typography, texture overlay
├── utilities.css      # Utility classes
└── components/        # Component-specific styles
```

### Pattern 1: Design Token Organization
**What:** Organize CSS custom properties by category with consistent naming
**When to use:** All color, spacing, typography, and shadow definitions

```css
/* Source: MDN CSS Custom Properties, Smashing Magazine best practices */
:root {
  /* Colors - semantic naming */
  --color-bg: #fafafa;
  --color-bg-elevated: #ffffff;
  --color-text-primary: #171717;
  --color-text-secondary: #525252;
  --color-accent: #0066cc;
  --color-accent-hover: #0052a3;

  /* Shadows - elevation levels */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);

  /* Spacing - 4px base grid */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  /* ... */
}
```

### Pattern 2: Full-Page Texture Overlay
**What:** Apply halftone texture across entire page using pseudo-element
**When to use:** Global texture effect that should cover all content

```css
/* Source: CSS-Tricks, Codrops overlay techniques */
body::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/assets/textures/halftone-dots.png');
  background-size: 200px;  /* Controls dot density - smaller = denser */
  background-repeat: repeat;
  mix-blend-mode: multiply;
  pointer-events: none;  /* Critical: allows clicking through */
  z-index: 9999;
  opacity: 0.15;  /* Adjust for intensity - start subtle */
}
```

### Pattern 3: Layered Shadows for Elevation
**What:** Use multiple shadow layers for realistic depth
**When to use:** Cards and elevated UI components

```css
/* Source: Josh Comeau "Designing Beautiful Shadows in CSS" */
.card {
  /* Layered shadows: each layer doubles the previous offset/blur */
  box-shadow:
    0 1px 1px rgba(0, 0, 0, 0.04),
    0 2px 2px rgba(0, 0, 0, 0.04),
    0 4px 4px rgba(0, 0, 0, 0.04),
    0 8px 8px rgba(0, 0, 0, 0.04);
}

/* Hover state: increase elevation */
.card:hover {
  box-shadow:
    0 2px 2px rgba(0, 0, 0, 0.04),
    0 4px 4px rgba(0, 0, 0, 0.04),
    0 8px 8px rgba(0, 0, 0, 0.04),
    0 16px 16px rgba(0, 0, 0, 0.04);
}
```

### Pattern 4: Reduced Motion Handling
**What:** Disable animations for users who prefer reduced motion
**When to use:** All transitions and animations

```css
/* Source: MDN, W3C WCAG Techniques */
/* Define animations only for users with no motion preference */
@media (prefers-reduced-motion: no-preference) {
  .card {
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }

  .card:hover {
    transform: translateY(-2px);
  }
}

/* Or: disable all motion globally */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Anti-Patterns to Avoid
- **Inline texture per element:** Apply texture globally once, not on every component
- **Pure black shadows:** Use rgba with subtle opacity, not #000
- **Forgetting pointer-events on overlays:** Overlay blocks all interaction without `pointer-events: none`
- **Testing contrast only after texture:** Verify base colors meet WCAG AA first, then fine-tune texture opacity
- **Hardcoding colors:** Always use CSS custom properties for maintainability

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Halftone pattern generation | Pure CSS radial-gradient halftone | Pre-made texture image from texturelabs.org | Performance, authentic look, easier to adjust |
| Color contrast checking | Manual calculation | WebAIM Contrast Checker | Edge cases, accuracy, WCAG conformance |
| Reduced motion detection | JavaScript-based detection | CSS `prefers-reduced-motion` media query | Native, no JS, respects system settings |
| Shadow elevation system | Ad-hoc shadow values | Defined shadow tokens (sm/md/lg) | Consistency, maintainability |

**Key insight:** The halftone texture effect looks deceptively simple but achieving authentic newspaper print feel with pure CSS is complex. Using a pre-made texture image is more performant and visually accurate.

## Common Pitfalls

### Pitfall 1: Texture Blocking Interactivity
**What goes wrong:** Full-page overlay captures all click/touch events
**Why it happens:** Overlay element sits on top of all content in z-index
**How to avoid:** Always add `pointer-events: none` to texture overlay
**Warning signs:** Nothing on page is clickable after adding texture

### Pitfall 2: Contrast Fails After Texture Applied
**What goes wrong:** Text passes contrast check but becomes unreadable with texture
**Why it happens:** Texture overlay darkens/lightens text unpredictably
**How to avoid:**
1. Start with colors that exceed minimum contrast (aim for 5:1+ instead of 4.5:1)
2. Use subtle texture opacity (start at 0.1-0.15, increase gradually)
3. Test with texture applied, not just base colors
**Warning signs:** Text feels "muddy" or hard to read

### Pitfall 3: Texture File Too Large
**What goes wrong:** Slow page load, visible loading delay for texture
**Why it happens:** Using full-resolution texture (4000px+) when smaller works
**How to avoid:** Scale texture to smallest size that still looks good when tiled (typically 200-400px)
**Warning signs:** Texture appears after content, layout shift

### Pitfall 4: Inconsistent Shadow Direction
**What goes wrong:** Shadows point different directions on different elements
**Why it happens:** No defined light source, ad-hoc shadow values
**How to avoid:** Define shadow tokens with consistent offset ratio (e.g., y-offset = 2x x-offset)
**Warning signs:** UI feels "off" but hard to articulate why

### Pitfall 5: Halftone Dots Too Large/Small
**What goes wrong:** Dots are pixelated or invisible
**Why it happens:** Wrong background-size for texture resolution
**How to avoid:** Experiment with background-size values. Start at 150-200px for typical halftone patterns, adjust based on visual result.
**Warning signs:** Pattern looks like noise (too small) or crude circles (too large)

## Code Examples

### Complete Texture Overlay Implementation
```css
/* Source: Verified pattern from multiple tutorials */
body {
  position: relative;  /* Needed for ::after positioning */
}

body::after {
  content: '';
  position: fixed;
  inset: 0;  /* Shorthand for top/right/bottom/left: 0 */
  background-image: url('/assets/textures/halftone-dots.png');
  background-size: 180px;  /* Adjust for dot density */
  background-repeat: repeat;
  mix-blend-mode: multiply;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.12;  /* Start subtle, increase if needed */
}
```

### Light Theme Color Variables
```css
/* Source: CONTEXT.md decisions + WCAG AA verification */
:root {
  /* Background colors */
  --color-bg: #fafafa;              /* Off-white, main background */
  --color-bg-elevated: #ffffff;      /* Cards, elevated surfaces */
  --color-bg-muted: #f0f4f8;         /* Muted gray-blue for dividers */

  /* Text colors - verified for 4.5:1+ contrast on #fafafa */
  --color-text-primary: #1a1a1a;     /* Near-black, ~13:1 contrast */
  --color-text-secondary: #4a4a4a;   /* Dark gray, ~7:1 contrast */
  --color-text-tertiary: #6b6b6b;    /* Medium gray, ~4.5:1 contrast */

  /* Accent: Blue range */
  --color-accent: #0066cc;           /* Primary blue */
  --color-accent-hover: #0052a3;     /* Darker on hover */
  --color-accent-active: #004080;    /* Even darker on active */

  /* Borders */
  --color-border: #e0e0e0;
  --color-border-hover: #0066cc;
}
```

### Shadow Elevation Tokens
```css
/* Source: Josh Comeau layered shadows + Reshaped/Material patterns */
:root {
  /* Subtle elevation - cards at rest */
  --shadow-sm:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 1px 1px rgba(0, 0, 0, 0.03);

  /* Medium elevation - cards on hover */
  --shadow-md:
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 4px 8px rgba(0, 0, 0, 0.04),
    0 8px 16px rgba(0, 0, 0, 0.02);

  /* High elevation - dropdowns, modals */
  --shadow-lg:
    0 4px 8px rgba(0, 0, 0, 0.04),
    0 8px 16px rgba(0, 0, 0, 0.04),
    0 16px 32px rgba(0, 0, 0, 0.02);
}
```

### Complete Reduced Motion Implementation
```css
/* Source: MDN prefers-reduced-motion, W3C WCAG C39 */

/* Base styles - no motion */
.card {
  box-shadow: var(--shadow-sm);
}

/* Add transitions only if user hasn't requested reduced motion */
@media (prefers-reduced-motion: no-preference) {
  .card {
    transition:
      box-shadow 200ms ease,
      transform 200ms ease,
      border-color 150ms ease;
  }

  .card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
}

/* When reduced motion is preferred, keep visual feedback without movement */
@media (prefers-reduced-motion: reduce) {
  .card:hover {
    /* Still change shadow, just no transition */
    box-shadow: var(--shadow-md);
    /* Skip transform entirely - no motion */
  }
}
```

### Button Variants (Solid + Ghost)
```css
/* Source: CONTEXT.md decisions */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: 500;
  border-radius: var(--radius-md);  /* 4-8px per decisions */
  cursor: pointer;
}

/* Primary: Solid fill */
.btn-primary {
  background: var(--color-accent);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: var(--color-accent-hover);
}

/* Secondary: Ghost/outlined */
.btn-secondary {
  background: transparent;
  color: var(--color-accent);
  border: 1.5px solid var(--color-accent);  /* 1.5px per discretion */
}

.btn-secondary:hover {
  background: rgba(0, 102, 204, 0.08);  /* Subtle fill on hover */
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| HSL for color systems | LCH/OKLCH color spaces | 2023-2024 | More perceptually uniform, better for theme generation |
| Single shadow values | Layered shadow tokens | 2020+ | More realistic, subtle elevation |
| Motion-first CSS | No-motion-first CSS | 2020+ | Better accessibility default |
| Per-element textures | Full-page overlay | N/A | Simpler, more consistent |

**Deprecated/outdated:**
- `-webkit-text-fill-color` alone: Still needed for `background-clip: text` but has fallback requirements
- Internet Explorer support: Not needed for modern sites, simplifies blend mode usage

## Open Questions

1. **Exact halftone texture to download**
   - What we know: texturelabs.org offers several options (grunge_351 "Tiny halftone overlay", grunge_340 "Fine vintage halftone")
   - What's unclear: Which specific texture best matches "noticeable but not overwhelming" requirement
   - Recommendation: Download 2-3 options, test in browser, choose based on visual result

2. **Optimal texture opacity**
   - What we know: Start subtle (0.1-0.15), multiply blend mode darkens
   - What's unclear: Exact value that achieves "clearly visible dots, obvious print feel" without hurting readability
   - Recommendation: Implement with CSS variable `--texture-opacity` for easy adjustment during development

3. **Texture on dark text vs. light backgrounds**
   - What we know: multiply blend mode affects both text and background
   - What's unclear: Whether texture should only affect background or both
   - Recommendation: Test both approaches; if text texture is distracting, consider selective application

## Sources

### Primary (HIGH confidence)
- [MDN mix-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode) - Blend mode values, browser support
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) - Media query syntax, values
- [MDN background-size](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size) - Texture scaling syntax
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - WCAG contrast validation
- [W3C WCAG C39](https://www.w3.org/WAI/WCAG21/Techniques/css/C39) - Reduced motion technique

### Secondary (MEDIUM confidence)
- [Josh Comeau: Designing Beautiful Shadows](https://www.joshwcomeau.com/css/designing-shadows/) - Layered shadow technique
- [Frontend Masters: Pure CSS Halftone](https://frontendmasters.com/blog/pure-css-halftone-effect-in-3-declarations/) - CSS halftone technique (not used, but reference)
- [Smashing Magazine: Naming Best Practices](https://www.smashingmagazine.com/2024/05/naming-best-practices/) - Design token naming
- [CSS-Tricks: Pseudo Element Uses](https://css-tricks.com/7-practical-uses-for-the-before-and-after-pseudo-elements-in-css/) - Overlay patterns
- [Texturelabs.org Halftone Textures](https://texturelabs.org/textures/grunge_351/) - Free halftone textures

### Tertiary (LOW confidence)
- [Linear Design Trend](https://blog.logrocket.com/ux-design/linear-design/) - General Linear aesthetic principles
- [Linear Brand Guidelines](https://linear.app/brand) - Color philosophy reference

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Native CSS features, well-documented
- Architecture: HIGH - Patterns verified across multiple authoritative sources
- Pitfalls: HIGH - Common issues confirmed by multiple tutorials
- Texture implementation: MEDIUM - Technique is sound, exact values need testing
- Color values: MEDIUM - Calculated for contrast, need verification with actual texture

**Research date:** 2026-02-02
**Valid until:** 60 days (stable CSS features, no breaking changes expected)
