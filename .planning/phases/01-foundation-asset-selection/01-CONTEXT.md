# Phase 1: Foundation & Asset Selection - Context

**Gathered:** 2026-01-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Development environment setup and legally-verified sprite asset selection with attribution system. This phase delivers the visual foundation and tooling — actual map design, gameplay, and content are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Sprite aesthetic
- LPC (Liberated Pixel Cup) style sprites — detailed RPG aesthetic with rich character options
- Player character is a personalized avatar representing Sam: blond hair, casual academic look (sweater/blazer)
- Environment should evoke Cambridge-specific feel: gothic architecture, stone college buildings, River Cam — even if this limits available assets

### Asset sourcing strategy
- Claude's discretion on single pack vs mixing — prioritize visual consistency
- If assets aren't available (punt boat, specific furniture), skip it and adjust game design — no custom sprites or purchases
- Each of the five buildings needs unique furniture sets — library looks different from lab from theatre
- CC-BY-SA licensing is acceptable — attribution requirements are fine for a personal portfolio

### Claude's Discretion
- Whether to use single sprite pack or mix LPC-compatible packs (based on what achieves best consistency)
- Specific LPC packs to use from OpenGameArt or similar sources
- Development environment specifics (Vite config, TypeScript setup details)
- Attribution file format and structure

</decisions>

<specifics>
## Specific Ideas

- Player avatar: blond hair, casual academic style (think sweater or blazer)
- Cambridge feel is important: gothic architecture, old stone buildings, river with punts if possible
- Each building interior should be visually distinct — not generic shared furniture

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-asset-selection*
*Context gathered: 2026-01-30*
