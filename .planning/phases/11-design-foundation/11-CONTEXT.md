# Phase 11: Design Foundation - Context

**Gathered:** 2026-02-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the visual design foundation: light theme color scheme, typography system with halftone texture effect, and component styling. This phase creates the base design tokens and CSS that all other visual work builds upon. Animations are Phase 12.

**Note:** Roadmap specified dark mode, but user decided on light theme. Update ROADMAP.md to reflect "Light Theme Foundation" instead of "Dark Mode Foundation."

</domain>

<decisions>
## Implementation Decisions

### Color palette
- Background: Off-white (#fafafa) — softer than pure white, easier on eyes
- Primary accent: Blue (#0066cc range) — professional, academic context appropriate
- Secondary accent: Muted gray-blue for backgrounds, borders, dividers
- Text: Near-black or black for readability (exact shade TBD based on halftone effect)

### Typography & halftone texture
- All text gets halftone dot texture for newspaper/print aesthetic
- Intensity: Noticeable texture — clearly visible dots, obvious print feel
- Source: Download texture from texturelabs.org
- Implementation approach: Overlay or linear-light blend mode, use curves to dial in strength
- If dots too large: Scale down using CSS techniques (needs research)
- Accessibility: Always show halftone — it's static texture, not motion, so no reduced-motion consideration

### Component styling
- Cards: Subtle shadow/elevation — slight lift effect, dimensional
- Links: No underline, color change on hover — minimal style
- Buttons: Mixed approach — solid fill for primary actions, outlined/ghost for secondary
- Corners: Slightly rounded (4-8px) — softens edges without being bubbly

### Claude's Discretion
- Exact text color shade that works with halftone
- Specific shadow values for cards
- Secondary button border weight
- Exact blue accent shades for different states (hover, active)

</decisions>

<specifics>
## Specific Ideas

- "I want it to feel modern and newspaper-like" — the halftone is the unique twist
- Linear.app as primary reference: clean spacing/whitespace, subtle micro-interactions, clear typography hierarchy
- The combination: Linear's clean structure + newspaper halftone texture = distinctive academic portfolio
- Texturelabs.org for halftone pattern source

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 11-design-foundation*
*Context gathered: 2026-02-02*
