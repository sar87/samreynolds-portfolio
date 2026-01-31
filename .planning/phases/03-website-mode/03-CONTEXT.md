# Phase 3: Website Mode - Context

**Gathered:** 2026-01-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Professional academic portfolio website displays all content in traditional layout. This phase builds the website mode that users can choose as an alternative to the game exploration. Content comes from the JSON data layer (Phase 2). The landing page and mode switching are Phase 7.

</domain>

<decisions>
## Implementation Decisions

### Visual Style
- Modern minimal aesthetic — clean lines, lots of whitespace, subtle accents (think Linear/Notion)
- Monochrome base (black/white/gray) with teal/cyan as accent color
- Inter font (or similar modern sans-serif web font)

### Navigation Structure
- Hybrid model: main content on single scrollable page, with detail pages for individual items
- All content types get detail pages (publications, talks, media)
- Header behavior: Claude's discretion, inspired by Linear.app

### Content Presentation
- Publications displayed as cards (not list or table)
- Publication cards show minimal info: title, authors, year — click through for details
- Talks organized chronologically, most recent first
- Media appearances listed chronologically (all types mixed together)

### Responsive Behavior
- Desktop max-width: ~1200px (wide layout)
- Desktop uses 2-column grid for publication/talk cards
- Mobile collapses to single column

### Claude's Discretion
- Section order on main page (About, Research, Publications, Talks, Media)
- Mobile navigation pattern (hamburger vs bottom nav vs other)
- Mobile card styling (full-width vs padded)
- Header show/hide behavior
- Exact spacing, hover states, transitions
- Detail page layouts

</decisions>

<specifics>
## Specific Ideas

- "Something like Linear.app website" — reference for the clean, modern aesthetic and navigation feel
- Cards should feel minimal and clean, not cluttered

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-website-mode*
*Context gathered: 2026-01-31*
