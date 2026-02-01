# Phase 7: Landing & Mode Switching - Context

**Gathered:** 2026-02-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Visitors choose between game and website modes via a polished landing screen. The landing displays a vertical split with each mode represented visually, includes animated pixel art preview for game mode, provides skip-to-content links, and transitions smoothly when a mode is selected. Mode switching between game and website is direct (no return to landing required).

</domain>

<decisions>
## Implementation Decisions

### Landing screen layout
- Vertical split design: website mode on left, game mode on right
- Equal balance between both halves on desktop
- Mobile: compact preview as header, more focus on text and buttons
- Professional academic tone for intro text (conservation and AI research focus)

### Mode choice presentation
- Left side (website): screenshot preview of the traditional website layout
- Right side (game): animated pixel art campus preview with movement
- Each half has title + brief tagline describing that mode
- Clear "Enter" button within each half (not entire panel clickable)

### Transition animations
- Quick transitions (200-300ms) for snappy, responsive feel
- Expand chosen side: selected half grows to fill screen, other fades away
- Direct mode switching: toggle button in each mode switches directly to the other (no return to landing)
- Pixel art themed loading animation while game assets load

### Skip-to-content links
- Position: footer area below the vertical split
- Include all sections: Publications, Talks, Media, Research, About
- Icons + text for each link
- Behavior: load website mode first, then smooth scroll to target section

### Claude's Discretion
- Exact button styling and hover states
- Specific loading animation design
- Typography and spacing details
- Icon selection for skip links
- Screenshot preview implementation (static vs subtle animation)

</decisions>

<specifics>
## Specific Ideas

- The vertical split should make it immediately clear there are two distinct ways to experience the content
- Animation on the game preview should be subtle — enough to show it's interactive, not distracting
- The expand transition should feel like "entering" the chosen mode

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-landing-mode-switching*
*Context gathered: 2026-02-01*
