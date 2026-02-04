# Phase 12: Animations - Context

**Gathered:** 2026-02-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Add Linear-style motion design to the site: scroll reveals that fade/slide content into view, gradient text effects on headings, and hover micro-interactions on cards and links. All animations must respect reduced-motion preferences and run smoothly at 60fps.

</domain>

<decisions>
## Implementation Decisions

### Scroll reveal style
- Fade + slide from sides (alternating left/right for visual interest)
- Slide direction alternates between sections for variety

### Gradient text design
- Apply to hero heading AND all section headings (Publications, Research, Media, etc.)
- Color palette: dark (charcoal/navy) transitioning to brand blue (#0066cc)
- Continuous flowing animation, colors slowly cycle through the gradient
- Animation speed: slow (4-6 seconds per cycle), ambient not distracting

### Hover interactions
- Cards: lift upward (-6px to -8px) with enhanced shadow underneath
- Links: color shift + animated underline appears
- Buttons: more emphasis than links — additional effects like slight scale or glow

### Animation timing
- Overall feel: quick and snappy (150-250ms for interactions)
- Reference: Linear.app — clean, professional, subtle motion

### Claude's Discretion
- Stagger timing for multiple items in a section (appropriate per element type)
- Slide distance for scroll reveals
- Viewport trigger point for scroll reveals
- Specific easing curves per animation type
- Whether animations replay when scrolling back (per element type)
- Exact button hover treatment (scale vs glow)

</decisions>

<specifics>
## Specific Ideas

- Reference: Linear.app for overall animation feel — clean, professional, subtle motion
- Use `/frontend-design` skill during implementation for high design quality
- Gradient animation should be slow enough to feel ambient, not attention-grabbing
- Card lift should be noticeable and provide clear feedback

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 12-animations*
*Context gathered: 2026-02-04*
