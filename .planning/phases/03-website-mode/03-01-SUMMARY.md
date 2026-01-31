---
phase: 03-website-mode
plan: 01
subsystem: website-core
tags: [css, typescript, router, design-system]

dependency-graph:
  requires: ["02-content-data-layer"]
  provides: ["css-design-tokens", "content-types", "content-loader", "hash-router"]
  affects: ["03-02", "03-03", "03-04"]

tech-stack:
  added: []
  patterns: ["css-custom-properties", "module-level-caching", "hash-routing"]

key-files:
  created:
    - src/styles/variables.css
    - src/styles/global.css
    - src/styles/utilities.css
    - src/types/content.ts
    - src/lib/content.ts
    - src/lib/router.ts
  modified:
    - index.html

decisions: []

metrics:
  duration: "2 min"
  completed: "2026-01-31"
---

# Phase 03 Plan 01: Website Foundation Summary

CSS design system with tokens, TypeScript types matching JSON schemas, cached content loader, and hash-based router with parameterized routes.

## What Was Built

### CSS Design System

Three-file design system establishing visual language:

**variables.css** - Design tokens as CSS custom properties:
- Monochrome palette (gray-50 through gray-900, white, black)
- Teal accent colors (500, 600, 700 with --color-accent: #0d9488)
- Semantic colors (bg, text-primary/secondary/tertiary, border, link)
- Typography scale (xs through 4xl, rem-based)
- Spacing scale (space-1 through space-20)
- Layout tokens (--max-width: 1200px, --content-padding, --section-gap)
- Transitions (fast: 150ms, normal: 250ms)
- Border radius (sm, md, lg)

**global.css** - Base styles:
- Modern CSS reset (box-sizing, margin removal)
- Inter font with variable font support
- Smooth scroll respecting prefers-reduced-motion
- Focus-visible for keyboard navigation
- Container class with max-width
- Mobile padding adjustments at 768px breakpoint

**utilities.css** - Utility classes:
- .sr-only for screen reader content
- .line-clamp-1/2/3 for text truncation
- .truncate for single-line ellipsis

### TypeScript Types

Content types in `src/types/content.ts` matching JSON schemas:
- `Publication` with `Author[]` (name, isSamReynolds)
- `Talk` with optional slides/video URLs
- `MediaItem` with type enum (podcast, video, panel, interview)
- `ResearchTopic` with optional relatedPublications
- `About` with education array and optional social links

### Content Loader

Async content utilities in `src/lib/content.ts`:
- `loadPublications()`, `loadTalks()`, `loadMedia()`, `loadResearch()`, `loadAbout()`
- Module-level caching to avoid refetching
- Lookup functions: `getPublicationById()`, `getTalkById()`, `getMediaById()`, `getResearchById()`
- `clearCache()` utility for testing

### Hash Router

Simple router in `src/lib/router.ts`:
- Parameterized route support: `/publication/:id` extracts named params
- `add(pattern, handler)` to register routes
- `init()` to start listening for hashchange
- `navigate(path)` for programmatic navigation
- 404 fallback to home route

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

| Check | Result |
|-------|--------|
| TypeScript compiles | PASS |
| CSS variables defined on :root | PASS |
| Inter font configured | PASS |
| Content types match schemas | PASS |

## Commits

| Hash | Message |
|------|---------|
| 9cc8ebe | feat(03-01): create CSS design system |
| 331348c | feat(03-01): create TypeScript types and content loader |
| b2c4a74 | feat(03-01): create hash-based router |

## Next Phase Readiness

**Ready for:** 03-02-PLAN (Header/Navigation components)

**Dependencies satisfied:**
- CSS design tokens available for components
- Content loader ready for page data
- Router ready for navigation integration

**No blockers.**

---

*Plan: 03-01*
*Completed: 2026-01-31*
*Duration: 2 min*
